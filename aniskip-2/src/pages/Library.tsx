import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnimeDetails, Anime } from "../services/anilist";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";
import { useUserPlan } from "../lib/useUserPlan";
import { useWatchlist } from "../lib/useWatchlist";

export default function Library() {
  const { trackedMap, userId, loading: watchlistLoading, updateTrackedAnime, removeAnime } = useWatchlist();
  const [trackedAnime, setTrackedAnime] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const { plan, loading: planLoading, showNsfw } = useUserPlan();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = Object.keys(trackedMap).map(Number);
    if (ids.length === 0) {
      setTrackedAnime([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(ids.map(id =>
      getAnimeDetails(id)
        .then(res => {
          if (!res || typeof res.Media === 'undefined' || res.Media === null) {
            console.error('AniList returned null or undefined for anime ID:', id, JSON.stringify(res, null, 2));
            return null;
          }
          return res.Media;
        })
        .catch(err => {
          console.error('Error fetching anime details for ID:', id, err);
          return null;
        })
    ))
      .then(animeArr => {
        setTrackedAnime(animeArr.filter(Boolean) as Anime[]);
        setLoading(false);
      });
  }, [trackedMap]);

  const handleTrackAnime = async (anime: Anime, status: string, episode: number) => {
    await updateTrackedAnime(anime.id, status, episode);
  };

  const handleAddToWatchlist = (anime: Anime) => {
    handleTrackAnime(anime, "Plan to Watch", 1);
    setSelectedAnime(null);
  };

  const handleRemoveFromWatchlist = async (anime: Anime) => {
    await removeAnime(anime.id);
  };

  const handleUpdateStatus = async (anime: Anime, status: string, episode: number) => {
    await updateTrackedAnime(anime.id, status, episode);
  };

  const handleQuickView = (anime: Anime) => {
    // Open a quick view modal with essential information
    setSelectedAnime(anime);
    // The existing modal will handle the display
  };

  if (planLoading || watchlistLoading) return null;

  const NSFW_GENRES = ["Ecchi", "Hentai", "Erotica", "Adult", "Yaoi", "Yuri"];
  const filteredTrackedAnime = showNsfw === false
    ? trackedAnime.filter(anime => !anime.genres?.some(g => NSFW_GENRES.includes(g)))
    : trackedAnime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          My Library
        </motion.h1>
        {loading ? (
          <div className="glass-effect border-slate-700 rounded-lg p-8 text-center text-slate-400">Loading...</div>
        ) : filteredTrackedAnime.length === 0 ? (
          <div className="glass-effect border-slate-700 rounded-lg p-8 text-center text-slate-400">
            No anime in your library yet.<br />
            Add anime from Search or Trending to start tracking your watchlist!
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.07, delayChildren: 0.1 },
              },
            }}
          >
            {filteredTrackedAnime.map(anime => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={setSelectedAnime}
                variant="default"
                showSignInButton={false}
                isInWatchlist={true}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                currentEpisode={trackedMap[anime.id]?.episode || 1}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </motion.div>
        )}
        <AnimeModal
          anime={selectedAnime}
          isOpen={!!selectedAnime}
          onClose={() => setSelectedAnime(null)}
          onAddToWatchlist={handleAddToWatchlist}
          trackedAnime={selectedAnime ? trackedMap[selectedAnime.id] : undefined}
          onTrackAnime={handleTrackAnime}
          isProUser={plan === 'pro'}
          showSignInPrompt={false}
          userId={userId} // <-- Pass userId explicitly
        />
      </div>
    </div>
  );
} 