import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface TrustBadge {
  name: string;
  description: string;
  url: string;
}

interface PageEnhancement {
  slug: string;
  features: Feature[];
  stats: Stat[];
  trust_badges: TrustBadge[];
}

// Common trust badges for UK procurement
const ukTrustBadges: TrustBadge[] = [
  {
    name: 'Crown Commercial Service',
    description: 'Aligned with UK government procurement standards',
    url: 'https://www.crowncommercial.gov.uk/'
  },
  {
    name: 'GOV.UK',
    description: 'Integrated with UK government portals',
    url: 'https://www.gov.uk/'
  },
  {
    name: 'Cyber Essentials',
    description: 'Meeting UK cybersecurity standards',
    url: 'https://www.ncsc.gov.uk/cyberessentials/overview'
  },
  {
    name: 'GDPR Compliant',
    description: 'Full UK data protection compliance',
    url: 'https://ico.org.uk/'
  }
];

const enhancements: PageEnhancement[] = [
  {
    slug: '/proposal-software',
    features: [
      {
        icon: '🤖',
        title: 'AI-Powered Drafting',
        description: 'Generate compelling first drafts from requirements in minutes, not hours'
      },
      {
        icon: '📚',
        title: 'Smart Content Library',
        description: 'Semantic search finds your best past responses instantly'
      },
      {
        icon: '👥',
        title: 'Team Collaboration',
        description: 'Real-time co-authoring with role-based permissions and approval workflows'
      },
      {
        icon: '✅',
        title: 'Compliance Checking',
        description: 'Automated validation ensures every submission meets requirements'
      }
    ],
    stats: [
      { value: '65', label: 'Faster Proposals', suffix: '%' },
      { value: '40', label: 'Better Win Rate', suffix: '%' },
      { value: '50', label: 'Less Errors', suffix: '%' },
      { value: '24/7', label: 'AI Assistance', suffix: '' }
    ],
    trust_badges: ukTrustBadges
  },
  {
    slug: '/proposal-software-accountants',
    features: [
      {
        icon: '📋',
        title: 'Engagement Letters',
        description: 'ICAEW-compliant templates with automatic population'
      },
      {
        icon: '👤',
        title: 'Team CV Management',
        description: 'Centralized partner and staff credentials with qualification tracking'
      },
      {
        icon: '⚖️',
        title: 'Independence Checking',
        description: 'Integrated conflict verification before every proposal'
      },
      {
        icon: '💰',
        title: 'Fee Calculation Tools',
        description: 'Defensible pricing with margin analysis and approval workflows'
      }
    ],
    stats: [
      { value: '2x', label: 'More Proposals', suffix: '' },
      { value: '28', label: 'Win Rate', suffix: '%' },
      { value: '£2.3M', label: 'New Fees Won', suffix: '' },
      { value: '50', label: 'Time Saved', suffix: '%' }
    ],
    trust_badges: [
      {
        name: 'ICAEW',
        description: 'Aligned with Institute of Chartered Accountants standards',
        url: 'https://www.icaew.com/'
      },
      {
        name: 'ACCA',
        description: 'Supporting ACCA member practices',
        url: 'https://www.accaglobal.com/'
      },
      {
        name: 'FRC',
        description: 'Compliant with Financial Reporting Council guidance',
        url: 'https://www.frc.org.uk/'
      },
      {
        name: 'PSAA',
        description: 'Ready for public sector audit tendering',
        url: 'https://www.psaa.co.uk/'
      }
    ]
  },
  {
    slug: '/rfp-automation-software',
    features: [
      {
        icon: '🔍',
        title: 'Intelligent Parsing',
        description: 'AI extracts requirements, criteria, and deadlines from any tender document'
      },
      {
        icon: '🔄',
        title: 'Workflow Orchestration',
        description: 'Automatic task assignment, reminders, and escalations'
      },
      {
        icon: '📝',
        title: 'Auto-Population',
        description: 'Standard responses and company info filled automatically'
      },
      {
        icon: '✔️',
        title: 'Quality Validation',
        description: 'Automated compliance checking and formatting validation'
      }
    ],
    stats: [
      { value: '90', label: 'Less Manual Work', suffix: '%' },
      { value: '1512', label: 'Hours Saved/Year', suffix: '' },
      { value: '£75K', label: 'Annual Savings', suffix: '' },
      { value: '35', label: 'Win Rate Boost', suffix: '%' }
    ],
    trust_badges: ukTrustBadges
  },
  {
    slug: '/rfp-tools',
    features: [
      {
        icon: '🔔',
        title: 'Opportunity Discovery',
        description: 'Unified search across all UK government portals with smart alerts'
      },
      {
        icon: '📊',
        title: 'Bid Analysis',
        description: 'Structured bid/no-bid scoring to focus on winnable opportunities'
      },
      {
        icon: '✍️',
        title: 'Content Tools',
        description: 'AI writing assistance, templates, and reusable content libraries'
      },
      {
        icon: '📈',
        title: 'Analytics',
        description: 'Track win/loss patterns and continuously improve your approach'
      }
    ],
    stats: [
      { value: '50K+', label: 'Opportunities/Year', suffix: '' },
      { value: '3x', label: 'Bid Throughput', suffix: '' },
      { value: '25', label: 'Win Rate Increase', suffix: '%' },
      { value: '431', label: 'Year 1 ROI', suffix: '%' }
    ],
    trust_badges: ukTrustBadges
  },
  {
    slug: '/proposal-writing-software',
    features: [
      {
        icon: '✨',
        title: 'AI Content Generation',
        description: 'Generate first drafts, executive summaries, and gap-fill content'
      },
      {
        icon: '🎯',
        title: 'Smart Suggestions',
        description: 'AI recommends your highest-scoring past responses for each requirement'
      },
      {
        icon: '📝',
        title: 'Collaborative Editing',
        description: 'Real-time co-authoring with version control and comments'
      },
      {
        icon: '📏',
        title: 'Quality Assurance',
        description: 'Readability scoring, compliance validation, and brand consistency'
      }
    ],
    stats: [
      { value: '35', label: 'Higher Scores', suffix: '%' },
      { value: '10x', label: 'Faster First Draft', suffix: '' },
      { value: '100', label: 'Compliance Rate', suffix: '%' },
      { value: '20+', label: 'Win Rate Boost', suffix: '%' }
    ],
    trust_badges: [
      {
        name: 'APMP',
        description: 'Aligned with proposal management best practices',
        url: 'https://www.apmp.org/'
      },
      ...ukTrustBadges.slice(0, 3)
    ]
  },
  {
    slug: '/government-tender-software',
    features: [
      {
        icon: '🏛️',
        title: 'Portal Integration',
        description: 'Direct connection to Find a Tender, Contracts Finder, and Digital Marketplace'
      },
      {
        icon: '📋',
        title: 'Compliance Management',
        description: 'Track certifications, insurance, and social value documentation'
      },
      {
        icon: '🤖',
        title: 'AI Response Generation',
        description: 'Public sector-specific content tailored to evaluator expectations'
      },
      {
        icon: '📨',
        title: 'Submission Management',
        description: 'Portal-specific formatting with deadline tracking and confirmation'
      }
    ],
    stats: [
      { value: '£300B', label: 'UK Procurement Market', suffix: '' },
      { value: '33', label: 'SME Target Spend', suffix: '%' },
      { value: '50K+', label: 'Annual Opportunities', suffix: '' },
      { value: '32', label: 'Win Rate Boost', suffix: '%' }
    ],
    trust_badges: [
      {
        name: 'Find a Tender',
        description: 'UK official high-value procurement portal',
        url: 'https://www.find-tender.service.gov.uk/'
      },
      {
        name: 'Contracts Finder',
        description: 'UK public sector opportunities',
        url: 'https://www.contractsfinder.service.gov.uk/'
      },
      {
        name: 'Digital Marketplace',
        description: 'G-Cloud and DOS frameworks',
        url: 'https://www.digitalmarketplace.service.gov.uk/'
      },
      {
        name: 'Crown Commercial Service',
        description: 'UK government procurement standards',
        url: 'https://www.crowncommercial.gov.uk/'
      }
    ]
  },
  {
    slug: '/free-rfp-software',
    features: [
      {
        icon: '🆓',
        title: 'Full Feature Trial',
        description: '14 days of complete platform access, no credit card required'
      },
      {
        icon: '📤',
        title: 'Easy Data Export',
        description: 'Keep all your content if you decide not to continue'
      },
      {
        icon: '💬',
        title: 'Full Support',
        description: 'Same expert support as paid customers during your trial'
      },
      {
        icon: '🔄',
        title: 'Seamless Upgrade',
        description: 'All your work preserved when you upgrade to paid plans'
      }
    ],
    stats: [
      { value: '14', label: 'Day Free Trial', suffix: '' },
      { value: '£0', label: 'Setup Cost', suffix: '' },
      { value: '100', label: 'Feature Access', suffix: '%' },
      { value: '£1560', label: 'Monthly Savings', suffix: '' }
    ],
    trust_badges: ukTrustBadges
  },
  {
    slug: '/rfp-software-small-business',
    features: [
      {
        icon: '⏱️',
        title: 'Time Efficiency',
        description: 'Reclaim 14+ hours per week for billable work'
      },
      {
        icon: '💼',
        title: 'Professional Quality',
        description: 'Compete with enterprises using polished, compliant submissions'
      },
      {
        icon: '📖',
        title: 'Knowledge Capture',
        description: 'Build and retain proposal expertise, reduce dependency on individuals'
      },
      {
        icon: '📈',
        title: 'Win Rate Growth',
        description: 'Average 20-30% improvement in competitive win rates'
      }
    ],
    stats: [
      { value: '£99', label: 'Starting Price', suffix: '/mo' },
      { value: '60', label: 'Time Reduction', suffix: '%' },
      { value: '25', label: 'Win Rate', suffix: '%' },
      { value: '3x', label: 'More Proposals', suffix: '' }
    ],
    trust_badges: [
      {
        name: 'SME Friendly',
        description: 'Purpose-built for small business success',
        url: 'https://www.gov.uk/government/publications/procurement-policy-note-1117-supporting-small-business'
      },
      ...ukTrustBadges.slice(0, 3)
    ]
  }
];

async function updateEnhancedData() {
  console.log('Adding enhanced component data...\n');

  for (const page of enhancements) {
    console.log(`Updating: ${page.slug}`);
    try {
      await sql`
        UPDATE pages
        SET
          features = ${JSON.stringify(page.features)},
          stats = ${JSON.stringify(page.stats)},
          trust_badges = ${JSON.stringify(page.trust_badges)},
          updated_at = NOW()
        WHERE slug = ${page.slug}
      `;
      console.log(`  ✓ Success: ${page.slug}`);
    } catch (error) {
      console.error(`  ✗ Error updating ${page.slug}:`, error);
    }
  }

  console.log('\nEnhanced data complete!');
  console.log(`Total pages updated: ${enhancements.length}`);
}

updateEnhancedData();
