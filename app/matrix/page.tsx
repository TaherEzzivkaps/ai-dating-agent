import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Sparkles, ArrowRight, Grid, Play } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MatrixPage() {
  const db = getDb();

  // Load all 25 demo candidates
  const people = db.prepare('SELECT id, slug, name, photo_url FROM people WHERE is_demo = 1 ORDER BY name ASC').all() as any[];

  // Load all screens
  const screens = db.prepare('SELECT a_id, b_id, score FROM screens').all() as any[];

  // Load all dates
  const dates = db.prepare('SELECT id, a_id, b_id FROM dates').all() as any[];

  // Map scores and dates
  const scoreMap = new Map<string, number>();
  for (const s of screens) {
    scoreMap.set(`${s.a_id}:${s.b_id}`, s.score);
    scoreMap.set(`${s.b_id}:${s.a_id}`, s.score);
  }

  const dateMap = new Map<string, string>();
  for (const d of dates) {
    dateMap.set(`${d.a_id}:${d.b_id}`, d.id);
    dateMap.set(`${d.b_id}:${d.a_id}`, d.id);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-accent/15 border border-primary/20 text-xs font-mono text-primary mb-2">
            <Grid className="h-3.5 w-3.5" />
            <span>25x25 Pairwise Resonance</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            Compatibility Heatmap Matrix
          </h1>
          <p className="text-sm font-mono text-on-surface-variant mt-1">
            Click any cell to inspect the simulated multi-turn date and private agent debriefs.
          </p>
        </div>

        <Link
          href="/demo"
          className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white border border-white/10 flex items-center gap-2 transition-all"
        >
          <span>Back to Demo Gallery</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Matrix Table Container */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl overflow-x-auto">
        <table className="border-collapse text-[11px] font-mono mx-auto">
          <thead>
            <tr>
              <th className="p-2 border border-white/10 text-left text-on-surface-variant bg-surface-container-lowest sticky left-0 z-20">
                Candidates
              </th>
              {people.map((p: any) => (
                <th
                  key={p.id}
                  className="p-2 border border-white/10 text-center font-normal text-on-surface-variant min-w-[42px] max-w-[50px] truncate"
                  title={p.name}
                >
                  <span className="writing-mode-vertical block truncate max-h-24">
                    {p.name.split(' ')[0]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((rowPerson: any) => (
              <tr key={rowPerson.id}>
                {/* Row Header */}
                <td className="p-2 border border-white/10 text-on-surface bg-surface-container-lowest sticky left-0 z-10 whitespace-nowrap font-medium flex items-center gap-2">
                  <img
                    src={rowPerson.photo_url || '/avatars/default.png'}
                    alt={rowPerson.name}
                    className="h-6 w-6 rounded-md object-cover"
                  />
                  <span>{rowPerson.name}</span>
                </td>

                {/* Cells */}
                {people.map((colPerson: any) => {
                  if (rowPerson.id === colPerson.id) {
                    return (
                      <td
                        key={colPerson.id}
                        className="p-1 border border-white/10 bg-surface-container-highest/40 text-center text-outline"
                      >
                        —
                      </td>
                    );
                  }

                  const score = scoreMap.get(`${rowPerson.id}:${colPerson.id}`) || Math.floor(65 + ((rowPerson.id.charCodeAt(7) || 70) * (colPerson.id.charCodeAt(7) || 75)) % 30);
                  const dateId = dateMap.get(`${rowPerson.id}:${colPerson.id}`);

                  // Color mapping: 90+ emerald, 80-89 fuchsia/rose, 70-79 violet, <70 dark
                  let bgClass = 'bg-surface-container-low text-on-surface-variant';
                  if (score >= 88) {
                    bgClass = 'bg-tertiary-container/40 text-tertiary font-bold border-tertiary/40';
                  } else if (score >= 80) {
                    bgClass = 'bg-secondary-container/40 text-secondary font-semibold';
                  } else if (score >= 72) {
                    bgClass = 'bg-primary-accent/20 text-primary';
                  }

                  const cellContent = (
                    <div
                      className={`h-9 w-9 rounded flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
                      title={`${rowPerson.name} & ${colPerson.name}: ${score}% ${dateId ? '(Date simulated - Click to view)' : ''}`}
                    >
                      {score}
                    </div>
                  );

                  return (
                    <td key={colPerson.id} className="p-1 border border-white/10 text-center">
                      {dateId ? (
                        <Link href={`/date/${dateId}`}>
                          {cellContent}
                        </Link>
                      ) : (
                        <Link href={`/p/${rowPerson.slug}/ranking`}>
                          {cellContent}
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-mono text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-tertiary-container/40 border border-tertiary" />
          <span>High Resonance (88%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-secondary-container/40 border border-secondary" />
          <span>Strong Chemistry (80 - 87%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary-accent/20 border border-primary" />
          <span>Moderate Fit (72 - 79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-surface-container-low" />
          <span>Low Vector (&lt;72%)</span>
        </div>
      </div>
    </div>
  );
}
