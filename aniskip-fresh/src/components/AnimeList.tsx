"use client";
import { useEffect, useState, useRef } from "react";
import AnimeDetailModal from './AnimeDetailModal';
import { FaRegBookmark, FaBookmark, FaStar } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Image from "next/image";
import { supabase } from '../../lib/supabaseClient';

// Type definitions for anime and episodes
interface Episode {
  number: number;
  title: string;
  filler: boolean;
  recap: boolean;
}

interface Anime {
  id: number;
  title: string;
  altTitles: string[];
  image: string;
  synopsis: string;
  episodes: Episode[];
  type?: string;
  score?: number;
  status?: string;
  aired?: string;
}

interface AnimeListProps {
  searchQuery?: string;
}

// Utility: robust search (token match, alt titles, fuzzy)
function matchesSearch(anime: Anime, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);
  const altTitles = Array.isArray((anime as any).altTitles) ? (anime as any).altTitles : [];
  const allTitles = [anime.title, ...altTitles].map((t) => t.toLowerCase());
  // Token match: all tokens must appear in any title
  return allTitles.some((title) => tokens.every((token) => title.includes(token)));
}

// Helper: fetch from Jikan API
async function jikanSearch(query: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`);
  const data = await res.json();
  return data.data || [];
}
async function jikanAnimeDetails(id: number) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
  const data = await res.json();
  return data.data;
}

function Spinner() {
  return <AiOutlineLoading3Quarters className="animate-spin text-3xl text-violet-400 mx-auto my-8" />;
}

export default function AnimeList({ searchQuery }: AnimeListProps) {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Anime | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [clickCounts, setClickCounts] = useState<{[id: number]: number}>({});
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      const { data, error } = await supabase.from('anime').select('*');
      if (error) {
        // Try to fallback to local data if available
        try {
          const res = await fetch('/anime_db.json');
          const localData = await res.json();
          setAnimeList(localData);
          setError('Could not load from Supabase. Showing local data.');
        } catch {
          setAnimeList([]);
          setError('Could not load anime from Supabase or local data.');
        }
      } else if (!data || data.length === 0) {
        setAnimeList([]);
        setError(null); // No error, just empty
      } else {
        setAnimeList(data);
        setError(null);
      }
      setLoading(false);
    }
    fetchAnime();
    setBookmarks(JSON.parse(localStorage.getItem("bookmarks") || "[]"));
    setClickCounts(JSON.parse(localStorage.getItem("clickCounts") || "{}"));
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery) {
      setLiveResults([]);
      setLiveLoading(false);
      setError(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        // Query Supabase for anime matching the search query
        const { data: supaResults, error: supaError } = await supabase
          .from('anime')
          .select('*')
          .ilike('title', `%${searchQuery}%`);
        if (supaError) {
          setError('Could not connect to Supabase.');
          setLiveResults([]);
          setLiveLoading(false);
          return;
        }
        if (supaResults && supaResults.length > 0) {
          setAnimeList(supaResults);
          setLiveResults([]);
          setLiveLoading(false);
          setError(null);
        } else {
          // No results in Supabase, show Jikan live results
          setLiveLoading(true);
          setError(null);
          jikanSearch(searchQuery).then((results) => {
            setLiveResults(results);
            setLiveLoading(false);
          }).catch(() => {
            setError('Could not fetch results from Jikan.');
            setLiveLoading(false);
          });
        }
      } catch (err) {
        setError('Unexpected error during search.');
        setLiveResults([]);
        setLiveLoading(false);
      }
    }, 350);
    // eslint-disable-next-line
  }, [searchQuery]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleCardClick(anime: Anime) {
    setSelected(anime);
    // Track clicks for popularity
    const counts = { ...clickCounts, [anime.id]: (clickCounts[anime.id] || 0) + 1 };
    setClickCounts(counts);
    localStorage.setItem("clickCounts", JSON.stringify(counts));
  }

  // Handle click on live result: fetch full details, add to Supabase if not present, show modal
  async function handleLiveCardClick(liveAnime: any) {
    setLiveLoading(true);
    const details = await jikanAnimeDetails(liveAnime.mal_id);
    // Map Jikan data to local Anime type
    const mapped: Anime = {
      id: details.mal_id,
      title: details.title,
      altTitles: [details.title_english, details.title_japanese, ...(details.titles?.map(t => t.title) || [])].filter(Boolean),
      image: details.images?.webp?.large_image_url || details.images?.jpg?.large_image_url || details.images?.jpg?.image_url || '',
      synopsis: details.synopsis || '',
      episodes: (details.episodes || []).map((ep: any) => ({
        number: ep.mal_id || ep.episode_id || ep.number,
        title: ep.title || '',
        filler: ep.filler || false,
        recap: ep.recap || false,
      })),
      type: details.type || '',
      score: details.score || null,
      status: details.status || '',
      aired: details.aired?.prop?.from?.year ? String(details.aired.prop.from.year) : (details.aired?.string || ''),
    };
    // Check if already in Supabase by mal_id
    const { data: existing, error: checkError } = await supabase
      .from('anime')
      .select('*')
      .eq('id', mapped.id)
      .limit(1);
    if (!existing || existing.length === 0) {
      // Not in Supabase, insert
      await supabase.from('anime').insert([mapped]);
    }
    // Add to local state
    setAnimeList(prev => {
      const exists = prev.some(a => a.id === mapped.id);
      if (exists) return prev;
      const updated = [...prev, mapped];
      localStorage.setItem('animeCache', JSON.stringify(updated));
      return updated;
    });
    setSelected(mapped);
    setLiveLoading(false);
    setToast('Anime added to your library!');
  }

  function toggleBookmark(anime: Anime) {
    let updated;
    if (bookmarks.some((a) => a.id === anime.id)) {
      updated = bookmarks.filter((a) => a.id !== anime.id);
    } else {
      updated = [...bookmarks, { id: anime.id, title: anime.title, image: anime.image }];
    }
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  }

  // If searchQuery, filter; else show top 8
  let displayList = animeList;
  if (searchQuery) {
    displayList = animeList.filter((anime) => matchesSearch(anime, searchQuery));
  } else {
    displayList = [...animeList].sort((a, b) => (clickCounts[b.id] || 0) - (clickCounts[a.id] || 0)).slice(0, 8);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-base font-semibold animate-fade-in">
          {toast}
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        displayList.length === 0 ? (
          <div>
            {liveLoading ? (
              <Spinner />
            ) : error ? (
              <div className="text-center text-red-400 py-12 text-xl font-semibold">{error}</div>
            ) : liveResults.length > 0 ? (
              <>
                <div className="text-center text-blue-500 py-4 text-base font-medium flex items-center justify-center gap-2">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mr-2">Live from MyAnimeList</span>
                  <span>Results</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {liveResults.map((anime) => (
                    <div
                      key={anime.mal_id}
                      className={`bg-white rounded-2xl shadow-xl transition-all duration-200 cursor-pointer flex flex-col overflow-hidden border border-blue-300 group relative hover:-translate-y-2 hover:shadow-2xl ${liveLoading ? 'pointer-events-none opacity-60' : ''}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open details for ${anime.title}`}
                      onClick={() => !liveLoading && handleLiveCardClick(anime)}
                      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !liveLoading) handleLiveCardClick(anime); }}
                    >
                      <div className="relative w-full aspect-[3/4] bg-gray-100">
                        <img
                          src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/file.svg'}
                          alt={anime.title}
                          className="object-cover rounded-t-2xl w-full h-full"
                          onError={e => { (e.target as HTMLImageElement).src = '/file.svg'; }}
                        />
                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-bold shadow">Live</span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-800 mb-1 truncate" title={anime.title}>{anime.title}</h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center gap-1 text-amber-500 font-bold text-lg"><FaStar className="inline-block" /> {anime.score || '--'}</span>
                          <span className="flex items-center gap-1 text-gray-500 text-sm">{anime.episodes || '--'} eps</span>
                          <span className="text-gray-500 text-sm">{anime.status || ''}</span>
                        </div>
                        <button
                          className="text-violet-600 font-semibold text-base flex items-center gap-1 hover:underline mt-auto cursor-pointer"
                          tabIndex={-1}
                          onClick={e => { e.stopPropagation(); if (!liveLoading) handleLiveCardClick(anime); }}
                          disabled={liveLoading}
                        >
                          View Guide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-12 text-xl font-semibold">No Results!</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayList.map((anime) => (
              <div
                key={anime.id}
                className="bg-white rounded-2xl shadow-xl transition-all duration-200 cursor-pointer flex flex-col overflow-hidden border border-gray-200 group relative hover:-translate-y-2 hover:shadow-2xl focus:ring-2 focus:ring-violet-400"
                tabIndex={0}
                role="button"
                aria-label={`Open details for ${anime.title}`}
                onClick={() => !liveLoading && handleCardClick(anime)}
                onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !liveLoading) handleCardClick(anime); }}
              >
                {/* Bookmark icon */}
                <button
                  className="absolute top-3 right-3 z-10 text-2xl text-gray-400 hover:text-violet-500 transition cursor-pointer"
                  onClick={e => { e.stopPropagation(); toggleBookmark(anime); }}
                  aria-label={bookmarks.some((a) => a.id === anime.id) ? "Remove bookmark" : "Add bookmark"}
                >
                  {bookmarks.some((a) => a.id === anime.id) ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <div className="relative w-full aspect-[3/4] bg-gray-100">
                  <img
                    src={anime.image || '/file.svg'}
                    alt={anime.title}
                    className="object-cover rounded-t-2xl w-full h-full"
                    onError={e => { (e.target as HTMLImageElement).src = '/file.svg'; }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-800 mb-1 truncate" title={anime.title}>{anime.title}</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 text-amber-500 font-bold text-lg"><FaStar className="inline-block" /> 8.01</span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg> {anime.episodes.length} eps</span>
                    <span className="text-gray-500 text-sm">Finished Airing</span>
                  </div>
                  <button
                    className="text-violet-600 font-semibold text-base flex items-center gap-1 hover:underline mt-auto cursor-pointer"
                    tabIndex={-1}
                    onClick={e => { e.stopPropagation(); handleCardClick(anime); }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
                    View Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {/* Modal for anime details */}
      <AnimeDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ''}
        image={selected?.image || ''}
        synopsis={selected?.synopsis || ''}
        episodes={selected?.episodes || []}
        type={selected?.type || ''}
        score={selected?.score}
        status={selected?.status || ''}
        aired={selected?.aired || ''}
      />
    </section>
  );
} 