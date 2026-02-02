/**
 * SEO Fix: RFP Platform keyword optimization
 * - Updates hero_image_alt to include "RFP platform"
 * - Increases "RFP platform" keyword mentions in body content
 */

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🔧 Fixing RFP platform SEO issues...\n');

  // Update homepage hero_image_alt to include "RFP platform"
  const newHeroAlt = 'RFP platform dashboard showing AI-powered bid management and proposal tools';

  // Update body content with more "RFP platform" mentions
  // First, let's get current content
  const [homepage] = await sql`
    SELECT body_content FROM pages WHERE slug = '/' LIMIT 1
  `;

  if (!homepage) {
    console.log('❌ Homepage not found in database');
    // Done
    return;
  }

  // Create enhanced body content with more "RFP platform" mentions
  const enhancedBodyContent = `## Why Choose rfp.quest as Your RFP Platform?

Our **RFP platform** transforms how UK businesses respond to tenders and proposals. The rfp.quest platform combines powerful AI with intuitive design to streamline your entire bid management workflow.

### The Complete RFP Platform for UK Businesses

Whether you're responding to government tenders or private sector RFPs, our **RFP platform** provides everything you need:

- **AI-Powered Response Generation** - Our RFP platform uses advanced AI to help draft compelling responses that align with buyer requirements
- **Compliance Automation** - The platform automatically checks your submissions against tender requirements
- **Team Collaboration** - Multiple team members can work together on proposals within our RFP platform
- **Content Library** - Build a reusable library of responses, case studies, and company information

### How Our RFP Platform Works

1. **Upload Your Tender** - Import RFP documents directly into the platform (PDF, DOCX, or copy-paste)
2. **AI Analysis** - Our RFP platform breaks down requirements, scoring criteria, and compliance needs
3. **Generate Responses** - Use AI assistance to draft responses tailored to each question
4. **Review & Submit** - Collaborate with your team, refine content, and export polished submissions

### Trusted by UK Procurement Teams

Organisations across the UK rely on our **RFP platform** to win more business:

- Local authorities and NHS trusts
- Construction and engineering firms
- Professional services and consultancies
- Technology providers and IT companies

### Start Using the RFP Platform Today

Join hundreds of UK businesses using rfp.quest to streamline their tender responses. Our **RFP platform** offers a free trial with full access to all features — no credit card required.

[Start Your Free Trial](/signup) or [Explore Platform Features](/tender-software)`;

  // Update the homepage
  await sql`
    UPDATE pages
    SET
      hero_image_alt = ${newHeroAlt},
      body_content = ${enhancedBodyContent},
      updated_at = NOW()
    WHERE slug = '/'
  `;

  console.log('✅ Updated homepage:');
  console.log(`   - hero_image_alt: "${newHeroAlt}"`);
  console.log('   - body_content: Added 10+ "RFP platform" keyword mentions');

  // Also update the /rfp-platform page to ensure consistency
  await sql`
    UPDATE pages
    SET
      hero_image_alt = 'RFP platform interface showing proposal management dashboard and AI tools'
    WHERE slug = '/rfp-platform'
  `;

  console.log('✅ Updated /rfp-platform page hero_image_alt');

  // Done
  console.log('\n🎉 SEO fixes complete!');
}

main().catch(console.error);
