import { Pool, type PoolConfig } from 'pg';

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

  const passwordSuffix = afterHash.slice(0, atIndex);
  const hostAndPath = afterHash.slice(atIndex + 1);
  return `${beforeHash}${encodeURIComponent(`#${passwordSuffix}`)}@${hostAndPath}`;
}

function getPoolConfig(databaseUrl: string) {
  const normalizedUrl = normalizeDatabaseUrl(databaseUrl);
  const parsedUrl = new URL(normalizedUrl);
  const isSupabaseManagedHost =
    parsedUrl.hostname.endsWith('.supabase.co') || parsedUrl.hostname.endsWith('.supabase.com');

  const config: PoolConfig = {
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : 5432,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, '') || 'postgres',
    ...(isSupabaseManagedHost ? { ssl: { rejectUnauthorized: false } } : {}),
  };

  return config;
}

async function migrate() {
  console.log('🚀 Starting migration...');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool(getPoolConfig(databaseUrl));

  try {
    // Add subscription fields to existing mvp_users table
    await pool.query(`
      ALTER TABLE mvp_users 
      ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;
    `);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

migrate();
