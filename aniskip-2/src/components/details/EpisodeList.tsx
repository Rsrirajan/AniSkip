import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Anime } from '../../services/anilist';

interface EpisodeListProps {
  anime: Anime;
  userId: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ anime, userId }) => {
  const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('user_anime_progress')
        .select('watched_episodes')
        .eq('user_id', userId)
        .eq('anime_id', anime.id)
        .single();

      if (data) {
        setWatchedEpisodes(data.watched_episodes || []);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [anime.id, userId]);

  const handleEpisodeToggle = async (episodeNumber: number) => {
    const newWatchedEpisodes = watchedEpisodes.includes(episodeNumber)
      ? watchedEpisodes.filter(e => e !== episodeNumber)
      : [...watchedEpisodes, episodeNumber];

    const { error } = await supabase.from('user_anime_progress').upsert({
      user_id: userId,
      anime_id: anime.id,
      watched_episodes: newWatchedEpisodes,
    }, { onConflict: 'user_id, anime_id' });

    if (!error) {
      setWatchedEpisodes(newWatchedEpisodes);
    } else {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return <div>Loading episodes...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {Array.from({ length: anime.episodes }, (_, i) => i + 1).map(episode => (
          <button
            key={episode}
            onClick={() => handleEpisodeToggle(episode)}
            className={`p-2 rounded-md text-center ${
              watchedEpisodes.includes(episode)
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {episode}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;