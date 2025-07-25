import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, TrendingUp, Calendar, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Anime, getTrendingAnime, getSeasonalAnime, getPopularAnime, getCurrentSeason, clearApiCache, searchAnime } from "../services/anilist";
import { supabase } from "../lib/supabaseClient";
import { useWatchlist } from "../lib/useWatchlist";

import AnimeModal from "../components/AnimeModal";
import AnimeCard from "../components/AnimeCard";
import { useRef } from "react";

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackedMap, userId, updateTrackedAnime } = useWatchlist();
  const [user, setUser] = useState<any>(null);
  // No premium logic needed for free launch
  const [animeCount, setAnimeCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await searchAnime(searchQuery, 1, 50);
      setSearchResults(res.data.Page.media);
    } catch (err) {
      setSearchError("Failed to fetch search results. Please try again.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setShowFilter(false);
      }
      if (!target.closest('.mobile-menu')) {
        setShowMobileMenu(false);
      }
    };

    if (showFilter || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter, showMobileMenu]);

  useEffect(() => {
    setLoading(true);
    const { season, year } = getCurrentSeason();
    
    // Reduce API calls by getting more data in fewer requests
    Promise.allSettled([
      getPopularAnime(1, 8), // Get more popular anime, we'll use first 3 for featured
      getTrendingAnime(1, 8), // Trending anime
      getSeasonalAnime(1, 8, season, year), // Seasonal anime
      // Skip anime count for now to reduce API calls
    ]).then((results) => {
      const [popularResult, trendingResult, seasonalResult] = results;
      
      // Handle popular anime (use first 3 for featured, rest for backup)
      if (popularResult.status === 'fulfilled') {
        const popularData = popularResult.value.data.Page.media;
        setFeaturedAnime(popularData.slice(0, 3));
        // If trending fails, use popular as backup
        if (trendingResult.status !== 'fulfilled') {
          setTrendingAnime(popularData.slice(3, 8));
        }
      } else {
        console.error('Failed to load popular anime:', popularResult.reason);
        // Replace setError('Failed to load some content. Please refresh the page.'); with console.error
      }
      
      // Handle trending anime
      if (trendingResult.status === 'fulfilled') {
        setTrendingAnime(trendingResult.value.data.Page.media.slice(0, 8));
      } else {
        console.error('Failed to load trending anime:', trendingResult.reason);
        // Use popular anime as fallback if trending fails
        if (popularResult.status === 'fulfilled') {
          setTrendingAnime(popularResult.value.data.Page.media.slice(3, 8));
        }
      }
      
      // Handle seasonal anime
      if (seasonalResult.status === 'fulfilled') {
        setSeasonalAnime(seasonalResult.value.data.Page.media.slice(0, 8));
      } else {
        console.error('Failed to load seasonal anime:', seasonalResult.reason);
        // Use trending anime as fallback if seasonal fails
        if (trendingResult.status === 'fulfilled') {
          setSeasonalAnime(trendingResult.value.data.Page.media.slice(0, 8));
        }
      }
      
      // Set a reasonable anime count without making an API call
      setAnimeCount(50000); // AniList has ~50k+ anime
      
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  const nextSlide = () => {
    if (featuredAnime.length > 0) {
      setCarouselIndex((i) => (i + 1) % featuredAnime.length);
    }
  };
  
  const prevSlide = () => {
    if (featuredAnime.length > 0) {
      setCarouselIndex((i) => (i - 1 + featuredAnime.length) % featuredAnime.length);
    }
  };

  const openAnimeModal = (anime: Anime) => {
    setSelectedAnime(anime);
    setShowAnimeModal(true);
  };

  const handleTrackAnime = async (anime: Anime, status: string, episode: number) => {
    await updateTrackedAnime(anime.id, status, episode);
  };

  const handleAddToWatchlist = (anime: Anime) => {
    handleTrackAnime(anime, "Plan to Watch", 1);
    setShowAnimeModal(false);
    setSelectedAnime(null);
  };

  // No premium logic needed for free launch

  // Real-time search as user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchAnime(searchQuery, 1, 50);
        setSearchResults(res.data.Page.media);
      } catch (err) {
        setSearchError("Failed to fetch search results. Please try again.");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header - Simple */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-purple-800/40 bg-white/10 backdrop-blur-lg fixed top-0 left-0 right-0 z-50" style={{background: 'rgba(30, 27, 75, 0.5)'}}>
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}> 
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl gradient-text">AniSkip</h2>
            <div className="flex gap-2 mt-1 items-center">
              <span className="px-1.5 py-0.5 bg-slate-800/60 text-slate-300 rounded-full text-[8px] font-normal border border-slate-700" style={{minWidth: 'unset', lineHeight: '1.1'}}>Filler Lists</span>
              <span className="px-1.5 py-0.5 bg-slate-800/60 text-slate-300 rounded-full text-[8px] font-normal border border-slate-700" style={{minWidth: 'unset', lineHeight: '1.1'}}>Watch Guides</span>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anime..."
            className="w-full px-4 py-2 pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </form>
        {/* User/Lang */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-slate-300 text-base font-medium mr-2">
                {(() => {
                  const email = user.email || "";
                  const username = email.split("@")[0];
                  let greeted = false;
                  try {
                    greeted = localStorage.getItem("welcomed_" + username) === "1";
                    if (!greeted) localStorage.setItem("welcomed_" + username, "1");
                  } catch {}
                  return greeted
                    ? `Welcome back, ${username}`
                    : `Welcome, ${username}`;
                })()}
              </span>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              Join
            </button>
          )}
        </div>
      </header>

      {/* Search Results Overlay */}
      {searchQuery && (
        <div className="w-full min-h-[calc(100vh-72px)] bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 transition-all pt-[72px] pb-12 flex flex-col items-center justify-start" style={{minHeight: 'calc(100vh - 72px)'}}>
          <section className="w-full max-w-7xl px-8 pt-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4">Search Results for "{searchQuery}"</h2>
            {searchLoading ? (
              <div className="border-slate-700 rounded-lg p-8 text-center text-slate-400 bg-slate-900/80">Loading...</div>
            ) : searchError ? (
              <div className="border-red-700 rounded-lg p-8 text-center text-red-400 bg-slate-900/80">{searchError}</div>
            ) : searchResults.length === 0 ? (
              <div className="border-slate-700 rounded-lg p-8 text-center text-slate-400 bg-slate-900/80">No results found.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full justify-center">
                {searchResults.map(anime => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onClick={openAnimeModal}
                    isInWatchlist={!!trackedMap[anime.id]}
                    onAddToWatchlist={user ? handleAddToWatchlist : undefined}
                    currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                    currentEpisode={trackedMap[anime.id]?.episode || 1}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      {/* Only show the rest of the page if not searching */}
      {!searchQuery && (
        <>
          {/* Hero Carousel - Large immersive */}
          <section className="relative w-full mx-auto mt-0 mb-12" style={{height: 'calc(100vh - 0px)', minHeight: 600, maxHeight: '100vh', paddingTop: 0}}>
            <div className="relative w-full h-full" style={{height: '100%'}}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner />
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {featuredAnime.length > 0 && (
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full flex cursor-pointer"
                      onClick={() => openAnimeModal(featuredAnime[carouselIndex])}
                    >
                      {/* Background image */}
                      <img
                        src={featuredAnime[carouselIndex].bannerImage || featuredAnime[carouselIndex].coverImage.large}
                        alt={featuredAnime[carouselIndex].title.romaji}
                        className="object-cover w-full h-full absolute inset-0 z-0"
                        style={{filter: 'brightness(0.55)', objectPosition: 'top'}}
                      />
                      {/* Overlay gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      {/* Overlayed info */}
                      <div className="relative z-20 flex flex-col justify-end h-full w-full px-12 pb-16 max-w-4xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                          {featuredAnime[carouselIndex].title.english || featuredAnime[carouselIndex].title.romaji}
                        </h2>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-purple-600/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {featuredAnime[carouselIndex].format}
                          </span>
                          <span className="bg-slate-700/80 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
                            {featuredAnime[carouselIndex].season} {featuredAnime[carouselIndex].seasonYear}
                          </span>
                          <span className="bg-slate-700/80 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
                            {featuredAnime[carouselIndex].genres?.slice(0, 3).join(' • ')}
                          </span>
                        </div>
                        <p className="text-lg text-slate-200 max-w-2xl mb-6 line-clamp-3">
                          {featuredAnime[carouselIndex].description?.replace(/<[^>]+>/g, '').slice(0, 220) + (featuredAnime[carouselIndex].description?.length > 220 ? '...' : '')}
                        </p>
                        <div className="flex items-center gap-6 mt-2">
                          <button 
                            onClick={e => {e.stopPropagation(); openAnimeModal(featuredAnime[carouselIndex]);}}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
                          >
                            Watch Now
                          </button>
                          <div className="flex items-center gap-3 text-slate-300 text-sm">
                            <span>⭐ {featuredAnime[carouselIndex].averageScore ? (featuredAnime[carouselIndex].averageScore / 10).toFixed(1) : 'N/A'}</span>
                            <span>• {featuredAnime[carouselIndex].episodes ? `${featuredAnime[carouselIndex].episodes} eps` : 'Ongoing'}</span>
                            <span>• {featuredAnime[carouselIndex].duration || 24} min/ep</span>
                          </div>
                        </div>
                      </div>
                      {/* Carousel controls */}
                      {featuredAnime.length > 1 && (
                        <>
                          <button 
                            onClick={e => {e.stopPropagation(); prevSlide();}}
                            className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-4 shadow-lg backdrop-blur-sm transition-all duration-200 z-20"
                          >
                            <ChevronLeft className="w-7 h-7" />
                          </button>
                          <button 
                            onClick={e => {e.stopPropagation(); nextSlide();}}
                            className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-4 shadow-lg backdrop-blur-sm transition-all duration-200 z-20"
                          >
                            <ChevronRight className="w-7 h-7" />
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </section>

          {/* Trending Section */}
          <section id="trending-section" className="max-w-7xl mx-auto mt-16 px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Trending This Week
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingAnime.length > 0 ? (
                  trendingAnime.map((anime, index) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnimeCard 
                        anime={anime} 
                        onClick={openAnimeModal}
                        isInWatchlist={!!trackedMap[anime.id]}
                        onAddToWatchlist={user ? handleAddToWatchlist : undefined}
                        currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                        currentEpisode={trackedMap[anime.id]?.episode || 1}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-slate-400 mb-4">Unable to load trending anime</div>
                    <button
                      onClick={() => {
                        clearApiCache();
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </section>

          {/* Seasonal Section */}
          <section className="max-w-7xl mx-auto mt-16 px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  {getCurrentSeason().season.charAt(0) + getCurrentSeason().season.slice(1).toLowerCase()} {getCurrentSeason().year}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {seasonalAnime.length > 0 ? (
                  seasonalAnime.map((anime, index) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnimeCard 
                        anime={anime} 
                        onClick={openAnimeModal}
                        isInWatchlist={!!trackedMap[anime.id]}
                        onAddToWatchlist={user ? handleAddToWatchlist : undefined}
                        currentStatus={trackedMap[anime.id]?.status || "Plan to Watch"}
                        currentEpisode={trackedMap[anime.id]?.episode || 1}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-slate-400 mb-4">Unable to load seasonal anime</div>
                    <button
                      onClick={() => {
                        clearApiCache();
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="bg-black/50 mt-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand & CTA */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white">AniSkip</h3>
                      <p className="text-xs text-slate-400">Pro Anime Tracker</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Skip the fillers, track your progress, and discover amazing anime. The ultimate anime tracking experience for true fans.
                  </p>
                  {animeCount > 0 && false && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Database className="w-4 h-4" />
                      <span>Access to {animeCount.toLocaleString()}+ anime from AniList</span>
                    </div>
                  )}
                  {!user && (
                    <button 
                      onClick={() => navigate('/signup')}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                    >
                      Get Started Free
                    </button>
                  )}
                </div>

                {/* Quick Links */}
              </div>
              
              <div className="border-t border-slate-800 mt-8 pt-8 text-center">
                <p className="text-slate-400 text-sm">
                  © 2025 AniSkip. All rights reserved. Made with ❤️ for anime fans.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Anime Modal - moved outside search conditional so it works during search */}
      <AnimatePresence>
        {showAnimeModal && selectedAnime && (
          <AnimeModal
            anime={selectedAnime}
            isOpen={showAnimeModal}
            onClose={() => {
              setShowAnimeModal(false);
              setSelectedAnime(null);
            }}
            onTrackAnime={handleTrackAnime}
            trackedAnime={trackedMap[selectedAnime.id.toString()]}
            isProUser={false} // Always false for free launch
            userId={userId}
            showSignInPrompt={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;