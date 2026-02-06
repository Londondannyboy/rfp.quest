import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createTendersTable() {
  console.log('Creating tenders table...');

  // Main tenders table - stores OCDS data from Find a Tender API
  await sql`
    CREATE TABLE IF NOT EXISTS tenders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      -- OCDS identifiers
      ocid VARCHAR(255) UNIQUE NOT NULL,
      release_id VARCHAR(255),

      -- Basic info
      title TEXT NOT NULL,
      description TEXT,
      status VARCHAR(50),
      stage VARCHAR(50),

      -- Buyer info
      buyer_name VARCHAR(500),
      buyer_id VARCHAR(255),

      -- Value
      value_amount DECIMAL(15, 2),
      value_currency VARCHAR(10) DEFAULT 'GBP',
      value_min DECIMAL(15, 2),
      value_max DECIMAL(15, 2),

      -- Dates
      published_date TIMESTAMP WITH TIME ZONE,
      tender_start_date TIMESTAMP WITH TIME ZONE,
      tender_end_date TIMESTAMP WITH TIME ZONE,
      contract_start_date TIMESTAMP WITH TIME ZONE,
      contract_end_date TIMESTAMP WITH TIME ZONE,

      -- Classification
      cpv_codes JSONB DEFAULT '[]'::jsonb,
      sectors JSONB DEFAULT '[]'::jsonb,

      -- Location
      region VARCHAR(255),
      delivery_locations JSONB DEFAULT '[]'::jsonb,

      -- Raw OCDS data for reference
      raw_ocds JSONB,

      -- Metadata
      source VARCHAR(50) DEFAULT 'find-a-tender',
      synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log('Tenders table created!');

  // Create indexes for common queries
  console.log('Creating indexes...');

  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_ocid ON tenders(ocid)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_stage ON tenders(stage)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_buyer ON tenders(buyer_name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_published ON tenders(published_date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_end_date ON tenders(tender_end_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_value ON tenders(value_amount)`;

  // GIN index for JSONB full-text search on CPV codes
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_cpv ON tenders USING GIN (cpv_codes)`;

  console.log('Indexes created!');

  // Create sync_log table to track sync operations
  await sql`
    CREATE TABLE IF NOT EXISTS tender_sync_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE,
      status VARCHAR(50) DEFAULT 'running',
      records_fetched INTEGER DEFAULT 0,
      records_inserted INTEGER DEFAULT 0,
      records_updated INTEGER DEFAULT 0,
      error_message TEXT,
      params JSONB
    )
  `;

  console.log('Sync log table created!');
}

createTendersTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
