'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  TagIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  SparklesIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { CompanyProfile } from '@/app/api/company-profile/route';

const CPV_DIVISIONS = [
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

const REGIONS = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'UK-wide',
];

const CERTIFICATIONS = [
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

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [productsServices, setProductsServices] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [targetRegions, setTargetRegions] = useState<string[]>([]);
  const [targetCpvDivisions, setTargetCpvDivisions] = useState<string[]>([]);
  const [minContractValue, setMinContractValue] = useState<string>('');
  const [maxContractValue, setMaxContractValue] = useState<string>('');
  const [sustainabilityFocus, setSustainabilityFocus] = useState(false);
  const [sustainabilityKeywords, setSustainabilityKeywords] = useState<string[]>([]);
  const [newSustainabilityKeyword, setNewSustainabilityKeyword] = useState('');

  // Load existing profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/company-profile');
        const data = await res.json();

        if (data.profile) {
          const p: CompanyProfile = data.profile;
          setCompanyName(p.companyName || '');
          setDescription(p.description || '');
          setWebsite(p.website || '');
          setProductsServices(p.productsServices || []);
          setExpertiseAreas(p.expertiseAreas || []);
          setCertifications(p.certifications || []);
          setTargetRegions(p.targetRegions || []);
          setTargetCpvDivisions(p.targetCpvDivisions || []);
          setMinContractValue(p.minContractValue?.toString() || '');
          setMaxContractValue(p.maxContractValue?.toString() || '');
          setSustainabilityFocus(p.sustainabilityFocus || false);
          setSustainabilityKeywords(p.sustainabilityKeywords || []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          description,
          website,
          productsServices,
          expertiseAreas,
          certifications,
          targetRegions,
          targetCpvDivisions,
          minContractValue: minContractValue ? parseInt(minContractValue) : null,
          maxContractValue: maxContractValue ? parseInt(maxContractValue) : null,
          sustainabilityFocus,
          sustainabilityKeywords,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => {
    if (newProduct.trim() && !productsServices.includes(newProduct.trim())) {
      setProductsServices([...productsServices, newProduct.trim()]);
      setNewProduct('');
    }
  };

  const removeProduct = (product: string) => {
    setProductsServices(productsServices.filter((p) => p !== product));
  };

  const addSustainabilityKeyword = () => {
    if (newSustainabilityKeyword.trim() && !sustainabilityKeywords.includes(newSustainabilityKeyword.trim())) {
      setSustainabilityKeywords([...sustainabilityKeywords, newSustainabilityKeyword.trim()]);
      setNewSustainabilityKeyword('');
    }
  };

  const removeSustainabilityKeyword = (keyword: string) => {
    setSustainabilityKeywords(sustainabilityKeywords.filter((k) => k !== keyword));
  };

  const toggleCpvDivision = (code: string) => {
    if (targetCpvDivisions.includes(code)) {
      setTargetCpvDivisions(targetCpvDivisions.filter((c) => c !== code));
    } else {
      setTargetCpvDivisions([...targetCpvDivisions, code]);
    }
  };

  const toggleRegion = (region: string) => {
    if (targetRegions.includes(region)) {
      setTargetRegions(targetRegions.filter((r) => r !== region));
    } else {
      setTargetRegions([...targetRegions, region]);
    }
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter((c) => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const toggleExpertise = (area: string) => {
    if (expertiseAreas.includes(area)) {
      setExpertiseAreas(expertiseAreas.filter((a) => a !== area));
    } else {
      setExpertiseAreas([...expertiseAreas, area]);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Redirect to home page after deletion
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600/50"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Company Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Set up your company profile to get personalized tender matches and recommendations.
        </p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-red-900/20 px-4 py-3 text-sm text-red-700">
          <ExclamationCircleIcon className="h-5 w-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-blue-900/20 px-4 py-3 text-sm text-green-400">
          <CheckIcon className="h-5 w-5" />
          Profile saved successfully!
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Basic Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                className="w-full rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Website
              </label>
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 text-slate-400 mr-2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of your company and what you do..."
                className="w-full rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Products & Services */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Products & Services</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                placeholder="Add a product or service..."
                className="flex-1 rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {productsServices.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productsServices.map((product) => (
                  <span
                    key={product}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                  >
                    {product}
                    <button
                      onClick={() => removeProduct(product)}
                      className="text-blue-500 hover:text-blue-300"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Expertise Areas (CPV Sectors) */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Expertise Areas</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Select the sectors where you have expertise. These map to CPV codes used in government tenders.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CPV_DIVISIONS.map((div) => (
              <button
                key={div.code}
                onClick={() => toggleExpertise(div.label)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  expertiseAreas.includes(div.label)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-slate-600/50 text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
                }`}
              >
                {expertiseAreas.includes(div.label) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {div.label}
              </button>
            ))}
          </div>
        </section>

        {/* Target CPV Divisions */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Target Tender Categories</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Select the tender categories you want to focus on. We'll prioritize these in your feed.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CPV_DIVISIONS.map((div) => (
              <button
                key={div.code}
                onClick={() => toggleCpvDivision(div.code)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  targetCpvDivisions.includes(div.code)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-slate-600/50 text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
                }`}
              >
                {targetCpvDivisions.includes(div.code) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {div.label}
              </button>
            ))}
          </div>
        </section>

        {/* Target Regions */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Target Regions</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
                  targetRegions.includes(region)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-slate-600/50 text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
                }`}
              >
                {targetRegions.includes(region) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {region}
              </button>
            ))}
          </div>
        </section>

        {/* Contract Value Range */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CurrencyPoundIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Contract Value Range</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Set your preferred contract value range to filter out opportunities that don't match.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-300 mb-1">Minimum (GBP)</label>
              <input
                type="number"
                value={minContractValue}
                onChange={(e) => setMinContractValue(e.target.value)}
                placeholder="0"
                className="w-full rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-slate-400 pt-6">to</span>
            <div className="flex-1">
              <label className="block text-sm text-slate-300 mb-1">Maximum (GBP)</label>
              <input
                type="number"
                value={maxContractValue}
                onChange={(e) => setMaxContractValue(e.target.value)}
                placeholder="No limit"
                className="w-full rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-100">Certifications</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Select certifications your company holds. This helps match you with tenders that require them.
          </p>

          <div className="flex flex-wrap gap-2">
            {CERTIFICATIONS.map((cert) => (
              <button
                key={cert}
                onClick={() => toggleCertification(cert)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  certifications.includes(cert)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-slate-600/50 text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
                }`}
              >
                {certifications.includes(cert) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {cert}
              </button>
            ))}
          </div>
        </section>

        {/* Sustainability Focus */}
        <section className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <h2 className="text-lg font-semibold text-slate-100">Sustainability Focus</h2>
            </div>
            <button
              onClick={() => setSustainabilityFocus(!sustainabilityFocus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                sustainabilityFocus ? 'bg-blue-900/200' : 'bg-slate-700/70'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-900/60 backdrop-blur-xl border-slate-700/50 transition-transform ${
                  sustainabilityFocus ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Enable this if your company focuses on sustainability, carbon reduction, or environmental services.
            We'll highlight relevant opportunities for you.
          </p>

          {sustainabilityFocus && (
            <div className="space-y-4 border-t border-slate-600/50 pt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sustainability Keywords
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSustainabilityKeyword}
                    onChange={(e) => setNewSustainabilityKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSustainabilityKeyword())}
                    placeholder="e.g., carbon reduction, net zero..."
                    className="flex-1 rounded-md border-slate-500/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    onClick={addSustainabilityKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {sustainabilityKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sustainabilityKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-900/20 px-3 py-1 text-sm text-green-400"
                    >
                      {keyword}
                      <button
                        onClick={() => removeSustainabilityKeyword(keyword)}
                        className="text-green-500 hover:text-green-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Danger Zone */}
        <section className="bg-red-900/20 rounded-lg border-red-200 p-6 mt-12">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          </div>
          <p className="text-sm text-red-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Account
          </button>
        </section>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Delete Account</h3>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to delete your account? This will permanently remove:
            </p>
            <ul className="text-sm text-slate-300 mb-4 list-disc list-inside">
              <li>Your user account</li>
              <li>Your company profile</li>
              <li>All saved preferences</li>
            </ul>

            <p className="text-sm text-slate-300 font-medium mb-2">
              Type <span className="font-mono bg-slate-800/50 px-1">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="w-full rounded-md border-slate-500/50 px-3 py-2 text-sm mb-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border-slate-500/50 text-slate-300 rounded-md text-sm font-medium hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
