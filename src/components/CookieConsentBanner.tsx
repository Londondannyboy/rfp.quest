'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    // Also set a cookie for server-side detection
    document.cookie = 'cookie-consent=accepted; max-age=31536000; path=/; SameSite=Lax';
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/50 p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300 text-center sm:text-left">
          We use cookies to improve your experience on RFP Platform Quest. By continuing, you agree to our{' '}
          <Link href="/privacy" className="text-teal-400 hover:text-teal-300 underline">
            Privacy Policy
          </Link>
          {' '}and{' '}
          <Link href="/terms" className="text-teal-400 hover:text-teal-300 underline">
            Terms of Service
          </Link>
          .
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={acceptCookies}
            className="px-5 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors whitespace-nowrap"
          >
            Accept
          </button>
          <button
            onClick={acceptCookies}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close cookie banner"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
