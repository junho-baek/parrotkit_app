import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('🚀 Starting migration...');

  try {
    // Add subscription fields to existing mvp_users table
    await sql`
      ALTER TABLE mvp_users 
      ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;
    `;

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
