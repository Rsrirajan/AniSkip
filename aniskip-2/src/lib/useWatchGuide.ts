import { useState, useEffect, useCallback } from 'react';
import { WatchGuide, generateWatchGuide } from '../services/watchGuideService';

interface UseWatchGuideReturn {
  guides: WatchGuide[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// Simple in-memory cache
const guideCache = new Map<number, WatchGuide>();

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
      
      // Only load One Piece and Black Clover
      const targetAnimeIds = [21, 34572]; // One Piece, Black Clover
      const loadedGuides: WatchGuide[] = [];

      for (const malId of targetAnimeIds) {
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

  // Load popular guides on mount
  useEffect(() => {
    loadPopularGuides();
  }, [loadPopularGuides]);

  return {
    guides,
    loading,
    error,
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