import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Cyber Essentials Plus UK Tenders: Technical Audit Requirements',
  description: 'Cyber Essentials Plus is mandatory for MOD contracts and NHS digital services. Learn the difference from basic CE, costs (from £1,695), timeline and technical audit requirements.',
  keywords: 'Cyber Essentials Plus UK tenders, Cyber Essentials Plus government contracts, CE Plus MOD contracts, Cyber Essentials Plus NHS, NCSC CE Plus certification',
  openGraph: {
    title: 'Cyber Essentials Plus for UK Government Contracts: Complete Guide',
    description: 'Cyber Essentials Plus is mandatory for MOD contracts and NHS digital services. Learn the difference from basic CE, costs, timeline and technical audit requirements.',
    url: 'https://rfp.quest/certifications/cyber-essentials-plus-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/cyber-essentials-plus-uk-tenders',
  },
}

export default function CyberEssentialsPlusUKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cyber Essentials Plus for UK Government Contracts: Complete Guide',
    description: 'Cyber Essentials Plus is mandatory for MOD contracts and NHS digital services. Learn the difference from basic CE, costs, timeline and technical audit requirements.',
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
    datePublished: '2024-03-20',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/cyber-essentials-plus-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between Cyber Essentials and Cyber Essentials Plus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cyber Essentials is a self-assessment questionnaire verified by an external body. Cyber Essentials Plus includes the same questionnaire PLUS a hands-on technical audit where an assessor tests your actual systems. CE Plus involves vulnerability scanning, configuration review, and sample device testing. It provides much stronger assurance and is required for higher-risk government contracts.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Cyber Essentials Plus mandatory for MOD contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Cyber Essentials Plus is mandatory for all direct MOD contractors under Defence Standard 05-138. This applies to all contracts involving MOD identifiable information. Subcontractors handling MOD data also require CE Plus. The MOD was the first government department to mandate CE Plus and remains the strictest enforcer.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does Cyber Essentials Plus cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cyber Essentials Plus costs from £1,695+VAT for micro companies (1-9 employees) up to £3,495+VAT for large organisations (250+ employees) through IASME. This includes the basic CE assessment plus the technical audit. Additional costs may include remediation work, IT consultant support (£500-£2,000), and annual recertification.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does Cyber Essentials Plus take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cyber Essentials Plus typically takes 2-6 weeks: 1-2 weeks to complete the questionnaire and prepare systems, 1-2 weeks to schedule the technical audit, 1 day for the on-site/remote audit itself, and 1 week for results and any remediation. If significant vulnerabilities are found, remediation and re-testing can add 2-4 weeks.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I go straight to Cyber Essentials Plus without basic CE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can apply directly for Cyber Essentials Plus without first obtaining basic Cyber Essentials. The Plus assessment includes the basic questionnaire, so you get both certifications if successful. Going straight to Plus saves time and can be more cost-effective if you know you need Plus for contract requirements.'
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
            Cyber Essentials Plus for UK Government Contracts: Complete Guide
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <p className="text-lg font-semibold text-red-900 mb-2">
              🔒 Mandatory for High-Risk Government Contracts
            </p>
            <p className="text-red-800">
              Cyber Essentials Plus is required for all MOD contracts, NHS digital services, and any contract handling large volumes of personal data. Without it, you're excluded from these high-value opportunities.
            </p>
          </div>

          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: cyber-essentials-plus-uk-contracts.jpg - Cyber Essentials Plus certification badge and technical audit process]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            Cyber Essentials Plus is the advanced tier of the UK government's cyber security certification scheme. While basic Cyber Essentials involves self-assessment, CE Plus adds rigorous technical verification through hands-on testing of your actual systems by qualified assessors.
          </p>

          <p>
            Introduced by the National Cyber Security Centre (NCSC), Cyber Essentials Plus provides the highest level of assurance under the scheme. It's specifically designed for organisations handling sensitive government data, critical national infrastructure, or large-scale personal information processing.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">When Cyber Essentials Plus is Required</h2>
          
          <p>
            CE Plus has become mandatory for specific high-risk government contracts:
          </p>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Ministry of Defence (MOD)</h3>
            <ul className="space-y-2">
              <li>• All direct MOD contractors - mandatory under DEFSTAN 05-138</li>
              <li>• Defence supply chain handling CJI/MOD identifiable information</li>
              <li>• Defence Innovation contracts</li>
              <li>• Dstl research programmes</li>
              <li>• Any contract processing OFFICIAL-SENSITIVE defence data</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">NHS & Healthcare</h3>
            <ul className="space-y-2">
              <li>• NHS digital service providers</li>
              <li>• GP IT services and clinical systems</li>
              <li>• Health data processors handling patient records</li>
              <li>• NHS App integrations</li>
              <li>• Medical device software suppliers</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Central Government High-Risk Contracts</h3>
            <ul className="space-y-2">
              <li>• Contracts handling 500,000+ citizen records</li>
              <li>• Critical national infrastructure projects</li>
              <li>• Law enforcement technology suppliers</li>
              <li>• GCHQ and intelligence community suppliers</li>
              <li>• Border Force and Home Office systems</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">CE Plus vs Basic Cyber Essentials</h2>
          
          <p>
            Understanding the key differences helps determine which certification you need:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Cyber Essentials</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Cyber Essentials Plus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Assessment Type</td>
                <td className="border border-gray-300 px-4 py-2">Self-assessment questionnaire</td>
                <td className="border border-gray-300 px-4 py-2">Questionnaire + technical audit</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Verification</td>
                <td className="border border-gray-300 px-4 py-2">Declaration-based</td>
                <td className="border border-gray-300 px-4 py-2">Hands-on system testing</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Cost Range</td>
                <td className="border border-gray-300 px-4 py-2">£320 - £600+VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,695 - £3,495+VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Timeline</td>
                <td className="border border-gray-300 px-4 py-2">1-2 weeks</td>
                <td className="border border-gray-300 px-4 py-2">2-6 weeks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Testing Included</td>
                <td className="border border-gray-300 px-4 py-2">None</td>
                <td className="border border-gray-300 px-4 py-2">Vulnerability scans, config review</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Assurance Level</td>
                <td className="border border-gray-300 px-4 py-2">Basic</td>
                <td className="border border-gray-300 px-4 py-2">High</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">The Technical Audit Process</h2>
          
          <p>
            The CE Plus technical audit involves comprehensive testing of your systems:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">1. External Vulnerability Scanning</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• All external IP addresses scanned</li>
              <li>• Open ports and services identified</li>
              <li>• Known vulnerabilities checked</li>
              <li>• SSL/TLS configuration tested</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">2. Internal System Testing</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Sample of user devices tested (laptops, desktops, mobiles)</li>
              <li>• Patch status verification</li>
              <li>• Anti-malware effectiveness</li>
              <li>• Firewall configuration review</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">3. Configuration Review</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Administrator account audit</li>
              <li>• Password policy testing</li>
              <li>• Software inventory verification</li>
              <li>• Security update processes</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">4. Build Standard Assessment</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Standard build configuration checked</li>
              <li>• Unnecessary services disabled</li>
              <li>• Auto-run disabled verification</li>
              <li>• Application whitelisting review</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Cyber Essentials Plus Costs</h2>
          
          <p>
            Official IASME pricing for CE Plus (2024-2025):
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Company Size</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CE Plus Cost</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Additional Costs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Micro (1-9 employees)</td>
                <td className="border border-gray-300 px-4 py-2">£1,695 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">IT support: £500-£1,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Small (10-49)</td>
                <td className="border border-gray-300 px-4 py-2">£1,995 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">Remediation: £1,000-£3,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Medium (50-249)</td>
                <td className="border border-gray-300 px-4 py-2">£2,745 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">Consultant: £2,000-£5,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Large (250+)</td>
                <td className="border border-gray-300 px-4 py-2">£3,495 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">Full prep: £3,000-£10,000</td>
              </tr>
            </tbody>
          </table>

          <p>
            Additional costs to consider:
          </p>
          <ul>
            <li>• Pre-assessment readiness review: £500-£1,500</li>
            <li>• Vulnerability remediation tools: £50-£200/month</li>
            <li>• Firewall upgrades if needed: £500-£2,000</li>
            <li>• Annual recertification (same price as initial)</li>
            <li>• Failed assessment re-test: £500-£1,000</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common Failure Points</h2>
          
          <p>
            The technical audit often identifies these issues causing failure:
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Top Reasons for CE Plus Failure
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• Unpatched systems (Windows updates more than 14 days old)</li>
              <li>• Weak or default passwords discovered</li>
              <li>• Missing patches on network devices (routers, firewalls)</li>
              <li>• Unsupported software still in use (Windows 7, Server 2008)</li>
              <li>• Administrative rights given to standard users</li>
              <li>• No anti-malware on some devices</li>
              <li>• Open RDP or unnecessary services exposed</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Preparing for CE Plus Assessment</h2>
          
          <p>
            Essential preparation steps to pass first time:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2-4 Weeks Before</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Complete internal vulnerability scan</li>
                <li>• Update all systems and software</li>
                <li>• Review and strengthen password policies</li>
                <li>• Document your standard build</li>
                <li>• Remove unnecessary software and admin rights</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">1 Week Before</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Final patching sweep</li>
                <li>• Test backup systems</li>
                <li>• Verify anti-malware on all devices</li>
                <li>• Check firewall rules and logs</li>
                <li>• Prepare system inventory</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Day of Assessment</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• IT team available for questions</li>
                <li>• Admin access ready for assessor</li>
                <li>• Network diagrams available</li>
                <li>• Sample devices prepared for testing</li>
                <li>• Key documentation accessible</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">CE Plus for Different Sectors</h2>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Legal Sector</h3>
            <p>
              From October 2025, criminal legal aid firms must have Cyber Essentials. While basic CE meets the minimum, CE Plus is recommended for firms handling sensitive case data or working with CPS, courts, or police systems.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Local Authorities</h3>
            <p>
              Councils increasingly require CE Plus from suppliers handling citizen data. Social care systems, housing management, and benefits processing suppliers often need Plus certification. Check individual council requirements.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Education Sector</h3>
            <p>
              Universities handling research data (especially UKRI-funded) may require suppliers to have CE Plus. EdTech companies processing student data increasingly need Plus for university contracts.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Maintaining CE Plus Certification</h2>
          
          <p>
            CE Plus requires annual recertification, not just renewal:
          </p>

          <ul className="space-y-2">
            <li>• Full technical re-audit required each year</li>
            <li>• Same comprehensive testing repeated</li>
            <li>• Costs similar to initial certification</li>
            <li>• Certificate invalid immediately upon expiry</li>
            <li>• No grace period for renewal</li>
          </ul>

          <p>
            Many organisations maintain readiness year-round through:
          </p>
          <ul className="space-y-2">
            <li>• Monthly vulnerability scanning</li>
            <li>• Quarterly internal CE Plus mock audits</li>
            <li>• Automated patch management systems</li>
            <li>• Continuous security monitoring</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Choosing a CE Plus Assessor</h2>
          
          <p>
            Select from NCSC-approved Certification Bodies:
          </p>

          <ul className="space-y-2">
            <li>• IASME Consortium (original scheme operator)</li>
            <li>• CREST</li>
            <li>• The Cyber Scheme</li>
            <li>• CompTIA</li>
            <li>• ICO Consultancy</li>
          </ul>

          <p>
            Ensure your assessor is approved for CE Plus, not just basic CE. Check the <a href="https://www.ncsc.gov.uk/cyberessentials/certified-bodies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NCSC certified bodies list</a>.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between Cyber Essentials and Cyber Essentials Plus?</h3>
              <p>
                Cyber Essentials is a self-assessment questionnaire verified by an external body. Cyber Essentials Plus includes the same questionnaire PLUS a hands-on technical audit where an assessor tests your actual systems. CE Plus involves vulnerability scanning, configuration review, and sample device testing. It provides much stronger assurance and is required for higher-risk government contracts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is Cyber Essentials Plus mandatory for MOD contracts?</h3>
              <p>
                Yes, Cyber Essentials Plus is mandatory for all direct MOD contractors under Defence Standard 05-138. This applies to all contracts involving MOD identifiable information. Subcontractors handling MOD data also require CE Plus. The MOD was the first government department to mandate CE Plus and remains the strictest enforcer.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does Cyber Essentials Plus cost?</h3>
              <p>
                Cyber Essentials Plus costs from £1,695+VAT for micro companies (1-9 employees) up to £3,495+VAT for large organisations (250+ employees) through IASME. This includes the basic CE assessment plus the technical audit. Additional costs may include remediation work, IT consultant support (£500-£2,000), and annual recertification.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does Cyber Essentials Plus take?</h3>
              <p>
                Cyber Essentials Plus typically takes 2-6 weeks: 1-2 weeks to complete the questionnaire and prepare systems, 1-2 weeks to schedule the technical audit, 1 day for the on-site/remote audit itself, and 1 week for results and any remediation. If significant vulnerabilities are found, remediation and re-testing can add 2-4 weeks.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I go straight to Cyber Essentials Plus without basic CE?</h3>
              <p>
                Yes, you can apply directly for Cyber Essentials Plus without first obtaining basic Cyber Essentials. The Plus assessment includes the basic questionnaire, so you get both certifications if successful. Going straight to Plus saves time and can be more cost-effective if you know you need Plus for contract requirements.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.ncsc.gov.uk/cyberessentials/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NCSC Cyber Essentials Official Guide
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/cyber-essentials-scheme-overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Government Cyber Essentials Scheme Overview
              </a>
            </li>
            <li>
              <a href="https://iasme.co.uk/cyber-essentials/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                IASME Cyber Essentials Portal
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/defence-standard-05-138" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                MOD DEFSTAN 05-138 Requirements
              </a>
            </li>
            <li>
              <a href="https://digital.nhs.uk/cyber-and-data-security/cyber-essentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS Digital Cyber Requirements
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/cyber-essentials-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Cyber Essentials (Basic)
                </Link>
                <p className="text-sm text-gray-600 mt-1">Foundation level certification</p>
              </div>
              <div>
                <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 27001 Information Security
                </Link>
                <p className="text-sm text-gray-600 mt-1">Comprehensive ISMS standard</p>
              </div>
              <div>
                <Link href="/certifications/dsp-toolkit-nhs-tenders" className="text-blue-600 hover:underline font-medium">
                  DSP Toolkit
                </Link>
                <p className="text-sm text-gray-600 mt-1">NHS data security requirements</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All UK Certifications
                </Link>
                <p className="text-sm text-gray-600 mt-1">Complete certification guide</p>
              </div>
            </div>
          </nav>
        </section>
      </article>
    </>
  )
}