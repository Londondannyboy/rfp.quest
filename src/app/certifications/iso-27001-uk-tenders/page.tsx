import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ISO 27001 UK Tenders: Information Security Cert Guide 2026',
  description: 'ISO 27001 is increasingly mandatory for NHS and digital government tenders in the UK. Costs, timelines and which contracts require it — complete 2026 guide.',
  keywords: 'ISO 27001 UK tenders, information security certification UK government, ISO 27001 NHS tenders, ISO 27001 digital contracts UK, cyber security certification for government contracts',
  openGraph: {
    title: 'ISO 27001 for UK Tenders: Information Security Certification Guide',
    description: 'ISO 27001 is increasingly mandatory for NHS and digital government tenders. Complete guide to requirements, costs, and implementation.',
    url: 'https://rfp.quest/certifications/iso-27001-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/iso-27001-uk-tenders',
  },
}

export default function ISO27001Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'ISO 27001 for UK Tenders: Information Security Certification Guide',
    description: 'ISO 27001 is increasingly mandatory for NHS and digital government tenders in the UK. Costs, timelines and which contracts require it — complete 2026 guide.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/iso-27001-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is ISO 27001 mandatory for UK government digital contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 27001 is increasingly stated as mandatory for NHS digital contracts, central government IT services, cloud service providers, data processors, and any contract involving personal or sensitive government data. It is strongly advantageous across all public sector data-touching contracts. However, ISO 27001 does NOT automatically replace Cyber Essentials - UK government policy requires both where the contract risk warrants it.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does ISO 27001 certification cost in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 27001 costs for UK organisations range from £5,000-£15,000 for smaller businesses in Year 1, £15,000-£40,000 for mid-size companies, with larger enterprises potentially spending £40,000+. These figures include consultant fees, certification body costs, training, and security tools. Annual surveillance audits typically cost £2,000-£5,000. Costs vary significantly based on scope, existing security maturity, and complexity.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does ISO 27001 certification take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 27001 certification typically takes 6-12 months, with implementation being the longest phase. The timeline includes: 1-2 months for gap analysis and scoping, 3-5 months for ISMS development and control implementation, 1-2 months for internal audit and management review, and 1-2 months for the certification audit process. Having existing management systems like ISO 9001 can reduce this by 2-3 months.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between ISO 27001:2013 and ISO 27001:2022?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 27001:2022 is the current version, replacing ISO 27001:2013. The 2022 revision includes updated Annex A controls (now 93 controls in 4 themes versus 114 in 14 domains), better alignment with modern cyber threats, clearer cloud security requirements, and enhanced focus on threat intelligence. The transition period ended October 2025 - all new certifications must now be to the 2022 standard.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does ISO 27001 replace Cyber Essentials for government contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, ISO 27001 does NOT replace Cyber Essentials. The UK Cabinet Office policy (PPN 014) explicitly states these are separate requirements. Many NHS and government contracts require both - ISO 27001 for comprehensive information security management and Cyber Essentials for baseline cyber security controls. Always check specific tender requirements as both may be mandatory.'
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
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            ISO 27001 for UK Tenders: Information Security Certification Guide
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <p className="font-semibold text-red-900 mb-2">⚠️ Critical Notice</p>
            <p className="text-red-800">
              ISO 27001 does NOT replace Cyber Essentials. The UK Cabinet Office (PPN 014) 
              explicitly states these are separate requirements. Many NHS and government 
              contracts require both. Check specific tender requirements carefully.
            </p>
          </div>

          {/* TODO: Add hero image */}
          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: iso-27001-uk-tenders-uk.jpg - ISO 27001 UK tenders requirements for UK government tenders]
            </p>
          </div>
        </header>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            ISO 27001 is the international standard for information security management systems (ISMS) 
            and increasingly mandatory for NHS digital contracts, central government IT services, and 
            any UK public sector contract involving sensitive data. Understanding its requirements, 
            costs, and relationship with other standards like Cyber Essentials is crucial for winning 
            data-handling government contracts.
          </p>

          <h2 id="what-is-iso-27001" className="text-2xl font-bold mt-10 mb-4">
            What is ISO 27001 and why is it critical for digital government contracts?
          </h2>
          
          <p>
            ISO/IEC 27001:2022 is the globally recognised standard that specifies requirements for 
            establishing, implementing, maintaining, and continually improving an information security 
            management system (ISMS). For UK government contracts, it demonstrates your organisation's 
            ability to protect sensitive information systematically and consistently.
          </p>

          <p>
            The standard has become critical for digital government contracts because it provides:
          </p>
          
          <ul>
            <li><strong>Risk-based approach:</strong> Systematic identification and treatment of information security risks</li>
            <li><strong>Comprehensive controls:</strong> 93 security controls covering all aspects of information protection</li>
            <li><strong>Continuous improvement:</strong> Regular reviews and updates to address evolving threats</li>
            <li><strong>Third-party assurance:</strong> Independent verification of security practices</li>
            <li><strong>Supply chain confidence:</strong> Demonstrated capability to protect government data</li>
            <li><strong>Regulatory alignment:</strong> Supports GDPR compliance and other data protection requirements</li>
          </ul>

          <p>
            The 2022 revision of ISO 27001 brought significant updates, with the transition period 
            ending in October 2025. All new certifications must now be to the 2022 standard, which 
            includes restructured controls better aligned with modern cyber threats and cloud computing 
            requirements.
          </p>

          <h2 id="which-contracts-require" className="text-2xl font-bold mt-10 mb-4">
            Which UK tender categories require ISO 27001?
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Near-Mandatory Requirements</h3>
          
          <p>
            ISO 27001 is increasingly stated as mandatory (not just advantageous) in these categories:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h4 className="font-semibold mb-3">NHS Digital Contracts</h4>
            <ul className="space-y-1">
              <li>• Electronic patient record systems</li>
              <li>• Clinical information systems</li>
              <li>• NHS App and digital services</li>
              <li>• Data analytics and reporting platforms</li>
              <li>• Telehealth and remote monitoring systems</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h4 className="font-semibold mb-3">Central Government IT/Digital</h4>
            <ul className="space-y-1">
              <li>• GOV.UK service development</li>
              <li>• Government digital transformation projects</li>
              <li>• Cloud service provision (G-Cloud)</li>
              <li>• Data processing and analytics services</li>
              <li>• Identity and access management systems</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h4 className="font-semibold mb-3">High-Security Departments</h4>
            <ul className="space-y-1">
              <li>• HMRC tax and customs systems</li>
              <li>• MOD defence contractors (alongside Defence Cyber Protection Partnership)</li>
              <li>• Home Office immigration and border systems</li>
              <li>• DWP benefits and pensions platforms</li>
              <li>• Justice and prison service systems</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Strongly Advantageous</h3>
          <p>
            ISO 27001 significantly improves win probability in:
          </p>
          <ul>
            <li>Local authority digital services</li>
            <li>Education sector (universities, schools)</li>
            <li>Housing associations</li>
            <li>Police and emergency services</li>
            <li>Any managed service provider contracts</li>
            <li>Business process outsourcing</li>
          </ul>

          <h2 id="iso-27001-vs-cyber-essentials" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001 vs Cyber Essentials: understanding the difference
          </h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
            <p className="font-semibold text-yellow-900 mb-2">Important Distinction</p>
            <p className="text-yellow-800">
              ISO 27001 and Cyber Essentials serve different purposes and are often BOTH required. 
              ISO 27001 is a comprehensive management system covering all aspects of information 
              security. Cyber Essentials focuses on five specific technical controls. UK government 
              policy (PPN 014) treats them as complementary, not alternatives.
            </p>
          </div>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ISO 27001</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cyber Essentials</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Scope</td>
                  <td className="border border-gray-300 px-4 py-2">Comprehensive ISMS</td>
                  <td className="border border-gray-300 px-4 py-2">5 technical controls</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Controls</td>
                  <td className="border border-gray-300 px-4 py-2">93 controls (4 themes)</td>
                  <td className="border border-gray-300 px-4 py-2">Firewalls, config, access, malware, patches</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Assessment</td>
                  <td className="border border-gray-300 px-4 py-2">Full audit over multiple days</td>
                  <td className="border border-gray-300 px-4 py-2">Self-assessment or basic audit</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Cost</td>
                  <td className="border border-gray-300 px-4 py-2">£5,000-£40,000+</td>
                  <td className="border border-gray-300 px-4 py-2">£320-£600</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Timeline</td>
                  <td className="border border-gray-300 px-4 py-2">6-12 months</td>
                  <td className="border border-gray-300 px-4 py-2">1-4 weeks</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Renewal</td>
                  <td className="border border-gray-300 px-4 py-2">3 years (annual surveillance)</td>
                  <td className="border border-gray-300 px-4 py-2">Annual</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Many tenders now explicitly require both: "The supplier shall hold current ISO 27001 
            certification AND Cyber Essentials certification." Always check requirements carefully.
          </p>

          <h2 id="cost-uk" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001 cost UK: realistic 2026 figures
          </h2>

          <p>
            ISO 27001 is one of the more expensive certifications due to its comprehensive nature 
            and the expertise required for implementation. Here are realistic UK costs for 2026:
          </p>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Organisation Size</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Year 1 Total</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Breakdown</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Annual Surveillance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Small (1-50 staff)</td>
                  <td className="border border-gray-300 px-4 py-2">£5,000 - £15,000</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £3,000-£8,000<br/>
                    Certification: £2,000-£4,000<br/>
                    Tools/Training: £1,000-£3,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£1,500 - £3,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Medium (51-250)</td>
                  <td className="border border-gray-300 px-4 py-2">£15,000 - £40,000</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £8,000-£20,000<br/>
                    Certification: £4,000-£8,000<br/>
                    Tools/Training: £3,000-£12,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£2,000 - £5,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Large (250+)</td>
                  <td className="border border-gray-300 px-4 py-2">£35,000 - £75,000+</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £15,000-£30,000<br/>
                    Certification: £8,000-£15,000<br/>
                    Tools/Training: £12,000-£30,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£5,000 - £10,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-2">Additional Cost Factors</h3>
            <ul className="space-y-2">
              <li><strong>Scope complexity:</strong> More locations, systems, and data types increase costs</li>
              <li><strong>Current maturity:</strong> Poor existing security increases consultancy needs</li>
              <li><strong>Tool requirements:</strong> SIEM, vulnerability scanners, GRC platforms</li>
              <li><strong>Staff training:</strong> Awareness programs and specialist training</li>
              <li><strong>Internal time:</strong> 200-400 hours of staff time typically required</li>
            </ul>
            <p className="text-sm mt-4">
              <strong>Disclaimer:</strong> Costs are approximate and vary by organisation size, 
              complexity, and certification body. Get a quote from a UKAS-accredited body for 
              accurate pricing.
            </p>
          </div>

          <h2 id="timeline" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001 timeline: from gap analysis to certificate
          </h2>

          <p>
            The ISO 27001 journey typically takes 6-12 months, with implementation consuming the 
            majority of time. Here's a realistic timeline:
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 my-6">
            <h3 className="text-xl font-semibold mb-4">Typical 9-Month Timeline</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Months 1-2: Preparation Phase</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Gap analysis against ISO 27001 requirements</li>
                  <li>• Define ISMS scope and boundaries</li>
                  <li>• Establish project team and governance</li>
                  <li>• Initial risk assessment methodology</li>
                  <li>• Management commitment and resources</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Months 3-5: ISMS Development</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Complete risk assessment and treatment</li>
                  <li>• Select and implement Annex A controls</li>
                  <li>• Develop ISMS documentation suite</li>
                  <li>• Create policies and procedures</li>
                  <li>• Design Statement of Applicability</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Months 6-7: Implementation</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Deploy technical controls</li>
                  <li>• Conduct staff training</li>
                  <li>• Begin collecting evidence</li>
                  <li>• Test incident response</li>
                  <li>• Operate ISMS for audit trail</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Month 8: Review</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Internal ISMS audit</li>
                  <li>• Management review</li>
                  <li>• Corrective actions</li>
                  <li>• Pre-assessment (optional)</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Month 9: Certification</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Stage 1 audit (documentation review)</li>
                  <li>• Address Stage 1 findings</li>
                  <li>• Stage 2 audit (implementation verification)</li>
                  <li>• Address any non-conformities</li>
                  <li>• Receive certificate</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Accelerating Factors</h3>
          <ul>
            <li>Existing ISO 9001 or ISO 14001 (shared structure saves 2-3 months)</li>
            <li>Mature IT security practices</li>
            <li>Dedicated project team</li>
            <li>Previous audit experience</li>
            <li>Limited, well-defined scope</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Common Delays</h3>
          <ul>
            <li>Scope creep during implementation</li>
            <li>Lack of management commitment</li>
            <li>Complex IT environment</li>
            <li>Multiple locations or business units</li>
            <li>Major security incidents during implementation</li>
          </ul>

          <h2 id="iso-27001-2022" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001:2022 — the latest standard and what changed
          </h2>

          <p>
            ISO 27001:2022 replaced the 2013 version with significant updates. The transition period 
            ended in October 2025, meaning all new certifications must now be to the 2022 standard.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Key Changes in ISO 27001:2022</h3>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h4 className="font-semibold mb-3">Restructured Annex A Controls</h4>
            <p className="mb-3">From 114 controls in 14 domains to 93 controls in 4 themes:</p>
            <ul className="space-y-2">
              <li><strong>Organizational controls (37):</strong> Policies, roles, supplier relationships, incident management</li>
              <li><strong>People controls (8):</strong> Screening, terms of employment, training, disciplinary process</li>
              <li><strong>Physical controls (14):</strong> Physical security perimeter, physical entry, protection against threats</li>
              <li><strong>Technological controls (34):</strong> Access control, cryptography, systems security, network security</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">New Control Areas</h3>
          <ul>
            <li><strong>Threat intelligence:</strong> Proactive threat information gathering</li>
            <li><strong>Cloud security:</strong> Explicit cloud service requirements</li>
            <li><strong>ICT readiness:</strong> Business continuity for IT systems</li>
            <li><strong>Data leakage prevention:</strong> Specific DLP controls</li>
            <li><strong>Web filtering:</strong> Internet access controls</li>
            <li><strong>Secure coding:</strong> Application security requirements</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">What This Means for Tenders</h3>
          <p>
            Government buyers are increasingly specifying "ISO 27001:2022" explicitly in requirements. 
            Organisations with 2013 certificates that haven't transitioned may find their bids 
            non-compliant. Always verify your certificate shows the 2022 version.
          </p>

          <h2 id="integration-nhs" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001 and NHS Data Security and Protection Toolkit
          </h2>

          <p>
            For NHS contracts, ISO 27001 maps directly to many Data Security and Protection (DSP) 
            Toolkit assertions but doesn't replace it. You'll likely need both:
          </p>

          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-3">How ISO 27001 Supports DSP Toolkit</h3>
            <ul className="space-y-2">
              <li>✓ Provides evidence for multiple DSP assertions</li>
              <li>✓ Demonstrates robust information governance</li>
              <li>✓ Shows third-party verified security</li>
              <li>✓ Covers technical and organizational measures</li>
              <li>✓ Includes incident management procedures</li>
            </ul>
            <p className="mt-4 text-sm">
              <strong>Note:</strong> ISO 27001 significantly simplifies DSP Toolkit completion but 
              doesn't automatically grant "Standards Met" status. Separate DSP submission still required.
            </p>
          </div>

          <h2 id="faq" className="text-2xl font-bold mt-10 mb-4">
            ISO 27001 Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Is ISO 27001 mandatory for UK government digital contracts?</h3>
              <p>
                ISO 27001 is increasingly mandatory for NHS digital contracts, central government IT 
                services, and contracts involving sensitive data. While not universally legally required, 
                it's often stated as mandatory in tender requirements. Check each tender carefully as 
                requirements vary by department and contract type.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does ISO 27001 certification cost in the UK?</h3>
              <p>
                ISO 27001 costs range from £5,000-£15,000 for small businesses, £15,000-£40,000 for 
                medium companies, and £35,000-£75,000+ for large organisations in Year 1. This includes 
                consultancy, certification, tools, and training. Annual surveillance audits add 
                £1,500-£10,000 depending on size.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does ISO 27001 take?</h3>
              <p>
                Typically 6-12 months, with 9 months being common for first-time certification. The 
                timeline includes gap analysis (1-2 months), ISMS development (3-5 months), implementation 
                (2-3 months), and certification audits (1-2 months). Having other ISO standards reduces 
                this by 2-3 months.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What's the difference between ISO 27001:2013 and 2022?</h3>
              <p>
                ISO 27001:2022 restructured controls from 114 in 14 domains to 93 in 4 themes, added 
                cloud security and threat intelligence requirements, and better aligns with modern cyber 
                threats. The transition period ended October 2025 - all new certifications must be to 
                2022 standard.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Does ISO 27001 replace Cyber Essentials?</h3>
              <p>
                No. The UK Cabinet Office explicitly requires both for many contracts. ISO 27001 is 
                comprehensive information security management while Cyber Essentials covers five basic 
                technical controls. NHS and government contracts often mandate both certifications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can we self-implement ISO 27001 without consultants?</h3>
              <p>
                Technically yes, but practically challenging. Most organisations use consultants due to 
                the standard's complexity, need for specialist knowledge, and time constraints. 
                Self-implementation typically takes 50% longer and risks failing the certification audit. 
                Budget for at least some consultancy support.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mt-12">
            <h2 className="text-2xl font-bold mb-4">Check ISO 27001 Requirements in Your Tenders</h2>
            <p className="mb-6">
              Our platform automatically identifies when tenders require ISO 27001, Cyber Essentials, 
              or both. Get alerts for certification requirements and understand exactly what buyers 
              need before you bid.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
            >
              Try RFP Platform Quest Free →
            </Link>
          </div>

          {/* Internal Links */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certifications/" className="text-blue-600 hover:underline">
                  UK procurement certifications complete guide
                </Link>
              </li>
              <li>
                <Link href="/certifications/cyber-essentials-uk-tenders" className="text-blue-600 hover:underline">
                  Cyber Essentials for UK government contracts
                </Link>
              </li>
              <li>
                <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline">
                  ISO 9001 quality management for tenders
                </Link>
              </li>
              <li>
                <Link href="/certifications/dsp-toolkit-nhs-tenders" className="text-blue-600 hover:underline">
                  DSP Toolkit for NHS suppliers
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  RFP Platform Quest - UK RFP intelligence platform
                </Link>
              </li>
            </ul>
          </nav>

          {/* External Links */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Official Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.iso.org/standard/82875.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  ISO 27001:2022 official standard page
                </a>
              </li>
              <li>
                <a
                  href="https://www.ukas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  UKAS - Find accredited certification bodies
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncsc.gov.uk/collection/iso27001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  NCSC guidance on ISO 27001
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/government/publications/procurement-policy-note-0914-cyber-essentials-scheme-certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  GOV.UK PPN 014 - Cyber security requirements
                </a>
              </li>
            </ul>
          </div>
        </section>
      </article>
    </>
  )
}