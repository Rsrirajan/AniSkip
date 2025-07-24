import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward, Crown } from "lucide-react";
import { useUserPlan } from "../lib/useUserPlan";
import { useWatchGuide } from "../lib/useWatchGuide";
import { WatchGuide } from "../services/watchGuideService";

const WatchGuides: React.FC = () => {
  const { loading: planLoading } = useUserPlan();
  const [selectedGuide, setSelectedGuide] = useState<WatchGuide | null>(null);
  const { guides, loading, error, clearError } = useWatchGuide();

  if (planLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Watch Guides</h1>
          <p className="text-slate-300 mb-6">
            Expert-curated guides to help you watch anime efficiently and get the most out of your viewing experience.
          </p>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300">Loading watch guides...</p>
              <p className="text-slate-400 text-sm mt-2">This may take a few moments as we fetch episode data</p>
            </div>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No watch guides available
            </h3>
            <p className="text-slate-400">
              Watch guides will be available here once loaded.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Individual Guides */}
            {guides.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">🎌 Anime Watch Guides</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {guides.map((guide, index) => (
                    <motion.div
                      key={guide.malId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-effect border-slate-700 rounded-lg overflow-hidden"
                    >
                      <div className="relative">
                        
                        {guide.proOnly && (
                          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Crown className="w-4 h-4" />
                            Pro Only
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{guide.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {guide.stats.watchTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <SkipForward className="w-4 h-4" />
                            Save {guide.stats.timeSaved}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {guide.stats.canonEpisodes}
                          </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                          <div className="bg-slate-800/50 rounded p-2 text-center">
                            <div className="text-white font-semibold">{guide.totalEpisodes}</div>
                            <div className="text-slate-400">Total</div>
                          </div>
                          <div className="bg-red-900/20 border border-red-700/30 rounded p-2 text-center">
                            <div className="text-red-400 font-semibold">{guide.stats.fillerEpisodes}</div>
                            <div className="text-slate-400">Filler</div>
                          </div>
                          <div className="bg-green-900/20 border border-green-700/30 rounded p-2 text-center">
                            <div className="text-green-400 font-semibold">{guide.stats.canonEpisodes}</div>
                            <div className="text-slate-400">Watch</div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedGuide(guide)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                        >
                          View Guide
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Total Episodes</h3>
                  <p className="text-slate-300">{selectedGuide.totalEpisodes}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Time to Watch</h3>
                  <p className="text-slate-300">{selectedGuide.stats.watchTime}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Time Saved</h3>
                  <p className="text-slate-300">{selectedGuide.stats.timeSaved}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Difficulty</h3>
                  <p className="text-slate-300">{selectedGuide.stats.canonEpisodes}</p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                  <div className="text-green-400 font-bold text-2xl">{selectedGuide.stats.canonEpisodes}</div>
                  <div className="text-slate-300 text-sm">Watch</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                  <div className="text-red-400 font-bold text-2xl">{selectedGuide.stats.fillerEpisodes}</div>
                  <div className="text-slate-300 text-sm">Skip</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                  <div className="text-yellow-400 font-bold text-2xl">{selectedGuide.stats.recapEpisodes}</div>
                  <div className="text-slate-300 text-sm">Optional</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                  <div className="text-blue-400 font-bold text-2xl">{selectedGuide.stats.mixedEpisodes}</div>
                  <div className="text-slate-300 text-sm">Filler</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Episode Recommendations</h3>
                <div className="space-y-4">
                  {selectedGuide.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        rec.recommendation === 'watch' 
                          ? 'bg-green-900/20 border-green-700/50' 
                          : rec.recommendation === 'skip'
                          ? 'bg-red-900/20 border-red-700/50'
                          : 'bg-yellow-900/20 border-yellow-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${
                          rec.recommendation === 'watch' 
                            ? 'bg-green-500' 
                            : rec.recommendation === 'skip'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold ${
                              rec.recommendation === 'watch' 
                                ? 'text-green-400' 
                                : rec.recommendation === 'skip'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            }`}>
                              {rec.recommendation === 'watch' ? 'WATCH' : rec.recommendation === 'skip' ? 'SKIP' : 'OPTIONAL'}
                            </span>
                            <span className="text-white font-medium">Episodes {rec.episode}</span>
                          </div>
                          <p className="text-slate-300 font-medium mb-1">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchGuides;