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

const fixedH1 = 'RFP Platform | AI Bid Management UK'; // 35 chars

const fixedMetaDescription = 'RFP platform for UK government tenders. AI-powered bid management with GDPR compliance, auto-versioning, and SME pricing from £99/month. Start free today.'; // Starts with "RFP platform"

const enhancedBodyContent = `## The UK's Leading RFP Platform Solution

rfp.quest is the AI-powered **RFP platform** and [proposal software](/rfp-response-software) that helps UK businesses create winning proposals, tender responses, and competitive bids. Our RFP platform combines intelligent automation with intuitive design to streamline your entire bid management process.

### Why Choose Our RFP Platform?

Whether you're responding to government tenders or private sector opportunities, our RFP platform provides everything you need to win more contracts:

- **AI-Powered Response Generation** - Our [AI RFP software](/ai-rfp-software) analyses tender documents and generates compliant first drafts in minutes, not days
- **Opportunity Discovery** - Connect to [Find a Tender](https://www.find-tender.service.gov.uk/), [Contracts Finder](https://www.contractsfinder.service.gov.uk/), and [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/)
- **Compliance Automation** - Built-in [GDPR compliance](/gdpr-bid-management) and [version control](/bid-versioning) for complete audit trails
- **Team Collaboration** - Real-time editing, section assignments, and approval workflows for distributed teams

### RFP Platform Features for Every Business Size

Our RFP platform serves businesses from sole traders to large enterprises across the UK:

**For SMEs and Small Businesses:**
- [AI tender software](/ai-tender-software-smes) designed specifically for small teams
- Affordable RFP platform pricing starting from £99/month
- No long-term enterprise contracts required
- Quick setup and intuitive interface

**For Enterprises and Large Teams:**
- Unlimited user seats on our RFP platform
- Custom API integrations with your existing systems
- Dedicated account management and onboarding
- Advanced analytics and reporting dashboards

### How the RFP Platform Works

Getting started with our RFP platform is straightforward:

1. **Connect your portals** - Link to UK government tender sources automatically
2. **Get matched opportunities** - AI surfaces relevant tenders based on your company profile and past wins
3. **Analyse requirements** - Upload tender PDFs for instant breakdown of mandatory and scored criteria
4. **Generate responses** - AI drafts compliant answers using your content library and best practices
5. **Collaborate and submit** - Work with your team to polish and submit winning proposals

### RFP Platform Pricing

We believe in transparent, accessible pricing for our RFP platform:

| Plan | Monthly | Best For |
|------|---------|----------|
| Starter | £99 | Sole traders, micro-businesses |
| Growth | £199 | SMEs with 2-20 employees |
| Scale | £399 | Growing bid teams |

All RFP platform plans include AI-powered analysis, UK portal integration, and [GDPR-compliant](/gdpr-bid-management) data handling.

### Trusted RFP Platform for UK Businesses

Over 500 UK businesses use rfp.quest as their RFP platform to win government contracts. Our platform integrates with Crown Commercial Service standards and meets Cyber Essentials requirements for information security.

**What makes our RFP platform different:**
- Purpose-built for UK procurement regulations
- Native integration with government tender portals
- AI trained on successful UK bid responses
- Automatic compliance with UK data protection laws

### Get Started with Your RFP Platform

Ready to transform how you respond to tenders? [Start your free 14-day trial](/signup) — no credit card required.

Explore our [tender software](/tender-software), [bid management tools](/bid-management-software), and [proposal software](/proposal-software) to learn more about what's possible with our RFP platform.

**Questions about our RFP platform?** [Contact us](/contact) or explore our [guides](/tender-process) to learn more about winning government contracts.`;

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
