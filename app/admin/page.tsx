'use client';

import { useState } from 'react';
import { Shield, Database, Play, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim().length > 0) {
      setAuthorized(true);
      setErrorMsg(null);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Seed failed');
      setStatusMsg(`Successfully seeded ${d.count} candidates into SQLite.`);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAll = async () => {
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/run-all', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Run-all failed');
      setStatusMsg(d.message || 'Run-all batch pipeline initiated in background.');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 text-primary font-mono text-xs font-bold uppercase">
            <Lock className="h-4 w-4" />
            <span>Admin Authorization Required</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-on-surface uppercase mb-1">
                Enter ADMIN_KEY
              </label>
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter secret admin key"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary-accent text-white font-semibold text-xs font-mono shadow-md hover:opacity-95 transition-all"
            >
              Unlock Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-accent/15 border border-primary/20 text-xs font-mono text-primary mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Authenticated Session</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-white">
          System Administration & Pipeline Control
        </h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Manage demo cohort seeds, trigger batch synthesis, and audit database telemetry.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-tertiary-container/30 border border-tertiary/40 text-xs font-mono text-tertiary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-error-container/30 border border-error/40 text-xs font-mono text-error flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed Database */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
            <Database className="h-4 w-4" />
            <span>Seed 25 Demo Profiles</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Bulk-load the verified candidate profiles from <code>data/seed.json</code> directly into SQLite. Refuses placeholder URLs.
          </p>
          <button
            onClick={handleSeed}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono font-semibold text-white border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Seed Batch</span>
          </button>
        </div>

        {/* Run All Pipeline */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-secondary uppercase">
            <Play className="h-4 w-4" />
            <span>Execute Run-All Pipeline</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Trigger complete synthesis, 300 pairwise screens, top 5 simulated dates per person, and full rankings for all 25 candidates.
          </p>
          <button
            onClick={handleRunAll}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-semibold text-xs font-mono shadow-md hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Trigger Run-All Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
