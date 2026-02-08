import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

// Load from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function addCategoryColumns() {
  console.log('Adding category columns to tenders table...');

  // Add main_category column
  await sql`
    ALTER TABLE tenders
    ADD COLUMN IF NOT EXISTS main_category VARCHAR(100)
  `;
  console.log('Added main_category column');

  // Add lead_category column
  await sql`
    ALTER TABLE tenders
    ADD COLUMN IF NOT EXISTS lead_category VARCHAR(255)
  `;
  console.log('Added lead_category column');

  // Add category_tags column (JSONB array)
  await sql`
    ALTER TABLE tenders
    ADD COLUMN IF NOT EXISTS category_tags JSONB DEFAULT '[]'
  `;
  console.log('Added category_tags column');

  // Add category_confidence column
  await sql`
    ALTER TABLE tenders
    ADD COLUMN IF NOT EXISTS category_confidence DECIMAL(3,2)
  `;
  console.log('Added category_confidence column');

  // Add categorized_at column
  await sql`
    ALTER TABLE tenders
    ADD COLUMN IF NOT EXISTS categorized_at TIMESTAMP WITH TIME ZONE
  `;
  console.log('Added categorized_at column');

  // Create indexes
  await sql`
    CREATE INDEX IF NOT EXISTS idx_tenders_main_category ON tenders(main_category)
  `;
  console.log('Created idx_tenders_main_category index');

  await sql`
    CREATE INDEX IF NOT EXISTS idx_tenders_lead_category ON tenders(lead_category)
  `;
  console.log('Created idx_tenders_lead_category index');

  console.log('All category columns added successfully!');
}

addCategoryColumns()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
