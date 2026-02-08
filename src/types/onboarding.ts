import type { ScrapedCompanyData } from '@/app/api/company-scrape/route';

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface OnboardingProfile {
  companyName: string;
  description: string;
  website: string;
  services: string[];
  certifications: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  targetCpvDivisions: string[];
  targetRegions: string[];
  minContractValue: number | null;
  maxContractValue: number | null;
  sustainabilityFocus: boolean;
}

export interface OnboardingState {
  step: OnboardingStep;
  url: string;
  isLoading: boolean;
  error: string | null;
  scrapedData: ScrapedCompanyData | null;
  profile: OnboardingProfile;
}

export const initialProfile: OnboardingProfile = {
  companyName: '',
  description: '',
  website: '',
  services: [],
  certifications: [],
  socialLinks: {},
  targetCpvDivisions: [],
  targetRegions: [],
  minContractValue: null,
  maxContractValue: null,
  sustainabilityFocus: false,
};

export const CPV_DIVISIONS = [
  { code: '45', label: 'Construction' },
  { code: '48', label: 'Software & IT Systems' },
  { code: '50', label: 'Repair & Maintenance' },
  { code: '55', label: 'Hospitality' },
  { code: '60', label: 'Transport' },
  { code: '65', label: 'Utilities' },
  { code: '71', label: 'Engineering & Architecture' },
  { code: '72', label: 'IT Services' },
  { code: '73', label: 'R&D Services' },
  { code: '75', label: 'Government Services' },
  { code: '77', label: 'Agriculture & Forestry' },
  { code: '79', label: 'Business Services' },
  { code: '80', label: 'Education' },
  { code: '85', label: 'Healthcare' },
  { code: '90', label: 'Environment & Waste' },
  { code: '92', label: 'Recreation & Culture' },
];

export const UK_REGIONS = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'UK-wide',
];

export const CERTIFICATIONS = [
  'ISO 9001',
  'ISO 14001',
  'ISO 27001',
  'ISO 45001',
  'Cyber Essentials',
  'Cyber Essentials Plus',
  'G-Cloud Supplier',
  'Digital Outcomes Supplier',
  'Crown Commercial Service Supplier',
];
