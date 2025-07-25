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

  const gintamaGuide = {
    franchiseName: "Gintama Series",
    arcs: [
      {
        saga: "Gintama (2006–2010)",
        entries: [
          { recommendation: "skip", title: "Pilot Episodes", episodes: "1–2" },
          { recommendation: "watch", title: "Harusame Arc, intro", episodes: "3–4" },
          { recommendation: "watch", title: "Episodic, canon", episodes: "5–16" },
          { recommendation: "watch", title: "Gengai Arc, semi-serious", episodes: "17" },
          { recommendation: "watch", title: "Canon", episodes: "18–26" },
          { recommendation: "watch", title: "Rengokukan Arc", episodes: "27–28" },
          { recommendation: "watch", title: "Canon", episodes: "29–30" },
          { recommendation: "watch", title: "Memory Loss Arc", episodes: "31–33" },
          { recommendation: "watch", title: "Canon", episodes: "34–39" },
          { recommendation: "watch", title: "Umibozu Arc", episodes: "40–42" },
          { recommendation: "watch", title: "Go-Ninja Arc", episodes: "43–44" },
          { recommendation: "watch", title: "Inugami Arc", episodes: "45" },
          { recommendation: "watch", title: "Canon", episodes: "46–49" },
          { recommendation: "optional", title: "Filler, parody", episodes: "50" },
          { recommendation: "watch", title: "Infant Strife Arc", episodes: "51–52" },
          { recommendation: "watch", title: "Canon", episodes: "53" },
          { recommendation: "watch", title: "Mother Arc", episodes: "54–55" },
          { recommendation: "watch", title: "Canon", episodes: "56" },
          { recommendation: "skip", title: "Filler", episodes: "57" },
          { recommendation: "watch", title: "Benizakura Arc", episodes: "58–61" },
          { recommendation: "watch", title: "Gintama: The Movie (Benizakura-hen) (replaces 58–61, better animation)" },
          { recommendation: "watch", title: "Canon", episodes: "62–68" },
          { recommendation: "watch", title: "Fuyo Arc", episodes: "69–71" },
          { recommendation: "watch", title: "Canon", episodes: "72–74" },
          { recommendation: "skip", title: "Filler", episodes: "75" },
          { recommendation: "watch", title: "Yagyu Arc", episodes: "76–81" },
          { recommendation: "watch", title: "Canon", episodes: "82–83" },
          { recommendation: "watch", title: "Hardboiled Detective Arc", episodes: "84–85" },
          { recommendation: "watch", title: "Okita Mitsuba Arc", episodes: "86–87" },
          { recommendation: "watch", title: "Canon", episodes: "88–93" },
          { recommendation: "watch", title: "Hasegawa Prosecution Arc", episodes: "94–95" },
          { recommendation: "watch", title: "Owee Arc", episodes: "96–99" },
          { recommendation: "watch", title: "Canon", episodes: "100" },
          { recommendation: "watch", title: "Shinsengumi Crisis Arc", episodes: "101–105" },
          { recommendation: "optional", title: "Filler", episodes: "106" },
          { recommendation: "watch", title: "Guardian Dog Arc", episodes: "107–108" },
          { recommendation: "watch", title: "Canon", episodes: "109–113" },
          { recommendation: "optional", title: "Filler", episodes: "114" },
          { recommendation: "watch", title: "Ryugujo Arc", episodes: "115–118" },
          { recommendation: "watch", title: "Canon", episodes: "119–120" },
          { recommendation: "watch", title: "Monkey Hunter Arc", episodes: "121–123" },
          { recommendation: "skip", title: "Filler", episodes: "124–125" },
          { recommendation: "watch", title: "Correspondence Arc", episodes: "126–128" },
          { recommendation: "watch", title: "Kintaro Arc", episodes: "129–130" },
          { recommendation: "watch", title: "Ghost Ryokan Arc", episodes: "131–134" },
          { recommendation: "skip", title: "Filler", episodes: "135" },
          { recommendation: "watch", title: "Canon", episodes: "136" },
          { recommendation: "skip", title: "Filler", episodes: "137" },
          { recommendation: "watch", title: "Canon", episodes: "138" },
          { recommendation: "watch", title: "Yoshiwara in Flames Arc", episodes: "139–147" },
          { recommendation: "watch", title: "Shinsengumi Death Game Arc", episodes: "148–149" },
          { recommendation: "skip", title: "Filler", episodes: "150" },
          { recommendation: "watch", title: "Barber Arc", episodes: "151–152" },
          { recommendation: "watch", title: "Canon", episodes: "153–154" },
          { recommendation: "optional", title: "Filler", episodes: "155" },
          { recommendation: "watch", title: "Canon", episodes: "156" },
          { recommendation: "watch", title: "Otsu Arc", episodes: "157–163" },
          { recommendation: "skip", title: "Filler", episodes: "164" },
          { recommendation: "watch", title: "Canon", episodes: "165" },
          { recommendation: "skip", title: "Filler", episodes: "166" },
          { recommendation: "watch", title: "Tama Quest Arc", episodes: "167–170" },
          { recommendation: "skip", title: "Filler", episodes: "171" },
          { recommendation: "watch", title: "Canon", episodes: "172" },
          { recommendation: "skip", title: "Filler", episodes: "173–174" },
          { recommendation: "watch", title: "Canon", episodes: "175" },
          { recommendation: "skip", title: "Filler", episodes: "176" },
          { recommendation: "watch", title: "Red Spider Arc", episodes: "177–181" },
          { recommendation: "watch", title: "Character Poll Arc", episodes: "182–184" },
          { recommendation: "skip", title: "Filler", episodes: "185" },
          { recommendation: "watch", title: "Rokkaku Arc", episodes: "186–187" },
          { recommendation: "watch", title: "Canon", episodes: "188" },
          { recommendation: "optional", title: "Filler", episodes: "189" },
          { recommendation: "watch", title: "Kabukicho Stray Cat Arc", episodes: "190–192" },
          { recommendation: "watch", title: "Canon", episodes: "193–194" },
          { recommendation: "watch", title: "Diviner Arc", episodes: "195–199" },
          { recommendation: "watch", title: "Santa Arc, end of 4:3 era", episodes: "200–201" },
        ]
      },
      {
        saga: "Gintama' (2011–2012)",
        entries: [
          { recommendation: "watch", title: "Timeskip Arc", episodes: "202–203" },
          { recommendation: "watch", title: "Canon", episodes: "204–206" },
          { recommendation: "watch", title: "Glasses Arc", episodes: "207–208" },
          { recommendation: "skip", title: "Filler", episodes: "209" },
          { recommendation: "watch", title: "Kabukicho Four Devas Arc", episodes: "210–214" },
          { recommendation: "watch", title: "Canon", episodes: "215–220" },
          { recommendation: "watch", title: "Jugem Arc", episodes: "221–222" },
          { recommendation: "watch", title: "Canon", episodes: "223–224" },
          { recommendation: "watch", title: "Jail Arc", episodes: "225–226" },
          { recommendation: "watch", title: "SKET Dance crossover", episodes: "227" },
          { recommendation: "watch", title: "Love Choriss Arc", episodes: "228–229" },
          { recommendation: "watch", title: "Canon", episodes: "230–231" },
          { recommendation: "watch", title: "Renho Arc", episodes: "232–236" },
          { recommendation: "watch", title: "Vacation Arc", episodes: "237–238" },
          { recommendation: "watch", title: "Scandal Arc", episodes: "239–240" },
          { recommendation: "watch", title: "Host Club Arc", episodes: "241–242" },
          { recommendation: "watch", title: "Bakuman parody", episodes: "243" },
          { recommendation: "watch", title: "Thorny Arc", episodes: "244–247" },
          { recommendation: "watch", title: "Canon", episodes: "248–250" },
          { recommendation: "skip", title: "Filler", episodes: "251" },
        ]
      },
      {
        saga: "Gintama': Enchousen (2012–2013)",
        entries: [
          { recommendation: "watch", title: "All canon", episodes: "253–265" },
        ]
      },
      {
        saga: "Gintama: The Final Chapter – Be Forever Yorozuya (Movie)",
        entries: [
          { recommendation: "watch", title: "Watch after Enchousen. (Canon, written by the author)" },
        ]
      },
      {
        saga: "Gintama° (2015–2016)",
        entries: [
          { recommendation: "watch", title: "Canon", episodes: "266–299" },
          { recommendation: "watch", title: "Aizome Kaori-hen (OVA) (Love Incense Arc, between 299–300)" },
          { recommendation: "watch", title: "Shogun Arc", episodes: "300–307" },
          { recommendation: "watch", title: "Shinsengumi Arc", episodes: "308–316" },
        ]
      },
      {
        saga: "Gintama. (2017)",
        entries: [
          { recommendation: "watch", title: "Rakuyou Decisive Battle Arc", episodes: "317–328" },
        ]
      },
      {
        saga: "Gintama.: Porori-hen (Slip Arc, 2017)",
        entries: [
          { recommendation: "watch", title: "Canon, previously skipped manga arcs; mostly comedic, can consider skipping if you want more serious arcs, but recommended to watch for full experience. Contains: Kagura's Boyfriend, Homeless, Excalibur, HDZ48, Guardian Spirits, etc.", episodes: "329–341" },
        ]
      },
      {
        saga: "Gintama.: Shirogane no Tamashii-hen (Silver Soul, 2018)",
        entries: [
          { recommendation: "watch", title: "Silver Soul Arc, Part 1", episodes: "342–353" },
          { recommendation: "watch", title: "Silver Soul Arc, Part 2 & Aftermath", episodes: "354–367" },
        ]
      },
      {
        saga: "Gintama: The Semi-Final (2021, Special)",
        entries: [
          { recommendation: "watch", title: "Prequel to The Final movie", episodes: "368–369" },
        ]
      },
      {
        saga: "Gintama: The Final (2021, Movie)",
        entries: [
          { recommendation: "watch", title: "Concludes the story (canon ending)" },
        ]
      },
      {
        saga: "3-nen Z-gumi Ginpachi-sensei (Spin-off, TBA)",
        entries: [
          { recommendation: "watch", title: "After The Final (when released)" },
        ]
      },
    ],
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect border-slate-700 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedFranchiseGuide(gintamaGuide)}
          >
            <div className="relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Crown className="w-4 h-4" /> Franchise Guide
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Gintama Series</h2>
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                Complete Gintama watch guide including canon arcs, filler skips, movies, and specials.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 369 episodes
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> 1 series
                </div>
                <div className="flex items-center gap-1">
                  <SkipForward className="w-4 h-4" /> 23 filler
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-white font-semibold">369</div>
                  <div className="text-slate-400">Total</div>
                </div>
                <div className="bg-green-900/20 border border-green-700/30 rounded p-2 text-center">
                  <div className="text-green-400 font-semibold">346</div>
                  <div className="text-slate-400">Canon</div>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded p-2 text-center">
                  <div className="text-red-400 font-semibold">23</div>
                  <div className="text-slate-400">Filler</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-2 text-center">
                  <div className="text-yellow-400 font-semibold">0</div>
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
                            {entry.note && (
                              <div className="text-xs text-slate-300 mt-1">{entry.note}</div>
                            )}
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