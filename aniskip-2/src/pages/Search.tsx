import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { searchAnime, getTrendingAnime, Anime } from "../services/anilist";
import AnimeCard from "../components/AnimeCard";
import AnimeModal from "../components/AnimeModal";
import { useUserPlan } from "../lib/useUserPlan";
import { useWatchlist } from "../lib/useWatchlist";

const STATUS_FILTERS = ["All", "Airing", "Completed"];
const NSFW_GENRES = ["Ecchi", "Hentai", "Erotica", "Adult", "Yaoi", "Yuri"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const { trackedMap, userId, loading: watchlistLoading, updateTrackedAnime, removeAnime } = useWatchlist();
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const { plan, loading: planLoading, showNsfw } = useUserPlan();

  // Trending anime state
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Fetch trending anime on mount
  useEffect(() => {
    setTrendingLoading(true);
    getTrendingAnime(1, 10).then(res => {
      setTrendingAnime(res.data.Page.media || []);
      setTrendingLoading(false);
    });
  }, []);

  // Extract unique genres from current animeList
  const genreOptions = useMemo(() => {
    const genres = new Set<string>();
    animeList.forEach(anime => anime.genres?.forEach(g => genres.add(g)));
    return ["All", ...Array.from(genres).sort()];
  }, [animeList]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await searchAnime(query, 1, 50); // Increased from 24 to 50
    setAnimeList(res.data.Page.media);
    setLoading(false);
    setStatusFilter("All");
    setGenreFilter("All");
  };

  // Add a function to search by genre
  const handleGenreSearch = async (genre: string) => {
    setLoading(true);
    setQuery(genre);
    setGenreFilter(genre);
    const res = await searchAnime(genre, 1, 50); // Search for 50 anime in the genre
    setAnimeList(res.data.Page.media);
    setLoading(false);
  };

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

  // Filter animeList by status, genre, and NSFW
  const filteredAnime = useMemo(() => {
    return animeList.filter(anime => {
      let statusOk = true;
      let genreOk = true;
      let nsfwOk = true;
      if (statusFilter !== "All") {
        if (statusFilter === "Airing") statusOk = anime.status === "RELEASING";
        else if (statusFilter === "Completed") statusOk = anime.status === "FINISHED";
      }
      if (genreFilter !== "All") {
        genreOk = anime.genres?.includes(genreFilter);
      }
      // NSFW filter (only for logged-in users)
      if (showNsfw === false && anime.genres?.some(g => NSFW_GENRES.includes(g))) {
        nsfwOk = false;
      }
      return statusOk && genreOk && nsfwOk;
    });
  }, [animeList, statusFilter, genreFilter, showNsfw]);

  // NSFW filter for trending anime
  const filteredTrendingAnime = useMemo(() => {
    if (showNsfw === false) {
      return trendingAnime.filter(anime => !anime.genres?.some(g => NSFW_GENRES.includes(g)));
    }
    return trendingAnime;
  }, [trendingAnime, showNsfw]);

  const GENRE_LINKS = [
    "Action", "Adventure", "Fantasy", "Comedy", "Drama", "Romance", "Sci-Fi", "Horror", "Mystery", "Slice of Life", "Sports", "Supernatural"
  ];

  if (planLoading || watchlistLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Search Anime</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anime..."
                className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          {animeList.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {STATUS_FILTERS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {genreOptions.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {!query && (
          <>
            {/* Trending Anime */}
            {!trendingLoading && trendingAnime.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredTrendingAnime.map(anime => (
                    <AnimeCard
                      key={anime.id}
                      anime={anime}
                      onClick={setSelectedAnime}
                      variant="trending"
                      showSignInButton={!userId}
                      isInWatchlist={!!trackedMap[anime.id]}
                      onAddToWatchlist={userId ? handleAddToWatchlist : undefined}
                      onRemoveFromWatchlist={userId ? handleRemoveFromWatchlist : undefined}
                      currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                      currentEpisode={trackedMap[anime.id]?.episode || 1}
                      onUpdateStatus={userId ? handleUpdateStatus : undefined}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Genres */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Genre</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {GENRE_LINKS.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreSearch(genre)}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-200"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Search Results */}
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results for "{query}"
            </h2>
            {loading ? (
              <div className="glass-effect border-slate-700 rounded-lg p-8 text-center text-slate-400">Loading...</div>
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
                {filteredAnime.map(anime => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onClick={setSelectedAnime}
                    variant="default"
                    showSignInButton={!userId}
                    isInWatchlist={!!trackedMap[anime.id]}
                    onAddToWatchlist={userId ? handleAddToWatchlist : undefined}
                    onRemoveFromWatchlist={userId ? handleRemoveFromWatchlist : undefined}
                    currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                    currentEpisode={trackedMap[anime.id]?.episode || 1}
                    onUpdateStatus={userId ? handleUpdateStatus : undefined}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Unified Anime Modal */}
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