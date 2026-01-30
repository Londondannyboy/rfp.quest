import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function auditLinks() {
  const pages = await sql`
    SELECT slug, cluster, intent, body_content, search_volume
    FROM pages
    ORDER BY cluster, search_volume DESC
  `;

  console.log('=== INTERNAL LINK AUDIT ===\n');

  // Group by cluster
  const clusters: Record<string, any[]> = {};
  for (const page of pages) {
    const cluster = page.cluster || 'uncategorized';
    if (!clusters[cluster]) clusters[cluster] = [];
    clusters[cluster].push(page);
  }

  console.log('Pages by cluster:');
  for (const [cluster, clusterPages] of Object.entries(clusters)) {
    console.log(`\n${cluster.toUpperCase()} (${clusterPages.length} pages):`);
    for (const p of clusterPages) {
      console.log(`  ${p.slug} (${p.search_volume}/mo)`);
    }
  }

  // Check for orphaned pages (not linked from any other page)
  console.log('\n=== CHECKING FOR ORPHANED PAGES ===\n');

  const allSlugs = pages.map((p: any) => p.slug);
  const orphaned: string[] = [];

  for (const page of pages) {
    if (page.slug === '/') continue; // Homepage is the root

    // Check if this page is linked from any other page
    let isLinked = false;
    for (const otherPage of pages) {
      if (otherPage.slug === page.slug) continue;
      if (otherPage.body_content && otherPage.body_content.includes(page.slug)) {
        isLinked = true;
        break;
      }
    }

    if (!isLinked) {
      orphaned.push(page.slug);
    }
  }

  if (orphaned.length > 0) {
    console.log('ORPHANED PAGES (not linked from other pages):');
    for (const slug of orphaned) {
      console.log(`  ⚠️  ${slug}`);
    }
  } else {
    console.log('✓ No orphaned pages found!');
  }

  // Check homepage links
  console.log('\n=== HOMEPAGE LINK CHECK ===\n');
  const homepage = pages.find((p: any) => p.slug === '/');
  if (homepage && homepage.body_content) {
    const linkedFromHome = allSlugs.filter((slug: string) =>
      slug !== '/' && homepage.body_content.includes(slug)
    );
    console.log(`Homepage links to ${linkedFromHome.length} pages:`);
    for (const slug of linkedFromHome.slice(0, 15)) {
      console.log(`  ✓ ${slug}`);
    }
    if (linkedFromHome.length > 15) {
      console.log(`  ... and ${linkedFromHome.length - 15} more`);
    }

    // Pages NOT linked from homepage
    const notLinkedFromHome = allSlugs.filter((slug: string) =>
      slug !== '/' && !homepage.body_content.includes(slug)
    );
    if (notLinkedFromHome.length > 0) {
      console.log(`\nPages NOT linked from homepage (${notLinkedFromHome.length}):`);
      for (const slug of notLinkedFromHome) {
        console.log(`  ⚠️  ${slug}`);
      }
    }
  }
}

auditLinks();
