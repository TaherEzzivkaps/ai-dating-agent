import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('admin_key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin key' }, { status: 401 });
    }

    const seedPath = path.join(process.cwd(), 'data', 'seed.json');
    if (!fs.existsSync(seedPath)) {
      return NextResponse.json({ error: 'data/seed.json not found' }, { status: 404 });
    }

    const items = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

    for (const item of items) {
      if (
        item.linkedin_url.includes('placeholder') ||
        item.instagram_url.includes('placeholder')
      ) {
        return NextResponse.json(
          { error: `Seed contains placeholder for ${item.name}` },
          { status: 400 }
        );
      }
    }

    const db = getDb();
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO people (
        id, slug, name, city, photo_url, linkedin_url, instagram_url, interested_in, is_demo, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `);

    const trans = db.transaction((rows: any[]) => {
      for (const row of rows) {
        insertStmt.run(
          row.id,
          row.slug,
          row.name,
          row.city,
          row.photo_url,
          row.linkedin_url,
          row.instagram_url,
          row.interested_in || 'open'
        );
      }
    });

    trans(items);
    return NextResponse.json({ success: true, count: items.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
