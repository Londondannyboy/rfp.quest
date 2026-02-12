'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [isValidating, setIsValidating] = useState(false);
  const hasValidated = useRef(false);

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

  // Validate saved tenders exist in DB and remove stale entries
  useEffect(() => {
    if (!isLoaded || savedTenders.length === 0 || hasValidated.current) return;

    const validateSavedTenders = async () => {
      setIsValidating(true);
      hasValidated.current = true;

      try {
        // Fetch all saved tenders by their OCIDs
        const ocids = savedTenders.map(t => t.ocid);
        const response = await fetch(`/api/tenders/search?ocids=${ocids.join(',')}`);

        if (!response.ok) {
          console.error('Failed to validate saved tenders');
          return;
        }

        const data = await response.json();
        const validOcids = new Set(data.tenders.map((t: { ocid: string }) => t.ocid));

        // Filter out any saved tenders that no longer exist in DB
        const staleTenders = savedTenders.filter(t => !validOcids.has(t.ocid));

        if (staleTenders.length > 0) {
          console.log(`Removing ${staleTenders.length} stale saved tender(s)`);
          setSavedTenders(prev => prev.filter(t => validOcids.has(t.ocid)));
        }
      } catch (e) {
        console.error('Error validating saved tenders:', e);
      } finally {
        setIsValidating(false);
      }
    };

    validateSavedTenders();
  }, [isLoaded, savedTenders]);

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
    isValidating,
  };
}
