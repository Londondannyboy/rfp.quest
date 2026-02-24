#!/usr/bin/env npx tsx

/**
 * Add UK Pages to Homepage Internal Links
 * Updates the homepage to include links to new UK-specific pages
 */

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function addUKLinksToHomepage() {
  console.log('🔗 Adding UK page links to homepage...\n');

  // Fetch current homepage content
  const [homepage] = await sql`
    SELECT body_content FROM pages WHERE slug = '/'
  `;

  if (!homepage) {
    console.error('❌ Homepage not found!');
    return;
  }

  // UK section to add before the closing content
  const ukSection = `

## UK Government Tender Solutions

### Find UK Public Sector Opportunities

RFP Quest provides comprehensive coverage of UK government tenders, with specialised integrations for all major procurement portals:

#### **[Find a Tender Integration](/find-a-tender-integration)**
Direct integration with the UK government's official tender portal. Access over 12,000 monthly opportunities worth billions. Our Find a Tender integration provides real-time synchronisation, intelligent filtering, and automated requirement extraction for all high-value UK public contracts.

#### **[Contracts Finder UK](/contracts-finder-uk)**  
Perfect for SMEs targeting below-threshold opportunities. Discover contracts from £10,000 to £138,760 across local councils, NHS trusts, and government departments. Our Contracts Finder integration simplifies the discovery and bidding process for smaller UK businesses.

#### **[NHS Tender Software](/nhs-tender-software)**
Specialised solution for healthcare suppliers. Win more NHS contracts with tools designed for medical device manufacturers, pharmaceutical companies, digital health providers, and NHS service suppliers. Features compliance management, clinical governance support, and trust-level intelligence.

### Why UK Suppliers Choose RFP Quest

- **Unified Platform**: Access Find a Tender, Contracts Finder, and NHS opportunities in one dashboard
- **UK Compliance**: Built for UK procurement regulations, including PCR 2015 and NHS standards
- **Local Intelligence**: Companies House integration for buyer insights and decision-maker profiling
- **Framework Access**: Monitor and bid for framework agreements across all UK public sectors
- **SME-Friendly**: Designed to help UK SMEs compete effectively for public contracts
`;

  // Find position to insert UK section (before the "## Getting Started" section)
  const insertPosition = homepage.body_content.indexOf('## Getting Started');
  
  let updatedContent;
  if (insertPosition > -1) {
    // Insert before Getting Started
    updatedContent = 
      homepage.body_content.slice(0, insertPosition) + 
      ukSection + '\n' +
      homepage.body_content.slice(insertPosition);
  } else {
    // Append to end if Getting Started not found
    updatedContent = homepage.body_content + ukSection;
  }

  // Update homepage
  await sql`
    UPDATE pages 
    SET 
      body_content = ${updatedContent},
      updated_at = NOW()
    WHERE slug = '/'
  `;

  console.log('✅ Homepage updated with UK page links');

  // Also update the homepage meta description to mention UK
  await sql`
    UPDATE pages
    SET 
      meta_description = 'UK government tender analysis platform. Win more public sector contracts with AI-powered RFP software. Integrates with Find a Tender, Contracts Finder, and NHS procurement portals.',
      updated_at = NOW()
    WHERE slug = '/'
  `;

  console.log('✅ Homepage meta description updated for UK market');

  // Add UK pages to sitemap priority
  const ukPages = [
    '/find-a-tender-integration',
    '/contracts-finder-uk', 
    '/nhs-tender-software'
  ];

  for (const slug of ukPages) {
    await sql`
      UPDATE pages
      SET 
        sitemap_priority = 0.9,
        sitemap_changefreq = 'weekly',
        updated_at = NOW()
      WHERE slug = ${slug}
    `;
  }

  console.log('✅ UK pages sitemap priority set to 0.9');

  // Summary
  const ukPagesCount = await sql`
    SELECT COUNT(*) as count 
    FROM pages 
    WHERE cluster = 'uk-government'
  `;

  const totalVolume = await sql`
    SELECT SUM(search_volume) as volume
    FROM pages
    WHERE cluster = 'uk-government'
  `;

  console.log('\n📊 UK Content Summary:');
  console.log(`   UK pages created: ${ukPagesCount[0].count}`);
  console.log(`   Total search volume: ${totalVolume[0].volume}/mo`);
  console.log('\n✨ Homepage linking complete!');
  
  console.log('\n📝 Next Steps:');
  console.log('1. Run "npm run build" to compile changes');
  console.log('2. Test UK pages locally with "npm run dev"');
  console.log('3. Deploy to production');
  console.log('4. Submit updated sitemap to Google Search Console');
  console.log('5. Monitor UK traffic in analytics');
}

// Execute
addUKLinksToHomepage().catch(console.error);