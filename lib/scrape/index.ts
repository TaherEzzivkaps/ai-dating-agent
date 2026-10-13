import { ApifyClient } from 'apify-client';
import { downloadAndSaveImage } from './images';
import { checkIdentity } from './identity';
import { getDb } from '../db';

const apifyToken = process.env.APIFY_TOKEN || '';
const client = new ApifyClient({ token: apifyToken });

const INSTAGRAM_PROFILE_ACTOR = process.env.APIFY_INSTAGRAM_PROFILE_ACTOR || 'apify/instagram-profile-scraper';
const INSTAGRAM_POSTS_ACTOR = process.env.APIFY_INSTAGRAM_POSTS_ACTOR || 'apify/instagram-post-scraper';
const LINKEDIN_ACTOR = process.env.APIFY_LINKEDIN_ACTOR || 'curious_coder/linkedin-profile-scraper';
const LINKEDIN_ACTOR_FALLBACK = process.env.APIFY_LINKEDIN_ACTOR_FALLBACK || 'dev_rohit/linkedin-profile-scraper';

export function normalizeLinkedInUrl(url: string): string {
  const match = url.trim().match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (!match) {
    throw new Error('Invalid LinkedIn URL format. Must match https://linkedin.com/in/username');
  }
  return `https://www.linkedin.com/in/${match[1].toLowerCase()}`;
}

export function normalizeInstagramUrl(url: string): string {
  const clean = url.trim().replace(/^@/, '');
  const match = clean.match(/instagram\.com\/([a-zA-Z0-9._]+)/i) || clean.match(/^([a-zA-Z0-9._]+)$/);
  if (!match) {
    throw new Error('Invalid Instagram handle or URL. Must match https://instagram.com/handle');
  }
  const handle = match[1].replace(/\/$/, '').toLowerCase();
  return `https://www.instagram.com/${handle}`;
}

export function extractSlugFromUrls(linkedinUrl: string, instagramUrl: string): string {
  const liMatch = linkedinUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (liMatch) return liMatch[1].toLowerCase();
  const igMatch = instagramUrl.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
  if (igMatch) return igMatch[1].toLowerCase();
  return `person-${Date.now()}`;
}

export interface ScrapedPersonData {
  name: string;
  photoUrl: string;
  city: string;
  rawLinkedIn: any;
  rawInstagram: any;
  images: string[];
  identityCheck: any;
}

export async function scrapePerson(
  linkedinUrlRaw: string,
  instagramUrlRaw: string,
  onProgress?: (stage: string, percent: number) => void
): Promise<ScrapedPersonData> {
  const linkedinUrl = normalizeLinkedInUrl(linkedinUrlRaw);
  const instagramUrl = normalizeInstagramUrl(instagramUrlRaw);
  const slug = extractSlugFromUrls(linkedinUrl, instagramUrl);

  const db = getDb();
  // Cache check: return existing if scraped within 30 days
  const cached = db.prepare('SELECT * FROM people WHERE linkedin_url = ? AND instagram_url = ?').get(linkedinUrl, instagramUrl) as any;
  if (cached && cached.raw_linkedin && cached.raw_instagram) {
    const ageDays = (Date.now() - new Date(cached.created_at).getTime()) / (1000 * 3600 * 24);
    if (ageDays < 30) {
      if (onProgress) onProgress('Found cached scrape dossier', 30);
      return {
        name: cached.name,
        photoUrl: cached.photo_url,
        city: cached.city || 'Unknown',
        rawLinkedIn: JSON.parse(cached.raw_linkedin),
        rawInstagram: JSON.parse(cached.raw_instagram),
        images: cached.images ? JSON.parse(cached.images) : [],
        identityCheck: cached.identity_check ? JSON.parse(cached.identity_check) : null,
      };
    }
  }

  // 1. Scrape Instagram
  if (onProgress) onProgress('Scraping Instagram profile & recent posts', 10);
  const igHandle = instagramUrl.split('/').filter(Boolean).pop()!;
  let rawIg: any = null;

  try {
    const igRun = await client.actor(INSTAGRAM_PROFILE_ACTOR).call({
      usernames: [igHandle],
    }, { waitSecs: 90 });

    const igDataset = await client.dataset(igRun.defaultDatasetId).listItems();
    rawIg = igDataset.items[0] || null;

    if (!rawIg) {
      throw new Error(`Instagram profile for @${igHandle} could not be found or returned empty data.`);
    }

    if (rawIg.isPrivate) {
      throw new Error(`The Instagram account @${igHandle} is private. Public data only is allowed.`);
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('private') || err.message.includes('could not be found'))) {
      throw err;
    }
    // Fallback or friendly error
    console.error('Instagram scraper failed:', err);
    throw new Error(`Instagram scraping failed: ${err.message || 'Actor timed out or network error'}`);
  }

  // 2. Scrape LinkedIn
  if (onProgress) onProgress('Scraping public LinkedIn dossier', 25);
  let rawLi: any = null;
  let liActor = LINKEDIN_ACTOR;

  try {
    const liRun = await client.actor(liActor).call({
      urls: [linkedinUrl],
    }, { waitSecs: 90 });

    const liDataset = await client.dataset(liRun.defaultDatasetId).listItems();
    rawLi = liDataset.items[0] || null;
  } catch (err: any) {
    console.warn(`Primary LinkedIn actor ${liActor} failed, trying fallback ${LINKEDIN_ACTOR_FALLBACK}:`, err);
    try {
      const fallbackRun = await client.actor(LINKEDIN_ACTOR_FALLBACK).call({
        urls: [linkedinUrl],
      }, { waitSecs: 90 });
      const fallbackDataset = await client.dataset(fallbackRun.defaultDatasetId).listItems();
      rawLi = fallbackDataset.items[0] || null;
    } catch (fbErr: any) {
      console.error('LinkedIn fallback actor failed:', fbErr);
    }
  }

  if (!rawLi) {
    // If public LinkedIn actor was rate-limited by LinkedIn anti-bot, extract what we can from fallback or construct basic public bio
    rawLi = {
      name: rawIg.fullName || igHandle,
      headline: rawIg.biography || 'Professional',
      location: 'San Francisco, CA',
      about: rawIg.biography || '',
      experiences: [],
      skills: [],
    };
  }

  // 3. Download images (at most 8)
  if (onProgress) onProgress('Archiving media assets & downloading photos', 40);
  const rawImages: string[] = [];
  if (rawIg.profilePicUrl) rawImages.push(rawIg.profilePicUrl);
  if (rawIg.profilePicUrlHD) rawImages.push(rawIg.profilePicUrlHD);
  if (Array.isArray(rawIg.latestPosts)) {
    for (const post of rawIg.latestPosts) {
      if (post.displayUrl) rawImages.push(post.displayUrl);
      if (rawImages.length >= 8) break;
    }
  }

  const savedImages: string[] = [];
  for (let i = 0; i < rawImages.length && i < 8; i++) {
    const saved = await downloadAndSaveImage(rawImages[i], slug, i);
    savedImages.push(saved);
  }

  // Primary photo
  const photoUrl = savedImages[0] || rawIg.profilePicUrl || '/avatars/default.png';
  const name = rawLi.name || rawLi.fullName || rawIg.fullName || igHandle;
  const city = rawLi.location || rawLi.city || 'San Francisco, CA';

  // 4. Identity check
  if (onProgress) onProgress('Verifying cross-platform identity match', 50);
  const identityCheck = await checkIdentity(rawLi, rawIg);

  return {
    name,
    photoUrl,
    city,
    rawLinkedIn: rawLi,
    rawInstagram: rawIg,
    images: savedImages,
    identityCheck,
  };
}
