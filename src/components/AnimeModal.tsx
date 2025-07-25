import { getShowsByName, getEpisodesFor, EPISODE_TYPE } from 'anime-filler-api';

// Helper to get slug for anime-filler-api
async function getFillerApiSlugFromName(anime: any) {
  let title = anime.title?.english || anime.title?.romaji || anime.title?.native || anime.name || '';
  try {
    const shows = await getShowsByName(title);
    if (shows && shows.length > 0) {
      return shows[0].slug;
    }
  } catch {}
  return null;
}

// Helper to fetch episode breakdown from anime-filler-api
async function fetchFillerApiEpisodesNpm(anime: any) {
  const slug = await getFillerApiSlugFromName(anime);
  if (!slug) return [];
  try {
    const episodes = await getEpisodesFor(slug);
    if (Array.isArray(episodes)) {
      return episodes.map((ep: any) => ({
        number: ep.number,
        title: ep.title || `Episode ${ep.number}`,
        filler: ep.type === EPISODE_TYPE.FILLER,
        recap: ep.type === EPISODE_TYPE.UNKNOWN || ep.type === 'RECAP',
        synopsis: undefined,
        type: ep.type
      }));
    }
  } catch (e) {}
  return [];
}

function useEpisodeBreakdown(malId?: number, anilistId?: number, enabled?: boolean, anime?: any) {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    let cancelled = false;
    async function fetchEpisodes() {
      // 1. Try anime-filler-api npm
      let fillerApiEpisodes: any[] = [];
      if (anime) {
        fillerApiEpisodes = await fetchFillerApiEpisodesNpm(anime);
      }
      if (fillerApiEpisodes && fillerApiEpisodes.length > 0) {
        if (!cancelled) {
          setEpisodes(fillerApiEpisodes);
          setLoading(false);
        }
        return;
      }
      // 2. Try Jikan
      let jikanEpisodes: any[] = [];
      if (malId) {
        try {
          const { getAllAnimeEpisodes } = await import('../services/jikan');
          jikanEpisodes = await getAllAnimeEpisodes(malId);
        } catch {}
      }
      if (jikanEpisodes && jikanEpisodes.length > 0) {
        if (!cancelled) {
          setEpisodes(jikanEpisodes);
          setLoading(false);
        }
        return;
      }
      // 3. Fallback to local data
      const { POPULAR_ANIME_DATABASE } = await import('../data/popularAnime');
      const local = POPULAR_ANIME_DATABASE.find(a => a.malId === malId);
      if (local && local.fillerRanges) {
        const total = local.estimatedFillers + (local.estimatedCanon || 0);
        let breakdown: any[] = [];
        let fillerSet = new Set<number>();
        for (const range of local.fillerRanges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) fillerSet.add(i);
          } else {
            fillerSet.add(Number(range));
          }
        }
        for (let i = 1; i <= (local.episodes || total || 100); i++) {
          breakdown.push({
            number: i,
            title: `Episode ${i}`,
            filler: fillerSet.has(i),
            recap: false,
            synopsis: undefined
          });
        }
        if (!cancelled) {
          setEpisodes(breakdown);
          setLoading(false);
        }
        return;
      }
      // 4. Nothing found
      if (!cancelled) {
        setEpisodes([]);
        setLoading(false);
      }
    }
    fetchEpisodes();
    return () => { cancelled = true; };
  }, [malId, anilistId, enabled, anime]);
  return { episodes, loading };
}

// ... existing code ...

const malId = (anime as any).mal_id;
const anilistId = anime.id;
const streamingSites = useJikanStreamingSites(malId, !!userId);
const { episodes: breakdownEpisodes, loading: episodesLoading } = useEpisodeBreakdown(malId, anilistId, !!userId, anime);

// ... existing code ...