import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/drizzle/schema';

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

/**
 * Mock mode is on when DATABASE_URL is missing, points to a placeholder host,
 * or when MOCK_DB=true is explicitly set. In mock mode every server action
 * short-circuits with a simulated success response — useful for:
 *   • UI development without provisioning Postgres
 *   • Replit agents validating the flow before connecting a real DB
 *   • Visual QA / Playwright smoke tests
 *
 * In production, DATABASE_URL is always set to a real Postgres URL → mock is off.
 */
export const isMockMode: boolean =
  process.env.MOCK_DB === 'true' ||
  !process.env.DATABASE_URL ||
  /placeholder|localhost\.invalid|example\.com/.test(process.env.DATABASE_URL);

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!global.__dbPool) {
    global.__dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5,
    });
  }
  return global.__dbPool;
}

// In mock mode we never instantiate a pool. The proxy below throws if anything
// accidentally tries to query when mock is active — catches programmer error early.
function makeMockDb(): ReturnType<typeof drizzle> {
  return new Proxy({} as ReturnType<typeof drizzle>, {
    get() {
      throw new Error(
        '[db] mock mode is active — server actions should short-circuit before touching the DB.',
      );
    },
  });
}

export const db = isMockMode ? makeMockDb() : drizzle(getPool(), { schema });
export { schema };
