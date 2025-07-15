import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fetch all episodes for an anime, handling pagination
async function fetchAllEpisodes(malId) {
  let episodes = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes?page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    if (!data.data || data.data.length === 0) break;
    episodes = episodes.concat(data.data.map(ep => ({
      number: ep.mal_id || ep.episode_id || ep.number,
      title: ep.title || '',
      filler: ep.filler || false,
      recap: ep.recap || false,
    })));
    hasNext = data.pagination?.has_next_page;
    page++;
  }
  return episodes;
}

async function importAnime(malId) {
  try {
    // Fetch main anime details
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`);
    if (!res.ok) return;
    const details = (await res.json()).data;
    if (!details) return;

    // Fetch all episodes (paginated)
    let episodes = await fetchAllEpisodes(malId);

    // Impute episodes for movies/OVAs if needed
    if (
      (!episodes || episodes.length === 0) &&
      (details.type === 'Movie' || details.type === 'OVA') &&
      details.episodes > 0
    ) {
      episodes = Array.from({ length: details.episodes }, (_, i) => ({
        number: i + 1,
        title: details.title + (details.episodes > 1 ? ` - Part ${i + 1}` : ''),
        filler: false,
        recap: false,
      }));
    }

    const anime = {
      id: details.mal_id,
      title: details.title,
      alt_titles: [
        details.title_english,
        details.title_japanese,
        ...(details.titles?.map(t => t.title) || [])
      ].filter(Boolean),
      image: details.images?.webp?.large_image_url || details.images?.jpg?.large_image_url || details.images?.jpg?.image_url || '',
      synopsis: details.synopsis || '',
      episodes,
      type: details.type || '',
      score: details.score || null,
      status: details.status || '',
      aired: details.aired?.prop?.from?.year ? String(details.aired.prop.from.year) : (details.aired?.string || ''),
    };

    // Upsert to avoid duplicates, and log errors
    const { error } = await supabase.from('anime').upsert([anime]);
    if (error) {
      console.error(`Supabase error for MAL ID ${malId}:`, error.message);
    } else {
      console.log(`Imported anime MAL ID: ${malId}`);
    }
  } catch (err) {
    console.error(`Failed to import MAL ID ${malId}:`, err.message);
  }
}

// Import the first 3000 anime using pagination (25 per page, 120 pages)
const PAGE_START = 1; // Change this to resume from a specific page
const PAGE_END = 120; // 120 pages * 25 = 3000 anime

(async () => {
  for (let page = PAGE_START; page <= PAGE_END; page++) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
      if (!res.ok) break;
      const data = await res.json();
      if (!data.data || data.data.length === 0) break;
      for (const anime of data.data) {
        await importAnime(anime.mal_id);
        await new Promise(r => setTimeout(r, 1200)); // Respect Jikan rate limit
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page}:`, err.message);
    }
  }
})(); 