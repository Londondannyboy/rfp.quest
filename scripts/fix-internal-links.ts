import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Define the comprehensive link structure
const linkUpdates: Record<string, string[]> = {
  // Homepage should link to all cluster pillar pages
  '/': [
    '/bid-writing',
    '/tender-process',
    '/how-to-write-a-tender',
    '/how-to-win-a-tender',
    '/bid-writing-courses',
    '/what-is-bid-writing',
    '/writing-a-tender-bid',
    '/bid-writing-services',
    '/bid-writing-examples',
    '/ai-bid-writing',
    '/sample-rfp-software',
    '/rfp-software-template',
    '/rfp-tender',
    '/procurement-software-uk',
    '/pqq-software',
    '/itt-response-software',
    '/tender-library-software',
    '/rfp-management-software',
    '/rfp-response-software',
    '/tender-management-software-uk',
  ],
  // Orphaned pages need links added to them
  '/what-is-bid-writing': ['/bid-writing', '/bid-writing-courses', '/bid-writing-examples'],
  '/writing-a-tender-bid': ['/bid-writing', '/how-to-write-a-tender', '/tender-process'],
  '/how-to-write-a-tender-proposal': ['/how-to-write-a-tender', '/bid-writing', '/bid-writing-examples'],
  '/how-to-write-a-tender-response': ['/how-to-write-a-tender', '/bid-writing', '/tender-process'],
  '/bid-writing-services': ['/bid-writing', '/bid-writing-software', '/proposal-software'],
  '/procurement-software-uk': ['/tender-management-software', '/government-tender-software', '/rfp-tools'],
  '/itt-response-software': ['/tender-software', '/rfp-response-software', '/government-tender-software'],
  '/tender-management-software-uk': ['/tender-management-software', '/tender-software', '/government-tender-software'],
  '/bid-writing-examples': ['/bid-writing', '/bid-writing-courses', '/how-to-write-a-tender'],
};

// New comprehensive homepage content with all cluster links
const newHomepageContent = `## The UK's Leading RFP & Bid Writing Software

rfp.quest is the AI-powered **RFP software** platform that helps UK businesses create winning proposals, tender responses, and competitive bids in a fraction of the time. Our **request for proposal software** combines intelligent automation with deep understanding of UK procurement to deliver measurably better results.

According to the [Crown Commercial Service](https://www.crowncommercial.gov.uk/), the UK public sector spends over £300 billion annually on procurement. Whether you're pursuing public sector tenders on [Contracts Finder](https://www.contractsfinder.service.gov.uk/) or responding to private sector RFPs, having the right software is the difference between winning and watching opportunities pass you by.

## What Is RFP Software?

**RFP software** (Request for Proposal software) is a specialised platform for managing the entire competitive bid process. Unlike generic document tools, dedicated [proposal software](/proposal-software) provides:

- **Content libraries** — Searchable repositories of past responses, case studies, and approved content
- **AI writing assistance** — Automated first draft generation tailored to specific requirements
- **Compliance checking** — Verification that responses meet all mandatory criteria
- **Collaboration tools** — Multi-author workflows with review and approval processes
- **Analytics** — Win/loss tracking and continuous improvement insights

The [Association of Proposal Management Professionals (APMP)](https://www.apmp.org/) reports that organisations using dedicated RFP software see 25%+ improvements in win rates compared to those relying on manual processes.

## Complete RFP Software for Every Stage

### Opportunity Discovery & Tracking

Our software automatically surfaces relevant opportunities from UK procurement portals, including:

- [Find a Tender Service](https://www.find-tender.service.gov.uk/) — High-value UK contracts
- [Contracts Finder](https://www.contractsfinder.service.gov.uk/) — Lower-threshold opportunities
- [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/) — G-Cloud and DOS frameworks

Learn more about [government tender software](/government-tender-software) and how to find opportunities.

### AI-Powered Bid Writing

Our [AI bid writing](/ai-bid-writing) capabilities transform your proposal process:

- Generate first drafts from tender requirements
- Match questions to your best previous responses
- Ensure consistent tone and messaging
- Learn from your successful bids

Explore our complete [bid writing guide](/bid-writing) to master the fundamentals.

### Proposal Creation & Collaboration

Create professional proposals with our [proposal writing software](/proposal-writing-software):

- Real-time multi-author collaboration
- Version control and audit trails
- Review and approval workflows
- Template libraries for common formats

See how [RFP automation software](/rfp-automation-software) can reduce your bid time by 65%.

### Compliance & Quality Assurance

Never miss a requirement with our [RFP tools](/rfp-tools):

- Automated compliance matrices
- Word count and format validation
- Mandatory section verification
- Pre-submission checklists

## Software Solutions by Category

### Bid Management & Tender Software

- [Bid Management Software](/bid-management-software) — Complete bid lifecycle management
- [Tender Software](/tender-software) — UK tender response platform
- [Tender Management Software](/tender-management-software) — End-to-end tender tracking
- [Tender Management Software UK](/tender-management-software-uk) — UK-specific features

### Proposal & RFP Software

- [Proposal Software](/proposal-software) — Professional proposal creation
- [Proposal Management Software](/proposal-management-software) — Centralized proposal control
- [RFP Management Software](/rfp-management-software) — Request for proposal handling
- [RFP Response Software](/rfp-response-software) — Response automation

### Specialist Solutions

- [Proposal Software for Accountants](/proposal-software-accountants) — Accounting firm proposals
- [Construction Bid Management Software](/construction-bid-management-software) — Construction sector
- [Government Tender Software](/government-tender-software) — Public sector bidding
- [Procurement Software UK](/procurement-software-uk) — UK procurement needs
- [PQQ Software](/pqq-software) — Pre-qualification questionnaires
- [ITT Response Software](/itt-response-software) — Invitation to tender responses

### AI & Innovation

- [AI RFP Software](/ai-rfp-software) — AI-powered proposal tools
- [AI Bid Writing](/ai-bid-writing) — Intelligent content generation
- [Bid Writing Software](/bid-writing-software) — Professional bid creation
- [Best RFP Software](/best-rfp-software) — Top-rated solutions compared

### Pricing Options

- [Free RFP Software](/free-rfp-software) — Get started at no cost
- [RFP Software for Small Business](/rfp-software-small-business) — SME-friendly pricing
- [Tender Library Software](/tender-library-software) — Content library solutions

## Learning Resources: How-To Guides

Master bid writing with our comprehensive guides:

### Bid Writing Fundamentals

- [What is Bid Writing?](/what-is-bid-writing) — Complete beginner's guide
- [Bid Writing Guide](/bid-writing) — Comprehensive UK guide (1,900+ monthly searches)
- [Writing a Tender Bid](/writing-a-tender-bid) — Step-by-step process
- [Bid Writing Examples](/bid-writing-examples) — Templates and samples

### Tender Writing

- [How to Write a Tender](/how-to-write-a-tender) — Complete walkthrough
- [How to Write a Tender Proposal](/how-to-write-a-tender-proposal) — Proposal structure
- [How to Write a Tender Response](/how-to-write-a-tender-response) — Response techniques
- [How to Win a Tender](/how-to-win-a-tender) — Winning strategies

### Process Understanding

- [Tender Process](/tender-process) — UK procurement explained (1,000+ monthly searches)
- [RFP Tender](/rfp-tender) — RFP vs tender differences

### Professional Development

- [Bid Writing Courses](/bid-writing-courses) — Training and qualifications
- [Bid Writing Services](/bid-writing-services) — Professional support options

## Templates & Examples

Get started faster with our template library:

- [Sample RFP Software](/sample-rfp-software) — Example RFP documents
- [RFP Software Template](/rfp-software-template) — Ready-to-use frameworks
- [RFP for Software Development Template](/rfp-for-software-development-template) — IT project templates
- [RFP Software Development](/rfp-software-development) — Development RFP guide
- [Bid Writing Examples](/bid-writing-examples) — Real response samples

## Why Choose rfp.quest?

### Built for UK Procurement

Unlike generic American RFP tools, rfp.quest is purpose-built for UK businesses:

- Native integration with [Find a Tender](https://www.find-tender.service.gov.uk/) and [Contracts Finder](https://www.contractsfinder.service.gov.uk/)
- Understanding of UK procurement regulations
- Social value and compliance requirements
- UK English throughout

### AI That Actually Helps

Our AI doesn't just generate generic content—it learns from your winning bids to create tailored, compelling responses that match your voice and highlight your strengths.

### Measurable Results

Our customers report:

- **65% reduction** in proposal preparation time
- **40% improvement** in win rates
- **50% fewer** compliance errors
- **3x increase** in bid capacity

## Getting Started

Ready to transform your bid process?

1. **[Start Free Trial](/pricing)** — Full access, no credit card required
2. **[Book a Demo](/demo)** — See rfp.quest in action
3. **[Explore Features](/features)** — Detailed capability overview

Join hundreds of UK organisations using rfp.quest to win more contracts.

## Frequently Asked Questions

### What is the best RFP software for UK businesses?

The best solution depends on your needs. For UK public sector bidding, look for software with native integration to [Find a Tender](https://www.find-tender.service.gov.uk/) and [Contracts Finder](https://www.contractsfinder.service.gov.uk/). rfp.quest is purpose-built for UK procurement with AI assistance and compliance checking.

### How much does RFP software cost?

Pricing ranges from [free options](/free-rfp-software) to enterprise solutions. rfp.quest offers transparent pricing starting at £99/month for [small businesses](/rfp-software-small-business), with no per-user fees.

### Can RFP software help with government tenders?

Absolutely. Our [government tender software](/government-tender-software) integrates with UK procurement portals and includes templates, compliance checking, and AI assistance specifically designed for public sector requirements.

### Is there a free trial available?

Yes! Start your [free 14-day trial](/pricing) with full access to all features. No credit card required.`;

async function fixInternalLinks() {
  console.log('=== FIXING INTERNAL LINKS ===\n');

  // Update homepage with comprehensive content
  console.log('Updating homepage with comprehensive cluster links...');
  try {
    await sql`
      UPDATE pages
      SET body_content = ${newHomepageContent}, updated_at = NOW()
      WHERE slug = '/'
    `;
    console.log('  ✓ Homepage updated\n');
  } catch (error) {
    console.error('  ✗ Error updating homepage:', error);
  }

  // Update orphaned pages to add links to related content
  console.log('Fixing orphaned pages with cross-links...\n');

  // Get all pages that need link fixes
  for (const [slug, linksToAdd] of Object.entries(linkUpdates)) {
    if (slug === '/') continue; // Already handled homepage

    // Get current content
    const result = await sql`SELECT body_content FROM pages WHERE slug = ${slug}`;
    if (!result.length || !result[0].body_content) {
      console.log(`  Skipping ${slug} - no content found`);
      continue;
    }

    let content = result[0].body_content as string;
    let modified = false;

    // Check which links are missing
    const missingLinks = linksToAdd.filter(link => !content.includes(link));

    if (missingLinks.length > 0) {
      // Add a "Related Resources" section if links are missing
      const relatedSection = `

## Related Resources

Explore more guides and tools:

${missingLinks.map(link => {
  const name = link.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `- [${name}](${link})`;
}).join('\n')}
`;

      // Add before FAQ section if it exists, otherwise at the end
      if (content.includes('## Frequently Asked Questions')) {
        content = content.replace('## Frequently Asked Questions', relatedSection + '\n## Frequently Asked Questions');
      } else {
        content = content + relatedSection;
      }
      modified = true;
    }

    if (modified) {
      try {
        await sql`
          UPDATE pages
          SET body_content = ${content}, updated_at = NOW()
          WHERE slug = ${slug}
        `;
        console.log(`  ✓ Fixed: ${slug} (added ${missingLinks.length} links)`);
      } catch (error) {
        console.error(`  ✗ Error: ${slug}`, error);
      }
    } else {
      console.log(`  ✓ Already OK: ${slug}`);
    }
  }

  console.log('\n=== LINK FIXES COMPLETE ===');
}

fixInternalLinks();
