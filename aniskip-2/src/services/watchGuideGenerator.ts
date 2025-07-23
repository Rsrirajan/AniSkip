import { getAllAnimeEpisodes, getAnimeById } from './jikan';

export interface EpisodeRecommendation {
  episode: number;
  title: string;
  type: 'canon' | 'filler' | 'recap' | 'mixed';
  recommendation: 'watch' | 'skip' | 'optional' | 'recommended';
  reason: string;
}

export interface WatchGuide {
  malId: number;
  title: string;
  description: string;
  totalEpisodes: number;
  stats: {
    totalEpisodes: number;
    canonEpisodes: number;
    fillerEpisodes: number;
    recapEpisodes: number;
    mixedEpisodes: number;
    timeSaved: number;
    watchTime: number;
  };
  recommendations: EpisodeRecommendation[];
  proOnly: boolean;
}

const getEpisodeRecommendation = (
  episode: any,
  animeTitle: string,
  episodeNumber: number
): EpisodeRecommendation => {
  const title = episode.title || `Episode ${episodeNumber}`;
  const isFiller = episode.filler || false;
  const isRecap = episode.recap || false;

  let type: 'canon' | 'filler' | 'recap' | 'mixed' = 'canon';
  if (isFiller && isRecap) type = 'mixed';
  else if (isFiller) type = 'filler';
  else if (isRecap) type = 'recap';

  let recommendation: 'watch' | 'skip' | 'optional' | 'recommended' = 'watch';
  let reason = '';
  let timeSaved = 0;

  if (isRecap) {
    recommendation = 'skip';
    reason = 'Recap episode - skip unless you need a refresher.';
    timeSaved = 24;
  } else if (isFiller) {
    recommendation = 'skip';
    reason = 'Standard filler episode - safe to skip.';
    timeSaved = 24;
  }

  return {
    episode: episodeNumber,
    title,
    type,
    recommendation,
    reason,
  };
};

export const generateWatchGuide = async (malId: number): Promise<WatchGuide> => {
  try {
    const animeDetails = await getAnimeById(malId);
    const animeTitle = animeDetails.data.title || 'Unknown Anime';

    const episodes = await getAllAnimeEpisodes(malId);

    if (!episodes || episodes.length === 0) {
      throw new Error('No episodes found for this anime');
    }

    const recommendations = episodes.map((episode) =>
      getEpisodeRecommendation(episode, animeTitle, episode.mal_id || 0)
    );

    const stats = {
      totalEpisodes: episodes.length,
      canonEpisodes: recommendations.filter((ep) => ep.type === 'canon').length,
      fillerEpisodes: recommendations.filter((ep) => ep.type === 'filler').length,
      recapEpisodes: recommendations.filter((ep) => ep.type === 'recap').length,
      mixedEpisodes: recommendations.filter((ep) => ep.type === 'mixed').length,
      timeSaved: recommendations.reduce((total, ep) => total + (ep.type === 'skip' ? 24 : 0), 0),
      watchTime: recommendations
        .filter((ep) => ep.recommendation === 'watch' || ep.recommendation === 'recommended')
        .length * 24,
    };

    const watchCount = recommendations.filter(
      (ep) => ep.recommendation === 'watch' || ep.recommendation === 'recommended'
    ).length;
    const skipCount = recommendations.filter((ep) => ep.recommendation === 'skip').length;
    const optionalCount = recommendations.filter((ep) => ep.recommendation === 'optional').length;

    const description = `Optimized watch guide for ${animeTitle}. Watch ${watchCount} essential episodes, skip ${skipCount} filler/recap episodes, and optionally watch ${optionalCount} episodes. Save approximately ${Math.round(stats.timeSaved / 60)} hours while maintaining story coherence.`;

    return {
      malId,
      title: animeTitle,
      description,
      totalEpisodes: episodes.length,
      stats,
      recommendations,
      proOnly: true,
    };
  } catch (error) {
    console.error('Error generating watch guide:', error);
    throw new Error('Failed to generate watch guide');
  }
};

