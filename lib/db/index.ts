import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

function getDbPath(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dating.db');
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'data', 'seed.sqlite'),
        path.join(process.cwd(), 'data', 'dating.db'),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpDbPath);
            break;
          } catch (e) {
            console.warn('Failed to copy seed db to /tmp:', e);
          }
        }
      }
    }
    return tmpDbPath;
  }

  const localPath = path.join(process.cwd(), 'data', 'dating.db');
  const dbDir = path.dirname(localPath);
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true });
    } catch {}
  }

  if (!fs.existsSync(localPath)) {
    const seedPath = path.join(process.cwd(), 'data', 'seed.sqlite');
    if (fs.existsSync(seedPath)) {
      try {
        fs.copyFileSync(seedPath, localPath);
      } catch {}
    }
  }

  return localPath;
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dbPath = getDbPath();
    try {
      dbInstance = new Database(dbPath);
      try {
        dbInstance.pragma('journal_mode = WAL');
      } catch {}
      initSchema(dbInstance);
    } catch (err) {
      console.error(`Failed to open SQLite database at ${dbPath}:`, err);
      try {
        dbInstance = new Database(':memory:');
        initSchema(dbInstance);
      } catch (memErr) {
        console.error('Failed to create in-memory database:', memErr);
        throw err;
      }
    }
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      linkedin_url TEXT NOT NULL,
      instagram_url TEXT NOT NULL,
      photo_url TEXT,
      city TEXT,
      raw_linkedin TEXT,
      raw_instagram TEXT,
      images TEXT,
      identity_check TEXT,
      interested_in TEXT DEFAULT 'open',
      is_demo INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profiles (
      person_id TEXT PRIMARY KEY,
      summary TEXT,
      needs TEXT,
      hobbies TEXT,
      interests TEXT,
      values_json TEXT,
      personality TEXT,
      lifestyle TEXT,
      communication_style TEXT,
      relationship_signals TEXT,
      friction_points TEXT,
      dating_persona TEXT,
      overall_confidence REAL,
      data_quality TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS screens (
      a_id TEXT NOT NULL,
      b_id TEXT NOT NULL,
      score REAL NOT NULL,
      shared TEXT,
      tension TEXT,
      rationale TEXT,
      PRIMARY KEY (a_id, b_id),
      FOREIGN KEY (a_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (b_id) REFERENCES people(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dates (
      id TEXT PRIMARY KEY,
      a_id TEXT NOT NULL,
      b_id TEXT NOT NULL,
      venue TEXT,
      transcript TEXT,
      verdict_a TEXT,
      verdict_b TEXT,
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (a_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (b_id) REFERENCES people(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rankings (
      person_id TEXT NOT NULL,
      candidate_id TEXT NOT NULL,
      rank INTEGER NOT NULL,
      score REAL NOT NULL,
      why_fits TEXT,
      watch_out TEXT,
      sources TEXT,
      PRIMARY KEY (person_id, candidate_id),
      FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (candidate_id) REFERENCES people(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      person_id TEXT,
      status TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      stage TEXT,
      error TEXT,
      payload TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      ip_hash TEXT NOT NULL,
      day TEXT NOT NULL,
      count INTEGER DEFAULT 1,
      PRIMARY KEY (ip_hash, day)
    );
  `);
}

export default getDb;
