import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createContentLibraryTables() {
  console.log('Creating content_library table...');

  await sql`
    CREATE TABLE IF NOT EXISTS content_library (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_profile_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      metadata JSONB DEFAULT '{}',
      usage_count INTEGER DEFAULT 0,
      last_used_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log('Creating content library indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_content_library_company ON content_library(company_profile_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_library_type ON content_library(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_library_tags ON content_library USING GIN(tags)`;

  console.log('Creating past_bids table...');
  await sql`
    CREATE TABLE IF NOT EXISTS past_bids (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_profile_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
      tender_title VARCHAR(500) NOT NULL,
      buyer_name VARCHAR(255),
      contract_value DECIMAL(15, 2),
      outcome VARCHAR(50) DEFAULT 'pending',
      submission_date DATE,
      award_date DATE,
      sector VARCHAR(100),
      cpv_codes TEXT[] DEFAULT '{}',
      lessons_learned TEXT,
      win_themes TEXT[],
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log('Creating past bids indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_past_bids_company ON past_bids(company_profile_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_past_bids_outcome ON past_bids(outcome)`;

  console.log('Creating past_bid_responses table...');
  await sql`
    CREATE TABLE IF NOT EXISTS past_bid_responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      past_bid_id UUID NOT NULL REFERENCES past_bids(id) ON DELETE CASCADE,
      question_number VARCHAR(50),
      question_text TEXT NOT NULL,
      response_text TEXT NOT NULL,
      word_count INTEGER,
      score_received DECIMAL(5, 2),
      max_score DECIMAL(5, 2),
      evaluator_feedback TEXT,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_past_bid_responses_bid ON past_bid_responses(past_bid_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_past_bid_responses_tags ON past_bid_responses USING GIN(tags)`;

  console.log('All content library tables created successfully!');
}

createContentLibraryTables()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
