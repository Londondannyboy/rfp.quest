import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL.trim());

async function optimizeRFPKeywords() {
  console.log('Optimizing homepage for both "RFP platform" and "RFP software"...');

  // Update homepage with both keywords
  const homepageUpdate = {
    title_tag: 'RFP Platform & RFP Software UK | AI Bid Management',
    h1: 'RFP Platform & Software: Win More UK Government Contracts with AI',
    meta_description: 'Leading RFP platform and RFP software for UK businesses. AI-powered bid writing, compliance checking, and proposal management. Win 3x more tenders.',
    primary_keyword: 'rfp platform',
    secondary_keywords: [
      'rfp software',
      'rfp platform uk',
      'rfp software uk',
      'tender software',
      'bid management software',
      'proposal software',
      'rfp response software',
      'rfp management software'
    ],
    body_content: `## The Complete **RFP Platform** and **RFP Software** for UK Businesses

Welcome to rfp.quest - the UK's most advanced **RFP platform** and **RFP software** solution. Whether you're responding to government tenders, private sector bids, or managing complex proposals, our AI-powered **RFP software** transforms how you win contracts.

### Why Choose Our **RFP Platform**?

Our **RFP platform** combines cutting-edge AI with deep understanding of UK procurement. Unlike generic **RFP software**, we're built specifically for UK businesses navigating government frameworks, public sector requirements, and compliance standards.

- **AI-Powered Analysis**: Our **RFP software** reads and understands tender documents instantly
- **Automated Bid Writing**: The **RFP platform** generates first drafts in minutes
- **Compliance Checking**: Built-in UK procurement compliance in our **RFP software**
- **Requirement Extraction**: Never miss mandatory criteria with our **RFP platform**

### **RFP Software** Features That Win Contracts

Our **RFP platform** isn't just another bid management tool. It's comprehensive **RFP software** that:

1. **Analyses Requirements** - The **RFP software** extracts all requirements automatically
2. **Scores Your Response** - Our **RFP platform** predicts your win probability
3. **Identifies Gaps** - The **RFP software** highlights missing information
4. **Suggests Improvements** - AI-powered recommendations in the **RFP platform**

### Who Uses Our **RFP Platform** and **RFP Software**?

- **SMEs** - Affordable **RFP software** that levels the playing field
- **Consultancies** - Scale your bid writing with our **RFP platform**
- **Construction** - Purpose-built **RFP software** for construction tenders
- **IT Services** - Win digital transformation bids with our **RFP platform**

### **RFP Platform** vs Traditional **RFP Software**

| Feature | Our RFP Platform | Traditional RFP Software |
|---------|------------------|--------------------------|
| AI Bid Writing | ✅ Automated | ❌ Manual |
| UK Compliance | ✅ Built-in | ❌ Generic |
| Requirement Extraction | ✅ Automatic | ❌ Manual |
| Win Rate Prediction | ✅ AI-powered | ❌ Guesswork |
| Pricing | From £99/month | £500+ |

### Getting Started with Our **RFP Software**

1. **Upload** - Add tender documents to the **RFP platform**
2. **Analyse** - Our **RFP software** extracts all requirements
3. **Generate** - AI creates your response in the **RFP platform**
4. **Refine** - Edit and perfect with **RFP software** suggestions
5. **Submit** - Win more contracts with our **RFP platform**

### Trusted **RFP Platform** for UK Businesses

Join hundreds of UK businesses already winning more contracts with our **RFP software**. From SMEs to large consultancies, our **RFP platform** delivers results:

- 3x higher win rates with our **RFP software**
- 85% time saved using the **RFP platform**
- 10x more tenders responded to with **RFP software**
- £2.5M+ in contracts won through our **RFP platform**

[Start Free Trial](/signup) | [Book Demo](/demo) | [View Pricing](/pricing)`
  };

  try {
    // Update homepage
    const result = await sql`
      UPDATE pages 
      SET 
        title_tag = ${homepageUpdate.title_tag},
        h1 = ${homepageUpdate.h1},
        meta_description = ${homepageUpdate.meta_description},
        primary_keyword = ${homepageUpdate.primary_keyword},
        secondary_keywords = ${homepageUpdate.secondary_keywords},
        body_content = ${homepageUpdate.body_content},
        updated_at = NOW()
      WHERE slug = '/'
      RETURNING id, slug, title_tag, h1
    `;

    if (result.length > 0) {
      console.log('✅ Homepage updated successfully:', result[0]);
    } else {
      console.log('❌ Homepage not found in database');
    }

    // Add image with both keywords in alt text
    const imageUpdate = await sql`
      UPDATE pages 
      SET 
        hero_image = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop&q=80',
        hero_image_alt = 'RFP Platform and RFP Software dashboard showing AI-powered bid management for UK businesses',
        og_image = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&q=80'
      WHERE slug = '/'
      RETURNING hero_image_alt
    `;

    if (imageUpdate.length > 0) {
      console.log('✅ Images updated with alt text:', imageUpdate[0].hero_image_alt);
    }

  } catch (error) {
    console.error('Error updating homepage:', error);
    process.exit(1);
  }
}

// Run the optimization
optimizeRFPKeywords().then(() => {
  console.log('✅ RFP keyword optimization complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});