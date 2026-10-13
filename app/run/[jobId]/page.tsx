'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Activity,
  Terminal,
} from 'lucide-react';

interface JobState {
  jobId: string;
  stage: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  person?: {
    id: string;
    slug: string;
    name: string;
    photo_url: string;
  };
}

const STAGES = [
  { id: 1, name: 'Scraping LinkedIn & Instagram', threshold: 25 },
  { id: 2, name: 'Reading Photos with Vision AI', threshold: 45 },
  { id: 3, name: 'Synthesizing Psychological Persona', threshold: 60 },
  { id: 4, name: 'Screening Candidate Match Pool', threshold: 75 },
  { id: 5, name: 'Simulating Autonomous Dates', threshold: 85 },
  { id: 6, name: 'Final Compatibility Ranking', threshold: 95 },
];

export default function PipelineRunPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();

  const [job, setJob] = useState<JobState>({
    jobId: jobId || '',
    stage: 'Initializing pipeline...',
    progress: 5,
    status: 'pending',
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [liveDateMessages, setLiveDateMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!jobId) return;

    // Connect to SSE stream
    const eventSource = new EventSource(`/api/jobs/${jobId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setJob((prev) => ({
          ...prev,
          stage: data.stage || prev.stage,
          progress: data.progress !== undefined ? data.progress : prev.progress,
          status: data.status || prev.status,
          error: data.error,
        }));

        if (data.message) {
          setLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${data.message}`]);
        }

        if (data.dateMessage) {
          setLiveDateMessages((prev) => [...prev.slice(-8), data.dateMessage]);
        }

        if (data.status === 'completed') {
          eventSource.close();
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Polling fallback
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob((prev) => ({
            ...prev,
            stage: data.stage || prev.stage,
            progress: data.progress !== undefined ? data.progress : prev.progress,
            status: data.status || prev.status,
            error: data.error,
            person: data.person || prev.person,
          }));

          if (data.status === 'completed' || data.status === 'failed') {
            clearInterval(interval);
          }
        }
      } catch (_) {}
    }, 3000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [jobId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-white/10 text-xs font-mono text-primary mb-3">
          <Activity className="h-3.5 w-3.5 animate-pulse text-tertiary" />
          <span>Job ID: {jobId}</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Autonomous Reconnaissance In Progress
        </h1>
        <p className="text-sm font-mono text-on-surface-variant mt-2">
          Streaming telemetry via Server-Sent Events (SSE)
        </p>
      </div>

      {/* Main Stepper Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {job.status === 'completed' ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-tertiary-container/30 text-tertiary border border-tertiary/40 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline Finished
              </span>
            ) : job.status === 'failed' ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-error-container/30 text-error border border-error/40 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> Pipeline Interrupted
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary-accent/20 text-primary border border-primary/30 flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Active Execution
              </span>
            )}
            <span className="text-xs font-mono text-on-surface font-semibold">{job.stage}</span>
          </div>
          <span className="text-sm font-mono font-bold text-primary">{job.progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-primary-accent via-fuchsia-500 to-secondary-accent transition-all duration-500"
            style={{ width: `${Math.max(5, job.progress)}%` }}
          />
        </div>

        {/* Stage List */}
        <div className="space-y-4">
          {STAGES.map((s) => {
            const isDone = job.progress >= s.threshold;
            const isCurrent = job.progress < s.threshold && (s.id === 1 || job.progress >= STAGES[s.id - 2]?.threshold);

            return (
              <div
                key={s.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-surface-container/60 border-tertiary/30 text-on-surface'
                    : isCurrent
                    ? 'bg-surface-container-high border-primary/40 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                    : 'bg-surface-container-lowest/40 border-white/5 text-on-surface-variant opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs font-bold">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-tertiary" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <span className="text-on-surface-variant">{s.id}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <span className="text-[11px] font-mono">
                  {isDone ? 'Completed' : isCurrent ? 'Running...' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {job.error && (
          <div className="mt-6 p-4 rounded-xl bg-error-container/30 border border-error/50 flex items-start gap-3 text-xs text-error">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Execution Error</p>
              <p className="font-mono mt-1">{job.error}</p>
            </div>
          </div>
        )}

        {/* Completion CTAs */}
        {job.status === 'completed' && job.person?.slug && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/p/${job.person.slug}`}
              className="flex-1 py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span>View Synthesized Psychological Profile</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link
              href={`/p/${job.person.slug}/ranking`}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all"
            >
              <span>View Compatibility Rankings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Live Date Feed (During Dating Stage) */}
      {liveDateMessages.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-secondary font-bold uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" />
            <span>Simulated Date Live Feed</span>
          </div>
          <div className="space-y-3 font-sans">
            {liveDateMessages.map((msg, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-white/5 text-sm">
                <span className="font-bold text-primary font-mono text-xs block mb-1">
                  {msg.speakerName}
                </span>
                <p className="text-on-surface">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Telemetry Console Log */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-on-surface-variant">
          <Terminal className="h-3.5 w-3.5" />
          <span>Realtime Telemetry Logs</span>
        </div>
        <div className="p-3 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface-variant space-y-1 max-h-40 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-outline">Waiting for worker telemetry packets...</p>
          ) : (
            logs.map((log, i) => <p key={i}>{log}</p>)
          )}
        </div>
      </div>
    </div>
  );
}
