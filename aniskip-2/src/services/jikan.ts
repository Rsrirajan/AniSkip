// Jikan API service for MyAnimeList data
const JIKAN_API_BASE = "https://api.jikan.moe/v4";

export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string;
  title_romanji: string;
  duration: number;
  aired: string;
  filler: boolean;
  recap: boolean;
  synopsis: string;
}

export interface JikanEpisodesResponse {
  data: JikanEpisode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number;
        month: number;
        year: number;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Search anime by title
export const searchAnime = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<JikanSearchResponse> => {
  const response = await fetch(
    `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get anime by ID
export const getAnimeById = async (id: number): Promise<{ data: JikanAnime }> => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get all episodes for an anime
export const getAnimeEpisodes = async (
  id: number,
  page: number = 1
): Promise<JikanEpisodesResponse> => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${id}/episodes?page=${page}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get a specific episode
export const getAnimeEpisode = async (
  id: number,
  episode: number
): Promise<{ data: JikanEpisode }> => {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${id}/episodes/${episode}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get all episodes for an anime (paginated)
export const getAllAnimeEpisodes = async (id: number): Promise<JikanEpisode[]> => {
  let allEpisodes: JikanEpisode[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const response = await getAnimeEpisodes(id, page);
      allEpisodes = [...allEpisodes, ...response.data];
      hasNextPage = response.pagination.has_next_page;
      page++;
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error fetching episodes for page ${page}:`, error);
      break;
    }
  }

  return allEpisodes;
};

// Get top anime
export const getTopAnime = async (
  page: number = 1,
  limit: number = 20
): Promise<JikanSearchResponse> => {
  const response = await fetch(`${JIKAN_API_BASE}/top/anime?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get seasonal anime
export const getSeasonalAnime = async (
  year: number = new Date().getFullYear(),
  season: 'winter' | 'spring' | 'summer' | 'fall' = 'winter'
): Promise<JikanSearchResponse> => {
  const response = await fetch(`${JIKAN_API_BASE}/seasons/${season}/${year}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 