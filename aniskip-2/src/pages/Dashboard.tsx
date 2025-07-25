import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Clock, 
  Star, 
  SkipForward,
  Crown,
  TrendingUp,
  Trophy,
  Eye
} from "lucide-react"
import { getAnimeDetails, Anime } from "../services/anilist";
import { getTopAnime as getJikanTopAnime } from "../services/jikan";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";
import { useUserPlan } from "../lib/useUserPlan";
import { useWatchlist } from "../lib/useWatchlist";
import { useProfile } from "../lib/useProfile";

function getMonthlyGoal() {
  return Number(localStorage.getItem("monthlyGoal") || 15);
}

// Animated Counter Component
const NSFW_GENRES = ["Hentai", "Ecchi"];

const AnimatedCounter = ({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const numericValue = parseFloat((value || "0").toString().replace(/[^0-9.]/g, ''))
    const startTime = Date.now()
    
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const currentCount = Math.floor(numericValue * progress)
      
      setCount(currentCount)
      
      if (progress >= 1) {
        clearInterval(timer)
        setCount(numericValue)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [value, duration])
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        delay: 0.2
      }}
      className="text-2xl font-bold text-white"
    >
      {count}{suffix}
    </motion.span>
  )
}

export default function Dashboard() {
  const { trackedMap, loading: watchlistLoading, updateTrackedAnime, removeAnime } = useWatchlist();
  const [continueWatching, setContinueWatching] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profile, loading: profileLoading } = useProfile();


  // Stats
  const [totalAnime, setTotalAnime] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(getMonthlyGoal());
  const [monthlyGoalInput, setMonthlyGoalInput] = useState<string>(getMonthlyGoal().toString());

  const { loading: planLoading, showNsfw } = useUserPlan();

  // Restore trendingAnime state
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    setTrendingLoading(true);
    getJikanTopAnime(1, 3)
      .then(data => {
        setTrendingAnime(data.data || []);
        setTrendingLoading(false);
      })
      .catch(error => {
        console.error('Error loading trending anime:', error);
        setTrendingLoading(false);
      });
  }, []);

  // Restore stats array
  const stats = [
    {
      title: "Total Anime",
      value: totalAnime.toString(),
      icon: Play,
      color: "from-purple-500 to-blue-500",
      change: ""
    },
    {
      title: "Episodes Watched",
      value: totalEpisodes.toString(),
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      change: ""
    },
    {
      title: "Hours Watched",
      value: totalHours.toFixed(1) + "h",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      change: ""
    },
    {
      title: "Time Saved",
      value: "-",
      icon: SkipForward,
      color: "from-orange-500 to-red-500",
      change: ""
    }
  ];

  useEffect(() => {
    // Load tracked anime from Supabase
    const ids = Object.keys(trackedMap).map(Number);
    if (ids.length === 0) {
      setContinueWatching([]);
      setLoading(false);
      setTotalAnime(0);
      setTotalEpisodes(0);
      setTotalHours(0);
      return;
    }
    setLoading(true);
    Promise.all(ids.map(id => getAnimeDetails(id).then(res => res.Media).catch(() => null)))
      .then(animeArr => {
        const animeMap: Record<string, Anime> = {};
        animeArr.forEach((a: Anime | null) => { if (a) animeMap[a.id] = a; });
        // Only show "Watching" and "On Hold" in Continue Watching, and filter NSFW if needed
        let filtered = animeArr.filter((a: Anime | null) => a && trackedMap[a.id] && ["Watching", "On Hold"].includes(trackedMap[a.id].status));
        if (showNsfw === false) {
          let filtered: (Anime | null)[] = animeArr.filter((anime: Anime | null) => anime !== null);
          if (!showNsfw) {
            filtered = filtered.filter((anime: Anime | null) => anime && !anime.genres?.some(g => NSFW_GENRES.includes(g)));
          }
        }
        setContinueWatching(filtered as Anime[]);
        // Stats: only count non-NSFW if showNsfw is false
        setTotalAnime(showNsfw === false
          ? Object.entries(trackedMap).filter(([id]) => {
              const anime = animeMap[id];
              return anime && !anime.genres?.some(g => NSFW_GENRES.includes(g));
            }).length
          : Object.keys(trackedMap).length);
        let ep = 0, hrs = 0;
        Object.entries(trackedMap).forEach(([id, t]: [string, any]) => {
          const anime = animeMap[id];
          if (anime && (showNsfw || !anime.genres?.some(g => NSFW_GENRES.includes(g))) ) {
            ep += t.episode;
            hrs += (anime.duration || 24) * t.episode / 60;
          }
        });
        setTotalEpisodes(ep);
        setTotalHours(hrs);
        setLoading(false);
      });
  }, [trackedMap, modalOpen, showNsfw]);

  const handleTrackAnime = async (anime: Anime, status: string, episode: number) => {
    await updateTrackedAnime(anime.id, status, episode);
    setModalOpen(false);
    setSelectedAnime(null);
  };

  const handleCardClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setModalOpen(true);
  };

  const handleRemoveFromWatchlist = async (anime: Anime) => {
    await removeAnime(anime.id);
  };

  // Progress calculation
  const percent = Math.min(100, (totalHours / monthlyGoal) * 100);
  const hoursRemaining = Math.max(0, monthlyGoal - totalHours);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  }

  const textVariants = {
    hidden: { 
      y: -30, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  // Helper to get a friendly display name
  function getDisplayName(profile: any) {
    if (!profile?.display_name) return "there";
    // If display_name looks like an email, show only the part before @
    if (profile.display_name.includes("@")) {
      return profile.display_name.split("@")[0];
    }
    return profile.display_name.split(" ")[0];
  }

  if (planLoading || watchlistLoading) return (
    <div className="flex justify-center items-center h-96">
      <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8" variants={textVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                variants={textVariants}
              >
                  {profileLoading ? "Welcome back..." : `Welcome back, ${getDisplayName(profile)}`}
              </motion.h1>
              <motion.p 
                className="text-slate-400"
                variants={textVariants}
              >
                Ready to start your anime journey?
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3"
              variants={textVariants}
            >
              <div className="bg-green-500/20 text-green-300 border border-green-500/50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Crown className="w-4 h-4" />
                All Features Free!
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Watching
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.title} 
              className="glass-effect border-slate-700 rounded-lg p-6"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                  {stat.change}
                </div>
              </div>
              
              <div>
                <div className="mb-1">
                  {stat.title === "Hours Watched" || stat.title === "Time Saved" ? (
                    <AnimatedCounter value={parseFloat(stat.value)} suffix={stat.title === "Hours Watched" ? "h" : "min"} />
                  ) : (
                    <AnimatedCounter value={parseInt(stat.value)} />
                  )}
                </div>
                <p className="text-slate-400 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Continue Watching */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="glass-effect border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Continue Watching</h2>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading...</div>
              ) : continueWatching.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No anime in progress</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Start watching anime to see them here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {continueWatching.map(anime => (
                    <div key={anime.id} className="relative">
                      <AnimeCard
                        anime={anime}
                        onClick={handleCardClick}
                        variant="default"
                        showSignInButton={false}
                        isInWatchlist={true}
                        onRemoveFromWatchlist={handleRemoveFromWatchlist}
                        currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                        currentEpisode={trackedMap[anime.id]?.episode || 1}
                      />
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        Ep {trackedMap[anime.id]?.episode || 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Monthly Goal */}
          <motion.div variants={itemVariants}>
            <div className="glass-effect border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Monthly Goal
              </h2>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10,
                    delay: 1.5
                  }}
                >
                  {totalHours.toFixed(1)}h
                </motion.div>
                <div className="text-sm text-slate-400 mb-4">
                  of {monthlyGoal}h goal
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: percent + '%' }}
                    transition={{ duration: 2 }}
                  ></motion.div>
                </div>
                <div className="text-sm text-slate-400 mb-2">
                  {hoursRemaining.toFixed(1)}h remaining
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <label htmlFor="goal-input" className="text-slate-400 text-xs">Set goal:</label>
                  <input
                    id="goal-input"
                    type="number"
                    min={1}
                    max={5208}
                    value={monthlyGoalInput}
                    onChange={e => {
                      const val = e.target.value;
                      // Allow empty string for typing
                      if (val === "" || /^\d{0,4}$/.test(val)) {
                        setMonthlyGoalInput(val);
                      }
                    }}
                    onBlur={() => {
                      const num = Number(monthlyGoalInput);
                      if (monthlyGoalInput === "" || isNaN(num) || num < 1) {
                        setMonthlyGoalInput(monthlyGoal.toString()); // revert to last valid
                      } else if (num > 5208) {
                        setMonthlyGoal(5208);
                        setMonthlyGoalInput("5208");
                        localStorage.setItem("monthlyGoal", "5208");
                      } else {
                        setMonthlyGoal(num);
                        localStorage.setItem("monthlyGoal", num.toString());
                      }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-slate-400 text-xs">hours</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">Progress: {percent.toFixed(0)}%</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Recent Activity */}
          <motion.div 
            className="glass-effect border-slate-700 rounded-lg p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No recent activity</p>
              <p className="text-sm text-slate-500 mt-2">
                Start watching anime to see activity here
              </p>
            </div>
          </motion.div>

          {/* Trending This Week */}
          <motion.div 
            className="glass-effect border-slate-700 rounded-lg p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending This Week
            </h2>
            <div className="space-y-4">
              {trendingLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                trendingAnime.map((anime) => (
                  <motion.div
                    key={anime.mal_id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      x: 5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    onClick={() => {
                      setSelectedAnime({
                        id: anime.mal_id,
                        title: {
                          english: anime.title_english || anime.title,
                          romaji: anime.title,
                          native: anime.title_japanese || anime.title,
                        },
                        coverImage: {
                          large: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
                          medium: anime.images?.jpg?.image_url,
                        },
                        bannerImage: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
                        episodes: anime.episodes || 0,
                        status: anime.status?.toUpperCase() || "UNKNOWN",
                        averageScore: anime.score ? anime.score * 10 : 0,
                        genres: anime.genres?.map((g: any) => g.name) || [],
                        description: anime.synopsis || "",
                        duration: anime.duration || 0,
                        format: anime.type || "TV",
                        season: anime.season || "UNKNOWN",
                        seasonYear: anime.year || 0,
                        studios: { nodes: anime.studios || [] }
                      });
                      setModalOpen(true);
                    }}
                  >
                    <img src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} alt={anime.title_english || anime.title} className="w-14 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm mb-1">{anime.title_english || anime.title}</h4>
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {anime.score ? anime.score.toFixed(1) : 'N/A'}
                        </div>
                        <span className="text-xs text-slate-400">
                          {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-slate-300 hover:text-white p-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTrackedAnime(anime.mal_id, "Plan to Watch", 1);
                      }}
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedAnime && (
          <AnimeModal
            anime={selectedAnime}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onTrackAnime={handleTrackAnime}
            trackedAnime={selectedAnime ? trackedMap[selectedAnime.id] : undefined}
            isProUser={true}
            showSignInPrompt={false}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
} 