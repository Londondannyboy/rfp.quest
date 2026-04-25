import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'DSP Toolkit NHS Tenders: Data Security & Protection Guide 2026',
  description: 'DSP Toolkit is mandatory for all NHS digital suppliers. Learn about standards compliance, costs, evidence requirements and how to achieve "Standards Met" status for NHS contracts.',
  keywords: 'DSP Toolkit NHS, Data Security Protection Toolkit, NHS DSP Toolkit requirements, DSPT compliance, NHS data security standards',
  openGraph: {
    title: 'DSP Toolkit for NHS Contracts: Complete Compliance Guide',
    description: 'DSP Toolkit is mandatory for all NHS digital suppliers. Learn requirements, costs, and how to achieve Standards Met status.',
    url: 'https://rfp.quest/certifications/dsp-toolkit-nhs-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/dsp-toolkit-nhs-tenders',
  },
}

export default function DSPToolkitNHSTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DSP Toolkit for NHS Contracts: Complete Compliance Guide',
    description: 'DSP Toolkit is mandatory for all NHS digital suppliers. Learn requirements, costs, and how to achieve Standards Met status.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/dsp-toolkit-nhs-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the DSP Toolkit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Data Security and Protection Toolkit (DSP Toolkit or DSPT) is an online self-assessment tool that all organisations processing NHS patient data must complete annually. It demonstrates compliance with data security standards, GDPR, and the National Data Guardian\'s 10 data security standards. Achieving "Standards Met" status is mandatory for NHS contracts involving patient data or NHS systems access.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is DSP Toolkit mandatory for NHS suppliers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, DSP Toolkit completion is mandatory for all organisations that process NHS patient information or have access to NHS systems. This includes GP practices, hospitals, digital health suppliers, IT service providers, and any third-party processors. NHS Standard Contract mandates annual DSPT submission with "Standards Met" or "Standards Exceeded" status. Without valid DSPT status, you cannot bid for or deliver NHS contracts.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does DSP Toolkit cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The DSP Toolkit itself is free to use. However, achieving compliance typically costs: Consultant support £2,000-£10,000 depending on organisation size and gaps. ISO 27001 certification (often required) £5,000-£25,000. Cyber Essentials Plus £1,695-£3,495. Staff training £500-£2,000. Technical improvements £1,000-£20,000. Total first-year costs typically £10,000-£50,000 for full compliance.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does DSP Toolkit take to complete?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DSP Toolkit timeline varies by organisation readiness: First submission typically 3-6 months including evidence gathering, policy development, technical improvements, and assessment completion. Annual renewal 4-8 weeks if maintaining good practices. Fast-track possible in 4-6 weeks with consultant support and existing ISO 27001. The deadline is June 30th each year, with submissions opening April 1st.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between Standards Met and Standards Exceeded?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standards Met means meeting all mandatory requirements across the 10 NDG standards with evidence. This is the minimum for NHS contracts. Standards Exceeded requires meeting all mandatory requirements plus implementing advanced measures like ISO 27001 certification, comprehensive BCM, advanced threat protection, and proactive security culture. Standards Exceeded provides competitive advantage in NHS tenders and is increasingly preferred for high-risk data processing.'
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
          <h1 className="text-4xl font-bold mb-6 text-slate-100">
            DSP Toolkit for NHS Contracts: Complete Compliance Guide
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-lg font-semibold text-blue-900 mb-2">
              🏥 Mandatory for All NHS Digital Suppliers
            </p>
            <p className="text-blue-800">
              The DSP Toolkit is required for any organisation handling NHS data. With annual submission by June 30th and increasing scrutiny following cyber attacks, achieving "Standards Met" status is essential for NHS contracts worth £billions.
            </p>
          </div>

          <div className="bg-slate-800/50 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-slate-400">
              [Image: dsp-toolkit-nhs-compliance.jpg - DSP Toolkit dashboard showing Standards Met status for NHS suppliers]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            The Data Security and Protection Toolkit (DSPT) replaced the Information Governance Toolkit in 2018, becoming the cornerstone of NHS data security assurance. Following high-profile NHS cyber attacks including WannaCry, the toolkit ensures all organisations handling NHS data meet robust security standards protecting patient information and critical systems.
          </p>

          <p>
            Managed by NHS Digital (now NHS England), the DSP Toolkit operationalises the National Data Guardian's 10 data security standards and demonstrates compliance with data protection legislation, NHS contractual requirements, and cyber security best practices. For suppliers, it's not optional - it's your license to operate in the NHS ecosystem.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Who Must Complete DSP Toolkit?</h2>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Healthcare Providers</h3>
            <ul className="space-y-2">
              <li>• GP practices and primary care networks</li>
              <li>• NHS trusts and foundation trusts</li>
              <li>• Community pharmacies</li>
              <li>• Dentists and opticians</li>
              <li>• Private hospitals treating NHS patients</li>
              <li>• Social care providers with NHS contracts</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Digital Health Suppliers</h3>
            <ul className="space-y-2">
              <li>• Clinical system vendors (EPR, PAS, LIMS)</li>
              <li>• Digital health app developers</li>
              <li>• Telehealth and remote monitoring providers</li>
              <li>• AI and diagnostic tool suppliers</li>
              <li>• NHS App integrators</li>
              <li>• Medical device software manufacturers</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Support Services</h3>
            <ul className="space-y-2">
              <li>• IT service providers and MSPs</li>
              <li>• Cloud hosting providers for NHS data</li>
              <li>• Document management and scanning services</li>
              <li>• Transcription and coding services</li>
              <li>• Business intelligence and analytics providers</li>
              <li>• Any third-party data processor</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">The 10 National Data Guardian Standards</h2>
          
          <p>
            The DSP Toolkit assesses compliance across these fundamental standards:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Personal Confidential Data</h3>
              <p className="text-sm">Staff understand responsibilities through annual training</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Staff Responsibilities</h3>
              <p className="text-sm">Staff understand and follow procedures</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Training</h3>
              <p className="text-sm">All staff complete appropriate annual training</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">4. Managing Access</h3>
              <p className="text-sm">Personal data is only accessible to authorised staff</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">5. Process Reviews</h3>
              <p className="text-sm">Processes are reviewed against standards</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">6. Responding to Incidents</h3>
              <p className="text-sm">Systems to respond to data incidents</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">7. Continuity Planning</h3>
              <p className="text-sm">Ensure availability of data and systems</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">8. Unsupported Systems</h3>
              <p className="text-sm">No unsupported systems in use</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">9. IT Protection</h3>
              <p className="text-sm">Cyber attack protection deployed</p>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">10. Accountable Suppliers</h3>
              <p className="text-sm">Suppliers are held accountable</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">DSP Toolkit Assessment Levels</h2>
          
          <p>
            Different organisation types have different requirements:
          </p>

          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Organisation Type</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Assertions</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Key Requirements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">GP Practice</td>
                <td className="border-slate-500/50 px-4 py-2">~40</td>
                <td className="border-slate-500/50 px-4 py-2">Clinical safety, access controls</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">NHS Trust</td>
                <td className="border-slate-500/50 px-4 py-2">~100</td>
                <td className="border-slate-500/50 px-4 py-2">Full compliance, board oversight</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Digital Supplier</td>
                <td className="border-slate-500/50 px-4 py-2">~110</td>
                <td className="border-slate-500/50 px-4 py-2">ISO 27001, pen testing, BCM</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Community Pharmacy</td>
                <td className="border-slate-500/50 px-4 py-2">~35</td>
                <td className="border-slate-500/50 px-4 py-2">Basic security, training</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Social Care</td>
                <td className="border-slate-500/50 px-4 py-2">~40</td>
                <td className="border-slate-500/50 px-4 py-2">Safeguarding, access controls</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Key Evidence Requirements</h2>
          
          <p>
            Common evidence required across all organisation types:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Policies & Procedures</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Data Protection/GDPR policy</li>
                <li>• Information Security policy</li>
                <li>• Incident Management procedure</li>
                <li>• Business Continuity plan</li>
                <li>• Access Control policy</li>
                <li>• Records Management policy</li>
                <li>• Subject Access Request procedure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Technical Evidence</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Network diagram and asset register</li>
                <li>• Penetration test reports (annual)</li>
                <li>• Vulnerability scan results</li>
                <li>• Patch management evidence</li>
                <li>• Anti-malware deployment</li>
                <li>• Backup and recovery testing</li>
                <li>• Audit logs and monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Compliance Documentation</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Data Protection Officer details</li>
                <li>• ICO registration</li>
                <li>• Data flow mapping</li>
                <li>• Privacy Impact Assessments</li>
                <li>• Third-party contracts with DSP clauses</li>
                <li>• Training completion records (95% minimum)</li>
                <li>• Board/senior meeting minutes</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">DSP Toolkit Timeline & Process</h2>
          
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Annual Cycle</h3>
            <ul className="space-y-2 text-slate-300">
              <li><strong>April 1st:</strong> New toolkit version opens</li>
              <li><strong>April-May:</strong> Complete baseline assessment</li>
              <li><strong>May-June:</strong> Implement improvements</li>
              <li><strong>June 30th:</strong> Submission deadline</li>
              <li><strong>July onwards:</strong> Maintain compliance</li>
              <li><strong>Year-round:</strong> Spot checks possible</li>
            </ul>
          </div>

          <div className="bg-amber-900/20 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Critical Deadline: June 30th
            </p>
            <p className="text-amber-800">
              Missing the June 30th deadline means non-compliance with NHS contracts. CCGs and NHS England can suspend contracts, withhold payments, or terminate agreements. Start your submission by May 1st to allow time for improvements and evidence gathering.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Achieving Standards Met vs Standards Exceeded</h2>
          
          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Aspect</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Standards Met</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Standards Exceeded</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Requirements</td>
                <td className="border-slate-500/50 px-4 py-2">All mandatory assertions</td>
                <td className="border-slate-500/50 px-4 py-2">Mandatory + excellence criteria</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">ISO 27001</td>
                <td className="border-slate-500/50 px-4 py-2">Not required</td>
                <td className="border-slate-500/50 px-4 py-2">Required</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Cyber Essentials</td>
                <td className="border-slate-500/50 px-4 py-2">Basic recommended</td>
                <td className="border-slate-500/50 px-4 py-2">CE Plus required</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Testing</td>
                <td className="border-slate-500/50 px-4 py-2">Annual pen test</td>
                <td className="border-slate-500/50 px-4 py-2">Continuous testing</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Training</td>
                <td className="border-slate-500/50 px-4 py-2">95% completion</td>
                <td className="border-slate-500/50 px-4 py-2">100% + role-specific</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Audit</td>
                <td className="border-slate-500/50 px-4 py-2">Self-assessment</td>
                <td className="border-slate-500/50 px-4 py-2">Independent audit</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common DSP Toolkit Challenges</h2>
          
          <div className="bg-red-900/20 border-l-4 border-red-400 p-6 my-8">
            <p className="font-semibold text-red-900 mb-2">
              🚫 Top Reasons for Failure
            </p>
            <ul className="space-y-2 text-red-800">
              <li>• Training completion below 95% threshold</li>
              <li>• No current penetration test (within 12 months)</li>
              <li>• Unsupported systems still in use (Windows 7, Server 2008)</li>
              <li>• Missing Business Continuity Plan or untested</li>
              <li>• No Data Protection Officer appointed</li>
              <li>• Third-party suppliers without DSP compliance</li>
              <li>• Incomplete privacy notices and consent processes</li>
              <li>• No evidence of board-level oversight</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">DSP Toolkit Costs</h2>
          
          <p>
            While the toolkit is free, achieving compliance requires investment:
          </p>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Typical First-Year Costs</h3>
            <table className="min-w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">DSP Consultant support</td>
                  <td className="py-2 text-right">£2,000 - £10,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">ISO 27001 (if needed)</td>
                  <td className="py-2 text-right">£5,000 - £25,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cyber Essentials Plus</td>
                  <td className="py-2 text-right">£1,695 - £3,495</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Penetration testing</td>
                  <td className="py-2 text-right">£2,000 - £10,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Staff training platform</td>
                  <td className="py-2 text-right">£500 - £2,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Technical improvements</td>
                  <td className="py-2 text-right">£1,000 - £20,000</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2">Total typical range</td>
                  <td className="py-2 text-right">£12,000 - £70,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Integration with Other Standards</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">ISO 27001 Alignment</h3>
            <p>
              ISO 27001 certification significantly simplifies DSP Toolkit compliance. Many assertions map directly to ISO 27001 controls. If you have ISO 27001, you'll automatically meet approximately 40% of DSP requirements. Consider pursuing ISO 27001 if you're a digital supplier - it's increasingly expected for "Standards Exceeded" status.
            </p>
            <p className="mt-2">
              <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline">
                Learn about ISO 27001 requirements →
              </Link>
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Cyber Essentials Integration</h3>
            <p>
              Cyber Essentials Plus is increasingly required for NHS IT suppliers. It demonstrates technical cyber security controls are in place and tested. CE Plus evidence directly supports multiple DSP Toolkit assertions around IT protection, patching, and access control.
            </p>
            <p className="mt-2">
              <Link href="/certifications/cyber-essentials-plus-uk-tenders" className="text-blue-600 hover:underline">
                Learn about Cyber Essentials Plus →
              </Link>
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Tips for DSP Toolkit Success</h2>
          
          <ol className="space-y-3">
            <li><strong>1. Start early:</strong> Begin in April when the new version releases</li>
            <li><strong>2. Appoint a lead:</strong> Designate a DSP coordinator with authority</li>
            <li><strong>3. Gap analysis first:</strong> Complete baseline assessment to identify gaps</li>
            <li><strong>4. Prioritise training:</strong> Get to 95% completion by May</li>
            <li><strong>5. Book pen testing:</strong> Schedule for April/May - providers get busy</li>
            <li><strong>6. Check suppliers:</strong> Ensure all have valid DSP status</li>
            <li><strong>7. Document everything:</strong> Keep evidence organised and dated</li>
            <li><strong>8. Use NHS resources:</strong> Free guides and templates available</li>
            <li><strong>9. Consider consultancy:</strong> Expert help saves time and ensures compliance</li>
            <li><strong>10. Plan for next year:</strong> DSP is annual - build it into BAU</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the DSP Toolkit?</h3>
              <p>
                The Data Security and Protection Toolkit (DSP Toolkit or DSPT) is an online self-assessment tool that all organisations processing NHS patient data must complete annually. It demonstrates compliance with data security standards, GDPR, and the National Data Guardian's 10 data security standards. Achieving "Standards Met" status is mandatory for NHS contracts involving patient data or NHS systems access.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is DSP Toolkit mandatory for NHS suppliers?</h3>
              <p>
                Yes, DSP Toolkit completion is mandatory for all organisations that process NHS patient information or have access to NHS systems. This includes GP practices, hospitals, digital health suppliers, IT service providers, and any third-party processors. NHS Standard Contract mandates annual DSPT submission with "Standards Met" or "Standards Exceeded" status. Without valid DSPT status, you cannot bid for or deliver NHS contracts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does DSP Toolkit cost?</h3>
              <p>
                The DSP Toolkit itself is free to use. However, achieving compliance typically costs: Consultant support £2,000-£10,000 depending on organisation size and gaps. ISO 27001 certification (often required) £5,000-£25,000. Cyber Essentials Plus £1,695-£3,495. Staff training £500-£2,000. Technical improvements £1,000-£20,000. Total first-year costs typically £10,000-£50,000 for full compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does DSP Toolkit take to complete?</h3>
              <p>
                DSP Toolkit timeline varies by organisation readiness: First submission typically 3-6 months including evidence gathering, policy development, technical improvements, and assessment completion. Annual renewal 4-8 weeks if maintaining good practices. Fast-track possible in 4-6 weeks with consultant support and existing ISO 27001. The deadline is June 30th each year, with submissions opening April 1st.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between Standards Met and Standards Exceeded?</h3>
              <p>
                Standards Met means meeting all mandatory requirements across the 10 NDG standards with evidence. This is the minimum for NHS contracts. Standards Exceeded requires meeting all mandatory requirements plus implementing advanced measures like ISO 27001 certification, comprehensive BCM, advanced threat protection, and proactive security culture. Standards Exceeded provides competitive advantage in NHS tenders and is increasingly preferred for high-risk data processing.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.dsptoolkit.nhs.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                DSP Toolkit Official Portal
              </a>
            </li>
            <li>
              <a href="https://www.nhsx.nhs.uk/information-governance/guidance/data-security-and-protection-toolkit-assessment-guides/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS DSP Toolkit Guides
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/data-security-and-protection-for-health-and-care" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                National Data Guardian Standards
              </a>
            </li>
            <li>
              <a href="https://digital.nhs.uk/cyber-and-data-security/guidance-and-assurance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS Digital Cyber Security
              </a>
            </li>
            <li>
              <a href="https://www.england.nhs.uk/publication/nhs-standard-contract/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS Standard Contract
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-slate-600/50">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 27001 Information Security
                </Link>
                <p className="text-sm text-slate-300 mt-1">Supports DSP compliance</p>
              </div>
              <div>
                <Link href="/certifications/cyber-essentials-plus-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Cyber Essentials Plus
                </Link>
                <p className="text-sm text-slate-300 mt-1">Technical security validation</p>
              </div>
              <div>
                <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 9001 Quality
                </Link>
                <p className="text-sm text-slate-300 mt-1">Clinical quality systems</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All UK Certifications
                </Link>
                <p className="text-sm text-slate-300 mt-1">Complete certification guide</p>
              </div>
            </div>
          </nav>
        </section>
      </article>
    </>
  )
}