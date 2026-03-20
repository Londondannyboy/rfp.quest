import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function updateHomepageWithCertifications() {
  console.log('🔄 Updating homepage with certifications link...');
  
  try {
    // Get the current homepage
    const homepage = await sql`
      SELECT * FROM pages WHERE slug = '/' LIMIT 1
    `;
    
    if (!homepage || homepage.length === 0) {
      console.log('❌ Homepage not found');
      return;
    }
    
    const currentContent = homepage[0].body_content || '';
    
    // Check if certifications section already exists
    if (currentContent.includes('uk-tender-certifications')) {
      console.log('⚠️  Certifications link already exists in homepage');
      return;
    }
    
    // Add certifications section to homepage content
    const certificationSection = `

## Essential Certifications for UK Tenders

Winning government contracts often requires specific certifications. Our comprehensive [UK Tender Certifications Guide](/uk-tender-certifications) covers:

- **ISO Standards** - ISO 9001, ISO 14001, ISO 27001, ISO 45001, and the new ISO 42001 for AI
- **Cyber Security** - Cyber Essentials and Cyber Essentials Plus requirements
- **Health & Safety** - SafeContractor, CHAS, SSIP, and ConstructionLine
- **Sector-Specific** - Industry certifications for construction, healthcare, and technology

[Explore all certification requirements →](/uk-tender-certifications)
`;
    
    // Find a good place to insert - after the main features but before the CTA
    let updatedContent = currentContent;
    
    // Try to insert before "Ready to win more tenders?" or similar CTA
    const ctaPatterns = [
      /## Ready to.*?\n/i,
      /## Get Started.*?\n/i,
      /## Start.*?\n/i,
      /\[.*?Try RFP Quest.*?\]/i
    ];
    
    let inserted = false;
    for (const pattern of ctaPatterns) {
      if (pattern.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern, (match) => {
          return certificationSection + '\n' + match;
        });
        inserted = true;
        break;
      }
    }
    
    // If no CTA found, append before the end
    if (!inserted) {
      updatedContent = updatedContent + certificationSection;
    }
    
    // Update the homepage
    await sql`
      UPDATE pages 
      SET 
        body_content = ${updatedContent},
        updated_at = NOW()
      WHERE slug = '/'
    `;
    
    console.log('✅ Homepage updated with certifications section');
    
    // Also update the features array if it exists
    const currentFeatures = homepage[0].features || [];
    
    // Add certification feature if not exists
    const certFeature = {
      icon: '📋',
      title: 'Certification Requirements',
      description: 'Understand which ISO standards and certifications you need for government tenders'
    };
    
    const hasCertFeature = currentFeatures.some(f => 
      f.title && f.title.toLowerCase().includes('certification')
    );
    
    if (!hasCertFeature && currentFeatures.length > 0) {
      currentFeatures.push(certFeature);
      
      await sql`
        UPDATE pages 
        SET 
          features = ${JSON.stringify(currentFeatures)},
          updated_at = NOW()
        WHERE slug = '/'
      `;
      
      console.log('✅ Added certification feature to homepage features');
    }
    
  } catch (error) {
    console.error('❌ Error updating homepage:', error);
  }
  
  console.log('\n✨ Homepage update complete!');
}

updateHomepageWithCertifications().catch(console.error);