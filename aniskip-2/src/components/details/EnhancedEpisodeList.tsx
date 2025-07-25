import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Anime } from '../../services/anilist';

import { Lock, Play, SkipForward, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EpisodeListProps {
  anime: Anime;
  userId: string;
}

interface Episode {
  number: number;
  title?: string;
  type: 'canon' | 'filler' | 'recap' | 'mixed';
  recommendation: 'watch' | 'skip' | 'optional' | 'recommended';
  reason?: string;
  timeSaved?: number;
  streamingLinks?: {
    crunchyroll?: string;
    funimation?: string;
    netflix?: string;
    hulu?: string;
  };
}

// Mock episode data - in production this would come from your database or API
const generateEpisodeData = (animeId: number, totalEpisodes: number): Episode[] => {
  return Array.from({ length: totalEpisodes }, (_, i) => {
    const episodeNumber = i + 1;
    
    // Simple algorithm to determine episode types based on patterns
    let type: 'canon' | 'filler' | 'recap' | 'mixed' = 'canon';
    let recommendation: 'watch' | 'skip' | 'optional' | 'recommended' = 'watch';
    let reason = 'Canon episode - essential for story progression';
    let timeSaved = 0;
    
    // Every 5th episode is a recap
    if (episodeNumber % 5 === 0) {
      type = 'recap';
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher';
      timeSaved = 24;
    }
    // Every 7th episode (except recaps) is filler
    else if (episodeNumber % 7 === 0) {
      type = 'filler';
      recommendation = 'optional';
      reason = 'Filler episode - optional content that doesn\'t affect main story';
      timeSaved = 0;
    }
    // Every 13th episode is high-quality filler
    else if (episodeNumber % 13 === 0) {
      type = 'filler';
      recommendation = 'recommended';
      reason = 'High-quality filler - great character development and entertainment value';
      timeSaved = 0;
    }
    
    return {
      number: episodeNumber,
      title: `Episode ${episodeNumber}`,
      type,
      recommendation,
      reason,
      timeSaved,
      streamingLinks: {
        crunchyroll: `https://crunchyroll.com/watch/${animeId}-${episodeNumber}`,
        funimation: `https://funimation.com/shows/${animeId}/episode-${episodeNumber}`,
      }
    };
  });
};

const getEpisodeColor = (type: string, recommendation: string) => {
  if (recommendation === 'recommended') return 'bg-purple-600 text-white border-2 border-purple-400';
  if (recommendation === 'skip') return 'bg-red-600/60 text-red-200';
  if (recommendation === 'optional') return 'bg-yellow-600/60 text-yellow-200';
  if (type === 'canon') return 'bg-blue-600 text-white';
  return 'bg-gray-600 text-gray-200';
};

const getEpisodeIcon = (_type: string, recommendation: string) => {
  if (recommendation === 'recommended') return <Award className="w-3 h-3" />;
  if (recommendation === 'skip') return <SkipForward className="w-3 h-3" />;
  if (recommendation === 'optional') return <Clock className="w-3 h-3" />;
  return <Play className="w-3 h-3" />;
};

const EnhancedEpisodeList: React.FC<EpisodeListProps> = ({ anime, userId }) => {
  const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const navigate = useNavigate();
  
  const isPro = true; // All features are now free

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('user_anime_progress')
        .select('watched_episodes')
        .eq('user_id', userId)
        .eq('anime_id', anime.id)
        .single();

      if (data) {
        setWatchedEpisodes(data.watched_episodes || []);
      }
      
      // Generate episode data
      const episodeData = generateEpisodeData(anime.id, anime.episodes);
      setEpisodes(episodeData);
      
      setLoading(false);
    };

    fetchProgress();
  }, [anime.id, userId, anime.episodes]);

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

  const handleUpgrade = () => {
    navigate('/premium');
  };

  if (loading) {
    return <div className="text-white">Loading episodes...</div>;
  }

  // Calculate stats
  const stats = {
    total: episodes.length,
    canon: episodes.filter(ep => ep.type === 'canon').length,
    filler: episodes.filter(ep => ep.type === 'filler').length,
    recap: episodes.filter(ep => ep.type === 'recap').length,
    timeSaved: episodes.reduce((total, ep) => total + (ep.timeSaved || 0), 0),
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Episodes</h2>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span className="bg-green-900/20 border border-green-700/30 px-3 py-1 rounded-full">
            🎉 All Features Free!
          </span>
        </div>
      </div>

      {/* Episode Type Legend - Available to all users */}
      <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-2">Episode Types</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-blue-200">Canon</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-600/60 rounded"></div>
            <span className="text-yellow-200">Filler</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-600/60 rounded"></div>
            <span className="text-red-200">Recap</span>
          </div>
          {isPro && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-600 rounded border border-purple-400"></div>
              <span className="text-purple-200">Recommended</span>
            </div>
          )}
        </div>
      </div>

      {/* Pro Stats */}
      {isPro && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
          <h3 className="text-sm font-semibold text-white mb-2">Smart Watch Guide Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{stats.total}</div>
              <div className="text-gray-400">Total Episodes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{stats.canon}</div>
              <div className="text-gray-400">Canon</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{stats.filler}</div>
              <div className="text-gray-400">Filler</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{stats.recap}</div>
              <div className="text-gray-400">Recap</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{Math.round(stats.timeSaved / 60)}h</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes Grid */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
        {episodes.map(episode => (
          <div
            key={episode.number}
            className={`relative p-2 rounded-md text-center cursor-pointer transition-all hover:scale-105 ${
              watchedEpisodes.includes(episode.number)
                ? 'bg-green-500 text-white ring-2 ring-green-400'
                : getEpisodeColor(episode.type, episode.recommendation)
            }`}
            onClick={() => handleEpisodeToggle(episode.number)}
            onMouseEnter={() => setSelectedEpisode(episode)}
            onMouseLeave={() => setSelectedEpisode(null)}
          >
            <div className="flex items-center justify-center gap-1">
              {isPro && getEpisodeIcon(episode.type, episode.recommendation)}
              <span className="text-sm font-medium">{episode.number}</span>
            </div>
            
            {/* Pro-only episode type indicator */}
            {!isPro && (
              <div className="absolute -top-1 -right-1">
                <div className={`w-2 h-2 rounded-full ${
                  episode.type === 'canon' ? 'bg-blue-500' :
                  episode.type === 'filler' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Episode Details Tooltip/Panel */}
      {selectedEpisode && isPro && (
        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg z-50">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-white">Episode {selectedEpisode.number}</h4>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              selectedEpisode.recommendation === 'recommended' ? 'bg-purple-600 text-white' :
              selectedEpisode.recommendation === 'skip' ? 'bg-red-600 text-white' :
              selectedEpisode.recommendation === 'optional' ? 'bg-yellow-600 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {selectedEpisode.recommendation.toUpperCase()}
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">{selectedEpisode.reason}</p>
          
          {selectedEpisode.timeSaved && selectedEpisode.timeSaved > 0 && (
            <div className="flex items-center gap-1 text-green-400 text-sm mb-3">
              <Clock className="w-4 h-4" />
              <span>Save {selectedEpisode.timeSaved} minutes by skipping</span>
            </div>
          )}
          
          {/* Streaming Links for Pro Users */}
          {selectedEpisode.streamingLinks && (
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm">Watch on:</span>
              {Object.entries(selectedEpisode.streamingLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Free User Episode Info */}
      {selectedEpisode && !isPro && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-white">Episode {selectedEpisode.number}</h4>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                selectedEpisode.type === 'canon' ? 'bg-blue-600 text-white' :
                selectedEpisode.type === 'filler' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {selectedEpisode.type.toUpperCase()}
              </span>
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
              >
                <Lock className="w-3 h-3" />
                Unlock Smart Guides
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Upgrade to Pro to see detailed recommendations, streaming links, and time-saving insights!</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedEpisodeList;
