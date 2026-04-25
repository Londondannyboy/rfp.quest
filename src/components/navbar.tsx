'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { authClient } from '@/lib/auth/client';

const softwareLinks = [
  { href: '/rfp-platform', label: 'RFP Platform' },
  { href: '/rfp-software', label: 'RFP Software' },
  { href: '/rfp-uk', label: 'RFP UK' },
  { href: '/ai-tender-writing-platform', label: 'AI Tender Writing' },
  { href: '/ai-rfp-discovery', label: 'AI Discovery' },
  { href: '/automatic-tender-response', label: 'Auto Response' },
  { href: '/tender-software', label: 'Tender Software' },
  { href: '/ai-tender-software-smes', label: 'AI for SMEs' },
  { href: '/government-tender-software', label: 'Government Tenders' },
  { href: '/bid-versioning', label: 'Version Control' },
  { href: '/best-rfp-software', label: 'Best RFP Software' },
];

const guideLinks = [
  { href: '/tender-process', label: 'Tender Process Guide' },
  { href: '/bid-writing', label: 'Bid Writing Guide' },
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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdown: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // 150ms delay before closing
  };

  const handleSignOut = () => {
    // Use the AuthView sign-out page for proper session cleanup
    window.location.href = '/auth/sign-out';
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-blue-900/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Beta Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group font-bold text-xl text-white hover:scale-105 transition-transform">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">RFP</span> Platform <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Quest</span>
            </Link>
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-md uppercase shadow-sm">Beta</span>
            <span className="hidden sm:inline text-xs text-slate-400">Launching Q2 2026</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Software Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter('software')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 text-slate-300 hover:text-blue-400 font-medium transition-colors relative">
                Software
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {openDropdown === 'software' && (
                <div 
                  className="absolute top-full left-0 w-56 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 rounded-2xl border border-slate-700/50 py-2 mt-2 z-50"
                  onMouseEnter={() => handleMouseEnter('software')}
                  onMouseLeave={handleMouseLeave}
                >
                  {softwareLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Guides Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter('guides')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 text-slate-300 hover:text-blue-400 font-medium transition-colors">
                Guides
              </button>
              {openDropdown === 'guides' && (
                <div 
                  className="absolute top-full left-0 w-56 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 rounded-2xl border border-slate-700/50 py-2 mt-2 z-50"
                  onMouseEnter={() => handleMouseEnter('guides')}
                  onMouseLeave={handleMouseLeave}
                >
                  {guideLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter('templates')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 text-slate-300 hover:text-blue-400 font-medium transition-colors">
                Templates
              </button>
              {openDropdown === 'templates' && (
                <div 
                  className="absolute top-full left-0 w-56 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 rounded-2xl border border-slate-700/50 py-2 mt-2 z-50"
                  onMouseEnter={() => handleMouseEnter('templates')}
                  onMouseLeave={handleMouseLeave}
                >
                  {templateLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Browse Tenders - public access */}
            <Link
              href="/browse-tenders"
              className="px-4 py-2 text-slate-300 hover:text-blue-400 font-medium transition-colors"
            >
              Browse Tenders
            </Link>

            {/* Dashboard - prominent link */}
            <Link
              href="/dashboard"
              className="px-4 py-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Dashboard
            </Link>

            {/* Auth Section */}
            {isPending ? (
              <div className="ml-4 w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
            ) : user ? (
              /* User Profile Dropdown */
              <div
                className="relative ml-4 group"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-800/50 transition-colors">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-blue-400/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm ring-2 ring-blue-400/20">
                      {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-slate-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'profile' && (
                  <div 
                    className="absolute top-full right-0 w-56 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 rounded-2xl border border-slate-700/50 py-2 mt-2 z-50"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-4 py-2 border-b border-slate-700/50">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Company Profile
                    </Link>
                    <Link
                      href="/profile/team"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Team Members
                    </Link>
                    <Link
                      href="/library"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Content Library
                    </Link>
                    <Link
                      href="/bids"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      My Bids
                    </Link>
                    <Link
                      href="/past-bids"
                      className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Past Bids
                    </Link>
                    <div className="border-t border-slate-700/50 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In / Get Started */
              <Link
                  href="/auth/sign-up"
                  className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-colors"
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
          <div className="md:hidden py-4 border-t border-slate-700/50 bg-slate-950/95 backdrop-blur-xl">
            <div className="space-y-1">
              <div className="px-2 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Software
              </div>
              {softwareLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-2 py-2 mt-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Guides
              </div>
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-2 py-2 mt-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Templates
              </div>
              {templateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-2 py-2 mt-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Opportunities
              </div>
              <Link
                href="/browse-tenders"
                className="block px-4 py-2 text-slate-300 hover:bg-blue-950/30 hover:text-blue-400 rounded transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Browse Tenders
              </Link>

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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium ring-2 ring-blue-400/20">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full text-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block w-full text-center px-5 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Company Profile
                    </Link>
                    <Link
                      href="/profile/team"
                      className="block w-full text-center px-5 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Team Members
                    </Link>
                    <Link
                      href="/library"
                      className="block w-full text-center px-5 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Content Library
                    </Link>
                    <Link
                      href="/bids"
                      className="block w-full text-center px-5 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Bids
                    </Link>
                    <Link
                      href="/past-bids"
                      className="block w-full text-center px-5 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Past Bids
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileOpen(false);
                      }}
                      className="block w-full text-center px-5 py-2.5 border-red-600 text-red-400 font-medium rounded-lg hover:bg-red-950/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                    <Link
                      href="/auth/sign-up"
                      className="block w-full text-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
