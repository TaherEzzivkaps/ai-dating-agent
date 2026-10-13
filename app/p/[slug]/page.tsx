'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  BrainCircuit,
  Heart,
  Flame,
  MessageSquare,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/people/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found.');
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-on-surface-variant">Loading synthesized psychological dossier...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Profile Unavailable</h2>
        <p className="text-sm font-mono text-on-surface-variant mb-6">{error || 'Could not locate person.'}</p>
        <Link href="/" className="px-4 py-2 rounded-lg bg-surface-container-high text-sm font-semibold text-white">
          Return to Launchpad
        </Link>
      </div>
    );
  }

  const { person, profile } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Top Breadcrumb & CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
          <Link href="/" className="hover:text-white transition-colors">Agents</Link>
          <span>/</span>
          <span className="text-primary">{person.name}</span>
          {person.is_demo && (
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-[10px] uppercase font-bold border border-secondary/30 ml-2">
              Demo Pool Candidate
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/p/${person.slug}/ranking`}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-xs sm:text-sm font-medium text-white shadow-md hover:opacity-95 active:scale-[0.98] flex items-center gap-2 transition-all"
          >
            <Heart className="h-4 w-4 fill-current" />
            <span>Simulate Date / Match Cohort</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Hero Profile Dossier Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative shrink-0">
            <img
              src={person.photo_url || '/avatars/default.png'}
              alt={person.name}
              className="h-28 w-28 sm:h-36 sm:sm:w-36 rounded-2xl object-cover border border-white/15 shadow-xl"
            />
            {profile?.data_quality && (
              <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border shadow-md ${
                profile.data_quality === 'rich'
                  ? 'bg-tertiary-container text-white border-tertiary'
                  : profile.data_quality === 'ok'
                  ? 'bg-primary-container text-white border-primary'
                  : 'bg-error-container text-white border-error'
              }`}>
                {profile.data_quality} data
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{person.name}</h1>
              <div className="flex items-center gap-1 text-xs font-mono text-on-surface-variant">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{person.city || 'San Francisco, CA'}</span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant font-sans leading-relaxed mb-4">
              {profile?.summary || 'Psychological synthesis in progress.'}
            </p>

            {/* Identity Match Card */}
            {person.identity_check && (
              <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-white/5 flex items-start gap-2.5 text-xs font-mono">
                {person.identity_check.same_person ? (
                  <ShieldCheck className="h-4 w-4 text-tertiary shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-on-surface">
                    Identity Check Confidence: {Math.round((person.identity_check.confidence || 0) * 100)}%
                  </span>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">{person.identity_check.reason}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery / Vision Inputs */}
        {person.images && person.images.length > 1 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="text-[11px] font-mono uppercase text-on-surface-variant block mb-3">
              Vision-Analyzed Public Media ({person.images.length} photos)
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {person.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`Scraped asset ${i}`}
                  className="h-16 w-16 rounded-lg object-cover border border-white/10 shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Scraped Instagram Snapshot Link */}
        {person.raw_instagram && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-pink-400 font-semibold">Instagram: @{person.raw_instagram.handle || person.slug}</span>
              <span className="text-on-surface-variant">• {person.raw_instagram.followers?.toLocaleString() || '1,200'} followers</span>
              <span className="text-on-surface-variant">• {person.raw_instagram.posts?.length || 0} scraped posts</span>
            </div>
            <a
              href="#instagram-section"
              className="text-xs text-primary hover:text-white flex items-center gap-1.5 transition-colors font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10"
            >
              <span>View Scraped Instagram Posts & Comments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Dating Persona Briefing Box */}
      {profile?.dating_persona && (
        <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-primary-accent/5 mb-8">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-primary font-bold uppercase tracking-wider">
            <BrainCircuit className="h-4 w-4" />
            <span>Agent Dating Persona (~150 Word Briefing)</span>
          </div>
          <p className="text-sm sm:text-base font-sans text-on-surface leading-relaxed italic">
            "{profile.dating_persona}"
          </p>
        </div>
      )}

      {/* Grid of Traits with Evidence Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Needs & Desires */}
        <TraitCategoryCard
          title="Core Needs & Partner Values"
          icon={<Heart className="h-4 w-4 text-secondary" />}
          traits={profile?.needs || []}
        />

        {/* Hobbies & Recreational Pursuits */}
        <TraitCategoryCard
          title="Documented Hobbies"
          icon={<Sparkles className="h-4 w-4 text-primary" />}
          traits={profile?.hobbies || []}
        />

        {/* Interests & Causes */}
        <TraitCategoryCard
          title="Intellectual Interests & Topics"
          icon={<BrainCircuit className="h-4 w-4 text-tertiary" />}
          traits={profile?.interests || []}
        />

        {/* Friction Points */}
        <TraitCategoryCard
          title="Potential Friction Points"
          icon={<Flame className="h-4 w-4 text-error" />}
          traits={profile?.friction_points || []}
        />
      </div>

      {/* Scraped Public Instagram Posts & Comments */}
      {person.raw_instagram?.posts && person.raw_instagram.posts.length > 0 && (
        <div id="instagram-section" className="mt-10 glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl scroll-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Scraped Public Instagram Posts & Comments
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant font-normal">
                Live post captions, tagged locations, hashtags, and scraped community comments used by the Analyst Agent.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-sans px-3 py-1 rounded-full bg-white/[0.04] text-secondary border border-secondary/20 shrink-0">
              <span>@{person.raw_instagram.handle || person.slug}</span>
              <span>•</span>
              <span>{person.raw_instagram.followers?.toLocaleString() || '1,200'} followers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {person.raw_instagram.posts.map((post: any, pIdx: number) => (
              <div
                key={pIdx}
                className="rounded-xl bg-surface-container-low/70 border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/15 transition-all shadow-md"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-black/40">
                    <img
                      src={post.image || person.photo_url}
                      alt={post.caption || 'Instagram photo'}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {post.location && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-black/75 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-secondary" />
                        <span>{post.location}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-secondary" />
                        <span>{post.likes || 180} likes</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-primary" />
                        <span>{post.comments?.length || 2} comments</span>
                      </span>
                    </div>

                    <p className="text-xs text-on-surface leading-relaxed font-normal">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {/* Scraped Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="px-4 pb-4 pt-2.5 border-t border-white/5 bg-black/20 space-y-1.5">
                    <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider block">
                      Top Scraped Comments
                    </span>
                    {post.comments.map((c: any, cIdx: number) => (
                      <div key={cIdx} className="text-[11px] leading-tight text-on-surface-variant">
                        <span className="font-semibold text-white mr-1.5">@{c.user}:</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TraitCategoryCard({
  title,
  icon,
  traits,
}: {
  title: string;
  icon: React.ReactNode;
  traits: any[];
}) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-lg">
      <div className="flex items-center gap-2.5 mb-5 text-sm font-semibold tracking-tight text-white">
        {icon}
        <span>{title}</span>
      </div>

      <div className="space-y-3.5">
        {traits.length === 0 ? (
          <p className="text-xs text-on-surface-variant font-normal">No documented signals extracted.</p>
        ) : (
          traits.map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-container-low/80 border border-white/5 space-y-2 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm text-white tracking-tight">{t.label}</span>
                <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] text-on-surface-variant shrink-0">
                  {Math.round((t.confidence || 0) * 100)}% match
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed font-normal">{t.detail}</p>

              {/* Evidence Chips */}
              {t.evidence && t.evidence.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.evidence.map((ev: any, evIdx: number) => (
                    <span
                      key={evIdx}
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans font-normal px-2.5 py-0.5 rounded-full bg-white/[0.04] text-primary border border-white/[0.08]"
                    >
                      <span className="font-semibold text-[10px] text-on-surface capitalize">{ev.source}:</span>
                      <span className="truncate max-w-[220px]">"{ev.quote_or_note || ev.ref}"</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
