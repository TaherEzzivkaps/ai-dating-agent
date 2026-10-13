import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Sparkles, ArrowRight, Grid, Play, Heart, MapPin, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const db = getDb();

  // Load all 25 demo people and their profile summaries
  const people = db.prepare(`
    SELECT p.id, p.slug, p.name, p.city, p.photo_url, p.linkedin_url, p.instagram_url, pr.summary, pr.data_quality
    FROM people p
    LEFT JOIN profiles pr ON p.id = pr.person_id
    WHERE p.is_demo = 1
    ORDER BY p.name ASC
  `).all() as any[];

  // Find a featured date (e.g. highest chemistry date between top profiles)
  const featuredDate = db.prepare(`
    SELECT d.id, d.venue, d.verdict_a, d.verdict_b, 
           pA.name as name_a, pA.slug as slug_a, pA.photo_url as photo_a,
           pB.name as name_b, pB.slug as slug_b, pB.photo_url as photo_b
    FROM dates d
    JOIN people pA ON d.a_id = pA.id
    JOIN people pB ON d.b_id = pB.id
    LIMIT 1
  `).get() as any;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner: Watch a Featured Date */}
      {featuredDate && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-accent/20 via-surface-container-high to-secondary-accent/20 border border-white/15 p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-accent/20 border border-secondary/30 text-xs font-mono text-secondary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Featured Autonomous Simulation</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {featuredDate.name_a} & {featuredDate.name_b}
              </h2>
              <p className="text-sm font-sans text-on-surface-variant mt-1 max-w-xl">
                Watch the multi-turn simulated date at {JSON.parse(featuredDate.venue || '{}').name || 'Bar Gemini'}, complete with real-time dialogue and private debriefs.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  src={featuredDate.photo_a || '/avatars/default.png'}
                  alt={featuredDate.name_a}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-surface shadow-md"
                />
                <img
                  src={featuredDate.photo_b || '/avatars/default.png'}
                  alt={featuredDate.name_b}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-surface shadow-md"
                />
              </div>

              <Link
                href={`/date/${featuredDate.id}`}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-semibold text-sm shadow-lg hover:opacity-95 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                <span>Watch Date Simulation</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Header & Matrix CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Pre-Run Demo Pool ({people.length} People)
          </h1>
          <p className="text-sm font-mono text-on-surface-variant mt-1">
            Zero-latency local view • Real public links • Full date histories & rankings
          </p>
        </div>

        <Link
          href="/matrix"
          className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white border border-white/10 flex items-center gap-2 transition-all"
        >
          <Grid className="h-4 w-4 text-primary" />
          <span>View 25x25 Compatibility Matrix</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {people.map((person: any) => (
          <div
            key={person.id}
            className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={person.photo_url || '/avatars/default.png'}
                  alt={person.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md text-white border border-white/15 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span>{person.city || 'San Francisco'}</span>
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors">
                {person.name}
              </h3>

              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                {person.summary || 'Verified profile analysis complete.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2.5">
              <Link
                href={`/p/${person.slug}`}
                className="h-9 px-3 flex-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-sans font-medium text-on-surface flex items-center justify-center gap-1.5 transition-all border border-white/5"
              >
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span>Profile</span>
              </Link>

              <Link
                href={`/p/${person.slug}/ranking`}
                className="h-9 px-3 flex-1 rounded-lg bg-gradient-to-r from-primary-accent to-secondary-accent text-white text-xs font-sans font-medium flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-all"
              >
                <span>Rankings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
