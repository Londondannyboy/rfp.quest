/**
 * Backfill CPV codes from raw_ocds data
 * Run with: npx tsx scripts/backfill-cpv-codes.ts
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

interface CPVClassification {
  scheme?: string;
  id?: string;
  description?: string;
}

interface RawOCDS {
  tender?: {
    classification?: CPVClassification;
    items?: Array<{
      classification?: CPVClassification;
      additionalClassifications?: CPVClassification[];
    }>;
  };
}

function extractCPVCodes(rawOcds: RawOCDS): string[] {
  const cpvCodes: string[] = [];
  const tender = rawOcds?.tender;

  // 1. Top-level tender classification
  if (tender?.classification?.scheme === 'CPV' && tender.classification.id) {
    cpvCodes.push(tender.classification.id);
  }

  // 2. Item classifications
  if (tender?.items) {
    for (const item of tender.items) {
      // Primary classification
      if (item.classification?.scheme === 'CPV' && item.classification.id) {
        cpvCodes.push(item.classification.id);
      }
      // Additional classifications
      if (item.additionalClassifications) {
        for (const ac of item.additionalClassifications) {
          if (ac.scheme === 'CPV' && ac.id) {
            cpvCodes.push(ac.id);
          }
        }
      }
    }
  }

  // Deduplicate and return
  return [...new Set(cpvCodes)];
}

async function backfillCPVCodes() {
  console.log('Starting CPV codes backfill...');

  // Get all tenders with empty cpv_codes but have raw_ocds
  const tenders = await sql`
    SELECT ocid, raw_ocds
    FROM tenders
    WHERE raw_ocds IS NOT NULL
      AND (cpv_codes IS NULL OR cpv_codes = '[]'::jsonb)
  `;

  console.log(`Found ${tenders.length} tenders to backfill`);

  let updated = 0;
  let withCpv = 0;

  for (const tender of tenders) {
    const rawOcds = tender.raw_ocds as RawOCDS;
    const cpvCodes = extractCPVCodes(rawOcds);

    if (cpvCodes.length > 0) {
      await sql`
        UPDATE tenders
        SET cpv_codes = ${JSON.stringify(cpvCodes)}::jsonb
        WHERE ocid = ${tender.ocid}
      `;
      withCpv++;
    }
    updated++;

    if (updated % 50 === 0) {
      console.log(`Processed ${updated}/${tenders.length}, ${withCpv} with CPV codes`);
    }
  }

  console.log(`\nBackfill complete!`);
  console.log(`Total processed: ${updated}`);
  console.log(`Tenders with CPV codes: ${withCpv}`);

  // Show sector breakdown after backfill
  const sectorCheck = await sql`
    SELECT
      LEFT((cpv_codes->>0)::text, 2) as division,
      COUNT(*) as count
    FROM tenders
    WHERE cpv_codes IS NOT NULL
      AND jsonb_array_length(cpv_codes) > 0
    GROUP BY LEFT((cpv_codes->>0)::text, 2)
    ORDER BY count DESC
    LIMIT 10
  `;

  console.log('\nSector breakdown after backfill:');
  for (const row of sectorCheck) {
    console.log(`  ${row.division}: ${row.count} tenders`);
  }
}

backfillCPVCodes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });
