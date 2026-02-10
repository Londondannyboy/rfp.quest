'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlusIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useTeamMembers } from '@/lib/hooks/use-team-members';
import type { TeamMember } from '@/app/api/team-members/route';

export default function TeamMembersPage() {
  const { data, isLoading, refetch } = useTeamMembers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    role: '',
    linkedinUrl: '',
    skills: [],
    certifications: [],
    bidRoles: [],
    yearsExperience: null,
    sectorExperience: [],
    bio: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common bid roles
  const commonBidRoles = [
    'Bid Lead',
    'Technical Lead',
    'Solution Architect',
    'Project Manager',
    'Business Analyst',
    'Account Director',
    'Subject Matter Expert',
    'Quality Reviewer',
  ];

  // Common sectors
  const commonSectors = [
    'Government',
    'Healthcare',
    'Finance',
    'Defence',
    'Education',
    'Transport',
    'Energy',
    'Retail',
  ];

  const handleAddMember = async () => {
    if (!newMember.name) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add member');
      }

      setNewMember({
        name: '',
        email: '',
        role: '',
        linkedinUrl: '',
        skills: [],
        certifications: [],
        bidRoles: [],
        yearsExperience: null,
        sectorExperience: [],
        bio: '',
      });
      setShowAddForm(false);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !newMember.skills?.includes(newSkill.trim())) {
      setNewMember({
        ...newMember,
        skills: [...(newMember.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setNewMember({
      ...newMember,
      skills: newMember.skills?.filter((s) => s !== skill) || [],
    });
  };

  const addCertification = () => {
    if (newCert.trim() && !newMember.certifications?.includes(newCert.trim())) {
      setNewMember({
        ...newMember,
        certifications: [...(newMember.certifications || []), newCert.trim()],
      });
      setNewCert('');
    }
  };

  const removeCertification = (cert: string) => {
    setNewMember({
      ...newMember,
      certifications: newMember.certifications?.filter((c) => c !== cert) || [],
    });
  };

  const toggleBidRole = (role: string) => {
    const current = newMember.bidRoles || [];
    if (current.includes(role)) {
      setNewMember({ ...newMember, bidRoles: current.filter((r) => r !== role) });
    } else {
      setNewMember({ ...newMember, bidRoles: [...current, role] });
    }
  };

  const toggleSector = (sector: string) => {
    const current = newMember.sectorExperience || [];
    if (current.includes(sector)) {
      setNewMember({ ...newMember, sectorExperience: current.filter((s) => s !== sector) });
    } else {
      setNewMember({ ...newMember, sectorExperience: [...current, sector] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
              <p className="text-gray-600 mt-1">
                Add team members to get matched with relevant tenders
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <UserPlusIcon className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Add Member Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newMember.email || ''}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={newMember.role || ''}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Senior Consultant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={newMember.yearsExperience || ''}
                      onChange={(e) =>
                        setNewMember({ ...newMember, yearsExperience: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={newMember.linkedinUrl || ''}
                    onChange={(e) => setNewMember({ ...newMember, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="https://linkedin.com/in/johnsmith"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={newMember.bio || ''}
                    onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Brief professional summary..."
                  />
                </div>

                {/* Bid Roles */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonBidRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleBidRole(role)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          newMember.bidRoles?.includes(role)
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sector Experience */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector Experience
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSectors.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          newMember.sectorExperience?.includes(sector)
                            ? 'bg-teal-100 text-teal-700 border border-teal-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMember.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Add skill..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMember.certifications?.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {cert}
                        <button onClick={() => removeCertification(cert)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Add certification..."
                    />
                    <button
                      onClick={addCertification}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMember}
                    disabled={saving || !newMember.name}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckIcon className="w-5 h-5" />
                    )}
                    Add Member
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Members List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.members && data.members.length > 0 ? (
          <div className="space-y-4">
            {data.members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-6">
              Add team members to see who&apos;s best suited for each tender opportunity.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <UserPlusIcon className="w-5 h-5" />
              Add Your First Team Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>

          {member.bio && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{member.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            {member.yearsExperience && (
              <span>{member.yearsExperience}+ years experience</span>
            )}
            {member.sectorExperience.length > 0 && (
              <span>Sectors: {member.sectorExperience.slice(0, 3).join(', ')}</span>
            )}
          </div>

          {/* Bid Roles */}
          {member.bidRoles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {member.bidRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          {/* Skills */}
          {member.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {member.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
              {member.skills.length > 6 && (
                <span className="text-xs text-gray-400">+{member.skills.length - 6} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
