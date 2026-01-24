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
  db = drizzleSqlite(sqlite, { schema });
  console.log("DATABASE_URL not set. Using local SQLite database (sqlite.db).");
}
