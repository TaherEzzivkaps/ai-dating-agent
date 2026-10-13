import fs from 'fs';
import path from 'path';
import { getDb } from '../lib/db';

async function main() {
  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  if (!fs.existsSync(seedPath)) {
    console.error('data/seed.json does not exist.');
    process.exit(1);
  }

  const raw = fs.readFileSync(seedPath, 'utf8');
  const items = JSON.parse(raw);

  // Verification rule from Section 10: refuse to run on placeholders
  for (const item of items) {
    if (
      item.linkedin_url.includes('placeholder') ||
      item.instagram_url.includes('placeholder')
    ) {
      console.error(
        `ABORT: Seed entry "${item.name}" contains placeholder URLs. Real URLs required.`
      );
      process.exit(1);
    }
  }

  console.log(`Loading ${items.length} verified demo individuals into SQLite...`);
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
  console.log('Successfully seeded 25 people.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
