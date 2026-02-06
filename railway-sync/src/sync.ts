/**
 * Tender sync logic for Railway cron job
 * Fetches UK government tenders from Find a Tender API and upserts to Neon PostgreSQL
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const FIND_A_TENDER_API = 'https://www.find-tender.service.gov.uk/api/1.0/ocdsReleasePackages';

// Types
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

export interface SyncOptions {
  days?: number;
  full?: boolean;
  limit?: number;
}

export interface SyncResult {
  fetched: number;
  inserted: number;
  updated: number;
  errors: number;
  duration: number;
}

// Helpers
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

function slugify(text: string, ocid: string): string {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);

  // Add last part of OCID for uniqueness (e.g., "064991" from "ocds-h6vhtk-064991")
  const ocidSuffix = ocid.split('-').pop() || '';
  return `${baseSlug}-${ocidSuffix}`;
}

// API fetching
async function fetchBatch(url?: string, updatedFrom?: string): Promise<{
  releases: OCDSRelease[];
  nextUrl: string | null;
}> {
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

  console.log(`  Fetching: ${fetchUrl.substring(0, 80)}...`);

  const response = await fetch(fetchUrl, {
    headers: { 'Accept': 'application/json' },
  });

  // Handle rate limiting
  if (response.status === 429 || response.status === 503) {
    const retryAfter = response.headers.get('Retry-After') || '60';
    console.log(`  Rate limited. Waiting ${retryAfter}s...`);
    await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
    return fetchBatch(url, updatedFrom);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error: ${response.status} ${response.statusText} - ${body.substring(0, 200)}`);
  }

  const data = await response.json();

  return {
    releases: data.releases || [],
    nextUrl: data.links?.next || null,
  };
}

// Database upsert
async function upsertTender(
  sql: NeonQueryFunction<false, false>,
  release: OCDSRelease
): Promise<'inserted' | 'updated' | 'error'> {
  const tender = release.tender;

  const values = {
    ocid: release.ocid,
    release_id: release.id,
    title: tender?.title || 'Untitled',
    slug: slugify(tender?.title || 'untitled', release.ocid),
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
    await sql`
      INSERT INTO tenders (
        ocid, release_id, title, slug, description, status, stage,
        buyer_name, buyer_id, value_amount, value_currency, value_min, value_max,
        published_date, tender_start_date, tender_end_date,
        contract_start_date, contract_end_date,
        cpv_codes, region, raw_ocds, synced_at
      ) VALUES (
        ${values.ocid}, ${values.release_id}, ${values.title}, ${values.slug}, ${values.description},
        ${values.status}, ${values.stage}, ${values.buyer_name}, ${values.buyer_id},
        ${values.value_amount}, ${values.value_currency}, ${values.value_min}, ${values.value_max},
        ${values.published_date}, ${values.tender_start_date}, ${values.tender_end_date},
        ${values.contract_start_date}, ${values.contract_end_date},
        ${values.cpv_codes}::jsonb, ${values.region}, ${values.raw_ocds}::jsonb, NOW()
      )
      ON CONFLICT (ocid) DO UPDATE SET
        release_id = EXCLUDED.release_id,
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
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
    console.error(`  Error upserting ${values.ocid}:`, (error as Error).message);
    return 'error';
  }
}

// Main sync function
export async function syncTenders(options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now();
  const { days = 7, full = false, limit } = options;

  // Validate DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log(`[Sync] Starting with options: days=${days}, full=${full}, limit=${limit || 'none'}`);

  // Calculate updatedFrom date
  let updatedFrom: string | undefined;
  if (!full) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    updatedFrom = fromDate.toISOString();
    console.log(`[Sync] Fetching tenders updated from: ${updatedFrom}`);
  }

  // Create sync log entry
  let logId: string | null = null;
  try {
    const [logEntry] = await sql`
      INSERT INTO tender_sync_log (params)
      VALUES (${JSON.stringify({ days, full, limit, source: 'railway-cron' })}::jsonb)
      RETURNING id
    `;
    logId = logEntry.id as string;
  } catch (e) {
    console.warn('[Sync] Could not create sync log entry:', (e as Error).message);
  }

  let fetched = 0;
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  let nextUrl: string | undefined;

  try {
    let hasMore = true;

    while (hasMore) {
      const result = await fetchBatch(nextUrl, updatedFrom);
      console.log(`[Sync] Processing batch of ${result.releases.length} records...`);

      for (const release of result.releases) {
        if (limit && fetched >= limit) {
          hasMore = false;
          break;
        }

        const upsertResult = await upsertTender(sql, release);
        fetched++;

        if (upsertResult === 'inserted') inserted++;
        if (upsertResult === 'updated') updated++;
        if (upsertResult === 'error') errors++;

        // Progress every 100
        if (fetched % 100 === 0) {
          console.log(`[Sync] Progress: ${fetched} processed, ${inserted} inserted, ${errors} errors`);
        }
      }

      if (!result.nextUrl || (limit && fetched >= limit)) {
        hasMore = false;
      } else {
        nextUrl = result.nextUrl;
        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Update sync log on success
    if (logId) {
      await sql`
        UPDATE tender_sync_log
        SET completed_at = NOW(),
            status = 'completed',
            records_fetched = ${fetched},
            records_inserted = ${inserted},
            records_updated = ${updated}
        WHERE id = ${logId}
      `;
    }

  } catch (error) {
    // Update sync log on error
    if (logId) {
      await sql`
        UPDATE tender_sync_log
        SET completed_at = NOW(),
            status = 'error',
            records_fetched = ${fetched},
            records_inserted = ${inserted},
            records_updated = ${updated},
            error_message = ${(error as Error).message}
        WHERE id = ${logId}
      `;
    }
    throw error;
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  return { fetched, inserted, updated, errors, duration };
}
