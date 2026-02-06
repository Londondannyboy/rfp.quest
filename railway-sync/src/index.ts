/**
 * RFP.quest Tender Sync - Railway Cron Entry Point
 *
 * Runs hourly to sync UK government tenders from Find a Tender API to Neon PostgreSQL.
 *
 * Environment Variables:
 *   DATABASE_URL - Neon PostgreSQL connection string (required)
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import { syncTenders } from './sync';

async function main() {
  const startTime = new Date();
  console.log('='.repeat(60));
  console.log(`[RFP.quest Sync] Starting at ${startTime.toISOString()}`);
  console.log('='.repeat(60));

  try {
    // Sync last 7 days of tenders
    const result = await syncTenders({ days: 7 });

    console.log('');
    console.log('='.repeat(60));
    console.log('[RFP.quest Sync] COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`  Fetched:  ${result.fetched}`);
    console.log(`  Inserted: ${result.inserted}`);
    console.log(`  Updated:  ${result.updated}`);
    console.log(`  Errors:   ${result.errors}`);
    console.log(`  Duration: ${result.duration}s`);
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('[RFP.quest Sync] FAILED');
    console.error('='.repeat(60));
    console.error('Error:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    console.error('='.repeat(60));

    process.exit(1);
  }
}

main();
