#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

interface CertPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  primaryKeyword: string
  secondaryKeywords: string[]
  contentSections: {
    intro: string
    requirements: string
    cost: string
    timeline: string
    faq: { q: string; a: string }[]
  }
}

// Define all certification pages with their content
const certPages: CertPage[] = [
  {
    slug: 'cyber-essentials-uk-tenders',
    title: 'Cyber Essentials UK Tenders: Mandatory Requirements 2026',
    metaDescription: 'Cyber Essentials is now mandatory for G-Cloud 15 and most central government contracts. Costs from £320. See who needs it and how to get certified fast.',
    h1: 'Cyber Essentials for UK Tenders: Is It Mandatory in 2026?',
    primaryKeyword: 'Cyber Essentials UK tenders',
    secondaryKeywords: ['Cyber Essentials government contracts', 'Cyber Essentials mandatory public sector', 'NCSC certification tenders'],
    contentSections: {
      intro: 'Cyber Essentials is the UK government baseline cyber security certification, managed by the National Cyber Security Centre (NCSC). Since 2014, it has become increasingly mandatory for government contracts, especially those handling sensitive or personal data.',
      requirements: 'G-Cloud 15 now mandates Cyber Essentials for many supplier lots. Central government contracts require it for handling sensitive data (PPN 014). Criminal Legal Aid law firms must have it from October 2025.',
      cost: 'From £320+VAT for self-assessment (up to 9 employees) to £600+VAT (250+ employees). NCSC official pricing applies.',
      timeline: 'Self-assessment can be completed in days. IASME assessment takes 1-4 weeks. Annual renewal required.',
      faq: [
        {
          q: 'Is Cyber Essentials mandatory for all UK government contracts?',
          a: 'Cyber Essentials is mandatory for central government contracts involving handling sensitive or personal data under Cabinet Office policy PPN 014. G-Cloud 15 requires it for many supplier lots. While not universally mandatory, it is required for a significant proportion of government contracts and the scope continues to expand.'
        },
        {
          q: 'How much does Cyber Essentials cost?',
          a: 'Cyber Essentials costs from £320+VAT for the smallest organisations (up to 9 employees) through self-assessment, rising to £600+VAT for organisations with 250+ employees. These are NCSC official prices through IASME. Costs are fixed and transparent, making it one of the most affordable certifications.'
        },
        {
          q: 'How quickly can I get Cyber Essentials certified?',
          a: 'Self-assessment can be completed in as little as 1-2 days if your systems are already compliant. The IASME assessment and certification process typically takes 1-4 weeks from submission to certificate. This makes it one of the fastest certifications to obtain for government contracts.'
        },
        {
          q: 'What is the difference between Cyber Essentials and Cyber Essentials Plus?',
          a: 'Cyber Essentials is a self-assessment verified by an external body. Cyber Essentials Plus includes the same requirements but adds an independent technical audit of your systems by a licensed assessor. Plus is required for higher-risk contracts, NHS digital services, and MOD suppliers.'
        },
        {
          q: 'Does ISO 27001 replace the need for Cyber Essentials?',
          a: 'No, ISO 27001 does NOT replace Cyber Essentials. The UK Cabinet Office policy explicitly states they are separate requirements serving different purposes. Many government contracts require both certifications. Always check specific tender requirements.'
        }
      ]
    }
  },
  {
    slug: 'iso-9001-uk-tenders',
    title: 'ISO 9001 UK Tenders: Requirements & Cost Guide 2026',
    metaDescription: 'ISO 9001 is the most requested certification in UK government tenders. Learn what it costs (from £2,500), how long it takes, and when it\'s mandatory.',
    h1: 'ISO 9001 for UK Tenders: Requirements, Cost and How to Get Certified',
    primaryKeyword: 'ISO 9001 UK tenders',
    secondaryKeywords: ['ISO 9001 certification requirements', 'ISO 9001 government contracts', 'quality management certification UK', 'ISO 9001 cost UK'],
    contentSections: {
      intro: 'ISO 9001:2015 is the world\'s most recognised quality management standard and appears in over 40% of UK government tenders. It demonstrates your ability to consistently provide products and services that meet customer and regulatory requirements.',
      requirements: 'Required in construction, engineering, FM, professional services, logistics, manufacturing, NHS supply chain, and central government. Rarely strictly mandatory but highly advantageous - often the difference between winning and losing.',
      cost: 'Small companies: £5,000-£10,000 total Year 1. Medium: £8,000-£15,000. Large: £12,000-£25,000. Certification body fees alone: £1,500-£5,000. Annual surveillance: £1,000-£2,500.',
      timeline: '3-6 months typical: Month 1 gap analysis, Months 2-3 system development, Month 4 implementation, Month 5 internal audit, Month 6 certification audit.',
      faq: [
        {
          q: 'Is ISO 9001 mandatory for UK government contracts?',
          a: 'ISO 9001 is rarely strictly mandatory but appears in over 40% of UK government tenders as highly advantageous. Some frameworks like NHS Supply Chain and Crown Commercial Service treat it as a de facto requirement. Without it, your bid is significantly less competitive.'
        },
        {
          q: 'How much does ISO 9001 certification cost in the UK?',
          a: 'ISO 9001 costs typically range from £5,000-£10,000 for small companies, £8,000-£15,000 for medium companies, and £12,000-£25,000 for large organisations in Year 1. This includes consultancy support, certification body fees, and training. Annual surveillance audits cost £1,000-£2,500.'
        },
        {
          q: 'How long does ISO 9001 take to get?',
          a: 'ISO 9001 certification typically takes 3-6 months from start to certificate. This includes gap analysis (Month 1), system development (Months 2-3), implementation (Month 4), internal audit (Month 5), and certification audit (Month 6). Having good existing processes can reduce this timeline.'
        },
        {
          q: 'What is the difference between ISO 9001 and ISO 9001:2015?',
          a: 'ISO 9001:2015 is simply the current version of ISO 9001, indicating it was last revised in 2015. This version is still current as of 2026. When people refer to ISO 9001, they mean ISO 9001:2015. The next revision is expected around 2025-2026.'
        },
        {
          q: 'Can I get ISO 9001 without a consultant?',
          a: 'Yes, you can achieve ISO 9001 without a consultant, but it typically takes 50% longer and has higher risk of failure at audit. Most SMEs use consultants to save time, ensure compliance, and benefit from expertise. Budget for at least some consultancy support for best results.'
        }
      ]
    }
  }
]

// Generate page component
function generatePageComponent(page: CertPage): string {
  return `import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '${page.title}',
  description: '${page.metaDescription}',
  keywords: '${page.primaryKeyword}, ${page.secondaryKeywords.join(', ')}',
  openGraph: {
    title: '${page.h1}',
    description: '${page.metaDescription}',
    url: 'https://rfp.quest/certifications/${page.slug}',
    siteName: 'rfp.quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/${page.slug}',
  },
}

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '${page.h1}',
    description: '${page.metaDescription}',
    author: {
      '@type': 'Organization',
      name: 'rfp.quest',
      url: 'https://rfp.quest'
    },
    publisher: {
      '@type': 'Organization',
      name: 'rfp.quest',
      url: 'https://rfp.quest'
    },
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/${page.slug}'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ${JSON.stringify(page.contentSections.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    })), null, 4)}
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            ${page.h1}
          </h1>
          
          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: ${page.slug}-uk.jpg - ${page.primaryKeyword} requirements for UK government tenders]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            ${page.contentSections.intro}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Requirements</h2>
          <p>${page.contentSections.requirements}</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Cost</h2>
          <p>${page.contentSections.cost}</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Timeline</h2>
          <p>${page.contentSections.timeline}</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            ${page.contentSections.faq.map(item => `
            <div>
              <h3 className="text-lg font-semibold mb-2">${item.q}</h3>
              <p>${item.a}</p>
            </div>
            `).join('')}
          </div>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Guides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certifications/" className="text-blue-600 hover:underline">
                  UK procurement certifications guide
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  rfp.quest - UK RFP platform
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </article>
    </>
  )
}`
}

// Generate all pages
async function generatePages() {
  const baseDir = path.join(process.cwd(), 'src/app/certifications')
  
  for (const page of certPages) {
    const dirPath = path.join(baseDir, page.slug)
    const filePath = path.join(dirPath, 'page.tsx')
    
    try {
      await fs.mkdir(dirPath, { recursive: true })
      const content = generatePageComponent(page)
      await fs.writeFile(filePath, content)
      console.log(`✅ Generated: ${page.slug}/page.tsx`)
    } catch (error) {
      console.error(`❌ Error generating ${page.slug}:`, error)
    }
  }
}

generatePages().catch(console.error)