'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompanyProfile } from '@/app/api/company-profile/route';

export interface ProfileCompleteness {
  isComplete: boolean;
  isLoading: boolean;
  completionPercentage: number;
  missingFields: string[];
  profile: CompanyProfile | null;
  refresh: () => Promise<void>;
}

/**
 * Checks if the user's company profile is complete.
 * Required fields: companyName, at least 1 CPV division, at least 1 region
 */
export function useProfileCompleteness(): ProfileCompleteness {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/company-profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || null);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Calculate completeness
  const missingFields: string[] = [];
  let completedFields = 0;
  const totalRequiredFields = 3; // companyName, cpvDivisions, regions

  if (!profile) {
    // No profile at all
    missingFields.push('Company Name', 'Target Sectors', 'Target Regions');
  } else {
    // Check company name
    if (profile.companyName && profile.companyName.trim().length > 0) {
      completedFields++;
    } else {
      missingFields.push('Company Name');
    }

    // Check CPV divisions
    if (profile.targetCpvDivisions && profile.targetCpvDivisions.length > 0) {
      completedFields++;
    } else {
      missingFields.push('Target Sectors');
    }

    // Check regions
    if (profile.targetRegions && profile.targetRegions.length > 0) {
      completedFields++;
    } else {
      missingFields.push('Target Regions');
    }
  }

  const completionPercentage = Math.round((completedFields / totalRequiredFields) * 100);
  const isComplete = missingFields.length === 0;

  return {
    isComplete,
    isLoading,
    completionPercentage,
    missingFields,
    profile,
    refresh: fetchProfile,
  };
}
