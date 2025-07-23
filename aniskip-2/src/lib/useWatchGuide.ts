import { useState, useEffect, useCallback } from 'react';
import { WatchGuide, generateWatchGuide, searchAndGenerateWatchGuide } from '../services/watchGuideService';
import { FranchiseWatchGuide, searchFranchiseWatchGuide, getAllFranchiseGuides } from '../services/franchiseWatchGuideService';

interface UseWatchGuideReturn {
  guides: WatchGuide[];
  franchiseGuides: FranchiseWatchGuide[];
  loading: boolean;
  error: string | null;
  searchGuides: (query: string) => Promise<void>;
  loadPopularGuides: () => Promise<void>;
  clearError: () => void;
}

// Simple in-memory cache
const guideCache = new Map<number, WatchGuide>();
const searchCache = new Map<string, WatchGuide>();
const franchiseCache = new Map<string, FranchiseWatchGuide>();

export const useWatchGuide = (): UseWatchGuideReturn => {
  const [guides, setGuides] = useState<WatchGuide[]>([]);
  const [franchiseGuides, setFranchiseGuides] = useState<FranchiseWatchGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPopularGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load franchise guides first (these are more comprehensive)
      const loadedFranchiseGuides = await getAllFranchiseGuides();
      setFranchiseGuides(loadedFranchiseGuides);
      
      // Load individual anime guides for non-franchise anime
      const popularAnimeIds = [21, 6702, 11061, 16498, 31964, 38000, 40748, 34572]; // One Piece, Fairy Tail, etc.
      const loadedGuides: WatchGuide[] = [];

      for (const malId of popularAnimeIds) {
        try {
          // Check cache first
          if (guideCache.has(malId)) {
            loadedGuides.push(guideCache.get(malId)!);
            continue;
          }

          const guide = await generateWatchGuide(malId);
          guideCache.set(malId, guide);
          loadedGuides.push(guide);

          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          console.error(`Failed to load guide for anime ${malId}:`, err);
          // Continue with other guides even if one fails
        }
      }

      setGuides(loadedGuides);
    } catch (err) {
      setError('Failed to load watch guides. Please try again later.');
      console.error('Error loading popular guides:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGuides = useCallback(async (query: string) => {
    if (!query.trim()) {
      setGuides([]);
      setFranchiseGuides([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First try to find a franchise guide
      const franchiseCacheKey = query.toLowerCase().trim();
      let franchiseResult = null;
      
      if (franchiseCache.has(franchiseCacheKey)) {
        franchiseResult = franchiseCache.get(franchiseCacheKey)!;
      } else {
        franchiseResult = await searchFranchiseWatchGuide(query);
        if (franchiseResult) {
          franchiseCache.set(franchiseCacheKey, franchiseResult);
        }
      }
      
      if (franchiseResult) {
        // Show franchise guide
        setFranchiseGuides([franchiseResult]);
        setGuides([]);
        return;
      }

      // If no franchise guide found, try individual anime guide
      const cacheKey = query.toLowerCase().trim();
      if (searchCache.has(cacheKey)) {
        setGuides([searchCache.get(cacheKey)!]);
        setFranchiseGuides([]);
        return;
      }

      const result = await searchAndGenerateWatchGuide(query);
      
      if (result) {
        // Cache the result
        searchCache.set(cacheKey, result);
        guideCache.set(result.malId, result);
        setGuides([result]);
        setFranchiseGuides([]);
      } else {
        setGuides([]);
        setFranchiseGuides([]);
      }
    } catch (err) {
      setError('Failed to search for watch guides. Please try again later.');
      console.error('Error searching guides:', err);
      setGuides([]);
      setFranchiseGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load popular guides on mount
  useEffect(() => {
    loadPopularGuides();
  }, [loadPopularGuides]);

  return {
    guides,
    franchiseGuides,
    loading,
    error,
    searchGuides,
    loadPopularGuides,
    clearError,
  };
};

// Hook for individual watch guide
export const useIndividualWatchGuide = (malId: number | null) => {
  const [guide, setGuide] = useState<WatchGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGuide = useCallback(async () => {
    if (!malId) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (guideCache.has(malId)) {
        setGuide(guideCache.get(malId)!);
        return;
      }

      const watchGuide = await generateWatchGuide(malId);
      guideCache.set(malId, watchGuide);
      setGuide(watchGuide);
    } catch (err) {
      setError('Failed to load watch guide. Please try again later.');
      console.error('Error loading individual guide:', err);
    } finally {
      setLoading(false);
    }
  }, [malId]);

  useEffect(() => {
    loadGuide();
  }, [loadGuide]);

  return {
    guide,
    loading,
    error,
    reload: loadGuide,
  };
}; 