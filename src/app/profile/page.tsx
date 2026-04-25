'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  SparklesIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CurrencyPoundIcon,
  MapPinIcon,
  TagIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CPV_HIERARCHY } from '@/lib/cpv-hierarchy';

// UK Regions for targeting
const UK_REGIONS = [
  'UK Wide',
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'London',
  'South East',
  'South West',
  'East of England',
  'East Midlands',
  'West Midlands',
  'Yorkshire and the Humber',
  'North West',
  'North East',
];

// Common RFP requirement categories (not just sustainability)
const RFP_REQUIREMENTS = [
  { id: 'sustainability', label: 'Sustainability & Environmental', icon: '🌱', keywords: ['sustainable', 'green', 'carbon neutral', 'net zero', 'environmental'] },
  { id: 'social-value', label: 'Social Value & Community', icon: '🤝', keywords: ['social value', 'community benefit', 'local jobs', 'apprenticeships'] },
  { id: 'security', label: 'Security & Compliance', icon: '🔒', keywords: ['security clearance', 'DBS', 'GDPR', 'ISO 27001', 'Cyber Essentials'] },
  { id: 'sme-friendly', label: 'SME Friendly', icon: '🏪', keywords: ['SME', 'small business', 'subcontracting', 'local supplier'] },
  { id: 'innovation', label: 'Innovation & R&D', icon: '💡', keywords: ['innovation', 'R&D', 'emerging technology', 'pilot'] },
  { id: 'digital', label: 'Digital Transformation', icon: '🖥️', keywords: ['digital', 'cloud', 'automation', 'AI', 'machine learning'] },
  { id: 'health', label: 'Health & Safety', icon: '⚕️', keywords: ['health and safety', 'risk assessment', 'CHAS', 'SafeContractor'] },
  { id: 'equality', label: 'Equality & Diversity', icon: '🌈', keywords: ['equality', 'diversity', 'inclusion', 'disability confident'] },
];

interface ProfileForm {
  companyName: string;
  description: string;
  website: string;
  linkedinUrl: string;
  productsServices: string[];
  expertiseAreas: string[];
  certifications: string[];
  targetRegions: string[];
  targetCpvDivisions: string[];
  minContractValue: number | null;
  maxContractValue: number | null;
  rfpRequirements: string[];
  customKeywords: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const [form, setForm] = useState<ProfileForm>({
    companyName: '',
    description: '',
    website: '',
    linkedinUrl: '',
    productsServices: [],
    expertiseAreas: [],
    certifications: [],
    targetRegions: [],
    targetCpvDivisions: [],
    minContractValue: null,
    maxContractValue: null,
    rfpRequirements: [],
    customKeywords: [],
  });

  // Fetch existing profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/company-profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        if (data.profile) {
          setForm({
            companyName: data.profile.companyName || '',
            description: data.profile.description || '',
            website: data.profile.website || '',
            linkedinUrl: '', // Not in API yet
            productsServices: data.profile.productsServices || [],
            expertiseAreas: data.profile.expertiseAreas || [],
            certifications: data.profile.certifications || [],
            targetRegions: data.profile.targetRegions || [],
            targetCpvDivisions: data.profile.targetCpvDivisions || [],
            minContractValue: data.profile.minContractValue,
            maxContractValue: data.profile.maxContractValue,
            rfpRequirements: data.profile.sustainabilityFocus ? ['sustainability'] : [],
            customKeywords: data.profile.sustainabilityKeywords || [],
          });
        }
      } catch {
        console.error('Error fetching profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Save profile
  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          description: form.description,
          website: form.website,
          productsServices: form.productsServices,
          expertiseAreas: form.expertiseAreas,
          certifications: form.certifications,
          targetRegions: form.targetRegions,
          targetCpvDivisions: form.targetCpvDivisions,
          minContractValue: form.minContractValue,
          maxContractValue: form.maxContractValue,
          sustainabilityFocus: form.rfpRequirements.includes('sustainability'),
          sustainabilityKeywords: form.customKeywords,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // Scrape LinkedIn
  async function handleLinkedInScrape() {
    if (!form.linkedinUrl) return;
    setScraping(true);
    setError(null);

    try {
      const res = await fetch('/api/scrape-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: form.linkedinUrl }),
      });

      if (!res.ok) throw new Error('Failed to scrape LinkedIn');

      const data = await res.json();
      if (data.company) {
        setForm((prev) => ({
          ...prev,
          companyName: data.company.name || prev.companyName,
          description: data.company.description || prev.description,
          website: data.company.website || prev.website,
          expertiseAreas: data.company.expertise || prev.expertiseAreas,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scrape');
    } finally {
      setScraping(false);
    }
  }

  // Toggle functions
  const toggleCpv = (code: string) => {
    setForm((prev) => ({
      ...prev,
      targetCpvDivisions: prev.targetCpvDivisions.includes(code)
        ? prev.targetCpvDivisions.filter((c) => c !== code)
        : [...prev.targetCpvDivisions, code],
    }));
  };

  const toggleRegion = (region: string) => {
    setForm((prev) => ({
      ...prev,
      targetRegions: prev.targetRegions.includes(region)
        ? prev.targetRegions.filter((r) => r !== region)
        : [...prev.targetRegions, region],
    }));
  };

  const toggleRequirement = (id: string) => {
    setForm((prev) => ({
      ...prev,
      rfpRequirements: prev.rfpRequirements.includes(id)
        ? prev.rfpRequirements.filter((r) => r !== id)
        : [...prev.rfpRequirements, id],
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !form.customKeywords.includes(newKeyword.trim())) {
      setForm((prev) => ({
        ...prev,
        customKeywords: [...prev.customKeywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setForm((prev) => ({
      ...prev,
      customKeywords: prev.customKeywords.filter((k) => k !== kw),
    }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !form.expertiseAreas.includes(newExpertise.trim())) {
      setForm((prev) => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, newExpertise.trim()],
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (exp: string) => {
    setForm((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter((e) => e !== exp),
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !form.certifications.includes(newCertification.trim())) {
      setForm((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8 relative">
      {/* Advanced decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-slate-300/10 rounded-full blur-xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Company Profile</h1>
            <p className="text-slate-300 mt-1">
              Configure your profile to get personalized tender matches
            </p>
          </div>
          <Link
            href="/profile/team"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 border-slate-600/50 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300 backdrop-blur-sm"
          >
            <UserGroupIcon className="w-5 h-5" />
            Team Members
          </Link>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-900/20 border-green-200 rounded-lg text-green-700 flex items-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            Profile saved successfully!
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-400" />
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Website
                </label>
                <div className="relative">
                  <GlobeAltIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>

            {/* LinkedIn URL with scrape button */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                LinkedIn Company URL
                <span className="text-slate-400 font-normal ml-2">(Auto-populate profile)</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <svg className="w-5 h-5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <button
                  onClick={handleLinkedInScrape}
                  disabled={scraping || !form.linkedinUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {scraping ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-5 h-5" />
                  )}
                  Import
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your company and services..."
              />
            </div>
          </section>

          {/* Target Sectors (CPV Categories) */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-blue-400" />
              Target Sectors
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Select the sectors you want to bid for. We&apos;ll prioritize matching tenders.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CPV_HIERARCHY.map((division) => {
                const isSelected = form.targetCpvDivisions.includes(division.code);
                return (
                  <button
                    key={division.code}
                    onClick={() => toggleCpv(division.code)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-slate-600/50 hover:border-slate-500/50 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{division.icon}</span>
                    <span className="text-sm font-medium">{division.label}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 ml-auto text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Target Regions */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-blue-400" />
              Target Regions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Select the geographic areas where you can deliver contracts.
            </p>

            <div className="flex flex-wrap gap-2">
              {UK_REGIONS.map((region) => {
                const isSelected = form.targetRegions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-900/30 text-blue-300 border-blue-400/50'
                        : 'bg-slate-800/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Contract Value Range */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <CurrencyPoundIcon className="w-5 h-5 text-blue-400" />
              Contract Value Range
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Set your preferred contract size to filter opportunities.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Minimum Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">£</span>
                  <input
                    type="number"
                    value={form.minContractValue || ''}
                    onChange={(e) =>
                      setForm({ ...form, minContractValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-full pl-7 pr-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50,000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Maximum Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">£</span>
                  <input
                    type="number"
                    value={form.maxContractValue || ''}
                    onChange={(e) =>
                      setForm({ ...form, maxContractValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className="w-full pl-7 pr-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10,000,000"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* RFP Requirements Categories */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
              RFP Focus Areas
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Select categories commonly asked for in UK public tenders. We&apos;ll highlight matching opportunities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RFP_REQUIREMENTS.map((req) => {
                const isSelected = form.rfpRequirements.includes(req.id);
                return (
                  <button
                    key={req.id}
                    onClick={() => toggleRequirement(req.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    <span className="text-xl">{req.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-slate-100">{req.label}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {req.keywords.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    {isSelected && <CheckIcon className="w-5 h-5 text-green-600" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Expertise Areas */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-blue-400" />
              Expertise Areas
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Add your key expertise areas and specializations.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.expertiseAreas.map((exp) => (
                <span
                  key={exp}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                >
                  {exp}
                  <button onClick={() => removeExpertise(exp)} className="hover:text-purple-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                className="flex-1 px-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., AI Strategy, Machine Learning, Cloud Architecture"
              />
              <button
                onClick={addExpertise}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Certifications */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-blue-400" />
              Certifications
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Add certifications and accreditations you hold.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                >
                  {cert}
                  <button onClick={() => removeCertification(cert)} className="hover:text-blue-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="flex-1 px-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., ISO 27001, Cyber Essentials Plus, G-Cloud"
              />
              <button
                onClick={addCertification}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-900/40"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Custom Keywords */}
          <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-600/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-blue-400" />
              Custom Keywords
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Add specific keywords to match in tender descriptions.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.customKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-full text-sm"
                >
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-amber-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., LLM, GenAI, digital transformation"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 text-slate-300 border-slate-500/50 rounded-lg hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.companyName}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
