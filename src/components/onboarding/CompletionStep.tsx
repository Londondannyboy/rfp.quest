'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/solid';
import type { OnboardingProfile } from '@/types/onboarding';
import { CPV_DIVISIONS } from '@/types/onboarding';

interface CompletionStepProps {
  profile: OnboardingProfile;
  onComplete: () => void;
}

export function CompletionStep({ profile, onComplete }: CompletionStepProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const sectorLabels = profile.targetCpvDivisions
    .map((code) => CPV_DIVISIONS.find((d) => d.code === code)?.label)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="relative">
      {/* Confetti */}
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-slate-700/50 p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            You&apos;re All Set!
          </h2>
          <p className="text-slate-300 mb-8">
            Your profile for <span className="text-blue-400 font-medium">{profile.companyName}</span> is ready.
          </p>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50 rounded-xl p-4 mb-8 text-left"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Target Sectors</p>
              <p className="text-white">
                {sectorLabels.join(', ')}
                {profile.targetCpvDivisions.length > 3 && (
                  <span className="text-slate-400">
                    {' '}+{profile.targetCpvDivisions.length - 3} more
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Regions</p>
              <p className="text-white">{profile.targetRegions.join(', ')}</p>
            </div>
            {profile.minContractValue && (
              <div>
                <p className="text-slate-400">Min Value</p>
                <p className="text-white">
                  £{profile.minContractValue.toLocaleString()}
                </p>
              </div>
            )}
            {profile.sustainabilityFocus && (
              <div>
                <p className="text-slate-400">Focus</p>
                <p className="text-green-400">Sustainability</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30"
        >
          <RocketLaunchIcon className="w-5 h-5" />
          Enter Your Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#14b8a6', '#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b'][
      Math.floor(Math.random() * 5)
    ],
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: 500,
            opacity: 0,
            rotate: 360,
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
