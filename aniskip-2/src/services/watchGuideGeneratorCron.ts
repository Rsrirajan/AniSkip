import { generateWatchGuide } from './watchGuideGenerator';
import { getTopAnimeWithFillers, PopularAnime } from '../data/popularAnime';

export const generatePopularAnimeWatchGuides = async (): Promise<void> => {
  const popularAnimes: PopularAnime[] = getTopAnimeWithFillers();

  for (const anime of popularAnimes) {
    try {
      const watchGuide = await generateWatchGuide(anime.malId);
      console.log(`Generated watch guide for ${anime.name}:`, watchGuide);
      // Save or utilize the watchGuide as needed
    } catch (error) {
      console.error(`Failed to generate watch guide for ${anime.name}:`, error);
    }
  }
};

