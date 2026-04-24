import Link from 'next/link';

const softwareLinks = [
  { href: '/', label: 'RFP Software Home' },
  { href: '/rfp-platform', label: 'RFP Platform' },
  { href: '/rfp-uk', label: 'RFP UK' },
  { href: '/ai-tender-writing-platform', label: 'AI Tender Writing' },
  { href: '/ai-tender-software', label: 'AI Tender Software' },
  { href: '/ai-rfp-discovery', label: 'AI Discovery' },
  { href: '/automatic-tender-response', label: 'Auto Response' },
  { href: '/tender-software', label: 'Tender Software' },
  { href: '/tender-writing-software', label: 'Tender Writing Software' },
  { href: '/tender-response-software', label: 'Tender Response Software' },
  { href: '/tender-management-software-uk', label: 'Tender Management UK' },
  { href: '/ai-tender-software-smes', label: 'AI for SMEs' },
  { href: '/nhs-tender-software', label: 'NHS Tender Software' },
  { href: '/government-tender-software', label: 'Government Tenders' },
  { href: '/procurement-software-uk', label: 'Procurement Software UK' },
  { href: '/itt-response-software', label: 'ITT Response Software' },
  { href: '/bid-versioning', label: 'Version Control' },
  { href: '/version-control-bid-content', label: 'Bid Content Versioning' },
  { href: '/contracts-finder-uk', label: 'Contracts Finder UK' },
  { href: '/find-a-tender-integration', label: 'Find a Tender Integration' },
  { href: '/free-rfp-software', label: 'Free Trial' },
  { href: '/best-rfp-software', label: 'Best RFP Software' },
];

const guideLinks = [
  { href: '/tender-process', label: 'Tender Process Guide' },
  { href: '/bid-writing', label: 'Bid Writing Guide' },
  { href: '/what-is-bid-writing', label: 'What Is Bid Writing?' },
  { href: '/bid-writing-services', label: 'Bid Writing Services' },
  { href: '/how-to-write-a-tender', label: 'How to Write a Tender' },
  { href: '/how-to-write-a-tender-proposal', label: 'Write a Tender Proposal' },
  { href: '/how-to-win-a-tender', label: 'How to Win a Tender' },
  { href: '/rfp-tender', label: 'RFP vs Tender' },
  { href: '/rfp-vs-tender', label: 'RFP vs Tender Guide' },
];

const templateLinks = [
  { href: '/sample-rfp-software', label: 'Sample RFP for Software' },
  { href: '/rfp-software-template', label: 'RFP Software Template' },
  { href: '/rfp-for-software-development-template', label: 'Software Development RFP' },
  { href: '/software-rfp-template', label: 'Software RFP Template' },
];

const certificationLinks = [
  { href: '/iso-9001-tender', label: 'ISO 9001 Tenders' },
  { href: '/iso-14001-tender', label: 'ISO 14001 Tenders' },
  { href: '/iso-27001-tender', label: 'ISO 27001 Tenders' },
  { href: '/iso-42001-ai-tender', label: 'ISO 42001 AI Tenders' },
  { href: '/iso-45001-tender', label: 'ISO 45001 Tenders' },
  { href: '/cyber-essentials-tender', label: 'Cyber Essentials Tenders' },
  { href: '/constructionline-tender', label: 'Constructionline Tenders' },
  { href: '/safecontractor-tender', label: 'SafeContractor Tenders' },
];

const partnerLinks = [
  { href: 'https://uksrs.org.uk', label: 'UK Sustainability Reporting', external: true },
  { href: 'https://miam.quest', label: 'MIAM Certificate', external: true },
  { href: 'https://membership.quest', label: 'Membership Marketing Agency', external: true },
  { href: 'https://relocation.quest', label: 'Relocation Advice', external: true },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-t border-slate-700/50 relative overflow-hidden">
      {/* Modern decorative background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Glass morphism decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-slate-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/10 to-slate-800/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group font-bold text-xl text-white mb-4 block hover:scale-105 transition-transform">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">RFP</span> Platform <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Quest</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              AI-powered <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">RFP software</Link> and tender management platform for UK procurement teams.
            </p>
          </div>

          {/* Software */}
          <div>
            <h3 className="font-semibold text-white mb-4">Software</h3>
            <ul className="space-y-2">
              {softwareLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="font-semibold text-white mb-4">Guides</h3>
            <ul className="space-y-2">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h3 className="font-semibold text-white mb-4">Templates</h3>
            <ul className="space-y-2">
              {templateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-4">Certifications</h3>
            <ul className="space-y-2">
              {certificationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-4">Partner Resources</h3>
            <ul className="space-y-2">
              {partnerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured Badge */}
        <div className="flex justify-center mt-12">
          <a 
            href="https://findly.tools/rfp-quest?utm_source=rfp-quest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform opacity-80 hover:opacity-100"
          >
            <img 
              src="https://findly.tools/badges/findly-tools-badge-light.svg" 
              alt="Featured on Findly.tools" 
              width="175" 
              height="55" 
              className="filter brightness-0 invert opacity-60"
            />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-300">
            &copy; {new Date().getFullYear()} RFP Platform Quest. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-300">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
