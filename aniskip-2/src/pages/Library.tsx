import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnimeDetails, Anime } from "../services/anilist";
import { getAnimeById as getMalAnimeById } from "../services/jikan";
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
    const entries = Object.entries(trackedMap);
    if (entries.length === 0) {
      setTrackedAnime([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(entries.map(async ([idStr, tracked]) => {
      const id = Number(idStr);
      if (tracked.site === 'anilist') {
        // AniList fetch
        try {
          const res = await getAnimeDetails(id);
          if (!res || typeof res.Media === 'undefined' || res.Media === null) {
            console.error('AniList returned null or undefined for anime ID:', id, JSON.stringify(res, null, 2));
            return null;
          }
          return res.Media;
        } catch (err) {
          console.error('Error fetching AniList anime details for ID:', id, err);
          return null;
        }
      } else if (tracked.site === 'mal' || tracked.site === 'myanimelist') {
        // MAL fetch
        try {
          const res = await getMalAnimeById(id);
          if (!res || !res.data) {
            console.error('Jikan returned null or undefined for MAL ID:', id, JSON.stringify(res, null, 2));
            return null;
          }
          const mal = res.data;
          // Convert JikanAnime to Anime type
          const anime: Anime = {
            id: mal.mal_id,
            title: {
              romaji: mal.title,
              english: mal.title_english || mal.title,
              native: mal.title_japanese || mal.title,
            },
            coverImage: {
              large: mal.images?.jpg?.large_image_url || mal.images?.jpg?.image_url || '',
              medium: mal.images?.jpg?.small_image_url || mal.images?.jpg?.image_url || '',
            },
            bannerImage: mal.images?.jpg?.image_url || '',
            description: mal.synopsis || '',
            averageScore: mal.score ? Math.round(mal.score * 10) : 0,
            episodes: mal.episodes || 0,
            status: mal.status?.toUpperCase() || 'UNKNOWN',
            genres: mal.genres?.map(g => g.name) || [],
            season: mal.season?.toUpperCase() || '',
            seasonYear: mal.year || 0,
            format: mal.type || '',
            duration: mal.duration ? parseInt(mal.duration) || 24 : 24,
            studios: { nodes: mal.studios?.map(s => ({ name: s.name })) || [] },
          };
          return anime;
        } catch (err) {
          console.error('Error fetching MAL anime details for ID:', id, err);
          return null;
        }
      } else {
        // Unknown site, fallback to AniList
        try {
          const res = await getAnimeDetails(id);
          if (!res || typeof res.Media === 'undefined' || res.Media === null) {
            console.error('AniList returned null or undefined for anime ID:', id, JSON.stringify(res, null, 2));
            return null;
          }
          return res.Media;
        } catch (err) {
          console.error('Error fetching AniList anime details for ID:', id, err);
          return null;
        }
      }
    }))
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
                currentEpisode={trackedMap[anime.id]?.episode ?? 0}
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