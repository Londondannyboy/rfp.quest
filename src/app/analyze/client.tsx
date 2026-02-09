'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { RfpUpload } from '@/components/analysis/RfpUpload';

interface UploadedFile {
  id: string;
  filename: string;
  originalFilename: string;
  url: string;
  size: number;
  status: string;
}

export function AnalyzePageClient() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);

  const handleUploadComplete = useCallback((upload: UploadedFile) => {
    setUploadedFile(upload);
  }, []);

  const handleAnalyze = useCallback(
    async (uploadId: string) => {
      setIsStartingAnalysis(true);
      try {
        // Start analysis for the uploaded RFP
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rfpUploadId: uploadId }),
        });

        if (response.ok) {
          const data = await response.json();
          // Redirect to analysis results page
          router.push(`/analyze/${data.id}`);
        }
      } catch (error) {
        console.error('Failed to start analysis:', error);
        setIsStartingAnalysis(false);
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 mb-6">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Analyze Any RFP Document
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload an RFP or tender document and get instant AI-powered analysis.
            We&apos;ll identify requirements, check compliance, and highlight gaps in your capabilities.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <RfpUpload
            onUploadComplete={handleUploadComplete}
            onAnalyze={handleAnalyze}
          />

          {isStartingAnalysis && (
            <div className="mt-4 p-4 bg-teal-900/30 border border-teal-700 rounded-lg text-center">
              <p className="text-teal-300">
                Starting analysis... You&apos;ll be redirected shortly.
              </p>
            </div>
          )}
        </div>

        {/* Or Search Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-slate-950 text-slate-500 text-sm">
              or analyze a UK government tender
            </span>
          </div>
        </div>

        {/* Search/Browse Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/dashboard"
            className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-teal-600 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-teal-900/50 transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 group-hover:text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Browse Tenders
                </h3>
                <p className="text-sm text-slate-400">
                  Search UK government tenders from Find a Tender
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard?stage=tender"
            className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-teal-600 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-teal-900/50 transition-colors">
                <DocumentTextIcon className="h-6 w-6 text-slate-400 group-hover:text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Open Opportunities
                </h3>
                <p className="text-sm text-slate-400">
                  View tenders currently accepting submissions
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-white text-center mb-8">
            What You&apos;ll Get
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-medium text-white mb-2">Summary</h3>
              <p className="text-sm text-slate-400">
                Key dates, buyer information, contract details, and framework detection
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="font-medium text-white mb-2">Compliance Checklist</h3>
              <p className="text-sm text-slate-400">
                Mandatory requirements, certifications needed, and social value criteria
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-medium text-white mb-2">Gap Analysis</h3>
              <p className="text-sm text-slate-400">
                Visual comparison of your capabilities vs requirements with action items
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
