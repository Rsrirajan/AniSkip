import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward } from "lucide-react";

// Demo data for One Piece and Black Clover
const demoGuides = [
  {
    malId: 21,
    title: "One Piece",
    description: "Follow Monkey D. Luffy and his Straw Hat crew as they sail the Grand Line in search of the legendary treasure known as One Piece.",
    totalEpisodes: 1000,
    stats: {
      totalEpisodes: 1000,
      canonEpisodes: 890,
      fillerEpisodes: 110,
      recapEpisodes: 15,
      mixedEpisodes: 5,
      timeSaved: 2640, // 110 episodes * 24 minutes
      watchTime: 21360 // 890 episodes * 24 minutes
    },
    recommendations: [
      {
        episode: "1-3",
        title: "Romance Dawn Arc",
        type: "canon" as const,
        recommendation: "watch" as const,
        reason: "Essential introduction to Luffy and the world of One Piece."
      },
      {
        episode: "54-61",
        title: "Warship Island Arc",
        type: "filler" as const,
        recommendation: "skip" as const,
        reason: "Filler arc that can be safely skipped without missing story content."
      },
      {
        episode: "196-206",
        title: "G-8 Arc",
        type: "filler" as const,
        recommendation: "recommended" as const,
        reason: "Exceptional filler arc with great comedy and character interactions - highly recommended!"
      }
    ]
  },
  {
    malId: 34572,
    title: "Black Clover",
    description: "In a world where magic is everything, Asta aims to become the Wizard King despite being born without magical powers.",
    totalEpisodes: 170,
    stats: {
      totalEpisodes: 170,
      canonEpisodes: 155,
      fillerEpisodes: 15,
      recapEpisodes: 3,
      mixedEpisodes: 2,
      timeSaved: 360, // 15 episodes * 24 minutes
      watchTime: 3720 // 155 episodes * 24 minutes
    },
    recommendations: [
      {
        episode: "1-13",
        title: "Introduction Arc",
        type: "canon" as const,
        recommendation: "watch" as const,
        reason: "Essential introduction to Asta, Yuno, and the Black Bulls."
      },
      {
        episode: "29",
        title: "Hot Springs Episode",
        type: "filler" as const,
        recommendation: "skip" as const,
        reason: "Comedic filler episode that can be skipped."
      },
      {
        episode: "123-129",
        title: "Training Episodes",
        type: "filler" as const,
        recommendation: "optional" as const,
        reason: "Training episodes with some character development but not essential."
      }
    ]
  }
];

const WatchGuidesDemo: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

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
        </motion.div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">🎌 Anime Watch Guides</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {demoGuides.map((guide, index) => (
                <motion.div
                  key={guide.malId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect border-slate-700 rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{guide.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.round(guide.stats.watchTime / 60)}h watch time
                      </div>
                      <div className="flex items-center gap-1">
                        <SkipForward className="w-4 h-4" />
                        Save {Math.round(guide.stats.timeSaved / 60)}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {guide.stats.canonEpisodes} episodes
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
        </div>

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
                  <p className="text-slate-300">{Math.round(selectedGuide.stats.watchTime / 60)}h</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Time Saved</h3>
                  <p className="text-slate-300">{Math.round(selectedGuide.stats.timeSaved / 60)}h</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Canon Episodes</h3>
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
                  <div className="text-slate-300 text-sm">Mixed</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Episode Recommendations</h3>
                <div className="space-y-4">
                  {selectedGuide.recommendations.map((rec: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        rec.recommendation === 'watch' 
                          ? 'bg-green-900/20 border-green-700/50' 
                          : rec.recommendation === 'skip'
                          ? 'bg-red-900/20 border-red-700/50'
                          : rec.recommendation === 'recommended'
                          ? 'bg-blue-900/20 border-blue-700/50'
                          : 'bg-yellow-900/20 border-yellow-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${
                          rec.recommendation === 'watch' 
                            ? 'bg-green-500' 
                            : rec.recommendation === 'skip'
                            ? 'bg-red-500'
                            : rec.recommendation === 'recommended'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold ${
                              rec.recommendation === 'watch' 
                                ? 'text-green-400' 
                                : rec.recommendation === 'skip'
                                ? 'text-red-400'
                                : rec.recommendation === 'recommended'
                                ? 'text-blue-400'
                                : 'text-yellow-400'
                            }`}>
                              {rec.recommendation === 'watch' ? 'WATCH' : 
                               rec.recommendation === 'skip' ? 'SKIP' :
                               rec.recommendation === 'recommended' ? 'RECOMMENDED' : 'OPTIONAL'}
                            </span>
                            <span className="text-white font-medium">Episodes {rec.episode}</span>
                          </div>
                          <p className="text-slate-300 font-medium mb-1">{rec.title}</p>
                          <p className="text-slate-400">{rec.reason}</p>
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

export default WatchGuidesDemo;