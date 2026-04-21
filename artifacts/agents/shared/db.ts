/**
 * DB client for agents.
 *
 * Uses raw `pg` (no Drizzle) — decouples agent type-graph from landing's
 * Drizzle version and keeps bulk operations simple (agents do lots of
 * INSERTs with ON CONFLICT).
 *
 * Schema is authoritative in `artifacts/landing/drizzle/schema.ts` and
 * migrations live in `artifacts/landing/drizzle/migrations/`.
 *
 * Mock mode: when DATABASE_URL is missing/placeholder, operations log to
 * stdout but return shape-compatible results so pipeline can run end-to-end.
 */

import pg from 'pg';
import { DB_MOCK_MODE, log } from './config';

let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5,
    });
  }
  return pool;
}

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  if (DB_MOCK_MODE) {
    log('debug', `[mock-db] query`, { text: text.replace(/\s+/g, ' ').trim().slice(0, 120), params });
    return { rows: [] as T[], rowCount: 0 };
  }
  const res = await getPool().query(text, params as unknown[]);
  return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
}

export function isDbMock(): boolean {
  return DB_MOCK_MODE;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
