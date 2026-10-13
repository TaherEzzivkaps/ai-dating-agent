'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Users,
  BrainCircuit,
  MessagesSquare,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [interestedIn, setInterestedIn] = useState('open');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin_url: linkedinUrl,
          instagram_url: instagramUrl,
          interested_in: interestedIn,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit profile URLs.');
      }

      router.push(`/run/${data.jobId}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please verify your URLs.');
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-primary-accent/20 via-secondary-accent/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-96 -left-32 w-[450px] h-[450px] bg-tertiary-accent/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] -right-32 w-[500px] h-[500px] bg-secondary-accent/15 blur-[110px] pointer-events-none -z-10" />

      {/* 1. Instant Demo Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-white/10 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-accent text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm text-on-surface">
                <span className="text-secondary font-bold uppercase tracking-wider mr-2 text-xs">Skip The Wait</span>
                Explore 25 pre-simulated real profiles instantly with zero waiting time or auth requirements.
              </p>
            </div>
            <Link
              href="/demo"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-white text-xs font-semibold border border-white/10 transition-all hover:border-primary/40 group"
            >
              <span>Explore 25-Person Demo Hub</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-primary" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-white/10 text-xs text-primary font-mono mb-6">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          <span>AUTONOMOUS AGENT RECON & DATING SWARM</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-6">
          Your AI Agent <br />
          <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-secondary bg-clip-text text-transparent">
            Dates For You.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto font-normal leading-relaxed mb-6">
          Paste your public LinkedIn and Instagram links. Our analyst agent extracts your authentic psychology, hobbies, and communication style, sends your agent on simulated dates, and delivers an evidence-backed ranking.
        </p>

        {/* Honesty Rule Callout */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-low border border-white/10 text-xs font-mono text-on-surface-variant">
          <ShieldAlert className="h-4 w-4 text-secondary" />
          <span>Honesty Rule: Data is scraped live from public profiles. Dates are LLM-simulated conversations.</span>
        </div>
      </section>

      {/* 3. Launch Form Card */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-accent text-white shadow-lg">
              Live Pipeline
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface mb-2">
                1. Public LinkedIn Profile URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-white/15 text-white placeholder-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono transition-all"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5 font-mono">
                Used for professional achievements, stated values, and career trajectory.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface mb-2">
                2. Public Instagram Profile URL or Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="https://instagram.com/username or @username"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-white/15 text-white placeholder-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono transition-all"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5 font-mono">
                Used for lifestyle photos, caption tone, hobbies, and recreational activities.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface mb-2">
                3. Interested In (Orientation Filter)
              </label>
              <select
                value={interestedIn}
                onChange={(e) => setInterestedIn(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-white/15 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono transition-all"
              >
                <option value="open">Open / Everyone</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="non-binary">Non-binary</option>
              </select>
              <p className="text-[11px] text-on-surface-variant mt-1.5 font-mono">
                Only explicit preference filter used. We never infer sensitive categories.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-error-container/30 border border-error/40 flex items-start gap-2.5 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-accent via-fuchsia-600 to-secondary-accent text-white font-semibold text-sm shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Initiating Reconnaissance Swarm...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Synthesize Profile & Start Dating</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 4. The 4-Step Pipeline */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-center font-display font-bold text-2xl text-white mb-2">
          How Autonomous Dating Works
        </h2>
        <p className="text-center text-xs font-mono text-on-surface-variant mb-12">
          Four automated phases from link submission to ranked compatibility
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col items-start">
            <span className="p-2.5 rounded-lg bg-primary-accent/15 text-primary mb-4">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-mono text-primary font-bold uppercase">Phase 01</span>
            <h3 className="font-display font-semibold text-base text-white mt-1 mb-2">Live Scrape & Recon</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apify actors retrieve verified public data from LinkedIn and Instagram posts, safely downloading media for vision analysis.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col items-start">
            <span className="p-2.5 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 mb-4">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-mono text-fuchsia-400 font-bold uppercase">Phase 02</span>
            <h3 className="font-display font-semibold text-base text-white mt-1 mb-2">Psychological Dossier</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Analyst agent constructs evidence-backed traits (needs, lifestyle, humor, values) and a 150-word first-person persona.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col items-start">
            <span className="p-2.5 rounded-lg bg-secondary-accent/15 text-secondary mb-4">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-mono text-secondary font-bold uppercase">Phase 03</span>
            <h3 className="font-display font-semibold text-base text-white mt-1 mb-2">Simulated Dates</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Fast screening filters the pool. Your agent goes on multi-turn venue dates with top 5 candidates, debriefing privately.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col items-start">
            <span className="p-2.5 rounded-lg bg-tertiary-accent/15 text-tertiary mb-4">
              <Trophy className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-mono text-tertiary font-bold uppercase">Phase 04</span>
            <h3 className="font-display font-semibold text-base text-white mt-1 mb-2">Rankings & Evidence</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Candidates are scored based on mutual date verdicts and screen vectors, with explicit "Why Fits" and friction warnings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
