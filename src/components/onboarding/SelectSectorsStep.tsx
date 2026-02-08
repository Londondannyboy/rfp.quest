'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckIcon,
  CurrencyPoundIcon,
  MapPinIcon,
  TagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { OnboardingProfile } from '@/types/onboarding';
import { CPV_DIVISIONS, UK_REGIONS } from '@/types/onboarding';

interface SelectSectorsStepProps {
  profile: OnboardingProfile;
  onUpdate: (updates: Partial<OnboardingProfile>) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
  error: string | null;
}

export function SelectSectorsStep({
  profile,
  onUpdate,
  onBack,
  onNext,
  isLoading,
  error,
}: SelectSectorsStepProps) {
  const toggleSector = (code: string) => {
    if (profile.targetCpvDivisions.includes(code)) {
      onUpdate({
        targetCpvDivisions: profile.targetCpvDivisions.filter((c) => c !== code),
      });
    } else {
      onUpdate({
        targetCpvDivisions: [...profile.targetCpvDivisions, code],
      });
    }
  };

  const toggleRegion = (region: string) => {
    if (profile.targetRegions.includes(region)) {
      onUpdate({
        targetRegions: profile.targetRegions.filter((r) => r !== region),
      });
    } else {
      onUpdate({
        targetRegions: [...profile.targetRegions, region],
      });
    }
  };

  const isValid =
    profile.targetCpvDivisions.length > 0 && profile.targetRegions.length > 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
      <div className="space-y-8">
        {/* Target Sectors */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-medium text-white">
              Target Sectors
            </h3>
            <span className="text-sm text-slate-400">
              (Select at least one)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CPV_DIVISIONS.map((div, index) => (
              <motion.button
                key={div.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => toggleSector(div.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
                  profile.targetCpvDivisions.includes(div.code)
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {profile.targetCpvDivisions.includes(div.code) && (
                  <CheckIcon className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="truncate">{div.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Target Regions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-medium text-white">
              Target Regions
            </h3>
            <span className="text-sm text-slate-400">
              (Select at least one)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {UK_REGIONS.map((region, index) => (
              <motion.button
                key={region}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleRegion(region)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border ${
                  profile.targetRegions.includes(region)
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {profile.targetRegions.includes(region) && (
                  <CheckIcon className="w-4 h-4" />
                )}
                {region}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contract Value Range */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CurrencyPoundIcon className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-medium text-white">
              Contract Value Range
            </h3>
            <span className="text-sm text-slate-400">(Optional)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">
                Minimum (GBP)
              </label>
              <input
                type="number"
                value={profile.minContractValue || ''}
                onChange={(e) =>
                  onUpdate({
                    minContractValue: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            <span className="text-slate-500 pt-5">to</span>
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">
                Maximum (GBP)
              </label>
              <input
                type="number"
                value={profile.maxContractValue || ''}
                onChange={(e) =>
                  onUpdate({
                    maxContractValue: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="No limit"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sustainability Focus */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-600">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Sustainability Focus</p>
              <p className="text-sm text-slate-400">
                Highlight environmental and sustainability tenders
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onUpdate({ sustainabilityFocus: !profile.sustainabilityFocus })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              profile.sustainabilityFocus ? 'bg-green-500' : 'bg-slate-600'
            }`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{ left: profile.sustainabilityFocus ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!isValid || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
