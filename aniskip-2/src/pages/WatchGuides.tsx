import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward, Crown } from "lucide-react";
import { useUserPlan } from "../lib/useUserPlan";

import onePieceGuide from "./op.json";

const WatchGuides: React.FC = () => {
  const { loading: planLoading } = useUserPlan();
  const [selectedFranchiseGuide, setSelectedFranchiseGuide] = useState<any>(null);

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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect border-slate-700 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedFranchiseGuide(onePieceGuide)}
          >
            <div className="relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Crown className="w-4 h-4" /> Franchise Guide
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">One Piece Series</h2>
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                Complete One Piece watch guide including canon arcs, filler skips, movies, and specials.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {onePieceGuide.totalEpisodes} episodes
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> {onePieceGuide.totalAnimeEntries} series
                </div>
                <div className="flex items-center gap-1">
                  <SkipForward className="w-4 h-4" /> Save {Math.round(onePieceGuide.combinedStats.timeSaved / 60)}h
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-white font-semibold">{onePieceGuide.totalEpisodes}</div>
                  <div className="text-slate-400">Total</div>
                </div>
                <div className="bg-green-900/20 border border-green-700/30 rounded p-2 text-center">
                  <div className="text-green-400 font-semibold">{onePieceGuide.combinedStats.canonEpisodes}</div>
                  <div className="text-slate-400">Canon</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded p-2 text-center">
                  <div className="text-red-400 font-semibold">{onePieceGuide.combinedStats.fillerEpisodes}</div>
                  <div className="text-slate-400">Filler</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-2 text-center">
                  <div className="text-yellow-400 font-semibold">{onePieceGuide.combinedStats.recapEpisodes}</div>
                  <div className="text-slate-400">Recap</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {selectedFranchiseGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setSelectedFranchiseGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedFranchiseGuide.franchiseName}</h2>
                  <p className="text-slate-300">Complete episode breakdown by arc and saga</p>
                </div>
                <button
                  onClick={() => setSelectedFranchiseGuide(null)}
                  className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>
              {selectedFranchiseGuide.arcs.map((saga: any, i: number) => (
                <div key={i} className="mb-8">
                  <h3 className="text-2xl text-white font-bold mb-4">📖 {saga.saga}</h3>
                  <div className="space-y-3">
                    {saga.entries.map((entry: any, j: number) => (
                      <div
                        key={j}
                        className={`p-4 rounded-lg border ${
                          entry.recommendation === "watch"
                            ? "bg-green-900/20 border-green-700/50"
                            : entry.recommendation === "skip"
                            ? "bg-red-900/20 border-red-700/50"
                            : "bg-yellow-900/20 border-yellow-700/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-3 h-3 mt-1 rounded-full ${
                              entry.recommendation === "watch"
                                ? "bg-green-500"
                                : entry.recommendation === "skip"
                                ? "bg-red-500"
                                : "bg-yellow-400"
                            }`}
                          />
                          <div className="text-white">
                            <div className="font-semibold">
                              {entry.recommendation.toUpperCase()} - {entry.title}
                              {entry.episodes ? ` (Episodes ${entry.episodes})` : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchGuides;