'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  TagIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { OnboardingProfile } from '@/types/onboarding';
import { CERTIFICATIONS } from '@/types/onboarding';

interface ReviewDataStepProps {
  profile: OnboardingProfile;
  onUpdate: (updates: Partial<OnboardingProfile>) => void;
  onBack: () => void;
  onNext: () => void;
  error: string | null;
}

export function ReviewDataStep({
  profile,
  onUpdate,
  onBack,
  onNext,
  error,
}: ReviewDataStepProps) {
  const [newService, setNewService] = useState('');

  const addService = () => {
    if (newService.trim() && !profile.services.includes(newService.trim())) {
      onUpdate({ services: [...profile.services, newService.trim()] });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    onUpdate({ services: profile.services.filter((s) => s !== service) });
  };

  const toggleCertification = (cert: string) => {
    if (profile.certifications.includes(cert)) {
      onUpdate({ certifications: profile.certifications.filter((c) => c !== cert) });
    } else {
      onUpdate({ certifications: [...profile.certifications, cert] });
    }
  };

  const isValid = profile.companyName.trim().length > 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-slate-700/50 p-8">
      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <BuildingOfficeIcon className="w-4 h-4" />
            Company Name *
          </label>
          <input
            type="text"
            value={profile.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            placeholder="Your company name"
            className="w-full px-4 py-3 bg-slate-900/50 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Website */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <GlobeAltIcon className="w-4 h-4" />
            Website
          </label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-slate-900/50 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company Description
          </label>
          <textarea
            value={profile.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Brief description of what your company does..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/50 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Services */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <TagIcon className="w-4 h-4" />
            Products & Services
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              placeholder="Add a service..."
              className="flex-1 px-4 py-2 bg-slate-900/50 border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addService}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-950/200 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          {profile.services.length > 0 && (
            <motion.div layout className="flex flex-wrap gap-2">
              {profile.services.map((service) => (
                <motion.span
                  key={service}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-950/50 border-blue-700/60/50 rounded-full text-sm text-blue-300"
                >
                  {service}
                  <button
                    onClick={() => removeService(service)}
                    className="hover:text-blue-200 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Certifications
          </label>
          <div className="flex flex-wrap gap-2">
            {CERTIFICATIONS.map((cert) => (
              <button
                key={cert}
                onClick={() => toggleCertification(cert)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                  profile.certifications.includes(cert)
                    ? 'bg-blue-700 border-blue-500/50 text-white'
                    : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                {cert}
              </button>
            ))}
          </div>
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

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-950/200 disabled:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
