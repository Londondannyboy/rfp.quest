import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Fixing dishonest claims on home page...');

  const pages = await sql`SELECT body_content FROM pages WHERE slug = '/' LIMIT 1`;
  let content = pages[0].body_content as string;

  // 1. Remove fabricated "Results That Matter" table
  content = content.replace(
    /## Results That Matter[\s\S]*?## The RFP Platform/,
    '## The RFP Platform'
  );

  // 2. Replace "Trusted by UK Leaders" with honest "Who Is rfp.quest For?"
  content = content.replace(
    /## The RFP Platform Trusted by UK Leaders[\s\S]*?## Security and Data Protection/,
    `## Who Is rfp.quest For?

Our **RFP software** is designed for UK organisations that respond to tenders and RFPs, including:

- **Technology companies** responding to IT services, software, and systems integration tenders
- **Professional services firms** — consultancies, accountancies, and legal practices bidding for advisory contracts
- **Construction and engineering firms** managing complex tender packs with bills of quantities and technical specifications
- **Healthcare suppliers** navigating NHS procurement and clinical compliance requirements
- **Facilities management companies** bidding for multi-year service contracts
- **SMEs** looking to win their first government contracts through Contracts Finder and Find a Tender

Whether you are an experienced bid team or writing your first tender response, rfp.quest is built to make the process faster and more structured.

## Security and Data Protection`
  );

  // 3. Remove fabricated support claims - replace with honest pre-launch version
  content = content.replace(
    /## Implementation and Support[\s\S]*?## Pricing That Scales With You/,
    `## Getting Started

When rfp.quest launches in Q2 2026, onboarding will include:
- Import your existing content library and past responses
- Configure your company profile and sector preferences
- Set up team access and collaboration workflows
- Connect to UK procurement portals for opportunity alerts

We are building comprehensive documentation and training resources for launch.

## Pricing That Scales With You`
  );

  // 4. Fix pricing section - frame as planned, not current
  content = content.replace(
    'Our flexible pricing ensures you get value at every stage:',
    'Our planned pricing is designed to scale with your team:'
  );

  // 5. Remove "Join hundreds" claim
  content = content.replace(
    'Join hundreds of UK businesses already winning more with our **RFP response platform**.',
    'Register early to be among the first UK businesses to use our **RFP software** when we launch in Q2 2026.'
  );

  // 6. Remove "Most clients see positive ROI" fabrication
  content = content.replace(
    /### How quickly can we see ROI from the RFP platform\?[\s\S]*?### Can the platform handle/,
    '### Can the platform handle'
  );

  // 7. Remove "100,000 UK government tenders" claim
  content = content.replace(
    'Our AI has been trained on over 100,000 UK government tenders and understands the nuances of public sector procurement language, evaluation frameworks, and compliance requirements.',
    'Our AI is trained on UK government procurement language, evaluation frameworks, and compliance requirements.'
  );

  // 8. Fix "Get Started with the Leading RFP Platform" section
  content = content.replace(
    /## Get Started with the Leading RFP Platform[\s\S]*?Register early to be among/,
    `## Register for Early Access

rfp.quest launches in Q2 2026. Register early for:

- **Early access** — Be among the first to use the platform
- **Free trial** — 14-day full-featured trial at launch
- **Onboarding support** — Help getting set up with your first bid

Register early to be among`
  );

  // 9. Fix FAQ about "what makes your platform different" - remove "trained exclusively" claim
  content = content.replace(
    'Our AI has been trained exclusively on UK tenders and incorporates Crown Commercial Service best practices.',
    'We focus specifically on UK procurement processes and incorporate Crown Commercial Service guidance.'
  );

  await sql`UPDATE pages SET body_content = ${content} WHERE slug = '/'`;

  console.log('Home page content updated to be honest!');

  // Also check other pages for similar fabricated claims
  console.log('\nChecking other pages for dishonest claims...');

  // Remove trust_badges from all pages (they claim certifications we don't have)
  const badgePages = await sql`SELECT slug FROM pages WHERE trust_badges IS NOT NULL`;
  if (badgePages.length > 0) {
    await sql`UPDATE pages SET trust_badges = NULL WHERE trust_badges IS NOT NULL`;
    console.log(`Removed trust_badges from ${badgePages.length} pages: ${badgePages.map(p => p.slug).join(', ')}`);
  }

  console.log('Done!');
}

main().catch(console.error);
