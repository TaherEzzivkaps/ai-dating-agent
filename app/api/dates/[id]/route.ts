import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const date = db.prepare('SELECT * FROM dates WHERE id = ?').get(params.id) as any;

    if (!date) {
      return NextResponse.json({ error: 'Date simulation not found' }, { status: 404 });
    }

    const personA = db.prepare('SELECT id, slug, name, photo_url, city FROM people WHERE id = ?').get(date.a_id) as any;
    const personB = db.prepare('SELECT id, slug, name, photo_url, city FROM people WHERE id = ?').get(date.b_id) as any;

    return NextResponse.json({
      id: date.id,
      personA,
      personB,
      venue: date.venue ? JSON.parse(date.venue) : null,
      transcript: date.transcript ? JSON.parse(date.transcript) : [],
      verdictA: date.verdict_a ? JSON.parse(date.verdict_a) : null,
      verdictB: date.verdict_b ? JSON.parse(date.verdict_b) : null,
      status: date.status,
      created_at: date.created_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
