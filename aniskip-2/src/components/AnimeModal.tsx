import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, X } from "lucide-react";
import { Anime } from "../services/anilist";

import { useNavigate } from "react-router-dom";

interface AnimeModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist?: (anime: Anime) => void;
  // New props for tracker
  trackedAnime?: {
    status: string;
    episode: number;
  };
  onTrackAnime?: (anime: Anime, status: string, episode: number) => void;
  isProUser?: boolean;
  userId?: string | null;
  showSignInPrompt?: boolean; // NEW PROP
}

const STATUS_OPTIONS = [
  "Watching",
  "Completed",
  "Plan to Watch",
  "On Hold",
  "Dropped"
];

// Episode guides removed - unused in current implementation

// Only keep franchise-level smart watch guides for One Piece and Black Clover
const SMART_WATCH_GUIDES: Record<number, string[]> = {
  21: [
    // Fill in with franchise-level One Piece guide lines
  ],
  97940: [
    // Fill in with franchise-level Black Clover guide lines
  ]
};

// Helper to fetch streaming sites from Jikan (now uses /anime/{id}/full)
function useJikanStreamingSites(malId?: number, enabled?: boolean) {
  const [streamingSites, setStreamingSites] = useState<{ name: string; url: string }[]>([]);
  useEffect(() => {
    if (!malId || !enabled) return;
    fetch(`https://api.jikan.moe/v4/anime/${malId}/full`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        if (json?.data?.streaming && Array.isArray(json.data.streaming)) {
          setStreamingSites(json.data.streaming.map((s: any) => ({ name: s.name, url: s.url })));
        } else {
          setStreamingSites([]);
        }
      })
      .catch(() => setStreamingSites([]));
  }, [malId, enabled]);
  return streamingSites;
}

// Helper to fetch all episodes from Jikan API (all pages) - COMMENTED OUT
/* function useJikanEpisodesAll(malId?: number, enabled?: boolean) {
  const [episodes, setEpisodes] = useState<{
    number: number;
    title: string;
    filler: boolean;
    recap: boolean;
    synopsis?: string;
  }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!malId || !enabled) return;
    setLoading(true);
    let allEpisodes: any[] = [];
    let page = 1;
    let hasNext = true;
    const fetchPage = async () => {
      while (hasNext) {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes?page=${page}`);
        if (!res.ok) break;
        const json = await res.json();
        if (Array.isArray(json.data)) {
          allEpisodes = allEpisodes.concat(json.data.map((ep: any) => ({
            number: ep.mal_id || ep.episode || ep.episode_id || ep.number || 0,
            title: ep.title || `Episode ${ep.mal_id || ep.episode || ep.episode_id || ep.number || 0}`,
            filler: ep.filler || false,
            recap: ep.recap || false,
            synopsis: ep.synopsis || undefined
          })));
        }
        hasNext = json.pagination?.has_next_page;
        page++;
      }
      setEpisodes(allEpisodes);
      setLoading(false);
    };
    fetchPage().catch(() => setLoading(false));
  }, [malId, enabled]);
  return { episodes, loading };
} */

export default function AnimeModal({ 
  anime, 
  isOpen, 
  onClose, 
  onAddToWatchlist,
  trackedAnime,
  onTrackAnime,
  userId,
  showSignInPrompt = false // NEW PROP
}: AnimeModalProps) {
  if (!anime) return null;
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [episode, setEpisode] = useState<number>(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);


  // Debug log for userId
  console.log('[AnimeModal] userId:', userId);

  useEffect(() => {
    if (trackedAnime) {
      setSelectedStatus(trackedAnime.status);
      setEpisode(trackedAnime.episode);
    } else {
      setSelectedStatus("");
      setEpisode(1);
    }
    setSaved(false);
    setSaving(false);
  }, [anime, trackedAnime, isOpen]);

  const getTitle = () => anime.title.english || anime.title.romaji || anime.title.native;
  const getScore = () => (anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A");



  // Use MyAnimeList ID for Jikan API if available
  const malId = (anime as any).mal_id;
  const streamingSites = useJikanStreamingSites(malId, !!userId);
  // Episode data commented out for now
  // const { episodes: jikanEpisodes, loading: episodesLoading } = useJikanEpisodesAll(malId, !!userId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-purple-800/40 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Image and Basic Info */}
              <div className="flex-shrink-0 flex flex-col">
                <div className="relative">
                  <img 
                    src={anime.coverImage.large} 
                    alt={getTitle()} 
                    className="w-64 h-96 object-cover rounded-xl shadow-lg"
                  />
                  {/* Score Badge */}
                  {anime.averageScore && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {getScore()}
                    </div>
                  )}
                </div>
                
                {/* Add to List (Tracker) UI - Only show for logged-in users */}
                {userId && (
                  <div>
                    {/* Status/Episode Section: Always render for static DOM order */}
                    <div className={userId ? "mb-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50" : "mb-4"} style={!userId ? { display: 'none' } : {}}>
                      {userId ? (
                        <>
                          <div className="mb-2 text-white font-semibold text-base flex items-center gap-2">
                            Set Status & Progress
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {STATUS_OPTIONS.map(status => (
                              <button
                                key={status}
                                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-150 ${selectedStatus === status ? "bg-purple-600 text-white border-purple-500" : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-purple-800/40 hover:text-white"}`}
                                onClick={() => {
                                  setSelectedStatus(status);
                                  if (status === "Completed" && anime.episodes) setEpisode(anime.episodes);
                                  else if (status === "Plan to Watch") setEpisode(0);
                                  else setEpisode(1);
                                }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          {selectedStatus ? (
                            <div className="flex items-center gap-2 mb-3">
                              <label className="text-slate-300 text-sm">Episode:</label>
                              <button
                                className="px-2 py-1 rounded bg-slate-700 text-white text-xs"
                                onClick={() => {
                                  const newEp = Math.max(selectedStatus === 'Plan to Watch' ? 0 : 1, episode - 1);
                                  setEpisode(newEp);
                                  if (selectedStatus === 'Plan to Watch' && newEp > 0) setSelectedStatus('Watching');
                                }}
                                disabled={episode <= (selectedStatus === 'Plan to Watch' ? 0 : 1)}
                              >-</button>
                              <input
                                type="number"
                                min={selectedStatus === 'Plan to Watch' ? 0 : 1}
                                max={anime.episodes || 3000}
                                value={episode === null ? '' : episode}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (/^\d*$/.test(val)) {
                                    if (val === "") {
                                      setEpisode(NaN); // allow empty for typing
                                    } else {
                                      const num = Number(val);
                                      setEpisode(num);
                                      // Auto-shift logic
                                      if (anime.episodes && num === anime.episodes) setSelectedStatus('Completed');
                                      else if (num === 0) setSelectedStatus('Plan to Watch');
                                      else if (selectedStatus === 'Plan to Watch' && num > 0) setSelectedStatus('Watching');
                                    }
                                  }
                                }}
                                onBlur={e => {
                                  let num = Number(e.target.value);
                                  if (isNaN(num)) num = selectedStatus === 'Plan to Watch' ? 0 : 1;
                                  if (num < (selectedStatus === 'Plan to Watch' ? 0 : 1)) num = selectedStatus === 'Plan to Watch' ? 0 : 1;
                                  if (anime.episodes && num > anime.episodes) num = anime.episodes;
                                  setEpisode(num);
                                  // Auto-shift logic
                                  if (anime.episodes && num === anime.episodes) setSelectedStatus('Completed');
                                  else if (num === 0) setSelectedStatus('Plan to Watch');
                                  else if (selectedStatus === 'Plan to Watch' && num > 0) setSelectedStatus('Watching');
                                }}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                              />
                              <button
                                className="px-2 py-1 rounded bg-slate-700 text-white text-xs"
                                onClick={() => {
                                  const maxEp = anime.episodes || 3000;
                                  const newEp = Math.min(maxEp, episode + 1);
                                  setEpisode(newEp);
                                  if (selectedStatus === 'Plan to Watch' && newEp > 0) setSelectedStatus('Watching');
                                }}
                                disabled={anime.episodes ? episode >= anime.episodes : false}
                              >+</button>
                              <span className="text-xs text-slate-400">/ {anime.episodes || '?'} </span>
                              <button
                                className={`ml-4 px-4 py-1 rounded text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg focus:outline-none ${saving ? 'opacity-60' : ''}`}
                                onClick={async () => {
                                  let ep = episode;
                                  if (isNaN(ep)) ep = selectedStatus === 'Plan to Watch' ? 0 : 1;
                                  if (ep < (selectedStatus === 'Plan to Watch' ? 0 : 1)) ep = selectedStatus === 'Plan to Watch' ? 0 : 1;
                                  if (anime.episodes && ep > anime.episodes) ep = anime.episodes;
                                  setEpisode(ep);
                                  if (selectedStatus === 'Plan to Watch' && ep > 0) setSelectedStatus('Watching');
                                  if (onTrackAnime && selectedStatus) {
                                    setSaving(true);
                                    await onTrackAnime(anime, selectedStatus, ep);
                                    setSaved(true);
                                    setTimeout(() => setSaved(false), 2000);
                                    setSaving(false);
                                  }
                                }}
                                disabled={saving || !selectedStatus}
                              >
                                {saved ? "Saved!" : trackedAnime ? "Update" : "Save"}
                              </button>
                            </div>
                          ) : <div style={{display:'none'}} />}
                        </>
                      ) : <div style={{display:'none'}} />}
                    </div>

                    {/* Debug Test Button */}
                    {/*<div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                      {userId ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Bug className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-medium">Debug Connection</span>
                          </div>
                          <button
                            onClick={handleTestConnection}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
                          >
                            Test Watchlist Connection
                          </button>
                          {testResult && (
                            <div className="mt-2 text-xs text-slate-300">{testResult}</div>
                          )}
                        </>
                      ) : <div style={{display:'none'}} />}
                    </div>
                    
                    {/* Currently tracked info */}
                    <div>
                      {trackedAnime ? (
                        <div className="mt-2 text-xs text-green-400">Currently: {trackedAnime.status} (Ep {trackedAnime.episode})</div>
                      ) : <div style={{display:'none'}} />}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  {onAddToWatchlist && (
                    <button 
                      onClick={() => onAddToWatchlist(anime)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Watchlist
                    </button>
                  )}
                </div>

                {/* Sign in prompt for non-logged-in users */}
                {!userId && showSignInPrompt && (
                  <div className="mt-8 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg mb-2">Want to track this anime?</h3>
                      <p className="text-slate-300 text-sm mb-4">
                        Sign in to add anime to your watchlist and track your progress.
                      </p>
                      <button 
                        onClick={() => {
                          onClose();
                          navigate('/signup'); // Redirect to the new sign-up page
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="flex-1 min-w-0">
                {/* Title and Status */}
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                    {getTitle()}
                  </h2>
                  {anime.title.native && anime.title.native !== getTitle() && (
                    <p className="text-lg text-slate-400 mb-2">{anime.title.native}</p>
                  )}
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="capitalize bg-slate-800/50 px-3 py-1 rounded-full text-sm">
                      {anime.status?.toLowerCase()}
                    </span>
                    {anime.episodes && (
                      <span className="text-slate-400">
                        {anime.episodes} Episodes
                      </span>
                    )}
                    {anime.duration && (
                      <span className="text-slate-400">
                        {anime.duration} min/ep
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {anime.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                    <div 
                      className="text-slate-300 leading-relaxed line-clamp-6"
                      dangerouslySetInnerHTML={{ __html: anime.description }}
                    />
                  </div>
                )}

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-purple-800/40 text-purple-100 px-3 py-1 rounded-full text-sm border border-purple-700/50"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anime.format && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-1">Format</h4>
                      <p className="text-white capitalize">{anime.format.toLowerCase()}</p>
                    </div>
                  )}
                  {anime.season && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-1">Season</h4>
                      <p className="text-white capitalize">{anime.season.toLowerCase()} {anime.seasonYear}</p>
                    </div>
                  )}
                  {anime.studios && anime.studios.nodes && anime.studios.nodes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-1">Studio</h4>
                      <p className="text-white">{anime.studios.nodes[0].name}</p>
                    </div>
                  )}
                  {/* Remove or comment out source property usage as it does not exist on Anime */}
                  {/* {anime.source && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-1">Source</h4>
                      <p className="text-white capitalize">{anime.source.toLowerCase()}</p>
                    </div>
                  )} */}
                </div>

                

                {/* Smart Watch Guide - Now free for all */}
                {anime.id && SMART_WATCH_GUIDES[anime.id] && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-400" />
                    </h3>
                    <ul className="list-disc pl-6 text-purple-200 space-y-1">
                      {SMART_WATCH_GUIDES[anime.id].map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Streaming Sites - Only for logged-in users */}
                {userId && streamingSites.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-400" /> Streaming Sites
                    </h3>
                    <ul className="list-disc pl-6 text-purple-200 space-y-1">
                      {streamingSites.map((site, i) => (
                        <li key={i}>
                          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">{site.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Episode Breakdown - Only for logged-in users */}
                {/*userId ? (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-400" /> Episode Breakdown
                    </h3>
                    {episodesLoading ? (
                      <div className="text-slate-400 text-sm">Loading episode data...</div>
                    ) : (
                      <>
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-[400px] w-full text-sm text-left text-slate-300">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="px-3 py-2 font-semibold">Episode</th>
                                <th className="px-3 py-2 font-semibold">Title</th>
                                <th className="px-3 py-2 font-semibold">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jikanEpisodes.map(ep => (
                                <tr key={ep.number} className="border-b border-slate-800/50">
                                  <td className="px-3 py-2 font-bold">{ep.number}</td>
                                  <td className="px-3 py-2 text-slate-300 truncate max-w-[200px]" title={ep.title}>{ep.title}</td>
                                  <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      ep.filler ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                                      ep.recap ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50' :
                                      'bg-green-900/40 text-green-300 border border-green-700/50'
                                    }`}>
                                      {ep.filler ? 'Filler' : ep.recap ? 'Recap' : 'Canon'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="text-xs text-slate-400">
                          Showing {jikanEpisodes.length} episodes
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 text-center">
                    <h3 className="text-white font-semibold text-lg mb-2">Sign up to see the episode breakdown by canon and filler</h3>
                    <p className="text-slate-300 text-sm mb-4">Unlock detailed episode breakdowns, including canon, filler, and recap flags, by creating a free account.</p>
                    <button 
                      onClick={() => {
                        onClose();
                        navigate('/signup');
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )*/}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}