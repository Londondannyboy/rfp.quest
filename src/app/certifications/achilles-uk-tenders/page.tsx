import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Achilles UK Tenders: UVDB, Link-Up & Supply-Line Guide 2026',
  description: 'Achilles is the pre-qualification scheme for UK utilities, rail and energy. UVDB for utilities, Link-Up for rail. Cost and requirements guide 2026.',
  openGraph: {
    title: 'Achilles UK Tenders: UVDB, Link-Up & Supply-Line Guide 2026',
    description: 'Achilles is the pre-qualification scheme for UK utilities, rail and energy. UVDB for utilities, Link-Up for rail. Cost and requirements guide 2026.',
    type: 'article',
  },
}

export default function /achillesUkTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"Achilles Accreditation for UK Tenders: UVDB, Link-Up and Supply-Line","description":"Achilles is the pre-qualification scheme for UK utilities, rail and energy. UVDB for utilities, Link-Up for rail. Cost and requirements guide 2026.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T14:59:22.580Z","dateModified":"2026-03-20T14:59:22.580Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need both Achilles and RISQS for rail work?","acceptedAnswer":{"@type":"Answer","text":"For UK rail, RISQS is mandatory and sufficient. Achilles Link-Up adds value if you work internationally or want broader visibility, but it doesn't replace RISQS for Network Rail contracts. Some suppliers maintain both to maximise opportunities, with data sharing reducing duplication."}},{"@type":"Question","name":"How much does Achilles UVDB cost per year?","acceptedAnswer":{"@type":"Answer","text":"Achilles UVDB costs £500-£2,500/year for registration depending on company size, plus £1,000-£5,000 for audits if required. Small utilities contractors typically pay £800-£1,500 annually. Additional costs include staff time (40-80 hours initially) and potential consultancy support."}},{"@type":"Question","name":"Which utilities require Achilles UVDB?","acceptedAnswer":{"@type":"Answer","text":"Major UK utilities requiring UVDB include National Grid, all gas distribution networks (Cadent, SGN, Wales & West), most water companies (Thames Water, Severn Trent, United Utilities), and electricity networks (UK Power Networks, Western Power). Without UVDB, you cannot tender for these companies' contracts."}},{"@type":"Question","name":"What's the difference between UVDB and UVDB Verify?","acceptedAnswer":{"@type":"Answer","text":"UVDB is the basic registration and self-assessment. UVDB Verify adds independent audit verification of your management systems. Basic UVDB suits low-risk supplies; Verify is required for operational work on gas networks, HV electrical, water treatment, or principal contractor roles. Verify costs an additional £2,000-£5,000."}},{"@type":"Question","name":"Can I use Achilles for construction tenders?","acceptedAnswer":{"@type":"Answer","text":"Achilles is specific to utilities, rail, and energy sectors - not general construction. For construction, you need CHAS, Constructionline, or other SSIP schemes. However, if you're doing construction work for utilities (e.g., laying gas pipes), you'll need both Achilles UVDB and construction accreditations."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Achilles Accreditation for UK Tenders: UVDB, Link-Up and Supply-Line
          </h1>
          <p className="text-xl text-slate-600">
            Achilles is the pre-qualification scheme for UK utilities, rail and energy. UVDB for utilities, Link-Up for rail. Cost and requirements guide 2026.
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
                <span>Achilles = global supplier qualification and risk management</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>UVDB for UK utilities (gas, water, electricity)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Link-Up for rail sector (works with RISQS)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Supply-Line for oil, gas, offshore</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost: £500-£2,500/year depending on audit level</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 4-6 weeks for assessment</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required by National Grid, Thames Water, Cadent</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Covers SHEQ + Corporate Social Responsibility</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is Achilles and which UK sectors use it?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Achilles is a global supplier qualification and risk management company that operates sector-specific pre-qualification communities. In the UK, Achilles manages critical supply chain qualification for utilities, rail, and energy sectors through distinct but interconnected platforms.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Unlike single-sector schemes like RISQS (rail-only) or JOSCAR (defence-only), Achilles operates multiple communities that share common assessment methodologies but have sector-specific requirements. This creates efficiency for suppliers working across multiple sectors while ensuring each industry's unique compliance needs are met.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The three main UK Achilles communities are UVDB (Utilities Vendor Database) for gas, water and electricity companies; Link-Up for rail infrastructure; and Supply-Line for oil, gas and offshore. Each community has its own buyer members, assessment criteria, and audit requirements, but they share core SHEQ (Safety, Health, Environment, Quality) elements.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">UVDB: the utilities sector qualification</h2>
          <p className="text-slate-700 leading-relaxed mb-4">UVDB (Utilities Vendor Database) is the mandatory pre-qualification system for UK utilities. Without UVDB, you cannot work for most UK gas, water, and electricity companies.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Who requires UVDB:**
National Grid, Cadent Gas, SGN (Scotia Gas Networks), Wales & West Utilities, Northern Gas Networks, Thames Water, Severn Trent Water, United Utilities, Anglian Water, Yorkshire Water, UK Power Networks, Western Power Distribution, Northern Powergrid, Scottish Power Energy Networks, SSE Networks.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**UVDB assessment covers:**
Health and Safety management, Environmental management, Quality management, Corporate Social Responsibility, Financial stability, Insurance verification, Competency and training records, Equipment and resource capability.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**UVDB Verify audit:**
Beyond basic registration, UVDB Verify provides independent on-site audit verification. Many utilities require Verify status for higher-risk work including gas network operations, HV electrical work, water treatment, and principal contractor roles. Verify audits occur every 1-3 years depending on risk level.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Link-Up: rail sector integration with RISQS</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Achilles Link-Up serves the rail sector but works differently from RISQS. While RISQS is mandatory for UK rail, Link-Up provides additional value through broader supply chain visibility and reduced assessment duplication for multi-national rail operators.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Link-Up vs RISQS:**
RISQS is UK-specific and mandatory for Network Rail. Link-Up is used by international rail companies and some UK operators for broader visibility. Many suppliers maintain both - RISQS for UK compliance, Link-Up for international opportunities. The systems can share data to reduce duplication.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Who uses Link-Up in UK rail:**
Some Train Operating Companies for non-infrastructure suppliers, International rolling stock companies, Cross-border operators (Eurostar, Eurotunnel), Rail consultancies working internationally, Companies supplying both UK and European rail markets.</p>
          <p className="text-slate-700 leading-relaxed mb-4">If you only work in UK rail, RISQS is sufficient. Link-Up becomes valuable when you work across borders or want visibility to international rail opportunities.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Supply-Line: oil, gas and offshore qualification</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Supply-Line is Achilles' community for oil, gas, and offshore industries. It's particularly strong in North Sea operations and UK offshore wind.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Who requires Supply-Line:**
Shell UK, BP, TotalEnergies, Equinor, CNR International, TAQA, Harbour Energy, Centrica, Major offshore wind developers, Offshore Energies UK members.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Supply-Line specific requirements:**
Beyond standard SHEQ, Supply-Line emphasises: offshore competency standards (OPITO, GWO), marine and helicopter operations, emergency response capabilities, asset integrity management, process safety management, environmental impact (especially marine), decommissioning capability.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Audit levels:**
Desktop Assessment (basic qualification), Verified Assessment (remote audit), Site Assessment (full on-site audit for high-risk suppliers). Major operators typically require Site Assessment for critical suppliers.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Achilles costs and timeline</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Achilles costs vary by community, company size, and audit level required.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Registration costs (annual):**
- Small company (<£1m turnover): £500-£800/year
- Medium company (£1-10m): £800-£1,500/year  
- Large company (>£10m): £1,500-£2,500/year
- Multi-community discount: 20-30% for second community</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Audit costs (additional):**
- Desktop verification: £500-£1,000
- Remote audit: £1,000-£2,000
- On-site audit: £2,000-£5,000
- Surveillance visits: £800-£1,500</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Timeline:**
- Registration: 1-2 weeks (self-assessment)
- Desktop verification: 2-3 weeks
- Full audit scheduling: 4-6 weeks
- Total to full compliance: 6-8 weeks</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Hidden costs to consider:**
- Staff time for data input (40-80 hours initially)
- Document preparation and system updates
- Potential consultant support (£500-£1,000/day)
- Annual data maintenance (10-20 hours)</p>
          <p className="text-slate-700 leading-relaxed mb-4">Most companies start with basic registration then add audit levels as contract requirements demand.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.achilles.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Achilles Information
            </a>
            <a href="https://www.nationalgrid.com/suppliers" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              National Grid Supplier Information
            </a>
            <a href="https://oeuk.org.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Offshore Energies UK
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Do I need both Achilles and RISQS for rail work?</h3>
              <p className="text-slate-700 leading-relaxed">For UK rail, RISQS is mandatory and sufficient. Achilles Link-Up adds value if you work internationally or want broader visibility, but it doesn't replace RISQS for Network Rail contracts. Some suppliers maintain both to maximise opportunities, with data sharing reducing duplication.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does Achilles UVDB cost per year?</h3>
              <p className="text-slate-700 leading-relaxed">Achilles UVDB costs £500-£2,500/year for registration depending on company size, plus £1,000-£5,000 for audits if required. Small utilities contractors typically pay £800-£1,500 annually. Additional costs include staff time (40-80 hours initially) and potential consultancy support.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Which utilities require Achilles UVDB?</h3>
              <p className="text-slate-700 leading-relaxed">Major UK utilities requiring UVDB include National Grid, all gas distribution networks (Cadent, SGN, Wales & West), most water companies (Thames Water, Severn Trent, United Utilities), and electricity networks (UK Power Networks, Western Power). Without UVDB, you cannot tender for these companies' contracts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between UVDB and UVDB Verify?</h3>
              <p className="text-slate-700 leading-relaxed">UVDB is the basic registration and self-assessment. UVDB Verify adds independent audit verification of your management systems. Basic UVDB suits low-risk supplies; Verify is required for operational work on gas networks, HV electrical, water treatment, or principal contractor roles. Verify costs an additional £2,000-£5,000.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use Achilles for construction tenders?</h3>
              <p className="text-slate-700 leading-relaxed">Achilles is specific to utilities, rail, and energy sectors - not general construction. For construction, you need CHAS, Constructionline, or other SSIP schemes. However, if you're doing construction work for utilities (e.g., laying gas pipes), you'll need both Achilles UVDB and construction accreditations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/risqs-rail-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Risqs Rail Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-45001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 45001 Uk Tenders
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
            Need Help With Achilles?
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
