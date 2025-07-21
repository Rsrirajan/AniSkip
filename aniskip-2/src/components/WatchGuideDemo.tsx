import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward, Play, Lock, TrendingUp, Users, Zap, Heart, BookOpen, Globe, AlertTriangle } from "lucide-react";

interface EpisodeRecommendation {
  episode: number;
  title: string;
  type: 'canon' | 'filler' | 'recap' | 'mixed';
  recommendation: 'watch' | 'skip' | 'optional' | 'recommended';
  reason: string;
  userRating?: number;
  communityRating?: number;
  isFunny?: boolean;
  isImportant?: boolean;
  hasCharacterDevelopment?: boolean;
  hasWorldBuilding?: boolean;
  timeSaved?: number;
}

interface WatchGuide {
  malId: number;
  title: string;
  description: string;
  totalEpisodes: number;
  stats: {
    totalEpisodes: number;
    canonEpisodes: number;
    fillerEpisodes: number;
    recapEpisodes: number;
    mixedEpisodes: number;
    timeSaved: number;
    watchTime: number;
  };
  recommendations: EpisodeRecommendation[];
  proOnly: boolean;
}

const DEMO_WATCH_GUIDES: WatchGuide[] = [
  {
    malId: 21,
    title: "One Piece",
    description: "Optimized watch guide for One Piece. Watch 850 essential episodes, skip 200 filler/recap episodes, and optionally watch 50 episodes. Save approximately 80 hours while maintaining story coherence.",
    totalEpisodes: 1100,
    stats: {
      totalEpisodes: 1100,
      canonEpisodes: 850,
      fillerEpisodes: 200,
      recapEpisodes: 30,
      mixedEpisodes: 20,
      timeSaved: 4800, // 80 hours
      watchTime: 20400 // 340 hours
    },
    recommendations: [
      {
        episode: 196,
        title: "G-8 Arc Begins",
        type: 'filler',
        recommendation: 'recommended',
        reason: 'G-8 Arc: One of the best filler arcs in anime. Hilarious, well-written, and maintains series quality. Highly recommended despite being filler.',
        userRating: 9.2,
        communityRating: 8.8,
        isFunny: true,
        hasCharacterDevelopment: true
      },
      {
        episode: 144,
        title: "Alabasta Arc",
        type: 'canon',
        recommendation: 'watch',
        reason: 'Alabasta Arc: Essential canon arc with major plot developments, character growth, and world-building.',
        userRating: 9.5,
        communityRating: 9.3,
        isImportant: true,
        hasCharacterDevelopment: true,
        hasWorldBuilding: true
      },
      {
        episode: 131,
        title: "Warship Island Arc",
        type: 'filler',
        recommendation: 'optional',
        reason: 'Warship Island Arc: Decent filler with some character moments. Not essential but enjoyable if you want more content.',
        userRating: 7.5,
        communityRating: 7.2,
        isFunny: true
      },
      {
        episode: 500,
        title: "Recap Episode",
        type: 'recap',
        recommendation: 'skip',
        reason: 'Recap episode - skip unless you need a refresher on previous events.',
        timeSaved: 24
      }
    ],
    proOnly: true
  },
  {
    malId: 20,
    title: "Naruto",
    description: "Optimized watch guide for Naruto. Watch 135 essential episodes, skip 85 filler/recap episodes, and optionally watch 15 episodes. Save approximately 34 hours while maintaining story coherence.",
    totalEpisodes: 220,
    stats: {
      totalEpisodes: 220,
      canonEpisodes: 135,
      fillerEpisodes: 85,
      recapEpisodes: 0,
      mixedEpisodes: 0,
      timeSaved: 2040, // 34 hours
      watchTime: 3240 // 54 hours
    },
    recommendations: [
      {
        episode: 101,
        title: "Land of Tea Arc",
        type: 'filler',
        recommendation: 'optional',
        reason: 'Land of Tea Arc: Decent filler with some character development. Not essential but enjoyable.',
        userRating: 7.0,
        communityRating: 6.8,
        hasCharacterDevelopment: true
      },
      {
        episode: 136,
        title: "Filler Hell Begins",
        type: 'filler',
        recommendation: 'skip',
        reason: 'Extended filler arc: Generally low quality. Skip to save significant time.',
        timeSaved: 24
      }
    ],
    proOnly: true
  },
  {
    malId: 269,
    title: "Bleach",
    description: "Optimized watch guide for Bleach. Watch 200 essential episodes, skip 100 filler/recap episodes, and optionally watch 25 episodes. Save approximately 40 hours while maintaining story coherence.",
    totalEpisodes: 366,
    stats: {
      totalEpisodes: 366,
      canonEpisodes: 200,
      fillerEpisodes: 100,
      recapEpisodes: 41,
      mixedEpisodes: 25,
      timeSaved: 2400, // 40 hours
      watchTime: 4800 // 80 hours
    },
    recommendations: [
      {
        episode: 168,
        title: "Zanpakuto Rebellion Arc",
        type: 'filler',
        recommendation: 'recommended',
        reason: 'Zanpakuto Rebellion Arc: Excellent filler with great character development and lore. Highly recommended despite being filler.',
        userRating: 8.8,
        communityRating: 8.5,
        hasCharacterDevelopment: true,
        hasWorldBuilding: true
      },
      {
        episode: 317,
        title: "Gotei 13 Invasion Arc",
        type: 'filler',
        recommendation: 'optional',
        reason: 'Gotei 13 Invasion Arc: Decent filler with some interesting concepts. Optional but enjoyable.',
        userRating: 7.2,
        communityRating: 7.0
      }
    ],
    proOnly: true
  }
];

interface WatchGuideDemoProps {
  onClose?: () => void;
}

const WatchGuideDemo: React.FC<WatchGuideDemoProps> = ({ onClose }) => {
  const [selectedGuide, setSelectedGuide] = useState<WatchGuide | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Watch Guides Demo
          </motion.h1>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {DEMO_WATCH_GUIDES.map((guide, index) => (
            <motion.div
              key={guide.malId}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{guide.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{guide.stats.totalEpisodes}</div>
                    <div className="text-slate-400 text-xs">Total</div>
                  </div>
                  <div className="bg-purple-600/20 rounded-lg p-3 text-center border border-purple-600/40">
                    <div className="text-lg font-bold text-purple-400">{Math.round(guide.stats.timeSaved / 60)}h</div>
                    <div className="text-slate-400 text-xs">Saved</div>
                  </div>
                </div>

                {/* Sample Recommendations */}
                <div className="space-y-2 mb-4">
                  {guide.recommendations.slice(0, 2).map((episode) => (
                    <div key={episode.episode} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">Ep {episode.episode}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(episode.type)}`}>
                          {episode.type.toUpperCase()}
                        </span>
                        <div className={`flex items-center gap-1 ${getRecommendationColor(episode.recommendation)}`}>
                          {getRecommendationIcon(episode.recommendation)}
                          <span className="font-semibold capitalize text-xs">{episode.recommendation}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs line-clamp-2">{episode.reason}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  View Full Guide
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Guide Modal */}
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedGuide.title}</h2>
                  <p className="text-slate-300">{selectedGuide.description}</p>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{selectedGuide.stats.totalEpisodes}</div>
                  <div className="text-slate-400 text-sm">Total Episodes</div>
                </div>
                <div className="bg-green-600/20 rounded-lg p-4 text-center border border-green-600/40">
                  <div className="text-2xl font-bold text-green-400">{selectedGuide.stats.canonEpisodes}</div>
                  <div className="text-slate-400 text-sm">Canon</div>
                </div>
                <div className="bg-orange-600/20 rounded-lg p-4 text-center border border-orange-600/40">
                  <div className="text-2xl font-bold text-orange-400">{selectedGuide.stats.fillerEpisodes}</div>
                  <div className="text-slate-400 text-sm">Filler</div>
                </div>
                <div className="bg-purple-600/20 rounded-lg p-4 text-center border border-purple-600/40">
                  <div className="text-2xl font-bold text-purple-400">{Math.round(selectedGuide.stats.timeSaved / 60)}h</div>
                  <div className="text-slate-400 text-sm">Time Saved</div>
                </div>
              </div>

              {/* Episode Recommendations */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-4">Episode Recommendations</h3>
                {selectedGuide.recommendations.map((episode) => (
                  <div key={episode.episode} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchGuideDemo; 