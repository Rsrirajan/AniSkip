import { supabase } from "../lib/supabaseClient";

export interface WatchlistItem {
  id?: number;
  user_id: string;
  anime_id: number;
  site: string;
  status: string;
  current_episode: number;
  rating?: number;
  notes?: string;
}

// Get all tracked anime for a user
export async function getTrackedAnimeMap(userId: string): Promise<Record<string, { status: string; episode: number }>> {
  console.log('getTrackedAnimeMap called with userId:', userId);
  if (!userId) {
    console.log('No userId provided, returning empty map');
    return {};
  }
  
  try {
    console.log('Fetching watchlist from Supabase...');
    const { data, error } = await supabase
      .from('watchlist')
      .select('anime_id, status, current_episode')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching watchlist:', error);
      return {};
    }
    
    console.log('Watchlist data received:', data);
    const map: Record<string, { status: string; episode: number }> = {};
    data?.forEach(item => {
      map[item.anime_id.toString()] = {
        status: item.status,
        episode: item.current_episode
      };
    });
    
    console.log('Processed watchlist map:', map);
    return map;
  } catch (error) {
    console.error('Error in getTrackedAnimeMap:', error);
    return {};
  }
}

// Add or update an anime in the watchlist
export async function setTrackedAnime(userId: string, animeId: number, status: string, episode: number, site: string = 'anilist'): Promise<boolean> {
  console.log('setTrackedAnime called with:', { userId, animeId, status, episode, site });
  if (!userId) {
    console.log('No userId provided, returning false');
    return false;
  }
  
  try {
    // First check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Auth check result:', { user: user?.id });
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Validate inputs
    if (!animeId || !status || episode < 1) {
      console.error('Invalid inputs:', { animeId, status, episode });
      return false;
    }
    
    const watchlistItem = {
      user_id: userId,
      anime_id: animeId,
      site: site,
      status: status,
      current_episode: episode
    };
    console.log('Attempting to upsert watchlist item:', watchlistItem);
    
    // Test the connection first
    const { data: testData, error: testError } = await supabase
      .from('watchlist')
      .select('count')
      .limit(1);
    
    console.log('Connection test result:', { testData, testError });
    
    const { data, error } = await supabase
      .from('watchlist')
      .upsert(watchlistItem, { 
        onConflict: 'user_id,anime_id'
      });
    
    console.log('Upsert result:', { data, error });
    
    if (error) {
      console.error('Error updating watchlist:', error);
      // If it's an RLS error, we need to enable RLS with proper policies
      if (error.code === '42501') {
        console.error('RLS (Row Level Security) error. Need to enable RLS with proper policies.');
      }
      // If it's a foreign key error, the table might not exist
      if (error.code === '23503') {
        console.error('Foreign key error. Check if the watchlist table exists and has proper constraints.');
      }
      // If it's a unique constraint error
      if (error.code === '23505') {
        console.error('Unique constraint error. This might be expected for updates.');
      }
      return false;
    }
    
    console.log('Successfully upserted watchlist item:', data);
    return true;
  } catch (error) {
    console.error('Error in setTrackedAnime:', error);
    return false;
  }
}

// Remove an anime from the watchlist
export async function removeTrackedAnime(userId: string, animeId: number): Promise<boolean> {
  console.log('removeTrackedAnime called with:', { userId, animeId });
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('anime_id', animeId);
    
    if (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
    
    console.log('Successfully removed anime from watchlist');
    return true;
  } catch (error) {
    console.error('Error in removeTrackedAnime:', error);
    return false;
  }
}

// Get a specific anime from watchlist
export async function getTrackedAnime(userId: string, animeId: number): Promise<{ status: string; episode: number } | null> {
  console.log('getTrackedAnime called with:', { userId, animeId });
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('status, current_episode')
      .eq('user_id', userId)
      .eq('anime_id', animeId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        console.log('No anime found in watchlist for this user/anime combination');
        return null;
      }
      console.error('Error fetching anime from watchlist:', error);
      return null;
    }
    
    console.log('Found anime in watchlist:', data);
    return {
      status: data.status,
      episode: data.current_episode
    };
  } catch (error) {
    console.error('Error in getTrackedAnime:', error);
    return null;
  }
} 

// Test function to verify database connection and RLS policies
export async function testWatchlistConnection(userId: string): Promise<{ success: boolean; error?: string; details?: any }> {
  console.log('Testing watchlist connection for userId:', userId);
  
  try {
    // Test 1: Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Test 2: Check if we can read from the table
    const { data: readData, error: readError } = await supabase
      .from('watchlist')
      .select('*')
      .limit(1);
    
    console.log('Read test result:', { readData, readError });
    
    // Test 3: Try to insert a test record
    const testItem = {
      user_id: userId,
      anime_id: 999999, // Use a high number to avoid conflicts
      site: 'test',
      status: 'test',
      current_episode: 1
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('watchlist')
      .insert(testItem);
    
    console.log('Insert test result:', { insertData, insertError });
    
    // Test 4: Try to delete the test record
    const { error: deleteError } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('anime_id', 999999);
    
    console.log('Delete test result:', { deleteError });
    
    if (readError) {
      return { 
        success: false, 
        error: 'Cannot read from watchlist table', 
        details: readError 
      };
    }
    
    if (insertError) {
      return { 
        success: false, 
        error: 'Cannot insert into watchlist table', 
        details: insertError 
      };
    }
    
    return { success: true, details: { readData, insertData } };
    
  } catch (error) {
    console.error('Error testing watchlist connection:', error);
    return { success: false, error: 'Connection test failed', details: error };
  }
} 