const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Load environment variables from .env.local if available
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importAnime(malId) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`);
    if (!res.ok) return;
    const details = (await res.json()).data;
    if (!details) return;

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
      episodes: (details.episodes || []).map(ep => ({
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

    // Upsert to avoid duplicates
    await supabase.from('anime').upsert([anime]);
    console.log(`Imported anime MAL ID: ${malId}`);
  } catch (err) {
    console.error(`Failed to import MAL ID ${malId}:`, err.message);
  }
}

// Example: Import first 100 anime by MAL ID
(async () => {
  for (let malId = 1; malId <= 100; malId++) {
    await importAnime(malId);
    await new Promise(r => setTimeout(r, 1200)); // Respect Jikan rate limit
  }
})(); 