'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BoltIcon,
  CurrencyPoundIcon,
} from '@heroicons/react/24/outline';
import { useTeamCredits } from '@/lib/hooks/use-team-credits';
import { enrichWithCredits } from '@/lib/db/operations';
import type { EnrichmentRequest, EnrichmentResponse } from '@/lib/db/types';

interface EnrichmentButtonProps {
  referenceId: string;
  referenceType: 'company' | 'tender' | 'competitor';
  teamId: string;
  userId?: string;
  onEnrichmentComplete?: (data: any) => void;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function EnrichmentButton({
  referenceId,
  referenceType,
  teamId,
  userId,
  onEnrichmentComplete,
  variant = 'default',
  className = '',
}: EnrichmentButtonProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [enrichmentType, setEnrichmentType] = useState<'company' | 'linkedin' | 'full'>('company');
  const [result, setResult] = useState<EnrichmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { credits, loading: creditsLoading, refetch: refetchCredits } = useTeamCredits(teamId);

  const creditCosts = {
    company: 1,
    linkedin: 1,
    full: 3,
  };

  const handleEnrich = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsEnriching(true);
    setError(null);

    try {
      const request: EnrichmentRequest = {
        type: enrichmentType,
        reference_id: referenceId,
        force_refresh: false,
      };

      const response = await enrichWithCredits(teamId, request, userId);
      
      if (response.success) {
        setResult(response);
        refetchCredits();
        if (onEnrichmentComplete) {
          onEnrichmentComplete(response.data);
        }
        setTimeout(() => {
          setShowConfirm(false);
          setResult(null);
        }, 3000);
      } else {
        setError('Enrichment failed. Please check your credits.');
      }
    } catch (err) {
      setError('An error occurred during enrichment.');
      console.error('Enrichment error:', err);
    } finally {
      setIsEnriching(false);
    }
  };

  const hasEnoughCredits = () => {
    if (!credits) return false;
    if (credits.credits_remaining === -1) return true; // Unlimited
    return credits.credits_remaining >= creditCosts[enrichmentType];
  };

  const getButtonContent = () => {
    if (variant === 'icon') {
      return <SparklesIcon className="w-5 h-5" />;
    }
    
    if (variant === 'compact') {
      return (
        <>
          <SparklesIcon className="w-4 h-4" />
          Enrich
        </>
      );
    }
    
    return (
      <>
        <SparklesIcon className="w-4 h-4" />
        Enrich Data
        {credits && credits.credits_remaining !== -1 && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {credits.credits_remaining} credits
          </span>
        )}
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isEnriching || creditsLoading || !hasEnoughCredits()}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${variant === 'icon' ? 'p-2' : ''}
          ${!hasEnoughCredits() 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title={!hasEnoughCredits() ? 'Insufficient credits' : 'Enrich with additional data'}
      >
        {isEnriching ? (
          <ArrowPathIcon className="w-4 h-4 animate-spin" />
        ) : (
          getButtonContent()
        )}
      </button>

      {/* Enrichment Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enrich {referenceType === 'company' ? 'Company' : referenceType === 'tender' ? 'Tender' : 'Competitor'} Data
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get additional insights and intelligence
                  </p>
                </div>
              </div>

              {/* Enrichment Options */}
              <div className="space-y-3 mb-6">
                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    enrichmentType === 'company'
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="enrichmentType"
                      value="company"
                      checked={enrichmentType === 'company'}
                      onChange={(e) => setEnrichmentType(e.target.value as any)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Company Data</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Financial, operational, sustainability, risk intelligence  
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    <BoltIcon className="w-3 h-3" />
                    1 credit
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    enrichmentType === 'linkedin'
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="enrichmentType"
                      value="linkedin"
                      checked={enrichmentType === 'linkedin'}
                      onChange={(e) => setEnrichmentType(e.target.value as any)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Decision Makers</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        LinkedIn profiles, recent posts, priorities
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    <BoltIcon className="w-3 h-3" />
                    1 credit
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    enrichmentType === 'full'
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="enrichmentType"
                      value="full"
                      checked={enrichmentType === 'full'}
                      onChange={(e) => setEnrichmentType(e.target.value as any)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <ChartBarIcon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Full Intelligence</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Complete bid intelligence: financials, strategy, ESG, risks, leadership
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <BoltIcon className="w-3 h-3" />
                    3 credits (save 25%)
                  </span>
                </label>
              </div>

              {/* Credits Status */}
              <div className="p-3 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your credits:</span>
                  <span className="font-semibold text-gray-900">
                    {credits?.credits_remaining === -1 ? 'Unlimited' : credits?.credits_remaining || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="font-semibold text-purple-600">
                    {creditCosts[enrichmentType]} {creditCosts[enrichmentType] === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
                {credits && credits.credits_remaining !== -1 && (
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200">
                    <span className="text-sm text-gray-600">After enrichment:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.max(0, credits.credits_remaining - creditCosts[enrichmentType])}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {result && result.success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Enrichment successful! {result.cached && '(From cache)'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEnrich}
                  disabled={isEnriching || !hasEnoughCredits()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnriching ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Enriching...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Confirm Enrichment
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>

              {!hasEnoughCredits() && (
                <p className="mt-3 text-xs text-center text-gray-500">
                  Need more credits?{' '}
                  <a href="/settings/billing" className="text-purple-600 hover:text-purple-700 font-medium">
                    Upgrade your plan
                  </a>
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}