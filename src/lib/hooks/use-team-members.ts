'use client';

import { useQuery } from '@tanstack/react-query';
import type { TeamMember } from '@/app/api/team-members/route';

interface TeamMembersResponse {
  members: TeamMember[];
}

/**
 * Hook to fetch team members for the current user's company
 */
export function useTeamMembers() {
  return useQuery<TeamMembersResponse>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const response = await fetch('/api/team-members');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Calculate how well a team member matches a tender
 */
export interface TeamMemberMatch {
  member: TeamMember;
  score: number;
  reasons: string[];
  matchingSkills: string[];
  matchingSectors: string[];
  suggestedRole: string;
}

export function calculateTeamMatch(
  member: TeamMember,
  tender: {
    cpvCodes: string[] | null;
    title: string;
    description: string | null;
    buyerName: string;
    valueMax: number | null;
  }
): TeamMemberMatch {
  const reasons: string[] = [];
  const matchingSkills: string[] = [];
  const matchingSectors: string[] = [];
  let score = 0;

  const titleLower = tender.title.toLowerCase();
  const descLower = (tender.description || '').toLowerCase();
  const combinedText = `${titleLower} ${descLower}`;

  // Check skill matches
  member.skills.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    if (
      combinedText.includes(skillLower) ||
      (skillLower.includes('ai') && combinedText.includes('artificial intelligence')) ||
      (skillLower.includes('ml') && combinedText.includes('machine learning')) ||
      (skillLower.includes('llm') && combinedText.includes('language model'))
    ) {
      matchingSkills.push(skill);
      score += 15;
    }
  });

  if (matchingSkills.length > 0) {
    reasons.push(`Skills match: ${matchingSkills.slice(0, 3).join(', ')}`);
  }

  // Check sector experience
  const cpvSectorMap: Record<string, string[]> = {
    '72': ['IT', 'Technology', 'Digital', 'Software'],
    '73': ['R&D', 'Research', 'Innovation'],
    '79': ['Consulting', 'Business', 'Advisory'],
    '85': ['Healthcare', 'Health', 'NHS'],
    '75': ['Government', 'Public Sector', 'Defence'],
    '45': ['Construction', 'Infrastructure'],
  };

  if (tender.cpvCodes && tender.cpvCodes.length > 0) {
    const primaryDiv = tender.cpvCodes[0].substring(0, 2);
    const sectorKeywords = cpvSectorMap[primaryDiv] || [];

    member.sectorExperience.forEach((sector) => {
      const sectorLower = sector.toLowerCase();
      if (sectorKeywords.some((kw) => sectorLower.includes(kw.toLowerCase()))) {
        matchingSectors.push(sector);
        score += 20;
      }
    });

    if (matchingSectors.length > 0) {
      reasons.push(`Sector expertise: ${matchingSectors.join(', ')}`);
    }
  }

  // Check years of experience
  if (member.yearsExperience) {
    if (member.yearsExperience >= 10) {
      score += 15;
      reasons.push('Senior experience (10+ years)');
    } else if (member.yearsExperience >= 5) {
      score += 10;
    }
  }

  // Check certifications relevance
  const relevantCerts = member.certifications.filter((cert) => {
    const certLower = cert.toLowerCase();
    return (
      combinedText.includes('security') && certLower.includes('security') ||
      combinedText.includes('cloud') && (certLower.includes('aws') || certLower.includes('azure') || certLower.includes('google')) ||
      combinedText.includes('data') && certLower.includes('data')
    );
  });

  if (relevantCerts.length > 0) {
    score += 10;
    reasons.push(`Relevant certifications: ${relevantCerts.slice(0, 2).join(', ')}`);
  }

  // Check bid roles
  const suggestedRole = member.bidRoles.length > 0
    ? member.bidRoles[0]
    : member.role || 'Team Member';

  // Bonus for bid leadership experience
  if (member.bidRoles.some((r) => r.toLowerCase().includes('lead'))) {
    score += 10;
    reasons.push('Bid leadership experience');
  }

  // Contract value appropriateness (larger contracts need senior people)
  if (tender.valueMax && tender.valueMax >= 1000000 && member.yearsExperience && member.yearsExperience >= 8) {
    score += 5;
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    member,
    score,
    reasons,
    matchingSkills,
    matchingSectors,
    suggestedRole,
  };
}

/**
 * Get the best matching team members for a tender
 */
export function getBestTeamMatches(
  members: TeamMember[],
  tender: {
    cpvCodes: string[] | null;
    title: string;
    description: string | null;
    buyerName: string;
    valueMax: number | null;
  },
  limit: number = 3
): TeamMemberMatch[] {
  const matches = members.map((member) => calculateTeamMatch(member, tender));
  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
