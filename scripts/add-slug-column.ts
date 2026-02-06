import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

async function addSlugColumn() {
  console.log('Adding slug column to tenders table...');

  // Add slug column
  await sql`
    ALTER TABLE tenders 
    ADD COLUMN IF NOT EXISTS slug VARCHAR(100)
  `;

  console.log('Slug column added!');

  // Create unique index on slug
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tenders_slug ON tenders(slug)
  `;

  console.log('Slug index created!');

  // Generate slugs for existing tenders
  console.log('Generating slugs for existing tenders...');

  const tenders = await sql`
    SELECT ocid, title FROM tenders WHERE slug IS NULL
  `;

  console.log(`Found ${tenders.length} tenders without slugs`);

  let updated = 0;
  const usedSlugs = new Set<string>();

  for (const tender of tenders) {
    let baseSlug = slugify(tender.title);
    let slug = baseSlug;
    let counter = 1;

    // Handle duplicates by appending a number
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    usedSlugs.add(slug);

    await sql`
      UPDATE tenders SET slug = ${slug} WHERE ocid = ${tender.ocid}
    `;

    updated++;
    if (updated % 100 === 0) {
      console.log(`Updated ${updated} tenders...`);
    }
  }

  console.log(`Done! Updated ${updated} tenders with slugs.`);
}

addSlugColumn()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
