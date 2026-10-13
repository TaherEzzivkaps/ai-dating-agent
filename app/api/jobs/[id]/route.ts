import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id) as any;

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let person = null;
    if (job.person_id) {
      person = db.prepare('SELECT id, slug, name, photo_url FROM people WHERE id = ?').get(job.person_id) as any;
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      stage: job.stage,
      progress: job.progress,
      error: job.error,
      person,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
