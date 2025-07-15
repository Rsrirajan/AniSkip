// scripts/fetch_anime_db.js
const fs = require('fs');
const axios = require('axios');

const BASE_URL = 'https://api.jikan.moe/v4';
const ANIME_PAGE_LIMIT = 25; // Jikan default
const TARGET_ANIME_COUNT = 500;
const OUTPUT_FILE = './anime_db.json';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (e) {
      if (e.response && e.response.status === 429) {
        // Wait and retry
        const wait = 2000 + Math.random() * 2000; // 2-4 seconds
        console.log(`Rate limited. Waiting ${Math.round(wait)}ms before retrying...`);
        await sleep(wait);
      } else {
        throw e;
      }
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function fetchAnimeList() {
  let animeList = [];
  let page = 1;
  while (animeList.length < TARGET_ANIME_COUNT) {
    const url = `${BASE_URL}/anime?page=${page}&limit=${ANIME_PAGE_LIMIT}`;
    const res = await fetchWithRetry(url);
    const data = res.data.data;
    animeList = animeList.concat(data);
    if (!res.data.pagination.has_next_page) break;
    page++;
    await sleep(400); // 0.4s between page fetches
  }
  return animeList.slice(0, TARGET_ANIME_COUNT);
}

async function fetchEpisodes(animeId) {
  let episodes = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const url = `${BASE_URL}/anime/${animeId}/episodes?page=${page}`;
    try {
      const res = await fetchWithRetry(url);
      const data = res.data.data;
      episodes = episodes.concat(
        data.map(ep => ({
          number: ep.mal_id,
          title: ep.title,
          filler: ep.filler,
          recap: ep.recap
        }))
      );
      hasNext = res.data.pagination.has_next_page;
      page++;
      await sleep(400); // 0.4s between episode page fetches
    } catch (e) {
      break;
    }
  }
  return episodes;
}

async function main() {
  console.log('Fetching anime list...');
  const animeList = await fetchAnimeList();
  const db = [];
  let count = 0;
  for (const anime of animeList) {
    count++;
    console.log(`(${count}/${animeList.length}) Fetching episodes for: ${anime.title} (id: ${anime.mal_id})`);
    const episodes = await fetchEpisodes(anime.mal_id);
    db.push({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images?.jpg?.image_url || '',
      synopsis: anime.synopsis || '',
      episodes: episodes,
      totalEpisodes: anime.episodes || episodes.length,
      fillerCount: episodes.filter(e => e.filler).length,
      recapCount: episodes.filter(e => e.recap).length
    });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));
  console.log(`Saved ${db.length} anime to ${OUTPUT_FILE}`);
}

main(); 