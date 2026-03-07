import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema';

type AppDatabase = NodePgDatabase<typeof schema>;

declare global {
  // Reuse a single pool during Next.js HMR so local dev does not leak connections.
  // Supabase gives us a Postgres connection string, not a Neon HTTP endpoint.
  var __parrotkitDbPool: Pool | undefined;
  var __parrotkitDb: AppDatabase | undefined;
}

let dbInstance: AppDatabase | null = null;

function normalizeDatabaseUrl(databaseUrl: string) {
  if (!databaseUrl.includes('#')) {
    return databaseUrl;
  }

  const hashIndex = databaseUrl.indexOf('#');
  const beforeHash = databaseUrl.slice(0, hashIndex);
  const afterHash = databaseUrl.slice(hashIndex + 1);
  const atIndex = afterHash.indexOf('@');

  if (atIndex === -1) {
    return databaseUrl;
  }

  // Supabase-generated passwords can contain `#`. If someone pastes the raw URL
  // into `.env.local`, URL parsers treat everything after `#` as a fragment and
  // pg tries to connect to a nonsense host. Re-encode only this broken case so
  // local/dev agents can keep moving without silently hitting EHOSTUNREACH.
  const passwordSuffix = afterHash.slice(0, atIndex);
  const hostAndPath = afterHash.slice(atIndex + 1);
  return `${beforeHash}${encodeURIComponent(`#${passwordSuffix}`)}@${hostAndPath}`;
}

function getPoolConfig(databaseUrl: string) {
  const normalizedUrl = normalizeDatabaseUrl(databaseUrl);
  const parsedUrl = new URL(normalizedUrl);
  const isSupabaseManagedHost =
    parsedUrl.hostname.endsWith('.supabase.co') || parsedUrl.hostname.endsWith('.supabase.com');
  const requiresSsl =
    parsedUrl.searchParams.get('sslmode') === 'require' ||
    parsedUrl.searchParams.get('ssl') === 'true' ||
    isSupabaseManagedHost;

  const config: PoolConfig = {
    // Preserve the full connection string so pg keeps query params such as
    // `sslmode=require`. Reconstructing host/user/password manually drops these
    // parameters and can make Supabase pooler connections look "insecure" in
    // server runtimes even though the original URL requested TLS.
    connectionString: normalizedUrl,
    // Supabase pooler/direct hosts require TLS, and some runtimes do not trust the
    // managed chain automatically. Make the TLS requirement explicit in addition to
    // preserving the original query string so both local and deployed runtimes behave
    // consistently.
    ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  };

  return config;
}

export function getDb(): AppDatabase {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (dbInstance) {
    return dbInstance;
  }

  const pool =
    globalThis.__parrotkitDbPool ||
    new Pool({
      ...getPoolConfig(databaseUrl),
      // Keep pool size conservative because Supabase pooled connections are shared
      // across Next.js route handlers and local HMR sessions.
      max: process.env.NODE_ENV === 'production' ? 10 : 5,
    });

  if (!globalThis.__parrotkitDbPool) {
    globalThis.__parrotkitDbPool = pool;
  }

  dbInstance = globalThis.__parrotkitDb || drizzle(pool, { schema });
  if (!globalThis.__parrotkitDb) {
    globalThis.__parrotkitDb = dbInstance;
  }

  return dbInstance;
}
