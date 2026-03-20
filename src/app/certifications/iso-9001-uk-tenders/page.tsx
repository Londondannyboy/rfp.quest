import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ISO 9001 UK Tenders: Requirements & Cost Guide 2026',
  description: 'ISO 9001 is the most requested certification in UK government tenders. Learn what it costs (from £2,500), how long it takes, and when it\'s mandatory.',
  keywords: 'ISO 9001 UK tenders, ISO 9001 certification requirements, ISO 9001 government contracts, quality management certification UK, ISO 9001 cost UK',
  openGraph: {
    title: 'ISO 9001 for UK Tenders: Requirements, Cost and How to Get Certified',
    description: 'ISO 9001 is the most requested certification in UK government tenders. Learn what it costs (from £2,500), how long it takes, and when it\'s mandatory.',
    url: 'https://rfp.quest/certifications/iso-9001-uk-tenders',
    siteName: 'rfp.quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/iso-9001-uk-tenders',
  },
}

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'ISO 9001 for UK Tenders: Requirements, Cost and How to Get Certified',
    description: 'ISO 9001 is the most requested certification in UK government tenders. Learn what it costs (from £2,500), how long it takes, and when it\'s mandatory.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/iso-9001-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
        "@type": "Question",
        "name": "Is ISO 9001 mandatory for UK government contracts?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "ISO 9001 is rarely strictly mandatory but appears in over 40% of UK government tenders as highly advantageous. Some frameworks like NHS Supply Chain and Crown Commercial Service treat it as a de facto requirement. Without it, your bid is significantly less competitive."
        }
    },
    {
        "@type": "Question",
        "name": "How much does ISO 9001 certification cost in the UK?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "ISO 9001 costs typically range from £5,000-£10,000 for small companies, £8,000-£15,000 for medium companies, and £12,000-£25,000 for large organisations in Year 1. This includes consultancy support, certification body fees, and training. Annual surveillance audits cost £1,000-£2,500."
        }
    },
    {
        "@type": "Question",
        "name": "How long does ISO 9001 take to get?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "ISO 9001 certification typically takes 3-6 months from start to certificate. This includes gap analysis (Month 1), system development (Months 2-3), implementation (Month 4), internal audit (Month 5), and certification audit (Month 6). Having good existing processes can reduce this timeline."
        }
    },
    {
        "@type": "Question",
        "name": "What is the difference between ISO 9001 and ISO 9001:2015?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "ISO 9001:2015 is simply the current version of ISO 9001, indicating it was last revised in 2015. This version is still current as of 2026. When people refer to ISO 9001, they mean ISO 9001:2015. The next revision is expected around 2025-2026."
        }
    },
    {
        "@type": "Question",
        "name": "Can I get ISO 9001 without a consultant?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can achieve ISO 9001 without a consultant, but it typically takes 50% longer and has higher risk of failure at audit. Most SMEs use consultants to save time, ensure compliance, and benefit from expertise. Budget for at least some consultancy support for best results."
        }
    }
]
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
            ISO 9001 for UK Tenders: Requirements, Cost and How to Get Certified
          </h1>
          
          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: iso-9001-uk-tenders-uk.jpg - ISO 9001 UK tenders requirements for UK government tenders]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            ISO 9001:2015 is the world's most recognised quality management standard and appears in over 40% of UK government tenders. It demonstrates your ability to consistently provide products and services that meet customer and regulatory requirements.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Requirements</h2>
          <p>Required in construction, engineering, FM, professional services, logistics, manufacturing, NHS supply chain, and central government. Rarely strictly mandatory but highly advantageous - often the difference between winning and losing.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Cost</h2>
          <p>Small companies: £5,000-£10,000 total Year 1. Medium: £8,000-£15,000. Large: £12,000-£25,000. Certification body fees alone: £1,500-£5,000. Annual surveillance: £1,000-£2,500.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Timeline</h2>
          <p>3-6 months typical: Month 1 gap analysis, Months 2-3 system development, Month 4 implementation, Month 5 internal audit, Month 6 certification audit.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is ISO 9001 mandatory for UK government contracts?</h3>
              <p>ISO 9001 is rarely strictly mandatory but appears in over 40% of UK government tenders as highly advantageous. Some frameworks like NHS Supply Chain and Crown Commercial Service treat it as a de facto requirement. Without it, your bid is significantly less competitive.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How much does ISO 9001 certification cost in the UK?</h3>
              <p>ISO 9001 costs typically range from £5,000-£10,000 for small companies, £8,000-£15,000 for medium companies, and £12,000-£25,000 for large organisations in Year 1. This includes consultancy support, certification body fees, and training. Annual surveillance audits cost £1,000-£2,500.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How long does ISO 9001 take to get?</h3>
              <p>ISO 9001 certification typically takes 3-6 months from start to certificate. This includes gap analysis (Month 1), system development (Months 2-3), implementation (Month 4), internal audit (Month 5), and certification audit (Month 6). Having good existing processes can reduce this timeline.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between ISO 9001 and ISO 9001:2015?</h3>
              <p>ISO 9001:2015 is simply the current version of ISO 9001, indicating it was last revised in 2015. This version is still current as of 2026. When people refer to ISO 9001, they mean ISO 9001:2015. The next revision is expected around 2025-2026.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I get ISO 9001 without a consultant?</h3>
              <p>Yes, you can achieve ISO 9001 without a consultant, but it typically takes 50% longer and has higher risk of failure at audit. Most SMEs use consultants to save time, ensure compliance, and benefit from expertise. Budget for at least some consultancy support for best results.</p>
            </div>
            
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
}