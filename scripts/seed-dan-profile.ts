/**
 * Seed script to create Dan Keegan's AI agency company profile.
 * Run with: npx tsx scripts/seed-dan-profile.ts
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Dan Keegan's AI Agency Profile
const AI_AGENCY_PROFILE = {
  email: 'keegan.dan@gmail.com',
  companyName: 'Keegan AI Consulting',
  description: `Award-winning AI consultancy specializing in enterprise AI strategy, LLM implementation, and intelligent automation.
We help government and enterprise clients harness the power of AI to transform operations, improve decision-making, and deliver better citizen/customer outcomes.
Our team combines deep technical expertise in machine learning, NLP, and generative AI with proven delivery experience across public sector digital transformation.`,
  website: 'https://dankeegan.com',
  productsServices: [
    'AI Strategy & Roadmapping',
    'LLM/GenAI Implementation',
    'Intelligent Automation',
    'Data Science & Analytics',
    'Digital Transformation',
    'AI Ethics & Governance',
    'Machine Learning Solutions',
    'NLP & Document Processing',
  ],
  expertiseAreas: [
    'Large Language Models (LLMs)',
    'Generative AI',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'AI Governance & Ethics',
    'Public Sector Digital',
    'Enterprise Architecture',
  ],
  certifications: [
    'ISO 27001',
    'Cyber Essentials Plus',
    'G-Cloud Supplier',
    'AWS Partner',
    'Google Cloud Partner',
    'Microsoft AI Partner',
  ],
  // Target UK Government AI/IT contracts
  targetCpvDivisions: [
    '72', // IT services
    '73', // R&D services
    '79', // Business services (consulting)
    '48', // Software packages
  ],
  targetRegions: [
    'London',
    'South East',
    'UK Wide',
    'England',
  ],
  minContractValue: 50000,  // £50k minimum
  maxContractValue: 10000000, // £10M maximum
  sustainabilityFocus: true,
  sustainabilityKeywords: [
    'sustainable AI',
    'green computing',
    'ethical AI',
    'responsible AI',
    'carbon neutral',
  ],
};

// Team members with their expertise and bid roles
const TEAM_MEMBERS = [
  {
    name: 'Dan Keegan',
    role: 'Founder & AI Strategy Lead',
    email: 'keegan.dan@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/dankeegan/',
    skills: [
      'AI Strategy',
      'LLM Architecture',
      'GenAI',
      'Public Sector',
      'Bid Leadership',
      'Solution Architecture',
      'Stakeholder Management',
    ],
    certifications: ['AWS Solutions Architect', 'Google ML Engineer'],
    bidRoles: ['Bid Lead', 'Technical Lead', 'Solution Architect', 'Account Director'],
    yearsExperience: 15,
    sectorExperience: ['Government', 'Healthcare', 'Finance', 'Defence'],
    bio: 'Seasoned AI leader with 15+ years delivering digital transformation for government and enterprise clients. Expert in translating AI capabilities into business value.',
  },
  // Add more team members as needed
];

async function seedProfile() {
  console.log('🚀 Seeding Dan Keegan AI Agency profile...\n');

  try {
    // Find user by email in Neon Auth schema
    console.log(`Looking for user: ${AI_AGENCY_PROFILE.email}`);
    const userResult = await sql`
      SELECT id, email, name FROM neon_auth.user WHERE email = ${AI_AGENCY_PROFILE.email}
    `;

    if (userResult.length === 0) {
      console.log('❌ User not found in Neon Auth. Please ensure the user is registered first.');
      console.log('   Register at: https://rfp.quest/auth/sign-up');
      return;
    }

    const userId = userResult[0].id;
    console.log(`✅ Found user: ${userResult[0].name || userResult[0].email} (ID: ${userId})`);

    // Upsert company profile
    console.log('\n📝 Creating/updating company profile...');
    const profileResult = await sql`
      INSERT INTO company_profiles (
        user_id,
        company_name,
        description,
        website,
        products_services,
        expertise_areas,
        certifications,
        target_regions,
        target_cpv_divisions,
        min_contract_value,
        max_contract_value,
        sustainability_focus,
        sustainability_keywords
      ) VALUES (
        ${userId},
        ${AI_AGENCY_PROFILE.companyName},
        ${AI_AGENCY_PROFILE.description},
        ${AI_AGENCY_PROFILE.website},
        ${AI_AGENCY_PROFILE.productsServices},
        ${AI_AGENCY_PROFILE.expertiseAreas},
        ${AI_AGENCY_PROFILE.certifications},
        ${AI_AGENCY_PROFILE.targetRegions},
        ${AI_AGENCY_PROFILE.targetCpvDivisions},
        ${AI_AGENCY_PROFILE.minContractValue},
        ${AI_AGENCY_PROFILE.maxContractValue},
        ${AI_AGENCY_PROFILE.sustainabilityFocus},
        ${AI_AGENCY_PROFILE.sustainabilityKeywords}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        description = EXCLUDED.description,
        website = EXCLUDED.website,
        products_services = EXCLUDED.products_services,
        expertise_areas = EXCLUDED.expertise_areas,
        certifications = EXCLUDED.certifications,
        target_regions = EXCLUDED.target_regions,
        target_cpv_divisions = EXCLUDED.target_cpv_divisions,
        min_contract_value = EXCLUDED.min_contract_value,
        max_contract_value = EXCLUDED.max_contract_value,
        sustainability_focus = EXCLUDED.sustainability_focus,
        sustainability_keywords = EXCLUDED.sustainability_keywords,
        updated_at = NOW()
      RETURNING id
    `;

    console.log(`✅ Company profile created/updated (ID: ${profileResult[0].id})`);

    // Check if team_members table exists
    console.log('\n👥 Checking team_members table...');
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'team_members'
      ) as exists
    `;

    if (!tableCheck[0].exists) {
      console.log('📊 Creating team_members table...');
      await sql`
        CREATE TABLE team_members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_profile_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          role VARCHAR(255),
          linkedin_url VARCHAR(500),
          skills TEXT[],
          certifications TEXT[],
          bid_roles TEXT[],
          years_experience INTEGER,
          sector_experience TEXT[],
          bio TEXT,
          avatar_url VARCHAR(500),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      console.log('✅ team_members table created');

      // Create index for faster lookups
      await sql`
        CREATE INDEX idx_team_members_company ON team_members(company_profile_id)
      `;
    }

    // Insert team members
    console.log('\n👤 Adding team members...');
    for (const member of TEAM_MEMBERS) {
      const memberResult = await sql`
        INSERT INTO team_members (
          company_profile_id,
          user_id,
          name,
          email,
          role,
          linkedin_url,
          skills,
          certifications,
          bid_roles,
          years_experience,
          sector_experience,
          bio
        ) VALUES (
          ${profileResult[0].id},
          ${member.email === AI_AGENCY_PROFILE.email ? userId : null},
          ${member.name},
          ${member.email},
          ${member.role},
          ${member.linkedinUrl},
          ${member.skills},
          ${member.certifications},
          ${member.bidRoles},
          ${member.yearsExperience},
          ${member.sectorExperience},
          ${member.bio}
        )
        ON CONFLICT DO NOTHING
        RETURNING id, name
      `;

      if (memberResult.length > 0) {
        console.log(`  ✅ Added: ${memberResult[0].name}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${member.name}`);
      }
    }

    console.log('\n🎉 Profile seeding complete!');
    console.log('\nProfile Summary:');
    console.log(`  Company: ${AI_AGENCY_PROFILE.companyName}`);
    console.log(`  Sectors: ${AI_AGENCY_PROFILE.targetCpvDivisions.join(', ')}`);
    console.log(`  Regions: ${AI_AGENCY_PROFILE.targetRegions.join(', ')}`);
    console.log(`  Value Range: £${AI_AGENCY_PROFILE.minContractValue.toLocaleString()} - £${AI_AGENCY_PROFILE.maxContractValue.toLocaleString()}`);
    console.log(`  Team Members: ${TEAM_MEMBERS.length}`);

  } catch (error) {
    console.error('❌ Error seeding profile:', error);
    throw error;
  }
}

seedProfile()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
