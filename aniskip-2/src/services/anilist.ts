// Anilist API service
const ANILIST_API = import.meta.env.DEV
  ? "/api/anilist"
  : "https://graphql.anilist.co";

// Rate limiting helper
let lastApiCall = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between calls

// Simple cache to prevent duplicate calls
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to clear cache
export const clearApiCache = () => {
  apiCache.clear();
  console.log('API cache cleared');
};

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastApiCall = Date.now();
};

// Helper function to make API calls with retry logic
const makeApiCall = async (query: string, variables: any, retries = 2): Promise<any> => {
  // Create cache key
  const cacheKey = JSON.stringify({ query, variables });
  const cached = apiCache.get(cacheKey);
  
  // Check if we have valid cached data
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached data for:', cacheKey.substring(0, 50) + '...');
    return cached.data;
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Wait for rate limit
      await waitForRateLimit();
      
      const response = await fetch(ANILIST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (response.status === 429) {
        console.warn('Rate limited, waiting longer...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds for rate limit
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the successful response
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.warn(`API call attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        // If all retries failed, return mock data for better UX
        console.log('Returning mock data due to API failure');
        return getMockData();
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 2000));
    }
  }
};

// Mock data fallback for when API is unavailable
const getMockData = (): any => {
  const mockAnime = {
    id: 1,
    title: {
      romaji: "Demo Anime",
      english: "Demo Anime",
      native: "デモアニメ"
    },
    coverImage: {
      large: "https://via.placeholder.com/300x400/6366f1/ffffff?text=Demo+Anime",
      medium: "https://via.placeholder.com/200x300/6366f1/ffffff?text=Demo+Anime"
    },
    bannerImage: "https://via.placeholder.com/1200x300/6366f1/ffffff?text=Demo+Anime+Banner",
    description: "This is a demo anime that appears when the API is unavailable. Please check your internet connection and try again.",
    averageScore: 75,
    episodes: 12,
    status: "FINISHED",
    genres: ["Action", "Adventure"],
    season: "WINTER",
    seasonYear: 2024,
    format: "TV",
    duration: 24,
    studios: { nodes: [{ name: "Demo Studio" }] }
  };

  const mockPage = {
    pageInfo: {
      total: 1000,
      currentPage: 1,
      hasNextPage: false
    },
    media: Array(8).fill(null).map((_, i) => ({
      ...mockAnime,
      id: i + 1,
      title: {
        romaji: `Demo Anime ${i + 1}`,
        english: `Demo Anime ${i + 1}`,
        native: `デモアニメ${i + 1}`
      }
    }))
  };

  return {
    data: {
      Page: mockPage
    }
  };
};

export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage: string;
  description: string;
  averageScore: number;
  episodes: number;
  status: string;
  genres: string[];
  season: string;
  seasonYear: number;
  format: string;
  duration: number;
  studios: {
    nodes: Array<{
      name: string;
    }>;
  };
}

export interface SearchResponse {
  data: {
    Page: {
      media: Anime[];
      pageInfo: {
        total: number;
        currentPage: number;
        hasNextPage: boolean;
      };
    };
  };
}

const searchQuery = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(search: $search, type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const trendingQuery = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: [TRENDING_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const seasonalQuery = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const popularQuery = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const topRatedQuery = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: [SCORE_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const searchAnime = async (
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<SearchResponse> => {
  const response = await makeApiCall(searchQuery, { search: query, page, perPage });
  return response;
};

export const getTrendingAnime = async (
  page: number = 1,
  perPage: number = 20
): Promise<SearchResponse> => {
  const response = await makeApiCall(trendingQuery, { page, perPage });
  return response;
};

export const getSeasonalAnime = async (
  page: number = 1,
  perPage: number = 20,
  season: string = "WINTER",
  seasonYear: number = new Date().getFullYear()
): Promise<SearchResponse> => {
  const response = await makeApiCall(seasonalQuery, { page, perPage, season, seasonYear });
  return response;
};

export const getPopularAnime = async (
  page: number = 1,
  perPage: number = 20
): Promise<SearchResponse> => {
  const response = await makeApiCall(popularQuery, { page, perPage });
  return response;
};

export const getTopRatedAnime = async (
  page: number = 1,
  perPage: number = 20
): Promise<SearchResponse> => {
  const response = await makeApiCall(topRatedQuery, { page, perPage });
  return response;
};

// Helper function to get current season
export const getCurrentSeason = (): { season: string; year: number } => {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const year = now.getFullYear();
  
  let season: string;
  if (month >= 1 && month <= 3) season = "WINTER";
  else if (month >= 4 && month <= 6) season = "SPRING";
  else if (month >= 7 && month <= 9) season = "SUMMER";
  else season = "FALL";
  
  return { season, year };
};

// Function to get total anime count (approximate)
export const getAnimeCount = async (): Promise<number> => {
  try {
    // Get a large page to estimate total count
    const response = await makeApiCall(`
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            hasNextPage
          }
          media(type: ANIME, sort: [POPULARITY_DESC]) {
            id
          }
        }
      }
    `, { page: 1, perPage: 1 });

    return response.data.Page.pageInfo.total || 0;
  } catch (error) {
    console.error('Error getting anime count:', error);
    return 1000; // Return a reasonable fallback number
  }
};

export const getAnimeDetails = async (
  id: number
): Promise<{ Media: Anime }> => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
        format
        duration
        studios {
          nodes {
            name
          }
        }
      }
    }
  `;

  const response = await makeApiCall(query, { id });
  return response.data;
}; 