import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const db = getDb();
    const person = db.prepare('SELECT id, name, slug, photo_url, city FROM people WHERE slug = ?').get(params.slug) as any;

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const rankingRows = db.prepare(`
      SELECT 
        r.rank,
        r.score,
        r.why_fits,
        r.watch_out,
        r.sources,
        c.id as candidate_id,
        c.slug as candidate_slug,
        c.name as candidate_name,
        c.photo_url as candidate_photo_url,
        c.city as candidate_city,
        c.raw_instagram as candidate_instagram,
        pr.summary as candidate_summary,
        d.id as date_id
      FROM rankings r
      JOIN people c ON r.candidate_id = c.id
      LEFT JOIN profiles pr ON c.id = pr.person_id
      LEFT JOIN dates d ON ((d.a_id = r.person_id AND d.b_id = r.candidate_id) OR (d.a_id = r.candidate_id AND d.b_id = r.person_id))
      WHERE r.person_id = ?
      ORDER BY r.rank ASC
    `).all(person.id) as any[];

    const candidates = rankingRows.map((row) => ({
      rank: row.rank,
      score: row.score,
      why_fits: row.why_fits,
      watch_out: row.watch_out,
      sources: row.sources ? JSON.parse(row.sources) : null,
      candidate: {
        id: row.candidate_id,
        slug: row.candidate_slug,
        name: row.candidate_name,
        photo_url: row.candidate_photo_url,
        city: row.candidate_city,
        summary: row.candidate_summary,
        raw_instagram: row.candidate_instagram ? JSON.parse(row.candidate_instagram) : null,
      },
      date_id: row.date_id || null,
      has_full_date: Boolean(row.date_id),
    }));

    return NextResponse.json({ person, rankings: candidates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
