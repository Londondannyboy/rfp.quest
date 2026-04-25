'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  TagIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useProfileCompleteness } from '@/lib/hooks/use-profile-completeness';
import { useAuth } from '@/lib/hooks/use-auth';

interface ProfileGateProps {
  children: React.ReactNode;
}

/**
 * ProfileGate wraps dashboard content and blocks access until the user
 * has completed their company profile with required fields.
 */
export function ProfileGate({ children }: ProfileGateProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    isComplete,
    isLoading: profileLoading,
    completionPercentage,
    missingFields,
  } = useProfileCompleteness();

  // Show loading state while checking auth and profile
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="w-8 h-8 border-3 border-blue-500/50/30 border-t-teal-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  // If not authenticated, show the dashboard anyway (public access)
  // The personalized features just won't work
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If profile is complete, render the dashboard
  if (isComplete) {
    return <>{children}</>;
  }

  // Show blocking interstitial for incomplete profiles
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Header Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border-slate-700/50 p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-blue-500/50/30 flex items-center justify-center"
          >
            <UserCircleIcon className="w-10 h-10 text-blue-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Complete Your Profile
          </h1>
          <p className="text-slate-400 mb-6">
            Tell us about your company to unlock personalized tender matching
            and intelligent recommendations.
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Profile Completion</span>
              <span className="text-blue-400 font-medium">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>

          {/* Missing Fields Checklist */}
          <div className="bg-slate-900/50 rounded-xl border-slate-700/50 p-4 mb-6 text-left">
            <p className="text-sm font-medium text-slate-300 mb-3">
              Required to continue:
            </p>
            <div className="space-y-2">
              <CheckItem
                label="Company Name"
                completed={!missingFields.includes('Company Name')}
                icon={BuildingOfficeIcon}
              />
              <CheckItem
                label="Target Sectors"
                completed={!missingFields.includes('Target Sectors')}
                icon={TagIcon}
              />
              <CheckItem
                label="Target Regions"
                completed={!missingFields.includes('Target Regions')}
                icon={MapPinIcon}
              />
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/profile">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/25"
            >
              Complete Profile
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </Link>

          {/* Benefits Hint */}
          <p className="text-xs text-slate-500 mt-4">
            Takes less than 2 minutes. Get matched with relevant tenders instantly.
          </p>
        </div>

        {/* Feature Teasers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          <FeatureTeaser
            emoji="🎯"
            label="Match Scores"
            description="See how well each tender fits your profile"
          />
          <FeatureTeaser
            emoji="🏆"
            label="Competitors"
            description="Discover who you're bidding against"
          />
          <FeatureTeaser
            emoji="📊"
            label="Analytics"
            description="Track your pipeline and win rate"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Helper components

function CheckItem({
  label,
  completed,
  icon: Icon,
}: {
  label: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        completed
          ? 'bg-blue-950/200/10 text-blue-300'
          : 'bg-slate-800/50 text-slate-400'
      }`}
    >
      {completed ? (
        <CheckCircleIcon className="w-5 h-5 text-blue-400" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <span className="text-sm">{label}</span>
      {completed && (
        <span className="ml-auto text-xs text-blue-500">Done</span>
      )}
    </div>
  );
}

function FeatureTeaser({
  emoji,
  label,
  description,
}: {
  emoji: string;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700/50 p-3 text-center group hover:border-slate-600/50 transition-colors">
      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
        {emoji}
      </div>
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">
        {description}
      </p>
    </div>
  );
}
