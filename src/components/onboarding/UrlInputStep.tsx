'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface UrlInputStepProps {
  url: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (url: string) => void;
  onSkip: () => void;
}

export function UrlInputStep({
  url: initialUrl,
  isLoading,
  error,
  onSubmit,
  onSkip,
}: UrlInputStepProps) {
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Add https:// if no protocol
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }
      onSubmit(finalUrl);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-slate-700/50 p-8">
      <div className="text-center mb-8">
        <p className="text-slate-300">
          Enter your company website and we'll automatically extract your
          details to save you time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <GlobeAltIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg disabled:opacity-50"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-900/30 border-red-700/50 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-4 bg-blue-700 hover:bg-blue-950/200 disabled:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <ScrapingAnimation />
              <span>Scanning website...</span>
            </>
          ) : (
            <>
              <span>Scan Website</span>
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors disabled:opacity-50"
        >
          Skip and enter details manually
        </button>
      </div>

      {isLoading && (
        <div className="mt-8 flex justify-center">
          <PulsingRings />
        </div>
      )}
    </div>
  );
}

function ScrapingAnimation() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function PulsingRings() {
  return (
    <div className="relative w-24 h-24">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-blue-500/60"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{
            scale: [0.5, 1.5, 2],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <GlobeAltIcon className="w-8 h-8 text-blue-400" />
      </div>
    </div>
  );
}
