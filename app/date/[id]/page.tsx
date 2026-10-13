'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Heart,
  ChevronLeft,
} from 'lucide-react';

export default function DateViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [dateData, setDateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replay playback states
  const [visibleTurnsCount, setVisibleTurnsCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = normal, 2 = fast, 0 = instant

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dates/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Simulated date not found.');
        return res.json();
      })
      .then((data) => {
        setDateData(data);
        setVisibleTurnsCount(data.transcript?.length || 0); // Default to full
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Replay timer
  useEffect(() => {
    if (!isPlaying || !dateData?.transcript) return;

    if (visibleTurnsCount >= dateData.transcript.length) {
      setIsPlaying(false);
      return;
    }

    const intervalTime = playbackSpeed === 2 ? 1000 : 2200;
    const timer = setTimeout(() => {
      setVisibleTurnsCount((prev) => prev + 1);
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isPlaying, visibleTurnsCount, dateData, playbackSpeed]);

  const handleStartReplay = () => {
    setVisibleTurnsCount(1);
    setIsPlaying(true);
  };

  const handleShowAll = () => {
    setVisibleTurnsCount(dateData?.transcript?.length || 0);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-on-surface-variant">Loading simulated date replay...</p>
      </div>
    );
  }

  if (error || !dateData) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Date Not Found</h2>
        <p className="text-sm font-mono text-on-surface-variant mb-6">{error}</p>
        <Link href="/" className="px-4 py-2 rounded-lg bg-surface-container-high text-sm font-semibold text-white">
          Back to Launchpad
        </Link>
      </div>
    );
  }

  const { personA, personB, venue, transcript, verdictA, verdictB } = dateData;
  const isFinished = visibleTurnsCount >= (transcript?.length || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/p/${personA.slug}/ranking`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Rankings</span>
        </Link>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white flex items-center gap-1.5 border border-white/10"
            >
              <Pause className="h-3.5 w-3.5 text-secondary" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStartReplay}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-accent to-secondary-accent text-xs font-mono text-white flex items-center gap-1.5 shadow-md hover:opacity-95"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Replay Date</span>
            </button>
          )}

          <button
            onClick={handleShowAll}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant hover:text-white border border-white/10"
          >
            Show All
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-xs font-mono text-primary border border-white/10"
          >
            {playbackSpeed}x Speed
          </button>
        </div>
      </div>

      {/* 1. Venue Card (Top Centerpiece) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-primary-accent/15 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary-accent/15 border border-primary/20 text-[11px] font-mono text-primary mb-2">
              <MapPin className="h-3 w-3" />
              <span>{venue?.city || 'San Francisco, CA'} • Simulated Venue</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-white">{venue?.name}</h1>
            <p className="text-sm text-secondary font-medium mt-1">{venue?.activity}</p>
          </div>

          {/* Candidates Avatars */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <img
                src={personA.photo_url || '/avatars/default.png'}
                alt={personA.name}
                className="h-12 w-12 rounded-xl object-cover border border-primary/40 shadow-md mx-auto"
              />
              <span className="text-[11px] font-mono text-on-surface block mt-1">{personA.name.split(' ')[0]}</span>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">✕</span>
            <div className="text-center">
              <img
                src={personB.photo_url || '/avatars/default.png'}
                alt={personB.name}
                className="h-12 w-12 rounded-xl object-cover border border-secondary/40 shadow-md mx-auto"
              />
              <span className="text-[11px] font-mono text-on-surface block mt-1">{personB.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {venue?.rationale && (
          <div className="mt-4 pt-4 border-t border-white/5 text-xs font-mono text-on-surface-variant">
            <span className="text-primary font-bold">Venue Rationale:</span> {venue.rationale}
          </div>
        )}
      </div>

      {/* 2. Conversational Chat Transcript */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4">
          {transcript?.slice(0, visibleTurnsCount).map((turn: any, idx: number) => {
            const isA = turn.speakerId === personA.id || turn.speakerName.includes(personA.name);
            const speakerPhoto = isA ? personA.photo_url : personB.photo_url;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isA ? 'justify-start' : 'justify-end flex-row-reverse'}`}
              >
                <img
                  src={speakerPhoto || '/avatars/default.png'}
                  alt={turn.speakerName}
                  className="h-9 w-9 rounded-xl object-cover border border-white/10 shrink-0 mt-1"
                />

                <div
                  className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                    isA
                      ? 'bg-surface-container-high border border-white/10 text-white rounded-tl-sm'
                      : 'bg-primary-accent/20 border border-primary/30 text-white rounded-tr-sm'
                  }`}
                >
                  <span
                    className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                      isA ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {turn.speakerName}
                  </span>
                  <p>{turn.text}</p>
                </div>
              </div>
            );
          })}

          {isPlaying && (
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant italic py-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>Simulating next speech turn...</span>
            </div>
          )}
        </div>

        {/* Replay End Status */}
        {isFinished && (
          <div className="text-center pt-8 border-t border-white/5 mt-6">
            <span className="text-xs font-mono text-tertiary uppercase tracking-wider font-bold">
              Date Concluded • Private Debriefs Recorded Below
            </span>
          </div>
        )}
      </div>

      {/* 3. Debrief & Verdict Cards Side-by-Side */}
      {isFinished && (
        <div>
          <h2 className="font-display font-bold text-xl text-white text-center mb-6">
            Private Autonomous Debriefs & Verdicts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person A Verdict */}
            <VerdictCard
              person={personA}
              otherPerson={personB}
              verdict={verdictA}
              accentColor="primary"
            />

            {/* Person B Verdict */}
            <VerdictCard
              person={personB}
              otherPerson={personA}
              verdict={verdictB}
              accentColor="secondary"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function VerdictCard({
  person,
  otherPerson,
  verdict,
  accentColor,
}: {
  person: any;
  otherPerson: any;
  verdict: any;
  accentColor: 'primary' | 'secondary';
}) {
  if (!verdict) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <img
            src={person.photo_url || '/avatars/default.png'}
            alt={person.name}
            className="h-8 w-8 rounded-lg object-cover border border-white/10"
          />
          <div>
            <span className="font-display font-bold text-sm text-white block">{person.name}'s Agent</span>
            <span className="text-[10px] font-mono text-on-surface-variant">Private Debrief</span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-display font-extrabold text-xl text-primary">{verdict.chemistry}/100</span>
          <span className="block text-[9px] font-mono text-on-surface-variant uppercase">Chemistry</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-surface-container-lowest text-xs font-mono text-on-surface italic">
        "{verdict.one_line_summary}"
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-tertiary block mb-1">What Clicked</span>
          <p className="text-on-surface leading-relaxed">{verdict.what_clicked}</p>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-secondary block mb-1">Concerns / Friction</span>
          <p className="text-on-surface-variant leading-relaxed">{verdict.concerns}</p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5 font-mono">
          <span className="text-on-surface-variant text-[11px]">Would see again?</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              verdict.would_see_again
                ? 'bg-tertiary-container/30 text-tertiary border border-tertiary/40'
                : 'bg-error-container/30 text-error border border-error/40'
            }`}
          >
            {verdict.would_see_again ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Yes
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" /> No
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
