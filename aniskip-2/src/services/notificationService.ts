import { supabase } from "../lib/supabaseClient";

export interface AnimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_episode' | 'anime_announcement' | 'goal_achieved' | 'pro_feature';
  timestamp: Date;
  read: boolean;
  animeId?: number;
  animeTitle?: string;
  episodeNumber?: number;
}

// Fetch notifications for anime the user is watching
export async function fetchUserNotifications(userId: string): Promise<AnimeNotification[]> {
  if (!userId) return [];

  try {
    // Get user's watchlist
    const { data: watchlist, error: watchlistError } = await supabase
      .from('watchlist')
      .select('anime_id, status')
      .eq('user_id', userId)
      .in('status', ['Watching', 'Plan to Watch']);

    if (watchlistError) {
      console.error('Error fetching watchlist:', watchlistError);
      return [];
    }

    const notifications: AnimeNotification[] = [];
    const animeIds = watchlist.map(item => item.anime_id);

    // Fetch recent episodes for anime the user is watching
    for (const animeId of animeIds) {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        if (response.ok) {
          const data = await response.json();
          const episodes = data.data || [];
          
          // Get the latest episode
          if (episodes.length > 0) {
            const latestEpisode = episodes[episodes.length - 1];
            const episodeDate = new Date(latestEpisode.aired);
            const now = new Date();
            const daysDiff = (now.getTime() - episodeDate.getTime()) / (1000 * 3600 * 24);

            // If episode was released in the last 7 days, create a notification
            if (daysDiff <= 7 && daysDiff > 0) {
              notifications.push({
                id: `episode_${animeId}_${latestEpisode.mal_id}`,
                title: 'New Episode Available',
                message: `${latestEpisode.title || `Episode ${latestEpisode.mal_id}`} of ${latestEpisode.title || 'your anime'} is now available to watch!`,
                type: 'new_episode',
                timestamp: episodeDate,
                read: false,
                animeId: animeId,
                animeTitle: latestEpisode.title || 'Unknown Anime',
                episodeNumber: latestEpisode.mal_id
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching episodes for anime ${animeId}:`, error);
      }
    }

    // Add goal achievement notification (mock for now)
    const { data: profile } = await supabase
      .from('profiles')
      .select('watch_goal')
      .eq('id', userId)
      .single();

    if (profile?.watch_goal) {
      // This would be calculated based on actual watch time
      // For now, just add a mock notification
      notifications.push({
        id: 'goal_achieved',
        title: 'Watch Goal Achieved',
        message: 'Congratulations! You\'ve reached your monthly watch goal.',
        type: 'goal_achieved',
        timestamp: new Date(),
        read: false
      });
    }

    // Add pro feature notification for free users
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single();

    if (userProfile?.plan === 'free') {
      notifications.push({
        id: 'pro_feature',
        title: 'Pro Feature Available',
        message: 'Upgrade to Pro to unlock detailed episode breakdowns and smart watch guides!',
        type: 'pro_feature',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        read: true
      });
    }

    // Sort by timestamp (newest first)
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(): Promise<boolean> {
  // In a real app, you'd store this in a notifications table
  // For now, we'll just return success
  return true;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<boolean> {
  // In a real app, you'd update all notifications for this user
  // For now, we'll just return success
  return true;
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const notifications = await fetchUserNotifications(userId);
  return notifications.filter(n => !n.read).length;
} 