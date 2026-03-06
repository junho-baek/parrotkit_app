import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (dbInstance) {
    return dbInstance;
  }

  const sql = neon(databaseUrl);
  dbInstance = drizzle(sql as any, { schema });
  return dbInstance;
}
