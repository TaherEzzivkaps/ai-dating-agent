'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  ArrowRight,
  Flame,
  Sparkles,
  Grid,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Heart,
} from 'lucide-react';

export default function RankingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  const handleSimulateDate = async (candidateId: string) => {
    if (!data?.person?.id) return;
    setSimulatingId(candidateId);
    try {
      const res = await fetch('/api/dates/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: data.person.id, candidateId }),
      });
      const d = await res.json();
      if (d.dateId) {
        router.push(`/date/${d.dateId}`);
      }
    } catch (err) {
      console.error('Failed to trigger date simulation:', err);
      setSimulatingId(null);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/people/${slug}/ranking`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load rankings.');
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
        <p className="font-mono text-sm text-on-surface-variant">Computing multi-vector affinity rankings...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Rankings Unavailable</h2>
        <p className="text-sm font-mono text-on-surface-variant mb-6">{error}</p>
        <Link href="/" className="px-4 py-2 rounded-lg bg-surface-container-high text-sm font-semibold text-white">
          Back to Launchpad
        </Link>
      </div>
    );
  }

  const { person, rankings } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Link
          href={`/p/${person.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to {person.name}'s Profile</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/matrix"
            className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-on-surface border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Grid className="h-3.5 w-3.5 text-primary" />
            <span>Explore 25x25 Heatmap Matrix</span>
          </Link>
        </div>
      </div>

      {/* Hero Summary Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={person.photo_url || '/avatars/default.png'}
              alt={person.name}
              className="h-16 w-16 rounded-xl object-cover border border-white/15"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Compatibility Rankings for {person.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary-accent/20 text-primary border border-primary/30">
                  Compared to Demo Pool
                </span>
              </div>
              <p className="text-xs font-mono text-on-surface-variant mt-1">
                Active Cohort: 25 Autonomous Agents • Top 5 Dates Fully Simulated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="text-center px-3 py-1.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="block text-primary font-bold text-base">{rankings.length}</span>
              <span className="text-[10px] text-on-surface-variant uppercase">Analyzed</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="block text-secondary font-bold text-base">
                {rankings.filter((r: any) => r.has_full_date).length}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase">Sim Dates</span>
            </div>
          </div>
        </div>

        {/* Quick Cohort Date Matcher */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <Heart className="h-4 w-4 text-pink-500 fill-pink-500/20" />
            <span>Select any candidate from cohort to simulate an instant date with {person.name}:</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCandidateId || rankings[0]?.candidate?.id || ''}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-surface-container-high border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-primary"
            >
              {rankings.map((r: any) => (
                <option key={r.candidate.id} value={r.candidate.id} className="bg-surface-container text-white">
                  #{r.rank < 10 ? `0${r.rank}` : r.rank} {r.candidate.name} ({r.score}% affinity)
                </option>
              ))}
            </select>
            <button
              onClick={() => handleSimulateDate(selectedCandidateId || rankings[0]?.candidate?.id)}
              disabled={simulatingId !== null}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:opacity-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              {simulatingId ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Simulating Date...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Launch Date Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ranked Candidate Cards */}
      <div className="space-y-5">
        {rankings.map((item: any) => (
          <div
            key={item.candidate.id}
            className={`glass-card rounded-2xl p-6 border transition-all ${
              item.rank === 1
                ? 'border-primary/40 shadow-[0_0_25px_rgba(139,92,246,0.15)] bg-surface-container-high/40'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                {/* Glowing Rank Badge */}
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center font-display font-extrabold text-base ${
                    item.rank === 1
                      ? 'bg-gradient-to-tr from-primary-accent to-secondary-accent text-white shadow-lg'
                      : item.rank === 2
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-highest text-on-surface'
                  }`}
                >
                  #{item.rank < 10 ? `0${item.rank}` : item.rank}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={item.candidate.photo_url || '/avatars/default.png'}
                    alt={item.candidate.name}
                    className="h-12 w-12 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/p/${item.candidate.slug}`}
                        className="font-display font-bold text-base text-white hover:text-primary transition-colors"
                      >
                        {item.candidate.name}
                      </Link>
                      <span className="text-xs font-mono text-on-surface-variant">• {item.candidate.city}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1">
                      {item.candidate.summary || 'Professional candidate'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Compatibility Score */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                    {item.score}%
                  </span>
                  <span className="block text-[10px] font-mono text-on-surface-variant uppercase">
                    Affinity Score
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {item.has_full_date ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-tertiary-container/20 text-tertiary border border-tertiary/30">
                  <CheckCircle2 className="h-3 w-3" /> Full Date Completed & Debriefed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-surface-container-high text-on-surface-variant border border-white/10">
                  <Clock className="h-3 w-3" /> Screened Only
                </span>
              )}
            </div>

            {/* Why This Fits & Watch Out Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest/80 border border-white/5">
                <span className="text-[11px] font-mono font-bold text-primary flex items-center gap-1.5 uppercase mb-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Why This Fits
                </span>
                <p className="text-xs text-on-surface leading-relaxed">{item.why_fits}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest/80 border border-white/5">
                <span className="text-[11px] font-mono font-bold text-secondary flex items-center gap-1.5 uppercase mb-1.5">
                  <Flame className="h-3.5 w-3.5" /> Watch Out
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.watch_out}</p>
              </div>
            </div>

            {/* Scraped Instagram Proof with Real Scraped Comments */}
            {item.candidate.raw_instagram && (
              <div className="mt-3.5 p-3 rounded-xl bg-surface-container-lowest/70 border border-white/5 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-pink-400 font-semibold">@{item.candidate.raw_instagram.handle}</span>
                    <span className="text-on-surface-variant text-[11px]">
                      • {item.candidate.raw_instagram.followers?.toLocaleString() || '1,200'} followers
                    </span>
                  </div>
                  <Link
                    href={`/p/${item.candidate.slug}`}
                    className="text-[11px] text-primary hover:underline font-mono"
                  >
                    View All Scraped Photos & Comments →
                  </Link>
                </div>
                {item.candidate.raw_instagram.posts?.[0]?.comments && item.candidate.raw_instagram.posts[0].comments.length > 0 && (
                  <div className="bg-black/25 rounded-lg p-2 border border-white/5 space-y-1">
                    <span className="text-[10px] text-on-surface-variant uppercase font-sans font-medium block">
                      Scraped Instagram Community Comments:
                    </span>
                    {item.candidate.raw_instagram.posts[0].comments.slice(0, 2).map((c: any, cIdx: number) => (
                      <p key={cIdx} className="text-[11px] text-on-surface-variant font-sans">
                        <span className="text-white font-medium">@{c.user}: </span>
                        <span>"{c.text}"</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Link
                href={`/p/${item.candidate.slug}`}
                className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
              >
                <span>Inspect Full Dossier</span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <div className="flex items-center gap-2">
                {item.date_id ? (
                  <Link
                    href={`/date/${item.date_id}`}
                    className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Watch Simulated Date</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSimulateDate(item.candidate.id)}
                    disabled={simulatingId === item.candidate.id}
                    className="h-9 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:opacity-95 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {simulatingId === item.candidate.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Simulating Date...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <span>Go on Date with {item.candidate.name.split(' ')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
