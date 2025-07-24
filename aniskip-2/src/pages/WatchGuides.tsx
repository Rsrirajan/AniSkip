import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, SkipForward, Crown, Lock, Search, Loader2 } from "lucide-react";
// import { useUserPlan } from "../lib/useUserPlan";
// import { useWatchGuide } from "../lib/useWatchGuide";
// import { WatchGuide } from "../services/watchGuideService";
import { useNavigate } from "react-router-dom";
// import Paywall from "../components/ui/Paywall";

const WatchGuides: React.FC = () => {
  // const { plan, loading: planLoading } = useUserPlan();
  // const [selectedGuide, setSelectedGuide] = useState<WatchGuide | null>(null);
  // const [selectedFranchiseGuide, setSelectedFranchiseGuide] = useState<any>(null);
  // const [searchQuery, setSearchQuery] = useState("");
  // For launch, only show hardcoded franchise guides for One Piece and Black Clover
  const franchiseGuides = [
    {
      franchiseName: "One Piece",
      description: "The complete One Piece franchise watch guide with optimal viewing order and filler information.",
      totalEpisodes: 1100,
      canonEpisodes: 1034,
      fillerEpisodes: 98,
      recapEpisodes: 0,
      mixedEpisodes: 0,
      timeSaved: 32 * 60, // minutes
      watchTime: 1034 * 24, // minutes
      seriesCount: 1,
      guides: [], // You can fill in with more details if needed
      specialInstructions: "Skip all marked filler and recap episodes for the most efficient viewing experience."
    },
    {
      franchiseName: "Black Clover",
      description: "The complete Black Clover franchise watch guide with optimal viewing order and filler information.",
      totalEpisodes: 170,
      canonEpisodes: 146,
      fillerEpisodes: 18,
      recapEpisodes: 6,
      mixedEpisodes: 0,
      timeSaved: 8 * 60, // minutes
      watchTime: 146 * 24, // minutes
      seriesCount: 1,
      guides: [],
      specialInstructions: "Skip all marked filler and recap episodes for the most efficient viewing experience."
    }
  ];
  const navigate = useNavigate();

  // if (planLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
  //       <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );
  // }

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

          {/* Search Bar */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for anime watch guides..."
                value={""}
                onChange={(e) => {}}
                onKeyPress={(e) => {}}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <button
              onClick={() => {}}
              disabled={false}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {false ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
            {"" && (
              <button
                onClick={() => {}}
                className="bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Error Display */}
          {false && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-red-400">{""}</p>
                <button
                  onClick={() => {}}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="space-y-8">
          {/* Franchise Guides (Only One Piece and Black Clover for launch) */}
          {franchiseGuides.map((franchiseGuide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 shadow-xl border border-purple-800/40 relative"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" /> {franchiseGuide.franchiseName} Franchise Guide
              </h2>
              <p className="text-slate-300 mb-4">{franchiseGuide.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                  <div className="text-green-400 font-bold text-2xl">{franchiseGuide.canonEpisodes}</div>
                  <div className="text-slate-300 text-sm">Watch</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                  <div className="text-red-400 font-bold text-2xl">{franchiseGuide.fillerEpisodes}</div>
                  <div className="text-slate-300 text-sm">Skip</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                  <div className="text-yellow-400 font-bold text-2xl">{franchiseGuide.recapEpisodes}</div>
                  <div className="text-slate-300 text-sm">Optional</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                  <div className="text-blue-400 font-bold text-2xl">{franchiseGuide.mixedEpisodes}</div>
                  <div className="text-slate-300 text-sm">Mixed</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <div className="text-green-300 font-semibold mb-2">Complete Franchise Guide - Included in Free Version!</div>
                <div className="text-slate-200 text-sm mb-2">Get the complete watch order and episode breakdowns</div>
                <ul className="list-disc pl-6 text-purple-200 space-y-1 text-sm">
                  <li>Complete franchise watch order</li>
                  <li>Episode-by-episode recommendations for all series</li>
                  <li>Special viewing instructions (like Danganronpa's alternating order)</li>
                  <li>Combined statistics across all series</li>
                  <li>Optimal time-saving strategies</li>
                </ul>
              </div>
              <div className="text-slate-400 text-xs italic">{franchiseGuide.specialInstructions}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchGuides;