import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { Pool, neonConfig } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import ws from 'ws';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

export let db: any;
export let pool: Pool | undefined;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon(pool, { schema });
} else {
  const sqlite = new Database('sqlite.db');
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      action TEXT NOT NULL,
      details TEXT,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      role TEXT NOT NULL,
      agence TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      old_value TEXT,
      new_value TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db = drizzleSqlite(sqlite, { schema });
  console.log("DATABASE_URL not set. Using local SQLite database (sqlite.db).");
}
