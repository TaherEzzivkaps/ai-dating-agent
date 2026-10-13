import { getDb } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ArrowRight, MapPin, Heart, Sparkles, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PersonDatesPage({ params }: { params: { slug: string } }) {
  const db = getDb();
  const person = db.prepare('SELECT id, slug, name, photo_url FROM people WHERE slug = ?').get(params.slug) as any;

  if (!person) {
    notFound();
  }

  const dateRows = db.prepare(`
    SELECT 
      d.id,
      d.venue,
      d.transcript,
      d.verdict_a,
      d.verdict_b,
      d.created_at,
      pOther.id as other_id,
      pOther.slug as other_slug,
      pOther.name as other_name,
      pOther.photo_url as other_photo_url,
      pOther.city as other_city
    FROM dates d
    JOIN people pOther ON (CASE WHEN d.a_id = ? THEN d.b_id ELSE d.a_id END) = pOther.id
    WHERE d.a_id = ? OR d.b_id = ?
    ORDER BY d.created_at DESC
  `).all(person.id, person.id, person.id) as any[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/p/${person.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to {person.name}'s Profile</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8 shadow-xl">
        <h1 className="font-display font-bold text-2xl text-white">
          Simulated Dates for {person.name}
        </h1>
        <p className="text-xs font-mono text-on-surface-variant mt-1">
          {dateRows.length} multi-turn venue conversations completed and debriefed.
        </p>
      </div>

      <div className="space-y-4">
        {dateRows.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-on-surface-variant border border-white/5 rounded-xl">
            No dates simulated for this candidate yet.
          </div>
        ) : (
          dateRows.map((d: any) => {
            const venue = d.venue ? JSON.parse(d.venue) : null;
            const verdictA = d.verdict_a ? JSON.parse(d.verdict_a) : null;
            const verdictB = d.verdict_b ? JSON.parse(d.verdict_b) : null;

            return (
              <div
                key={d.id}
                className="glass-card rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={d.other_photo_url || '/avatars/default.png'}
                    alt={d.other_name}
                    className="h-12 w-12 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base text-white">
                        Date with {d.other_name}
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">• {d.other_city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-mono mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{venue?.name} ({venue?.activity})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-display font-extrabold text-lg text-secondary">
                      {verdictA?.chemistry || 85}%
                    </span>
                    <span className="block text-[10px] font-mono text-on-surface-variant uppercase">Chemistry</span>
                  </div>

                  <Link
                    href={`/date/${d.id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-medium text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all"
                  >
                    <span>Watch Date</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
