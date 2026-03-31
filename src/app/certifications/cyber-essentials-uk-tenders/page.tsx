import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Cyber Essentials UK Tenders: Mandatory Requirements 2026',
  description: 'Cyber Essentials is now mandatory for G-Cloud 15 and most central government contracts. Costs from £320. See who needs it and how to get certified fast.',
  keywords: 'Cyber Essentials UK tenders, Cyber Essentials government contracts, Cyber Essentials mandatory public sector, NCSC certification tenders',
  openGraph: {
    title: 'Cyber Essentials for UK Tenders: Is It Mandatory in 2026?',
    description: 'Cyber Essentials is now mandatory for G-Cloud 15 and most central government contracts. Costs from £320. See who needs it and how to get certified fast.',
    url: 'https://rfp.quest/certifications/cyber-essentials-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/cyber-essentials-uk-tenders',
  },
}

export default function Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cyber Essentials for UK Tenders: Is It Mandatory in 2026?',
    description: 'Cyber Essentials is now mandatory for G-Cloud 15 and most central government contracts. Costs from £320. See who needs it and how to get certified fast.',
    author: {
      '@type': 'Organization',
      name: 'RFP Platform Quest',
      url: 'https://rfp.quest'
    },
    publisher: {
      '@type': 'Organization',
      name: 'RFP Platform Quest',
      url: 'https://rfp.quest'
    },
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/cyber-essentials-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
        "@type": "Question",
        "name": "Is Cyber Essentials mandatory for all UK government contracts?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cyber Essentials is mandatory for central government contracts involving handling sensitive or personal data under Cabinet Office policy PPN 014. G-Cloud 15 requires it for many supplier lots. While not universally mandatory, it is required for a significant proportion of government contracts and the scope continues to expand."
        }
    },
    {
        "@type": "Question",
        "name": "How much does Cyber Essentials cost?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cyber Essentials costs from £320+VAT for the smallest organisations (up to 9 employees) through self-assessment, rising to £600+VAT for organisations with 250+ employees. These are NCSC official prices through IASME. Costs are fixed and transparent, making it one of the most affordable certifications."
        }
    },
    {
        "@type": "Question",
        "name": "How quickly can I get Cyber Essentials certified?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Self-assessment can be completed in as little as 1-2 days if your systems are already compliant. The IASME assessment and certification process typically takes 1-4 weeks from submission to certificate. This makes it one of the fastest certifications to obtain for government contracts."
        }
    },
    {
        "@type": "Question",
        "name": "What is the difference between Cyber Essentials and Cyber Essentials Plus?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cyber Essentials is a self-assessment verified by an external body. Cyber Essentials Plus includes the same requirements but adds an independent technical audit of your systems by a licensed assessor. Plus is required for higher-risk contracts, NHS digital services, and MOD suppliers."
        }
    },
    {
        "@type": "Question",
        "name": "Does ISO 27001 replace the need for Cyber Essentials?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, ISO 27001 does NOT replace Cyber Essentials. The UK Cabinet Office policy explicitly states they are separate requirements serving different purposes. Many government contracts require both certifications. Always check specific tender requirements."
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
            Cyber Essentials for UK Tenders: Is It Mandatory in 2026?
          </h1>
          
          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: cyber-essentials-uk-tenders-uk.jpg - Cyber Essentials UK tenders requirements for UK government tenders]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            Cyber Essentials is the UK government baseline cyber security certification, managed by the National Cyber Security Centre (NCSC). Since 2014, it has become increasingly mandatory for government contracts, especially those handling sensitive or personal data.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Requirements</h2>
          <p>G-Cloud 15 now mandates Cyber Essentials for many supplier lots. Central government contracts require it for handling sensitive data (PPN 014). Criminal Legal Aid law firms must have it from October 2025.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Cost</h2>
          <p>From £320+VAT for self-assessment (up to 9 employees) to £600+VAT (250+ employees). NCSC official pricing applies.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Timeline</h2>
          <p>Self-assessment can be completed in days. IASME assessment takes 1-4 weeks. Annual renewal required.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is Cyber Essentials mandatory for all UK government contracts?</h3>
              <p>Cyber Essentials is mandatory for central government contracts involving handling sensitive or personal data under Cabinet Office policy PPN 014. G-Cloud 15 requires it for many supplier lots. While not universally mandatory, it is required for a significant proportion of government contracts and the scope continues to expand.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How much does Cyber Essentials cost?</h3>
              <p>Cyber Essentials costs from £320+VAT for the smallest organisations (up to 9 employees) through self-assessment, rising to £600+VAT for organisations with 250+ employees. These are NCSC official prices through IASME. Costs are fixed and transparent, making it one of the most affordable certifications.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How quickly can I get Cyber Essentials certified?</h3>
              <p>Self-assessment can be completed in as little as 1-2 days if your systems are already compliant. The IASME assessment and certification process typically takes 1-4 weeks from submission to certificate. This makes it one of the fastest certifications to obtain for government contracts.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between Cyber Essentials and Cyber Essentials Plus?</h3>
              <p>Cyber Essentials is a self-assessment verified by an external body. Cyber Essentials Plus includes the same requirements but adds an independent technical audit of your systems by a licensed assessor. Plus is required for higher-risk contracts, NHS digital services, and MOD suppliers.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Does ISO 27001 replace the need for Cyber Essentials?</h3>
              <p>No, ISO 27001 does NOT replace Cyber Essentials. The UK Cabinet Office policy explicitly states they are separate requirements serving different purposes. Many government contracts require both certifications. Always check specific tender requirements.</p>
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
                  RFP Platform Quest - UK RFP platform
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </article>
    </>
  )
}