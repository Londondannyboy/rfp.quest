'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { authClient } from '@/lib/auth/client';

const softwareLinks = [
  { href: '/rfp-platform', label: 'RFP Platform' },
  { href: '/rfp-software', label: 'RFP Software' },
  { href: '/proposal-software', label: 'Proposal Software' },
  { href: '/tender-software', label: 'Tender Software' },
  { href: '/bid-management-software', label: 'Bid Management' },
  { href: '/rfp-bid-management-software', label: 'RFP Bid Management' },
  { href: '/ai-rfp-software', label: 'AI RFP Software' },
  { href: '/government-tender-software', label: 'Government Tenders' },
  { href: '/rfp-pipeline-tools', label: 'Pipeline Tools' },
  { href: '/gdpr-bid-management', label: 'GDPR Compliant' },
  { href: '/bid-versioning', label: 'Version Control' },
];

const guideLinks = [
  { href: '/tender-process', label: 'Tender Process Guide' },
  { href: '/how-to-write-a-tender', label: 'How to Write a Tender' },
  { href: '/how-to-win-a-tender', label: 'How to Win a Tender' },
  { href: '/rfp-tender', label: 'RFP vs Tender' },
];

const templateLinks = [
  { href: '/sample-rfp-software', label: 'Sample RFP' },
  { href: '/rfp-software-template', label: 'RFP Templates' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Beta Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
              <span className="text-teal-600">rfp</span>
              <span>.quest</span>
            </Link>
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-600 text-black rounded uppercase">Beta</span>
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">Launching Q1 2026</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Software Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('software')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium">
                Software
              </button>
              {openDropdown === 'software' && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2">
                  {softwareLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Guides Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('guides')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium">
                Guides
              </button>
              {openDropdown === 'guides' && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2">
                  {guideLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('templates')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium">
                Templates
              </button>
              {openDropdown === 'templates' && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2">
                  {templateLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            {isPending ? (
              <div className="ml-4 w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              /* User Profile Dropdown */
              <div
                className="relative ml-4"
                onMouseEnter={() => setOpenDropdown('profile')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'profile' && (
                  <div className="absolute top-full right-0 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2 mt-1">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In / Get Started */
              <>
                <Link
                  href="/auth/sign-in"
                  className="ml-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <div className="px-2 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Software
              </div>
              {softwareLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-2 py-2 mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Guides
              </div>
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-2 py-2 mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Templates
              </div>
              {templateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 px-2 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full text-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileOpen(false);
                      }}
                      className="block w-full text-center px-5 py-2.5 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="block w-full text-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="block w-full text-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
