'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTeamMembers, getBestTeamMatches, type TeamMemberMatch } from '@/lib/hooks/use-team-members';
import type { Tender } from '@/lib/hooks/use-tenders';

interface TeamMatchBadgeProps {
  tender: Tender;
  compact?: boolean;
  showDetails?: boolean;
  maxMembers?: number;
}

/**
 * Shows the best matching team member(s) for a tender
 */
export function TeamMatchBadge({
  tender,
  compact = false,
  showDetails = true,
  maxMembers = 1,
}: TeamMatchBadgeProps) {
  const { data, isLoading } = useTeamMembers();

  const matches = useMemo(() => {
    if (!data?.members || data.members.length === 0) return [];

    return getBestTeamMatches(
      data.members,
      {
        cpvCodes: tender.cpvCodes,
        title: tender.title,
        description: tender.description,
        buyerName: tender.buyerName,
        valueMax: tender.valueMax,
      },
      maxMembers
    );
  }, [data?.members, tender, maxMembers]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-6 h-6 bg-slate-800/60 rounded-full" />
        <div className="w-20 h-4 bg-slate-800/60 rounded" />
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  if (compact) {
    return <CompactTeamBadge matches={matches} />;
  }

  return (
    <div className="space-y-2">
      {matches.map((match, index) => (
        <TeamMemberCard
          key={match.member.id}
          match={match}
          showDetails={showDetails}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * Compact badge showing just avatar + name + score
 */
function CompactTeamBadge({ matches }: { matches: TeamMemberMatch[] }) {
  const topMatch = matches[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-indigo-100"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {topMatch.member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        {/* Score indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-white text-[8px] font-bold flex items-center justify-center"
          style={{
            backgroundColor: topMatch.score >= 70 ? '#10b981' : topMatch.score >= 40 ? '#f59e0b' : '#ef4444',
            color: 'white',
          }}
        >
          {Math.round(topMatch.score / 10)}
        </div>
      </div>

      {/* Name + Role */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-100 leading-tight">
          {topMatch.member.name.split(' ')[0]}
        </span>
        <span className="text-[10px] text-slate-500 leading-tight">
          {topMatch.suggestedRole}
        </span>
      </div>

      {/* Additional members indicator */}
      {matches.length > 1 && (
        <span className="text-[10px] text-slate-400 ml-1">
          +{matches.length - 1}
        </span>
      )}
    </motion.div>
  );
}

/**
 * Full team member card with details
 */
function TeamMemberCard({
  match,
  showDetails,
  index,
}: {
  match: TeamMemberMatch;
  showDetails: boolean;
  index: number;
}) {
  const { member, score, reasons, matchingSkills, suggestedRole } = match;

  const scoreColor = score >= 70 ? 'emerald' : score >= 40 ? 'amber' : 'red';
  const gradientColors = {
    emerald: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-700/50 p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {/* Avatar with score ring */}
        <div className="relative flex-shrink-0">
          <svg width="48" height="48" viewBox="0 0 48 48" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            {/* Score ring */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 125.6} 125.6`}
            />
          </svg>

          {/* Avatar in center */}
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br ${gradientColors[scoreColor]} flex items-center justify-center text-white font-bold text-sm shadow`}>
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}

          {/* Score label */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 px-1.5 py-0.5 rounded-full border-slate-700/50 shadow-sm">
            <span className={`text-[10px] font-bold ${
              score >= 70 ? 'text-blue-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {score}%
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 truncate">
                {member.name}
              </h4>
              <p className="text-xs text-slate-500">
                {member.role || suggestedRole}
              </p>
            </div>

            {/* Suggested role badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700">
              {suggestedRole}
            </span>
          </div>

          {/* Match reasons */}
          {showDetails && reasons.length > 0 && (
            <div className="mt-2 space-y-1">
              {reasons.slice(0, 3).map((reason, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] text-slate-300">{reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Matching skills pills */}
          {showDetails && matchingSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {matchingSkills.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-blue-950/20 text-blue-400 border-blue-700/40"
                >
                  {skill}
                </span>
              ))}
              {matchingSkills.length > 4 && (
                <span className="text-[10px] text-slate-400 px-1">
                  +{matchingSkills.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Experience + LinkedIn */}
          <div className="mt-2 flex items-center gap-3">
            {member.yearsExperience && (
              <span className="text-[10px] text-slate-400">
                {member.yearsExperience}+ years
              </span>
            )}
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                View
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Team match section for expanded tender rows
 */
export function TeamMatchSection({
  tender,
}: {
  tender: Tender;
}) {
  const { data, isLoading } = useTeamMembers();

  const matches = useMemo(() => {
    if (!data?.members || data.members.length === 0) return [];

    return getBestTeamMatches(
      data.members,
      {
        cpvCodes: tender.cpvCodes,
        title: tender.title,
        description: tender.description,
        buyerName: tender.buyerName,
        valueMax: tender.valueMax,
      },
      5
    );
  }, [data?.members, tender]);

  if (isLoading) {
    return (
      <div className="p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 bg-slate-800/60 rounded" />
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-24 bg-slate-800/60 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.members || data.members.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-slate-700/50">
        <div className="text-center py-4">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-800/60 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-300 font-medium">No team members yet</p>
          <p className="text-xs text-slate-500 mt-1">Add team members to see who&apos;s best suited for this bid</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-amber-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-700">No strong team matches for this tender</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Recommended Team
        </h4>
        <span className="text-xs text-slate-500">{matches.length} matches</span>
      </div>

      {/* Top match highlighted */}
      <TeamMemberCard match={matches[0]} showDetails={true} index={0} />

      {/* Other matches as compact row */}
      {matches.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {matches.slice(1).map((match, i) => (
            <motion.div
              key={match.member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i + 1) * 0.1 }}
              className="inline-flex items-center gap-2 px-2 py-1.5 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg border-slate-700/50"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold">
                {match.member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-100">{match.member.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500">{match.score}% match</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
