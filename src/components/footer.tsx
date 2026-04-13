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
  { href: 'https://miam.quest', label: 'MIAM Certificate', external: true },
  { href: 'https://membership.quest', label: 'Membership Marketing Agency', external: true },
  { href: 'https://relocation.quest', label: 'Relocation Advice', external: true },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white mb-4 block">
              <span className="text-teal-600">RFP</span> Platform <span className="text-teal-600">Quest</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              AI-powered <Link href="/" className="text-teal-600 hover:underline">RFP software</Link> and tender management platform for UK procurement teams.
            </p>
          </div>

          {/* Software */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Software</h3>
            <ul className="space-y-2">
              {softwareLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Guides</h3>
            <ul className="space-y-2">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Templates</h3>
            <ul className="space-y-2">
              {templateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-4">Certifications</h3>
            <ul className="space-y-2">
              {certificationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-4">Partner Resources</h3>
            <ul className="space-y-2">
              {partnerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured Badge */}
        <div className="flex justify-center mt-8">
          <a 
            href="https://findly.tools/rfp-quest?utm_source=rfp-quest" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://findly.tools/badges/findly-tools-badge-light.svg" 
              alt="Featured on Findly.tools" 
              width="175" 
              height="55" 
            />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} RFP Platform Quest. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
