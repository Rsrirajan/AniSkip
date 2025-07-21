import { useState, useEffect, useCallback } from 'react';
import { WatchGuide, generateWatchGuide, searchAndGenerateWatchGuide } from '../services/watchGuideService';

interface UseWatchGuideReturn {
  guides: WatchGuide[];
  loading: boolean;
  error: string | null;
  searchGuides: (query: string) => Promise<void>;
  loadPopularGuides: () => Promise<void>;
  clearError: () => void;
}

// Simple in-memory cache
const guideCache = new Map<number, WatchGuide>();
const searchCache = new Map<string, WatchGuide>();

export const useWatchGuide = (): UseWatchGuideReturn => {
  const [guides, setGuides] = useState<WatchGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPopularGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, load a few popular anime guides
      const popularAnimeIds = [21, 20, 1735, 269, 223, 813, 30694, 235, 6702, 11061]; // One Piece, Naruto, etc.
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
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check search cache first
      const cacheKey = query.toLowerCase().trim();
      if (searchCache.has(cacheKey)) {
        setGuides([searchCache.get(cacheKey)!]);
        return;
      }

      const result = await searchAndGenerateWatchGuide(query);
      
      if (result) {
        // Cache the result
        searchCache.set(cacheKey, result);
        guideCache.set(result.malId, result);
        setGuides([result]);
      } else {
        setGuides([]);
      }
    } catch (err) {
      setError('Failed to search for watch guides. Please try again later.');
      console.error('Error searching guides:', err);
      setGuides([]);
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