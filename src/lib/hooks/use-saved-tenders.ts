'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rfp-quest-saved-tenders';

export interface SavedTender {
  ocid: string;
  slug: string;
  title: string;
  buyerName: string | null;
  valueMax: number | null;
  deadline: string | null;
  savedAt: string;
}

export function useSavedTenders() {
  const [savedTenders, setSavedTenders] = useState<SavedTender[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedTenders(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved tenders:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTenders));
      } catch (e) {
        console.error('Failed to save tenders:', e);
      }
    }
  }, [savedTenders, isLoaded]);

  const saveTender = useCallback((tender: Omit<SavedTender, 'savedAt'>) => {
    setSavedTenders((prev) => {
      // Don't add duplicates
      if (prev.some((t) => t.ocid === tender.ocid)) {
        return prev;
      }
      return [...prev, { ...tender, savedAt: new Date().toISOString() }];
    });
  }, []);

  const removeTender = useCallback((ocid: string) => {
    setSavedTenders((prev) => prev.filter((t) => t.ocid !== ocid));
  }, []);

  const isSaved = useCallback(
    (ocid: string) => savedTenders.some((t) => t.ocid === ocid),
    [savedTenders]
  );

  const toggleSaved = useCallback(
    (tender: Omit<SavedTender, 'savedAt'>) => {
      if (isSaved(tender.ocid)) {
        removeTender(tender.ocid);
      } else {
        saveTender(tender);
      }
    },
    [isSaved, removeTender, saveTender]
  );

  return {
    savedTenders,
    savedCount: savedTenders.length,
    saveTender,
    removeTender,
    isSaved,
    toggleSaved,
    isLoaded,
  };
}
