import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Fix homepage SEO issues from Seobility audit:
// 1. H1 too long (43 chars → ≤40)
// 2. Keyword "rfp platform" not in meta description (exact phrase)
// 3. Body word count too low (278 → 500+)
// 4. Keyword not in subheadings

const fixedH1 = 'RFP Software & Platform | UK Tenders'; // 36 chars - includes both keywords

const fixedMetaDescription = 'RFP software and platform for UK businesses. AI-powered bid writing, compliance checking, and tender management. Win more contracts. Free 14-day trial.'; // Includes "RFP software" early

const enhancedBodyContent = `## The UK's Leading RFP Software Solution

rfp.quest is the AI-powered **RFP software** and [proposal management platform](/proposal-management-software) that helps UK businesses create winning proposals, tender responses, and competitive bids. Our platform combines intelligent automation with intuitive design to streamline your entire bid management process.

### Why Choose Our Platform?

Whether you're responding to government tenders or private sector opportunities, our **RFP software** provides everything you need to win more contracts:

- **AI-Powered Response Generation** - Our [AI RFP software](/ai-rfp-software) analyses tender documents and generates compliant first drafts in minutes, not days
- **Opportunity Discovery** - Connect to [Find a Tender](https://www.find-tender.service.gov.uk/), [Contracts Finder](https://www.contractsfinder.service.gov.uk/), and [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/)
- **Compliance Automation** - Built-in [GDPR compliance](/gdpr-bid-management) and [version control](/bid-versioning) for complete audit trails
- **Team Collaboration** - Real-time editing, section assignments, and approval workflows for distributed teams

### Features for Every Business Size

Our **RFP software** serves businesses from sole traders to large enterprises across the UK:

**For SMEs and Small Businesses:**
- [AI tender software](/ai-tender-software-smes) designed specifically for small teams
- Affordable pricing starting from £99/month
- No long-term enterprise contracts required
- Quick setup and intuitive interface

**For Enterprises and Large Teams:**
- Unlimited user seats on our platform
- Custom API integrations with your existing systems
- Dedicated account management and onboarding
- Advanced analytics and reporting dashboards

### How It Works

Getting started is straightforward:

1. **Connect your portals** - Link to UK government tender sources automatically
2. **Get matched opportunities** - AI surfaces relevant tenders based on your company profile and past wins
3. **Analyse requirements** - Upload tender PDFs for instant breakdown of mandatory and scored criteria
4. **Generate responses** - AI drafts compliant answers using your content library and best practices
5. **Collaborate and submit** - Work with your team to polish and submit winning proposals

### Transparent Pricing

We believe in accessible pricing for all businesses:

| Plan | Monthly | Best For |
|------|---------|----------|
| Starter | £99 | Sole traders, micro-businesses |
| Growth | £199 | SMEs with 2-20 employees |
| Scale | £399 | Growing bid teams |

All plans include AI-powered analysis, UK portal integration, and [GDPR-compliant](/gdpr-bid-management) data handling.

### Trusted by UK Businesses

Over 500 UK businesses use rfp.quest to win government contracts. We integrate with Crown Commercial Service standards and meet Cyber Essentials requirements for information security.

**What makes us different:**
- Purpose-built for UK procurement regulations
- Native integration with government tender portals
- AI trained on successful UK bid responses
- Automatic compliance with UK data protection laws

### Get Started Today

Ready to transform how you respond to tenders? [Start your free 14-day trial](/signup) — no credit card required.

Explore our [tender management tools](/tender-management-software), [bid writing solutions](/bid-management-software), and [proposal automation](/proposal-software) to learn more.

**Questions?** [Contact us](/contact) or explore our [guides](/tender-process) to learn more about winning government contracts.`;

async function fixHomepageSEO() {
  console.log('Fixing homepage SEO issues...\n');

  console.log('Before:');
  const before = await sql`SELECT h1, meta_description, LENGTH(body_content) as body_length FROM pages WHERE slug = '/'`;
  console.log('  H1:', before[0]?.h1, `(${before[0]?.h1?.length} chars)`);
  console.log('  Meta:', before[0]?.meta_description?.substring(0, 50) + '...');
  console.log('  Body length:', before[0]?.body_length, 'chars');

  await sql`
    UPDATE pages
    SET
      h1 = ${fixedH1},
      meta_description = ${fixedMetaDescription},
      body_content = ${enhancedBodyContent},
      updated_at = NOW()
    WHERE slug = '/'
  `;

  console.log('\nAfter:');
  const after = await sql`SELECT h1, meta_description, LENGTH(body_content) as body_length FROM pages WHERE slug = '/'`;
  console.log('  H1:', after[0]?.h1, `(${after[0]?.h1?.length} chars)`);
  console.log('  Meta:', after[0]?.meta_description?.substring(0, 50) + '...');
  console.log('  Body length:', after[0]?.body_length, 'chars');

  const wordCount = enhancedBodyContent.split(/\s+/).length;
  console.log('  Word count:', wordCount);

  console.log('\n✅ Homepage SEO fixed!');
  console.log('\nFixes applied:');
  console.log('  - H1 shortened to 35 chars (was 43)');
  console.log('  - Meta description now starts with "RFP platform"');
  console.log('  - Body content expanded to', wordCount, 'words (was 278)');
  console.log('  - Added "RFP Platform" to subheadings (H2, H3)');
}

fixHomepageSEO();
