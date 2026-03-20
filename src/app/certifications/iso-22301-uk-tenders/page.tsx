import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ISO 22301 UK Tenders: Business Continuity Cert Guide 2026',
  description: 'ISO 22301 business continuity is required for critical services, NHS, emergency and utilities tenders in the UK. Cost from £3,000. Requirements guide 2026.',
  openGraph: {
    title: 'ISO 22301 UK Tenders: Business Continuity Cert Guide 2026',
    description: 'ISO 22301 business continuity is required for critical services, NHS, emergency and utilities tenders in the UK. Cost from £3,000. Requirements guide 2026.',
    type: 'article',
  },
}

export default function /iso22301UkTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"ISO 22301 for UK Tenders: Business Continuity Certification Guide","description":"ISO 22301 business continuity is required for critical services, NHS, emergency and utilities tenders in the UK. Cost from £3,000. Requirements guide 2026.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T12:03:17.855Z","dateModified":"2026-03-20T12:03:17.855Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is ISO 22301 mandatory for NHS contracts?","acceptedAnswer":{"@type":"Answer","text":"ISO 22301 is mandatory for many NHS critical service contracts including IT services, patient transport, and medical supplies. It's strongly advantageous for all NHS suppliers as business continuity is weighted highly in tender evaluations, especially post-COVID. Check specific tender requirements as mandates vary by service criticality."}},{"@type":"Question","name":"How much does ISO 22301 certification cost?","acceptedAnswer":{"@type":"Answer","text":"ISO 22301 certification costs £3,000-£6,000 for small organisations, £6,000-£10,000 for medium, and £10,000-£20,000 for large organisations in Year 1. This includes gap analysis, consultancy, training, and audit fees. Annual surveillance audits cost £1,000-£2,000. Costs are lower if you already have other ISO standards."}},{"@type":"Question","name":"Can I implement ISO 22301 and ISO 27001 together?","acceptedAnswer":{"@type":"Answer","text":"Yes, implementing ISO 22301 and ISO 27001 together is highly recommended. Approximately 60% of requirements overlap, making combined implementation efficient. Many NHS and government contracts require both. Use an Integrated Management System approach to minimize duplication and reduce costs by about 30% versus separate implementation."}},{"@type":"Question","name":"How long does ISO 22301 take to implement?","acceptedAnswer":{"@type":"Answer","text":"ISO 22301 typically takes 4-8 months from start to certification. This includes Business Impact Analysis (1-2 months), plan development (1-2 months), testing (1 month), and audits (2 months). Organisations with existing ISO standards can achieve it faster (3-6 months) by building on existing management systems."}},{"@type":"Question","name":"What's the difference between ISO 22301 and a basic business continuity plan?","acceptedAnswer":{"@type":"Answer","text":"ISO 22301 is a comprehensive management system requiring ongoing improvement, regular testing, and independent certification. A basic plan might sit on a shelf; ISO 22301 requires active management, regular exercises, management reviews, and annual audits. Tender evaluators recognize this distinction - certification proves your continuity capability is actively maintained, not just documented."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ISO 22301 for UK Tenders: Business Continuity Certification Guide
          </h1>
          <p className="text-xl text-slate-600">
            ISO 22301 business continuity is required for critical services, NHS, emergency and utilities tenders in the UK. Cost from £3,000. Requirements guide 2026.
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Facts</h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>ISO 22301: Business Continuity Management Systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required for critical national infrastructure</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for many NHS and emergency services contracts</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Increasingly required for data centres and cloud services</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost: £3,000-£12,000 Year 1</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 4-8 months to certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Often paired with ISO 27001 for resilience</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>NCSC recommends for critical sectors</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is ISO 22301 and when is it required?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">ISO 22301 is the international standard for Business Continuity Management Systems (BCMS). It provides a framework for organisations to plan, establish, implement, operate, monitor, review, maintain and continually improve a documented management system to protect against, reduce the likelihood of, and ensure recovery from disruptive incidents.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The standard is increasingly mandated in UK public sector procurement, particularly for services where interruption could cause significant harm to citizens, the economy, or national security. This includes contracts for critical national infrastructure (energy, water, transport, telecommunications), NHS services (especially urgent care, patient records, medical supplies), emergency services support, financial services, and data centres/cloud services.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Unlike general quality standards, ISO 22301 specifically addresses an organisation's ability to continue delivering products and services at acceptable predefined levels following disruptive incidents. This could range from cyber attacks and natural disasters to pandemic responses and supply chain failures. For buyers, ISO 22301 certification provides assurance that suppliers have robust plans to maintain service delivery during crises.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">ISO 22301 requirements for UK government contracts</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Government procurement of critical services increasingly specifies ISO 22301 as either mandatory or highly advantageous. Here's where you'll encounter requirements:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS and Healthcare:**
ISO 22301 is commonly required for NHS IT services, patient transport, medical equipment maintenance, pharmaceutical distribution, and facilities management. The NHS expects suppliers to demonstrate they can maintain services during major incidents, whether cyber attacks, severe weather, or infrastructure failures.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Central Government:**
Crown Commercial Service frameworks for mission-critical services often mandate ISO 22301. This includes IT disaster recovery, contact centre services, critical telecommunications, and security services. The Cabinet Office's resilience standards specifically reference ISO 22301 as best practice.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Local Government:**
Local authorities require ISO 22301 for emergency planning support, social care provision, waste management (statutory service), and housing management systems. Following COVID-19, resilience requirements have significantly increased.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Utilities and Infrastructure:**
Water companies, energy providers, and transport operators require ISO 22301 from critical suppliers. This reflects their own regulatory obligations under the Civil Contingencies Act and sector-specific resilience requirements from regulators like Ofgem and Ofwat.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">ISO 22301 and ISO 27001: complementary standards</h2>
          <p className="text-slate-700 leading-relaxed mb-4">ISO 22301 (business continuity) and ISO 27001 (information security) are increasingly required together, particularly for digital and data-heavy contracts. Understanding how they complement each other is crucial for tender success.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Where they overlap:**
Both standards require risk assessment and treatment, incident management procedures, management review processes, and continual improvement. If you have one, implementing the other is significantly easier as you can build on existing management systems.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Key differences:**
ISO 27001 focuses on protecting information assets through confidentiality, integrity, and availability controls. ISO 22301 focuses on maintaining critical business functions during and after disruptions. While 27001 might prevent a cyber attack, 22301 ensures you can still operate if one succeeds.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Combined requirements:**
NHS digital services, G-Cloud suppliers, financial services, and critical infrastructure contracts often require both certifications. Having both demonstrates comprehensive resilience - you can prevent incidents (27001) and recover from them (22301).</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Implementation synergies:**
Many organisations implement both standards simultaneously, using an Integrated Management System (IMS) approach. This reduces duplication, audit costs, and management overhead. Approximately 60% of the requirements overlap, making combined implementation efficient.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cost and timeline for ISO 22301 certification</h2>
          <p className="text-slate-700 leading-relaxed mb-4">ISO 22301 implementation costs and timelines vary based on organisation size and existing resilience maturity. Here's what to expect:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Certification Costs (Year 1):**
- Small organisations (<50 staff): £3,000-£6,000
- Medium organisations (50-250): £6,000-£10,000
- Large organisations (250+): £10,000-£20,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Breakdown of Costs:**
- Gap analysis: £1,000-£2,000
- Consultancy support: £600-£1,200/day (typically 5-15 days needed)
- Training (lead implementer): £1,500-£2,500
- Internal audit: £800-£1,500
- Certification audit: £2,000-£4,000 (Stage 1 + Stage 2)
- Annual surveillance: £1,000-£2,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Implementation Timeline:**
- Month 1: Gap analysis and planning
- Month 2-3: Business Impact Analysis (BIA) and risk assessment
- Month 3-4: Strategy and plan development
- Month 4-5: Testing and exercising
- Month 5-6: Internal audit and management review
- Month 6-7: Stage 1 audit (documentation review)
- Month 7-8: Stage 2 audit (implementation audit)</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Critical Success Factors:**
The timeline assumes dedicated resources and management commitment. Organisations with existing ISO standards (9001, 14001, 27001) can typically achieve certification 30% faster due to familiar processes.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Impact Analysis: the heart of ISO 22301</h2>
          <p className="text-slate-700 leading-relaxed mb-4">The Business Impact Analysis (BIA) is the cornerstone of ISO 22301 and often the most challenging element for organisations. It determines which activities are critical and must be recovered first after a disruption.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**What the BIA identifies:**
- Critical activities that must continue or be quickly resumed
- Maximum tolerable period of disruption (MTPD) for each activity
- Recovery time objectives (RTO) and recovery point objectives (RPO)
- Resources needed for recovery (people, premises, technology, information)
- Internal and external dependencies
- Impacts of disruption over time (financial, reputational, regulatory, contractual)</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Why tender evaluators focus on the BIA:**
Your BIA demonstrates understanding of what matters most to service delivery. For public sector contracts, evaluators want evidence that you've identified and can protect the services they're buying. A robust BIA shows you understand their critical requirements and have planned accordingly.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Common BIA mistakes to avoid:**
- Making everything "critical" (shows lack of genuine analysis)
- Ignoring supply chain dependencies
- Unrealistic recovery timeframes
- Not aligning with customer requirements
- Failing to test assumptions through exercises</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.iso.org/standard/75106.html" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              ISO 22301 Standard Information
            </a>
            <a href="https://www.gov.uk/government/organisations/cabinet-office" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Cabinet Office Resilience Standards
            </a>
            <a href="https://www.thebci.org" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Business Continuity Institute
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is ISO 22301 mandatory for NHS contracts?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 22301 is mandatory for many NHS critical service contracts including IT services, patient transport, and medical supplies. It's strongly advantageous for all NHS suppliers as business continuity is weighted highly in tender evaluations, especially post-COVID. Check specific tender requirements as mandates vary by service criticality.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does ISO 22301 certification cost?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 22301 certification costs £3,000-£6,000 for small organisations, £6,000-£10,000 for medium, and £10,000-£20,000 for large organisations in Year 1. This includes gap analysis, consultancy, training, and audit fees. Annual surveillance audits cost £1,000-£2,000. Costs are lower if you already have other ISO standards.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I implement ISO 22301 and ISO 27001 together?</h3>
              <p className="text-slate-700 leading-relaxed">Yes, implementing ISO 22301 and ISO 27001 together is highly recommended. Approximately 60% of requirements overlap, making combined implementation efficient. Many NHS and government contracts require both. Use an Integrated Management System approach to minimize duplication and reduce costs by about 30% versus separate implementation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How long does ISO 22301 take to implement?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 22301 typically takes 4-8 months from start to certification. This includes Business Impact Analysis (1-2 months), plan development (1-2 months), testing (1 month), and audits (2 months). Organisations with existing ISO standards can achieve it faster (3-6 months) by building on existing management systems.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between ISO 22301 and a basic business continuity plan?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 22301 is a comprehensive management system requiring ongoing improvement, regular testing, and independent certification. A basic plan might sit on a shelf; ISO 22301 requires active management, regular exercises, management reviews, and annual audits. Tender evaluators recognize this distinction - certification proves your continuity capability is actively maintained, not just documented.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/iso-27001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 27001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-9001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 9001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/cyber-essentials-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Cyber Essentials Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With ISO?
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Get expert guidance on certification requirements and tender preparation
          </p>
          <Link href="/contact" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            Get Expert Advice
          </Link>
        </div>
      </section>
    </div>
  )
}
