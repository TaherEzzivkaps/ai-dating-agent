import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { normalizeLinkedInUrl, normalizeInstagramUrl, extractSlugFromUrls } from '@/lib/scrape';
import { runFullPipelineForPerson } from '@/lib/jobs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkedin_url, instagram_url, interested_in = 'open' } = body;

    if (!linkedin_url || !instagram_url) {
      return NextResponse.json(
        { error: 'Both LinkedIn and Instagram URLs are required.' },
        { status: 400 }
      );
    }

    let normLinkedIn: string;
    let normInstagram: string;

    try {
      normLinkedIn = normalizeLinkedInUrl(linkedin_url);
      normInstagram = normalizeInstagramUrl(instagram_url);
    } catch (urlErr: any) {
      return NextResponse.json({ error: urlErr.message }, { status: 400 });
    }

    const db = getDb();

    // Rate limit check
    const forwarded = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ip = forwarded.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
    const today = new Date().toISOString().slice(0, 10);

    const ipLimit = parseInt(process.env.MAX_LIVE_SCRAPES_PER_IP_PER_DAY || '3', 10);
    const globalLimit = parseInt(process.env.DAILY_GLOBAL_SCRAPE_CAP || '40', 10);

    const ipUsage = db.prepare('SELECT count FROM rate_limits WHERE ip_hash = ? AND day = ?').get(ipHash, today) as any;
    if (ipUsage && ipUsage.count >= ipLimit) {
      return NextResponse.json(
        { error: `Daily scrape limit of ${ipLimit} per IP exceeded. Please try again tomorrow or browse the demo cohort.` },
        { status: 429 }
      );
    }

    const totalUsage = db.prepare('SELECT SUM(count) as total FROM rate_limits WHERE day = ?').get(today) as any;
    if (totalUsage && (totalUsage.total || 0) >= globalLimit) {
      return NextResponse.json(
        { error: 'Daily global scrape capacity reached. Please view the 25-person demo cohort at /demo.' },
        { status: 429 }
      );
    }

    // Update rate limit count
    db.prepare(`
      INSERT INTO rate_limits (ip_hash, day, count)
      VALUES (?, ?, 1)
      ON CONFLICT(ip_hash, day) DO UPDATE SET count = count + 1
    `).run(ipHash, today);

    const slug = extractSlugFromUrls(normLinkedIn, normInstagram);
    const personId = `person-${Date.now()}`;
    const jobId = `job-${Date.now()}`;

    // Create or update person stub
    db.prepare(`
      INSERT OR REPLACE INTO people (id, slug, name, linkedin_url, instagram_url, interested_in, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(personId, slug, slug, normLinkedIn, normInstagram, interested_in);

    // Create job record
    db.prepare(`
      INSERT INTO jobs (id, type, person_id, status, progress, stage, payload)
      VALUES (?, 'full_pipeline', ?, 'pending', 0, 'Initializing', ?)
    `).run(jobId, personId, JSON.stringify({ slug, normLinkedIn, normInstagram, interested_in }));

    // Run pipeline asynchronously in background
    setTimeout(() => {
      runFullPipelineForPerson(jobId, personId, normLinkedIn, normInstagram, interested_in).catch((err) => {
        console.error('Pipeline execution error:', err);
      });
    }, 100);

    return NextResponse.json({ jobId, slug });
  } catch (err: any) {
    console.error('POST /api/people error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
