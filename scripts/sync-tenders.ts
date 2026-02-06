/**
 * Sync tenders from Find a Tender API to Neon database
 *
 * Usage:
 *   npx tsx scripts/sync-tenders.ts              # Sync recent tenders (last 7 days)
 *   npx tsx scripts/sync-tenders.ts --full       # Full sync (all available)
 *   npx tsx scripts/sync-tenders.ts --days=30    # Last 30 days
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

const FIND_A_TENDER_API = 'https://www.find-tender.service.gov.uk/api/1.0/ocdsReleasePackages';

interface OCDSRelease {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  tender?: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    tenderPeriod?: {
      startDate?: string;
      endDate?: string;
    };
    contractPeriod?: {
      startDate?: string;
      endDate?: string;
    };
    value?: {
      amount?: number;
      currency?: string;
    };
    minValue?: { amount?: number };
    maxValue?: { amount?: number };
    items?: Array<{
      classification?: {
        scheme?: string;
        id?: string;
        description?: string;
      };
    }>;
    deliveryAddresses?: Array<{
      region?: string;
    }>;
  };
  buyer?: {
    id?: string;
    name?: string;
  };
}

interface SyncOptions {
  days?: number;
  full?: boolean;
  limit?: number;
}

async function fetchTenders(url?: string, updatedFrom?: string): Promise<{
  releases: OCDSRelease[];
  nextUrl: string | null;
}> {
  // Build initial URL if not following a next link
  let fetchUrl: string;
  if (url) {
    fetchUrl = url;
  } else {
    const params = new URLSearchParams({ limit: '100' });
    if (updatedFrom) {
      params.append('updatedFrom', updatedFrom);
    }
    fetchUrl = `${FIND_A_TENDER_API}?${params}`;
  }

  console.log(`Fetching: ${fetchUrl}`);

  const response = await fetch(fetchUrl, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (response.status === 429 || response.status === 503) {
    const retryAfter = response.headers.get('Retry-After') || '60';
    console.log(`Rate limited. Waiting ${retryAfter}s...`);
    await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
    return fetchTenders(url, updatedFrom);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error: ${response.status} ${response.statusText} - ${body}`);
  }

  const data = await response.json();

  return {
    releases: data.releases || [],
    nextUrl: data.links?.next || null,
  };
}

function extractCPVCodes(tender?: OCDSRelease['tender']): string[] {
  if (!tender?.items) return [];

  return tender.items
    .filter(item => item.classification?.scheme === 'CPV')
    .map(item => item.classification?.id || '')
    .filter(Boolean);
}

function extractRegion(tender?: OCDSRelease['tender']): string | null {
  const address = tender?.deliveryAddresses?.[0];
  return address?.region || null;
}

function getStage(tags: string[]): string {
  if (tags.includes('award')) return 'award';
  if (tags.includes('tender')) return 'tender';
  if (tags.includes('planning')) return 'planning';
  return tags[0] || 'unknown';
}

async function upsertTender(release: OCDSRelease): Promise<'inserted' | 'updated' | 'skipped'> {
  const tender = release.tender;

  const values = {
    ocid: release.ocid,
    release_id: release.id,
    title: tender?.title || 'Untitled',
    description: tender?.description || null,
    status: tender?.status || null,
    stage: getStage(release.tag || []),
    buyer_name: release.buyer?.name || null,
    buyer_id: release.buyer?.id || null,
    value_amount: tender?.value?.amount || null,
    value_currency: tender?.value?.currency || 'GBP',
    value_min: tender?.minValue?.amount || null,
    value_max: tender?.maxValue?.amount || null,
    published_date: release.date || null,
    tender_start_date: tender?.tenderPeriod?.startDate || null,
    tender_end_date: tender?.tenderPeriod?.endDate || null,
    contract_start_date: tender?.contractPeriod?.startDate || null,
    contract_end_date: tender?.contractPeriod?.endDate || null,
    cpv_codes: JSON.stringify(extractCPVCodes(tender)),
    region: extractRegion(tender),
    raw_ocds: JSON.stringify(release),
  };

  try {
    // Try insert first
    await sql`
      INSERT INTO tenders (
        ocid, release_id, title, description, status, stage,
        buyer_name, buyer_id, value_amount, value_currency, value_min, value_max,
        published_date, tender_start_date, tender_end_date,
        contract_start_date, contract_end_date,
        cpv_codes, region, raw_ocds, synced_at
      ) VALUES (
        ${values.ocid}, ${values.release_id}, ${values.title}, ${values.description},
        ${values.status}, ${values.stage}, ${values.buyer_name}, ${values.buyer_id},
        ${values.value_amount}, ${values.value_currency}, ${values.value_min}, ${values.value_max},
        ${values.published_date}, ${values.tender_start_date}, ${values.tender_end_date},
        ${values.contract_start_date}, ${values.contract_end_date},
        ${values.cpv_codes}::jsonb, ${values.region}, ${values.raw_ocds}::jsonb, NOW()
      )
      ON CONFLICT (ocid) DO UPDATE SET
        release_id = EXCLUDED.release_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        stage = EXCLUDED.stage,
        buyer_name = EXCLUDED.buyer_name,
        buyer_id = EXCLUDED.buyer_id,
        value_amount = EXCLUDED.value_amount,
        value_currency = EXCLUDED.value_currency,
        value_min = EXCLUDED.value_min,
        value_max = EXCLUDED.value_max,
        published_date = EXCLUDED.published_date,
        tender_start_date = EXCLUDED.tender_start_date,
        tender_end_date = EXCLUDED.tender_end_date,
        contract_start_date = EXCLUDED.contract_start_date,
        contract_end_date = EXCLUDED.contract_end_date,
        cpv_codes = EXCLUDED.cpv_codes,
        region = EXCLUDED.region,
        raw_ocds = EXCLUDED.raw_ocds,
        synced_at = NOW(),
        updated_at = NOW()
    `;

    return 'inserted';
  } catch (error) {
    console.error(`Error upserting ${values.ocid}:`, error);
    return 'skipped';
  }
}

async function syncTenders(options: SyncOptions = {}) {
  const { days = 7, full = false, limit } = options;

  console.log('Starting tender sync...');
  console.log(`Options: days=${days}, full=${full}, limit=${limit || 'none'}`);

  // Calculate updatedFrom date
  let updatedFrom: string | undefined;
  if (!full) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    updatedFrom = fromDate.toISOString();
    console.log(`Fetching tenders updated from: ${updatedFrom}`);
  }

  // Create sync log entry
  const [logEntry] = await sql`
    INSERT INTO tender_sync_log (params)
    VALUES (${JSON.stringify({ days, full, limit })}::jsonb)
    RETURNING id
  `;
  const logId = logEntry.id;

  let totalFetched = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let nextUrl: string | undefined;

  try {
    let hasMore = true;

    while (hasMore) {
      const result = await fetchTenders(nextUrl, updatedFrom);

      console.log(`Processing batch of ${result.releases.length} records...`);

      for (const release of result.releases) {
        if (limit && totalFetched >= limit) {
          hasMore = false;
          break;
        }

        const upsertResult = await upsertTender(release);
        totalFetched++;

        if (upsertResult === 'inserted') totalInserted++;
        if (upsertResult === 'updated') totalUpdated++;

        // Progress indicator
        if (totalFetched % 100 === 0) {
          console.log(`Progress: ${totalFetched} processed, ${totalInserted} inserted`);
        }
      }

      if (!result.nextUrl || (limit && totalFetched >= limit)) {
        hasMore = false;
      } else {
        nextUrl = result.nextUrl;
        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Update sync log
    await sql`
      UPDATE tender_sync_log
      SET completed_at = NOW(),
          status = 'completed',
          records_fetched = ${totalFetched},
          records_inserted = ${totalInserted},
          records_updated = ${totalUpdated}
      WHERE id = ${logId}
    `;

    console.log('\n=== Sync Complete ===');
    console.log(`Total fetched: ${totalFetched}`);
    console.log(`Inserted: ${totalInserted}`);
    console.log(`Updated: ${totalUpdated}`);

  } catch (error) {
    // Log error
    await sql`
      UPDATE tender_sync_log
      SET completed_at = NOW(),
          status = 'error',
          records_fetched = ${totalFetched},
          records_inserted = ${totalInserted},
          records_updated = ${totalUpdated},
          error_message = ${(error as Error).message}
      WHERE id = ${logId}
    `;

    throw error;
  }
}

// Parse command line args
const args = process.argv.slice(2);
const options: SyncOptions = {};

for (const arg of args) {
  if (arg === '--full') {
    options.full = true;
  } else if (arg.startsWith('--days=')) {
    options.days = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--limit=')) {
    options.limit = parseInt(arg.split('=')[1]);
  }
}

syncTenders(options)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
