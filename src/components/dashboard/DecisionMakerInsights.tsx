'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { LinkedinIcon } from 'lucide-react';

export interface DecisionMakerProfile {
  name: string;
  role: string;
  linkedinUrl: string | null;
  linkedinProfile: {
    url: string;
    name: string;
    headline: string;
    location: string | null;
    followers: number | null;
    connections: number | null;
  } | null;
  recentTopics: string[];
  publicPriorities: string[];
  concerns: string[];
  bidInsights: string[];
  postCount: number;
}

interface DecisionMakerInsightsProps {
  companyNumber: string | null;
  onLoad?: () => void;
}

export function DecisionMakerInsights({ companyNumber }: DecisionMakerInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<DecisionMakerProfile[] | null>(null);
  const [stats, setStats] = useState<{
    directorsFound: number;
    profilesWithLinkedin: number;
    profilesWithPosts: number;
  } | null>(null);

  const fetchProfiles = async () => {
    if (!companyNumber || profiles) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/decision-makers/${companyNumber}/profile?maxDirectors=5`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch decision maker profiles');
      }

      const data = await response.json();
      setProfiles(data.profiles);
      setStats({
        directorsFound: data.directorsFound,
        profilesWithLinkedin: data.profilesWithLinkedin,
        profilesWithPosts: data.profilesWithPosts,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (newExpanded && !profiles && !isLoading) {
      fetchProfiles();
    }
  };

  if (!companyNumber) {
    return null;
  }

  return (
    <div className="border-t border-slate-700/50 pt-3">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <LinkedinIcon className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm text-slate-800">
            Decision Maker Insights
          </span>
          {stats && (
            <span className="text-xs text-slate-500">
              ({stats.profilesWithLinkedin}/{stats.directorsFound} on LinkedIn)
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="ml-2 text-sm text-slate-500">
                Searching LinkedIn profiles...
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {profiles && profiles.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No director profiles found for this company
            </p>
          )}

          {profiles && profiles.length > 0 && (
            <div className="space-y-2">
              {profiles.map((profile, index) => (
                <DecisionMakerCard key={index} profile={profile} />
              ))}
            </div>
          )}

          {profiles && profiles.length > 0 && (
            <p className="text-xs text-slate-400 text-center pt-2">
              Powered by LinkedIn data via Apify
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DecisionMakerCard({ profile }: { profile: DecisionMakerProfile }) {
  const [showDetails, setShowDetails] = useState(false);
  const hasInsights = profile.bidInsights.length > 0 || profile.recentTopics.length > 0;

  // Format role nicely
  const formatRole = (role: string) => {
    return role
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Format name (from "LASTNAME, Firstname" to "Firstname Lastname")
  const formatName = (name: string) => {
    const parts = name.split(', ');
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0].charAt(0)}${parts[0].slice(1).toLowerCase()}`;
    }
    return name;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50 p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 truncate">
              {profile.linkedinProfile?.name || formatName(profile.name)}
            </span>
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-slate-500">{formatRole(profile.role)}</p>

          {profile.linkedinProfile?.headline && (
            <p className="text-xs text-slate-600 mt-1 truncate">
              {profile.linkedinProfile.headline}
            </p>
          )}

          {profile.linkedinProfile?.location && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {profile.linkedinProfile.location}
            </div>
          )}
        </div>

        {hasInsights && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Insights
          </button>
        )}
      </div>

      {showDetails && hasInsights && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {profile.recentTopics.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Recent Topics</p>
              <div className="flex flex-wrap gap-1">
                {profile.recentTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.publicPriorities.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Public Priorities</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {profile.publicPriorities.map((priority, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-green-500">+</span>
                    {priority}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.bidInsights.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Bid Writing Tips</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {profile.bidInsights.map((insight, i) => (
                  <li key={i} className="bg-amber-900/20 p-2 rounded text-amber-800">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.postCount > 0 && (
            <p className="text-xs text-slate-400">
              Based on {profile.postCount} recent LinkedIn posts
            </p>
          )}
        </div>
      )}

      {!profile.linkedinUrl && (
        <p className="text-xs text-slate-400 mt-2 italic">
          LinkedIn profile not found
        </p>
      )}
    </div>
  );
}

// Loading skeleton
export function DecisionMakerInsightsSkeleton() {
  return (
    <div className="border-t border-slate-700/50 pt-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-700/70 rounded" />
        <div className="h-4 w-40 bg-slate-700/70 rounded" />
      </div>
    </div>
  );
}
