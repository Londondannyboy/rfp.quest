import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RISQS Rail Tenders UK: Supplier Qualification Guide 2026',
  description: 'RISQS is the mandatory entry point for UK rail industry tenders. Required by Network Rail, TfL and all major rail operators. Cost from £400. 2026 guide.',
  openGraph: {
    title: 'RISQS Rail Tenders UK: Supplier Qualification Guide 2026',
    description: 'RISQS is the mandatory entry point for UK rail industry tenders. Required by Network Rail, TfL and all major rail operators. Cost from £400. 2026 guide.',
    type: 'article',
  },
}

export default function /risqsRailTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"RISQS for UK Rail Tenders: Railway Supplier Qualification Guide","description":"RISQS is the mandatory entry point for UK rail industry tenders. Required by Network Rail, TfL and all major rail operators. Cost from £400. 2026 guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T12:03:17.785Z","dateModified":"2026-03-20T12:03:17.785Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is RISQS mandatory for all UK rail work?","acceptedAnswer":{"@type":"Answer","text":"Yes, RISQS is mandatory for virtually all UK rail work. Network Rail, TfL, HS2 and all train operators require it. Even small subcontractors need RISQS if their work could affect rail operations or safety. The only exceptions are pure consultancy or design work with no site presence."}},{"@type":"Question","name":"How much does RISQS cost per year?","acceptedAnswer":{"@type":"Answer","text":"RISQS registration costs from £400/year for micro companies up to £4,800/year for large enterprises. Audit costs (required for most work) add £1,500-£5,000 every 2-3 years. Total Year 1 costs typically range from £2,000-£8,000 depending on company size and work scope."}},{"@type":"Question","name":"Can I use CHAS instead of RISQS for rail work?","acceptedAnswer":{"@type":"Answer","text":"No, CHAS cannot replace RISQS for rail work. RISQS is the only accepted scheme for UK rail. While CHAS covers general health and safety, RISQS includes rail-specific requirements like track safety and PTS competency. You need both if you work across rail and construction sectors."}},{"@type":"Question","name":"How long does RISQS qualification take?","acceptedAnswer":{"@type":"Answer","text":"RISQS registration typically takes 2-3 weeks if you have documentation ready. If audit is required, add another 2-4 weeks for scheduling and completion. Total timeline: 4-6 weeks for full qualification. Fast-track options available for urgent contracts (additional 50% fee)."}},{"@type":"Question","name":"What happens if my RISQS expires?","acceptedAnswer":{"@type":"Answer","text":"If RISQS expires, you immediately lose the ability to tender for new rail contracts and may be suspended from current contracts. Buyers receive automatic notifications of expired suppliers. Renewal must be completed before expiry - there's no grace period. Set reminders 3 months before expiry date."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            RISQS for UK Rail Tenders: Railway Supplier Qualification Guide
          </h1>
          <p className="text-xl text-slate-600">
            RISQS is the mandatory entry point for UK rail industry tenders. Required by Network Rail, TfL and all major rail operators. Cost from £400. 2026 guide.
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
                <span>RISQS = Railway Industry Supplier Qualification Scheme</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Operated by RSSB (Rail Safety and Standards Board)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for Network Rail, TfL, HS2, all rail operators</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Covers H&S, quality, environmental, financial standing</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Two components: RISQS registration + RISQS Audit</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Registration from £400/year; Audit additional cost</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 4-6 weeks for full qualification</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>NOT the same as CHAS or SSIP - rail-specific</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is RISQS and who needs it?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">RISQS (Railway Industry Supplier Qualification Scheme) is the mandatory pre-qualification system for any company wanting to work in the UK rail industry. Operated by RSSB (Rail Safety and Standards Board), RISQS acts as the single entry point for suppliers to the entire UK rail sector.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The scheme was established to streamline supplier assessment across the rail industry. Instead of completing different pre-qualification questionnaires for each rail company, suppliers complete RISQS once and share their verified data with multiple buyers. This creates efficiency for both suppliers and rail infrastructure managers while ensuring consistent safety and quality standards.</p>
          <p className="text-slate-700 leading-relaxed mb-4">You need RISQS if you want to supply to: Network Rail (infrastructure owner), Transport for London (TfL/London Underground), HS2, CrossRail/Elizabeth Line, National Rail train operating companies (TOCs), freight operating companies (FOCs), rolling stock companies (ROSCOs), light rail and metro systems (Manchester Metrolink, Edinburgh Trams, etc.), or any principal contractors working on rail projects.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Without RISQS, you cannot tender for rail contracts, appear on approved supplier lists, or work on rail infrastructure - even as a subcontractor.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">RISQS registration vs RISQS audit: what's the difference?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">RISQS has two distinct components that often cause confusion. Understanding the difference is crucial for proper compliance and budgeting.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**RISQS Registration (Basic Qualification):**
This is the online questionnaire covering company information, financial data, insurances, health and safety policies, quality management, environmental policies, and competency/experience evidence. Registration alone allows you to be visible to buyers and tender for lower-risk work. Cost: from £400/year for small companies, scaling with turnover.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**RISQS Audit (Verified Qualification):**
This is an independent on-site audit to verify your management systems against rail industry standards. The audit is mandatory for higher-risk work including: all track-side work, signalling and telecoms, electrical work, work affecting train operations, principal contractor roles, and safety-critical activities. Audit costs vary by scope (typically £1,500-£5,000) and are additional to registration fees.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Many suppliers start with registration only, then add audit capability as they win contracts requiring it. However, for most infrastructure work, both registration AND audit are required from day one.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Which UK rail organisations require RISQS?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Virtually every organization in UK rail requires RISQS from their suppliers. Here's the comprehensive list:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Infrastructure Owners:**
- Network Rail (all routes and regions)
- HS2 Ltd
- London Underground/TfL
- Nexus (Tyne and Wear Metro)
- Strathclyde Partnership for Transport</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Train Operating Companies (all require RISQS):**
Avanti West Coast, CrossCountry, East Midlands Railway, Great Western Railway, LNER, Northern, ScotRail, Southeastern, Southern, South Western Railway, TransPennine Express, Transport for Wales, West Midlands Railway, and all others.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Freight Operators:**
DB Cargo UK, Freightliner, GB Railfreight, Direct Rail Services, Colas Rail</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Rolling Stock Companies:**
Angel Trains, Eversholt Rail, Porterbrook, Rock Rail</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Major Principal Contractors:**
All Tier 1 contractors working on rail projects require their subcontractors to have RISQS, including: Balfour Beatty Rail, Babcock Rail, Colas Rail, VolkerRail, Alstom, Siemens Mobility, and Network Rail's own commercial projects division.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">RISQS cost UK 2026</h2>
          <p className="text-slate-700 leading-relaxed mb-4">RISQS costs vary based on company size, scope of work, and audit requirements. Here's the detailed breakdown for 2026:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Registration Fees (Annual):**
- Micro (turnover <£500k): £400 + VAT
- Small (£500k-£2m): £650 + VAT
- Medium (£2m-£10m): £1,200 + VAT
- Large (£10m-£50m): £2,400 + VAT
- Enterprise (>£50m): £4,800 + VAT</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Audit Costs (Every 2-3 years):**
- Basic audit (single discipline): £1,500-£2,500
- Multi-discipline audit: £2,500-£5,000
- Complex/multi-site audit: £5,000-£10,000
- Surveillance visits (between audits): £800-£1,500</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Additional Costs:**
- Sentinel card sponsor status: £350/year
- Additional product/service codes: £100 each
- Fast-track processing: +50% fee
- Consultant support: £500-£1,500/day</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Total Year 1 Investment:**
Small company, basic scope: £2,000-£3,500
Medium company, multiple disciplines: £4,000-£8,000
Large company, complex operations: £8,000-£15,000</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">RISQS vs CHAS vs SSIP: different sectors, different schemes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">A common mistake is assuming CHAS or SSIP membership covers rail work. It doesn't. Here's why:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**RISQS (Rail-specific):**
Mandatory for all rail sector work. Includes rail-specific requirements like track safety, PTS competency, rail-specific method statements, Rule Book compliance, and fatigue management standards. Not recognised outside rail sector.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**CHAS (Multi-sector H&S):**
General health and safety scheme used mainly in construction, facilities management, and local authorities. While CHAS covers general H&S, it doesn't address rail-specific requirements. Rail companies will not accept CHAS as an alternative to RISQS.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**SSIP (Safety Schemes in Procurement):**
Umbrella organisation for H&S schemes with mutual recognition between members. RISQS is NOT part of SSIP. While SSIP schemes (CHAS, SafeContractor, etc.) recognise each other, none are accepted for rail work.</p>
          <p className="text-slate-700 leading-relaxed mb-4">If you work across rail and construction, you need both RISQS (for rail) and CHAS/SSIP scheme (for construction). The assessments don't overlap, though having one can help prepare for the other as both require similar management systems.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">RISQS and HS2: special requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">HS2 has additional requirements beyond standard RISQS that suppliers must understand:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**HS2-Specific Requirements:**
While RISQS registration is the baseline, HS2 adds its own pre-qualification through the HS2 Supplier Information Management System (SIMS). You need both RISQS AND separate HS2 approval. HS2 also requires enhanced vetting including: higher insurance levels (typically £10m+), specific HS2 induction training, commitment to HS2's EDI and Skills agenda, and carbon management planning.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Innovation and Social Value:**
HS2 places unusual emphasis on innovation and social value in supplier selection. Your RISQS profile should highlight: apprenticeship programmes, local employment initiatives, carbon reduction innovations, and diversity/inclusion policies. These factors can be weighted up to 20% in HS2 tender evaluations.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Security Clearance:**
Many HS2 contracts require Baseline Personnel Security Standard (BPSS) or higher clearance for staff. This isn't part of RISQS but must be arranged separately through your HR processes. Allow 2-4 weeks for BPSS clearance.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.risqs.org" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              RISQS Official Website
            </a>
            <a href="https://www.rssb.co.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              RSSB (Scheme Operator)
            </a>
            <a href="https://www.networkrail.co.uk/suppliers" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Network Rail Supplier Information
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is RISQS mandatory for all UK rail work?</h3>
              <p className="text-slate-700 leading-relaxed">Yes, RISQS is mandatory for virtually all UK rail work. Network Rail, TfL, HS2 and all train operators require it. Even small subcontractors need RISQS if their work could affect rail operations or safety. The only exceptions are pure consultancy or design work with no site presence.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does RISQS cost per year?</h3>
              <p className="text-slate-700 leading-relaxed">RISQS registration costs from £400/year for micro companies up to £4,800/year for large enterprises. Audit costs (required for most work) add £1,500-£5,000 every 2-3 years. Total Year 1 costs typically range from £2,000-£8,000 depending on company size and work scope.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use CHAS instead of RISQS for rail work?</h3>
              <p className="text-slate-700 leading-relaxed">No, CHAS cannot replace RISQS for rail work. RISQS is the only accepted scheme for UK rail. While CHAS covers general health and safety, RISQS includes rail-specific requirements like track safety and PTS competency. You need both if you work across rail and construction sectors.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How long does RISQS qualification take?</h3>
              <p className="text-slate-700 leading-relaxed">RISQS registration typically takes 2-3 weeks if you have documentation ready. If audit is required, add another 2-4 weeks for scheduling and completion. Total timeline: 4-6 weeks for full qualification. Fast-track options available for urgent contracts (additional 50% fee).</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What happens if my RISQS expires?</h3>
              <p className="text-slate-700 leading-relaxed">If RISQS expires, you immediately lose the ability to tender for new rail contracts and may be suspended from current contracts. Buyers receive automatic notifications of expired suppliers. Renewal must be completed before expiry - there's no grace period. Set reminders 3 months before expiry date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/achilles-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Achilles Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-45001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 45001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-9001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 9001 Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With RISQS?
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
