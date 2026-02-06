import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

// Load from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createCompanyProfilesTable() {
  console.log('Creating company_profiles table...');

  await sql`
    CREATE TABLE IF NOT EXISTS company_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      -- Basic Info
      company_name VARCHAR(500) NOT NULL,
      description TEXT,
      website VARCHAR(500),

      -- Expertise & Offerings
      products_services TEXT[] DEFAULT '{}',
      expertise_areas TEXT[] DEFAULT '{}',
      certifications TEXT[] DEFAULT '{}',

      -- Targeting
      target_regions TEXT[] DEFAULT '{}',
      target_cpv_divisions TEXT[] DEFAULT '{}',
      min_contract_value INTEGER,
      max_contract_value INTEGER,

      -- Sustainability Focus
      sustainability_focus BOOLEAN DEFAULT false,
      sustainability_keywords TEXT[] DEFAULT '{}',

      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log('company_profiles table created!');

  // Create index on user_id
  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_profiles_user ON company_profiles(user_id)
  `;

  console.log('Index created!');
}

createCompanyProfilesTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
