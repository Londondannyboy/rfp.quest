'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UrlInputStep } from './UrlInputStep';
import { ReviewDataStep } from './ReviewDataStep';
import { SelectSectorsStep } from './SelectSectorsStep';
import { CompletionStep } from './CompletionStep';
import type { OnboardingStep, OnboardingProfile, OnboardingState } from '@/types/onboarding';
import type { ScrapedCompanyData } from '@/app/api/company-scrape/route';
import { initialProfile } from '@/types/onboarding';

const STEP_TITLES = {
  1: 'Enter Your Website',
  2: 'Review Your Details',
  3: 'Select Your Focus',
  4: 'All Set!',
};

export function WizardContainer() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    url: '',
    isLoading: false,
    error: null,
    scrapedData: null,
    profile: initialProfile,
  });

  const setStep = (step: OnboardingStep) => {
    setState((prev) => ({ ...prev, step, error: null }));
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const setScrapedData = (data: ScrapedCompanyData) => {
    setState((prev) => ({
      ...prev,
      scrapedData: data,
      profile: {
        ...prev.profile,
        companyName: data.companyName || '',
        description: data.description || '',
        website: data.website || '',
        services: data.services || [],
        certifications: data.certifications || [],
        socialLinks: data.socialLinks || {},
      },
    }));
  };

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const handleScrape = async (url: string) => {
    setLoading(true);
    setError(null);
    setState((prev) => ({ ...prev, url }));

    try {
      const res = await fetch('/api/company-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan website');
      }

      setScrapedData(data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipScrape = () => {
    // Skip to step 2 with empty data for manual entry
    setState((prev) => ({
      ...prev,
      scrapedData: null,
      profile: initialProfile,
    }));
    setStep(2);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: state.profile.companyName,
          description: state.profile.description,
          website: state.profile.website,
          productsServices: state.profile.services,
          certifications: state.profile.certifications,
          targetCpvDivisions: state.profile.targetCpvDivisions,
          targetRegions: state.profile.targetRegions,
          minContractValue: state.profile.minContractValue,
          maxContractValue: state.profile.maxContractValue,
          sustainabilityFocus: state.profile.sustainabilityFocus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-2xl font-bold text-white">
          <span className="text-teal-400">RFP</span> Quest
        </span>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-8"
      >
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                step <= state.step ? 'bg-teal-400' : 'bg-slate-600'
              }`}
              animate={{
                scale: step === state.step ? [1, 1.2, 1] : 1,
              }}
              transition={{
                repeat: step === state.step ? Infinity : 0,
                duration: 2,
              }}
            />
            {step < 4 && (
              <div
                className={`w-8 h-0.5 ${
                  step < state.step ? 'bg-teal-400' : 'bg-slate-600'
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Title */}
      <motion.h1
        key={state.step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-2xl font-semibold text-white mb-8 text-center"
      >
        {STEP_TITLES[state.step]}
      </motion.h1>

      {/* Step Content */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait" custom={state.step}>
          <motion.div
            key={state.step}
            custom={state.step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {state.step === 1 && (
              <UrlInputStep
                url={state.url}
                isLoading={state.isLoading}
                error={state.error}
                onSubmit={handleScrape}
                onSkip={handleSkipScrape}
              />
            )}
            {state.step === 2 && (
              <ReviewDataStep
                profile={state.profile}
                onUpdate={updateProfile}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                error={state.error}
              />
            )}
            {state.step === 3 && (
              <SelectSectorsStep
                profile={state.profile}
                onUpdate={updateProfile}
                onBack={() => setStep(2)}
                onNext={handleSaveProfile}
                isLoading={state.isLoading}
                error={state.error}
              />
            )}
            {state.step === 4 && (
              <CompletionStep
                profile={state.profile}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
