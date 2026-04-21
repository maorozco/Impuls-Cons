import type { Config } from 'drizzle-kit';
import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env.local explicitly so drizzle-kit picks up DATABASE_URL the same way
// Next.js does at runtime. Falls back to a local Homebrew Postgres for dev.
for (const p of ['.env.local', '.env']) {
  const abs = resolve(process.cwd(), p);
  if (existsSync(abs)) loadDotenv({ path: abs, override: false });
}

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      `postgres://${process.env.USER ?? 'postgres'}@127.0.0.1:5432/biocycle`,
  },
  strict: true,
  verbose: true,
} satisfies Config;
