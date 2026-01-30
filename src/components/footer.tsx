import Link from 'next/link';

const softwareLinks = [
  { href: '/rfp-platform', label: 'RFP Platform' },
  { href: '/proposal-software', label: 'Proposal Software' },
  { href: '/tender-software', label: 'Tender Software' },
  { href: '/bid-management-software', label: 'Bid Management Software' },
  { href: '/ai-rfp-software', label: 'AI RFP Software' },
  { href: '/government-tender-software', label: 'Government Tenders' },
  { href: '/gdpr-bid-management', label: 'GDPR Compliant' },
  { href: '/bid-versioning', label: 'Version Control' },
  { href: '/free-rfp-software', label: 'Free Trial' },
];

const guideLinks = [
  { href: '/tender-process', label: 'Tender Process Guide' },
  { href: '/how-to-write-a-tender', label: 'How to Write a Tender' },
  { href: '/how-to-win-a-tender', label: 'How to Win a Tender' },
  { href: '/how-to-write-a-tender-proposal', label: 'Write a Tender Proposal' },
  { href: '/rfp-tender', label: 'RFP vs Tender' },
];

const templateLinks = [
  { href: '/sample-rfp-software', label: 'Sample RFP for Software' },
  { href: '/rfp-software-template', label: 'RFP Software Template' },
  { href: '/rfp-for-software-development-template', label: 'Software Development RFP' },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 font-bold text-xl text-gray-900 dark:text-white mb-4">
              <span className="text-teal-600">rfp</span>
              <span>.quest</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              AI-powered RFP and tender management software for UK procurement teams.
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} rfp.quest. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy</Link>
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
