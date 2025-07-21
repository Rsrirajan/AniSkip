import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { getTrackedAnimeMap, setTrackedAnime, removeTrackedAnime } from '../services/watchlistService';

export function useWatchlist() {
  const [trackedMap, setTrackedMap] = useState<Record<string, { status: string; episode: number; site: string }>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      console.log('useWatchlist: Fetching current user...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('useWatchlist: Current user:', user);
      setUserId(user?.id || null);
      setLoading(false);
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useWatchlist: Auth state changed:', event, session?.user?.id);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load watchlist when user changes
  useEffect(() => {
    const loadWatchlist = async () => {
      console.log('useWatchlist: Loading watchlist for userId:', userId);
      if (userId) {
        const map = await getTrackedAnimeMap(userId);
        console.log('useWatchlist: Setting trackedMap:', map);
        setTrackedMap(map);
      } else {
        console.log('useWatchlist: No userId, setting empty trackedMap');
        setTrackedMap({});
      }
    };

    loadWatchlist();
  }, [userId]);

  // Function to update tracked anime
  const updateTrackedAnime = async (animeId: number, status: string, episode: number): Promise<boolean> => {
    console.log('useWatchlist: updateTrackedAnime called with:', { animeId, status, episode, userId });
    if (!userId) {
      console.log('useWatchlist: No userId, cannot update tracked anime');
      return false;
    }

    try {
      const success = await setTrackedAnime(userId, animeId, status, episode);
      console.log('useWatchlist: setTrackedAnime result:', success);
      if (success) {
        // Update local state
        const newMap = {
          ...trackedMap,
          [animeId.toString()]: { status, episode }
        };
        console.log('useWatchlist: Updating local state with:', newMap);
        setTrackedMap(newMap);
      }
      return success;
    } catch (error) {
      console.error('useWatchlist: Error updating tracked anime:', error);
      return false;
    }
  };

  // Function to remove tracked anime
  const removeAnime = async (animeId: number) => {
    console.log('useWatchlist: removeAnime called with:', { animeId, userId });
    if (!userId) return false;

    const success = await removeTrackedAnime(userId, animeId);
    if (success) {
      // Update local state
      setTrackedMap(prev => {
        const newMap = { ...prev };
        delete newMap[animeId.toString()];
        return newMap;
      });
    }
    return success;
  };

  return {
    trackedMap,
    userId,
    loading,
    updateTrackedAnime,
    removeAnime
  };
} 