import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AS9100 Aerospace UK Tenders: Quality Certification Guide 2026',
  description: 'AS9100 is the aerospace quality management standard required for UK aerospace supply chains. Supersedes ISO 9001 for aviation. Cost, timeline and requirements.',
  openGraph: {
    title: 'AS9100 Aerospace UK Tenders: Quality Certification Guide 2026',
    description: 'AS9100 is the aerospace quality management standard required for UK aerospace supply chains. Supersedes ISO 9001 for aviation. Cost, timeline and requirements.',
    type: 'article',
  },
}

export default function /as9100AerospaceTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"AS9100 for UK Aerospace Tenders: Quality Standard Guide 2026","description":"AS9100 is the aerospace quality management standard required for UK aerospace supply chains. Supersedes ISO 9001 for aviation. Cost, timeline and requirements.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T14:59:22.582Z","dateModified":"2026-03-20T14:59:22.582Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is AS9100 mandatory for all aerospace suppliers?","acceptedAnswer":{"@type":"Answer","text":"AS9100 is mandatory for manufacturing or assembling aircraft components, especially flight-critical items. Design organisations and special process suppliers also need it. Pure commercial off-the-shelf suppliers might not need AS9100, but it's increasingly expected. Check your customer's supplier requirements - most aerospace companies mandate AS9100."}},{"@type":"Question","name":"Can I use ISO 9001 instead of AS9100 for aerospace?","acceptedAnswer":{"@type":"Answer","text":"No, ISO 9001 cannot replace AS9100 for aerospace work. AS9100 includes all ISO 9001 requirements plus 100+ aerospace-specific additions. Aerospace companies explicitly require AS9100 and won't accept ISO 9001 alone. You also need AS9100 to appear in the OASIS supplier database."}},{"@type":"Question","name":"How much does AS9100 certification cost?","acceptedAnswer":{"@type":"Answer","text":"AS9100 typically costs £3,000-£8,000 for small companies, £8,000-£15,000 for medium, and £15,000-£30,000 for large companies in Year 1. Annual surveillance adds £2,000-£4,000. If you need NADCAP special process certifications, add £10,000-£25,000 per process."}},{"@type":"Question","name":"What's the difference between AS9100 and AS9120?","acceptedAnswer":{"@type":"Answer","text":"AS9100 is for manufacturers and maintainers who add value to products. AS9120 is for distributors and stockists who don't manufacture or alter products. If you machine, assemble, or modify parts, you need AS9100. If you only store and distribute, AS9120 is appropriate."}},{"@type":"Question","name":"Do I need NADCAP if I have AS9100?","acceptedAnswer":{"@type":"Answer","text":"AS9100 is the quality system foundation, but NADCAP may be required for special processes like heat treatment, plating, welding, or NDT. Check your customer requirements - most aerospace primes require both AS9100 and relevant NADCAP certifications for special process suppliers. NADCAP is additional to, not instead of, AS9100."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AS9100 for UK Aerospace Tenders: Quality Standard Guide 2026
          </h1>
          <p className="text-xl text-slate-600">
            AS9100 is the aerospace quality management standard required for UK aerospace supply chains. Supersedes ISO 9001 for aviation. Cost, timeline and requirements.
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
                <span>AS9100 Rev D: aerospace-specific quality standard</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required by Airbus, BAE, Rolls-Royce, Boeing UK</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Includes all ISO 9001 plus aerospace additions</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for flight-critical components</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost: £3,000-£15,000 Year 1</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 6-12 months</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>OASIS database registration included</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>UKAS accreditation essential</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is AS9100 and who requires it?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">AS9100 is the international quality management standard specifically designed for the aerospace industry. Built upon ISO 9001, it adds over 100 additional requirements specific to aviation, space, and defense. The current version, AS9100 Rev D (aligned with ISO 9001:2015), is recognised globally as the benchmark for aerospace quality.</p>
          <p className="text-slate-700 leading-relaxed mb-4">In the UK aerospace sector, AS9100 is effectively mandatory for any company manufacturing, designing, or servicing aircraft components. Major aerospace companies including Airbus UK, BAE Systems, Rolls-Royce, Leonardo, GKN Aerospace, Boeing UK operations, Bombardier Belfast, and all Tier 1 aerospace suppliers require AS9100 from their supply chain.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The standard goes beyond general quality management to address aerospace-specific concerns: configuration management, risk management for flight safety, first article inspection requirements, prevention of counterfeit parts, control of critical items, foreign object debris (FOD) prevention, and special processes validation. Without AS9100, you cannot enter the aerospace supply chain, regardless of your technical capabilities or competitive pricing.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">AS9100 vs ISO 9001: understanding the differences</h2>
          <p className="text-slate-700 leading-relaxed mb-4">While AS9100 incorporates all ISO 9001 requirements, the aerospace additions make it significantly more demanding.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**What AS9100 adds to ISO 9001:**
Configuration Management: Strict control of product configuration throughout lifecycle. Risk Management: Formal risk assessment for product safety and reliability. Product Safety: Explicit requirements for safety-critical items. Counterfeit Prevention: Systems to detect and prevent counterfeit parts. Special Processes: Validation of processes like welding, plating, heat treatment. First Article Inspection (FAI): Detailed verification of first production items. Critical Items: Enhanced controls for flight-critical components.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Documentation requirements:**
AS9100 requires extensive documentation beyond ISO 9001: Production Part Approval Process (PPAP), Advanced Product Quality Planning (APQP), Failure Mode and Effects Analysis (FMEA), Control Plans for all products, Statistical Process Control (SPC) data, Measurement System Analysis (MSA).</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Why you can't use ISO 9001 for aerospace:**
Aerospace buyers explicitly require AS9100. ISO 9001 alone is never acceptable for aerospace manufacturing. The OASIS database (aerospace supplier register) only lists AS9100 certified companies. Insurance and liability requirements reference AS9100 compliance.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">OASIS database and aerospace supplier visibility</h2>
          <p className="text-slate-700 leading-relaxed mb-4">OASIS (Online Aerospace Supplier Information System) is the global database of AS9100 certified organisations. Registration is automatic with AS9100 certification and crucial for aerospace business development.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**How OASIS works:**
When you achieve AS9100, your certification body registers you in OASIS. Aerospace buyers search OASIS to find qualified suppliers. Your certification scope, locations, and special processes are listed. Buyers can verify your certification status in real-time. Database includes audit scores and certification history.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Why OASIS matters:**
Major aerospace companies only source from OASIS-listed suppliers. RFQs often require OASIS ID number. Buyers pre-screen suppliers using OASIS before tender invitations. Your OASIS profile is your aerospace credibility.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Maximising OASIS visibility:**
Ensure certification scope accurately reflects capabilities. List all special processes and approvals. Keep contact information current. Add customer approvals and flow-downs. Include any NADCAP special process certifications.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Without OASIS listing (via AS9100), you're invisible to aerospace procurement teams.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Special processes and NADCAP requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Many aerospace contracts require special process certifications beyond AS9100, particularly NADCAP accreditation.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**What is NADCAP:**
NADCAP (National Aerospace and Defense Contractors Accreditation Program) provides standardised special process certification. Managed by PRI (Performance Review Institute). Required by most aerospace primes for special processes.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Common NADCAP requirements:**
Heat Treating, Chemical Processing, Welding, Non-Destructive Testing (NDT), Surface Enhancement (shot peening, plating), Composites, Material Testing.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**AS9100 and NADCAP relationship:**
AS9100 is the quality system foundation. NADCAP validates specific technical processes. You need AS9100 first, then add NADCAP as required. Both certifications required for special process suppliers.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Cost implications:**
Each NADCAP process costs £10,000-£25,000 for initial certification. Annual audits required (£5,000-£15,000). Multiple processes multiply costs significantly. Budget £25,000-£75,000 annually for AS9100 plus NADCAP.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Special process suppliers should factor NADCAP costs when planning AS9100 implementation.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cost and timeline for AS9100 certification</h2>
          <p className="text-slate-700 leading-relaxed mb-4">AS9100 costs mirror ISO 9001 but with aerospace-specific additions that increase complexity and cost.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Certification costs (Year 1):**
- Small company (<25 employees): £3,000-£8,000
- Medium company (25-100): £8,000-£15,000
- Large company (100+): £15,000-£30,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Cost breakdown:**
- Gap analysis: £1,500-£3,000
- AS9100 documentation: £3,000-£6,000
- Consultant support: £800-£1,500/day (typically 15-30 days)
- Internal auditor training: £1,500-£2,500
- Stage 1 & 2 audit: £3,000-£8,000
- OASIS registration: Included
- Annual surveillance: £2,000-£4,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Implementation timeline:**
Months 1-2: Gap analysis and planning
Months 3-4: Quality manual and procedures
Months 5-6: Risk management and special processes
Months 7-8: Implementation and training
Months 9-10: Internal audits and management review
Months 11-12: Certification audit</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Critical success factors:**
Having ISO 9001 reduces timeline by 3-4 months. Aerospace experience in team accelerates implementation. Customer-specific requirements may add complexity. Allow extra time for special process validation.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.iaqg.org" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              IAQG (AS9100 Standard Owner)
            </a>
            <a href="https://www.iaqg.org/oasis/login" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              OASIS Database
            </a>
            <a href="https://www.pri-network.org" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              PRI (NADCAP)
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is AS9100 mandatory for all aerospace suppliers?</h3>
              <p className="text-slate-700 leading-relaxed">AS9100 is mandatory for manufacturing or assembling aircraft components, especially flight-critical items. Design organisations and special process suppliers also need it. Pure commercial off-the-shelf suppliers might not need AS9100, but it's increasingly expected. Check your customer's supplier requirements - most aerospace companies mandate AS9100.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use ISO 9001 instead of AS9100 for aerospace?</h3>
              <p className="text-slate-700 leading-relaxed">No, ISO 9001 cannot replace AS9100 for aerospace work. AS9100 includes all ISO 9001 requirements plus 100+ aerospace-specific additions. Aerospace companies explicitly require AS9100 and won't accept ISO 9001 alone. You also need AS9100 to appear in the OASIS supplier database.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does AS9100 certification cost?</h3>
              <p className="text-slate-700 leading-relaxed">AS9100 typically costs £3,000-£8,000 for small companies, £8,000-£15,000 for medium, and £15,000-£30,000 for large companies in Year 1. Annual surveillance adds £2,000-£4,000. If you need NADCAP special process certifications, add £10,000-£25,000 per process.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between AS9100 and AS9120?</h3>
              <p className="text-slate-700 leading-relaxed">AS9100 is for manufacturers and maintainers who add value to products. AS9120 is for distributors and stockists who don't manufacture or alter products. If you machine, assemble, or modify parts, you need AS9100. If you only store and distribute, AS9120 is appropriate.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Do I need NADCAP if I have AS9100?</h3>
              <p className="text-slate-700 leading-relaxed">AS9100 is the quality system foundation, but NADCAP may be required for special processes like heat treatment, plating, welding, or NDT. Check your customer requirements - most aerospace primes require both AS9100 and relevant NADCAP certifications for special process suppliers. NADCAP is additional to, not instead of, AS9100.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/joscar-defence-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Joscar Defence Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-9001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 9001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-14001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 14001 Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With AS9100?
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
