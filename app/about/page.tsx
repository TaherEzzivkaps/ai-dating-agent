'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function AboutPage() {
  const [slugToRemove, setSlugToRemove] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRemoval = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/people/${slugToRemove.trim()}?public_request=true&email=${encodeURIComponent(adminKey)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete profile.');
      setMessage(data.message || 'Profile and all associated data successfully removed.');
      setSlugToRemove('');
    } catch (err: any) {
      setError(err.message || 'Error executing removal request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
          Architecture, Privacy & Honesty Rule
        </h1>
        <p className="font-mono text-xs text-on-surface-variant">
          Complete transparency on data scraping, simulation models, and data sovereignty.
        </p>
      </div>

      {/* Honesty & Data Sources */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider">
          <Info className="h-4 w-4" />
          <span>The Honesty Rule</span>
        </div>
        <p className="text-sm font-sans text-on-surface leading-relaxed">
          Agentic Dating uses <strong>strictly public data</strong> from two verified sources: public LinkedIn profiles (retrieved via no-cookie scrapers) and public Instagram accounts. No search engines, background checks, or private databases are touched.
        </p>
        <p className="text-sm font-sans text-on-surface leading-relaxed">
          All dates are <strong>LLM-simulated multi-turn conversations</strong> between digital agents roleplaying with persona constraints derived from those public sources.
        </p>
      </div>

      {/* Safety & Non-Inference Policy */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Safety & Sensitive Categories Policy</span>
        </div>
        <p className="text-sm font-sans text-on-surface leading-relaxed">
          Our system prompts and analyst models are strictly forbidden from inferring, analyzing, or storing sensitive personal categories. We never assess or predict:
        </p>
        <ul className="list-disc list-inside text-xs font-mono text-on-surface-variant space-y-1 pl-2">
          <li>Sexual orientation (we rely solely on the explicit "Interested in" preference)</li>
          <li>Religious beliefs or spiritual affiliations</li>
          <li>Medical conditions or health records</li>
          <li>Ethnicity or racial background</li>
          <li>Political beliefs or affiliations</li>
        </ul>
      </div>

      {/* Removal Request */}
      <div id="removal" className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-error font-mono text-xs font-bold uppercase tracking-wider">
          <Trash2 className="h-4 w-4" />
          <span>Immediate Profile Removal Request</span>
        </div>
        <p className="text-sm font-sans text-on-surface leading-relaxed">
          Anyone can request the immediate and irrevocable deletion of their profile, scraped raw JSON, downloaded images, simulated dates, and match rankings.
        </p>

        <form onSubmit={handleRemoval} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface mb-1">
              Profile Slug or Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. elena-rostova or username"
              value={slugToRemove}
              onChange={(e) => setSlugToRemove(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-error"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface mb-1">
              Contact / Verification Email
            </label>
            <input
              type="email"
              required
              placeholder="Your email for confirmation"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-error"
            />
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-tertiary-container/30 border border-tertiary/40 text-xs font-mono text-tertiary flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/40 text-xs font-mono text-error flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-5 rounded-xl bg-error-container hover:bg-error text-white font-semibold text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Purge Profile & All Derived Data</span>
          </button>
        </form>
      </div>
    </div>
  );
}
