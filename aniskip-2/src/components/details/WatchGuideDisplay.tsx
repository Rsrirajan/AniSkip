import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward, Play, AlertTriangle, Users, Zap, Heart, Globe } from "lucide-react";
import { generateWatchGuide, WatchGuide } from "../../services/watchGuideService";

interface WatchGuideDisplayProps {
  malId: number;
  animeTitle: string;
}

const WatchGuideDisplay: React.FC<WatchGuideDisplayProps> = ({ malId, animeTitle }) => {
  const [guide, setGuide] = useState<WatchGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEpisodeDetails, setShowEpisodeDetails] = useState(false);

  useEffect(() => {
    loadWatchGuide();
  }, [malId]);

  const loadWatchGuide = async () => {
    try {
      setLoading(true);
      setError(null);
      const watchGuide = await generateWatchGuide(malId);
      setGuide(watchGuide);
    } catch (err) {
      setError('Failed to load watch guide. Please try again later.');
      console.error('Error loading watch guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'watch': return 'text-green-400';
      case 'recommended': return 'text-purple-400';
      case 'optional': return 'text-yellow-400';
      case 'skip': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'watch': return <Play className="w-4 h-4" />;
      case 'recommended': return <Star className="w-4 h-4" />;
      case 'optional': return <Clock className="w-4 h-4" />;
      case 'skip': return <SkipForward className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'canon': return 'bg-green-600/20 text-green-400 border-green-600/40';
      case 'filler': return 'bg-orange-600/20 text-orange-400 border-orange-600/40';
      case 'recap': return 'bg-blue-600/20 text-blue-400 border-blue-600/40';
      case 'mixed': return 'bg-purple-600/20 text-purple-400 border-purple-600/40';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-600/40';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-slate-300">Loading watch guide...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Watch Guide</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={loadWatchGuide}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="text-center py-8">
          <p className="text-slate-400">No watch guide available for this anime.</p>
        </div>
      </div>
    );
  }

  const watchEpisodes = guide.recommendations.filter(ep => ep.recommendation === 'watch' || ep.recommendation === 'recommended');
  const skipEpisodes = guide.recommendations.filter(ep => ep.recommendation === 'skip');
  const optionalEpisodes = guide.recommendations.filter(ep => ep.recommendation === 'optional');

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Watch Guide: {animeTitle}</h3>
        <p className="text-slate-300 mb-4">{guide.description}</p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{guide.stats.totalEpisodes}</div>
            <div className="text-slate-400 text-sm">Total Episodes</div>
          </div>
          <div className="bg-green-600/20 rounded-lg p-4 text-center border border-green-600/40">
            <div className="text-2xl font-bold text-green-400">{guide.stats.canonEpisodes}</div>
            <div className="text-slate-400 text-sm">Canon</div>
          </div>
          <div className="bg-orange-600/20 rounded-lg p-4 text-center border border-orange-600/40">
            <div className="text-2xl font-bold text-orange-400">{guide.stats.fillerEpisodes}</div>
            <div className="text-slate-400 text-sm">Filler</div>
          </div>
          <div className="bg-purple-600/20 rounded-lg p-4 text-center border border-purple-600/40">
            <div className="text-2xl font-bold text-purple-400">{Math.round(guide.stats.timeSaved / 60)}h</div>
            <div className="text-slate-400 text-sm">Time Saved</div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">Watch: {watchEpisodes.length} episodes</span>
            </div>
            <div className="flex items-center gap-2">
              <SkipForward className="w-4 h-4 text-red-400" />
              <span className="text-slate-300">Skip: {skipEpisodes.length} episodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">Optional: {optionalEpisodes.length} episodes</span>
            </div>
          </div>
        </div>

        {/* Episode Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Episode Recommendations</h4>
            <button
              onClick={() => setShowEpisodeDetails(!showEpisodeDetails)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {showEpisodeDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="space-y-3">
            {guide.recommendations.map((episode) => (
              <motion.div
                key={episode.episode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">Ep {episode.episode}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(episode.type)}`}>
                      {episode.type.toUpperCase()}
                    </span>
                    <div className={`flex items-center gap-1 ${getRecommendationColor(episode.recommendation)}`}>
                      {getRecommendationIcon(episode.recommendation)}
                      <span className="font-semibold capitalize">{episode.recommendation}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {episode.userRating && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{episode.userRating}</span>
                      </div>
                    )}
                    {episode.communityRating && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{episode.communityRating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h5 className="text-white font-medium mb-2">{episode.title}</h5>
                <p className="text-slate-300 text-sm mb-3">{episode.reason}</p>

                {showEpisodeDetails && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-600/50">
                    {episode.isFunny && (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <Heart className="w-3 h-3" />
                        <span>Funny</span>
                      </div>
                    )}
                    {episode.isImportant && (
                      <div className="flex items-center gap-1 text-red-400 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Important</span>
                      </div>
                    )}
                    {episode.hasCharacterDevelopment && (
                      <div className="flex items-center gap-1 text-blue-400 text-xs">
                        <Users className="w-3 h-3" />
                        <span>Character Dev</span>
                      </div>
                    )}
                    {episode.hasWorldBuilding && (
                      <div className="flex items-center gap-1 text-purple-400 text-xs">
                        <Globe className="w-3 h-3" />
                        <span>World Building</span>
                      </div>
                    )}
                    {episode.timeSaved && episode.timeSaved > 0 && (
                      <div className="flex items-center gap-1 text-orange-400 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Save {episode.timeSaved}m</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchGuideDisplay; 