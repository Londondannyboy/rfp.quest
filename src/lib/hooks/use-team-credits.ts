import { useState, useEffect } from 'react';
import { getTeamCredits } from '@/lib/db/operations';
import type { TeamCredits } from '@/lib/db/types';

export function useTeamCredits(teamId: string) {
  const [credits, setCredits] = useState<TeamCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    if (!teamId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const teamCredits = await getTeamCredits(teamId);
      setCredits(teamCredits);
    } catch (err) {
      console.error('Failed to fetch team credits:', err);
      setError('Failed to load credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [teamId]);

  const refetch = () => {
    fetchCredits();
  };

  const hasCredits = (amount: number = 1): boolean => {
    if (!credits) return false;
    if (credits.credits_remaining === -1) return true; // Unlimited
    return credits.credits_remaining >= amount;
  };

  const isUnlimited = (): boolean => {
    return credits?.credits_remaining === -1;
  };

  const getPercentageUsed = (): number => {
    if (!credits || credits.monthly_allowance === -1) return 0;
    return (credits.credits_used_this_period / credits.monthly_allowance) * 100;
  };

  const getDaysUntilRefresh = (): number => {
    if (!credits) return 0;
    const now = new Date();
    const periodEnd = new Date(credits.period_end);
    const diffTime = Math.abs(periodEnd.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    credits,
    loading,
    error,
    refetch,
    hasCredits,
    isUnlimited,
    getPercentageUsed,
    getDaysUntilRefresh,
  };
}