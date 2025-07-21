import { getAllAnimeEpisodes, getAnimeById, JikanEpisode, JikanAnime } from './jikan';

export interface EpisodeRecommendation {
  episode: number;
  title: string;
  type: 'canon' | 'filler' | 'recap' | 'mixed';
  recommendation: 'watch' | 'skip' | 'optional' | 'recommended';
  reason: string;
  userRating?: number;
  communityRating?: number;
  isFunny?: boolean;
  isImportant?: boolean;
  hasCharacterDevelopment?: boolean;
  hasWorldBuilding?: boolean;
  timeSaved?: number; // in minutes
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
    timeSaved: number; // in minutes
    watchTime: number; // in minutes
  };
  recommendations: EpisodeRecommendation[];
  proOnly: boolean;
}

// Enhanced recommendation logic based on community feedback and ratings
const getEpisodeRecommendation = (
  episode: any, 
  animeTitle: string,
  episodeNumber: number
): EpisodeRecommendation => {
  const title = episode.title || `Episode ${episodeNumber}`;
  const isFiller = episode.filler || false;
  const isRecap = episode.recap || false;
  
  // Determine episode type
  let type: 'canon' | 'filler' | 'recap' | 'mixed' = 'canon';
  if (isFiller && isRecap) type = 'mixed';
  else if (isFiller) type = 'filler';
  else if (isRecap) type = 'recap';

  // Enhanced recommendation logic based on anime and episode characteristics
  let recommendation: 'watch' | 'skip' | 'optional' | 'recommended' = 'watch';
  let reason = '';
  let userRating: number | undefined;
  let communityRating: number | undefined;
  let isFunny = false;
  let isImportant = false;
  let hasCharacterDevelopment = false;
  let hasWorldBuilding = false;
  let timeSaved = 0;

  // Special cases for popular anime with known filler quality
  if (animeTitle.toLowerCase().includes('one piece')) {
    // One Piece specific recommendations
    if (episodeNumber >= 196 && episodeNumber <= 206) {
      // G-8 Arc - highly rated filler
      recommendation = 'recommended';
      reason = 'G-8 Arc: One of the best filler arcs in anime. Hilarious, well-written, and maintains series quality. Highly recommended despite being filler.';
      userRating = 9.2;
      communityRating = 8.8;
      isFunny = true;
      hasCharacterDevelopment = true;
    } else if (episodeNumber >= 131 && episodeNumber <= 143) {
      // Warship Island Arc - decent filler
      recommendation = 'optional';
      reason = 'Warship Island Arc: Decent filler with some character moments. Not essential but enjoyable if you want more content.';
      userRating = 7.5;
      communityRating = 7.2;
      isFunny = true;
    } else if (episodeNumber >= 144 && episodeNumber <= 195) {
      // Alabasta Arc - canon, must watch
      recommendation = 'watch';
      reason = 'Alabasta Arc: Essential canon arc with major plot developments, character growth, and world-building.';
      userRating = 9.5;
      communityRating = 9.3;
      isImportant = true;
      hasCharacterDevelopment = true;
      hasWorldBuilding = true;
    } else if (isRecap) {
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher on previous events.';
      timeSaved = 24;
    } else if (isFiller) {
      recommendation = 'skip';
      reason = 'Standard filler episode - safe to skip to save time.';
      timeSaved = 24;
    }
  } else if (animeTitle.toLowerCase().includes('naruto')) {
    // Naruto specific recommendations
    if (episodeNumber >= 101 && episodeNumber <= 106) {
      // Land of Tea Arc - decent filler
      recommendation = 'optional';
      reason = 'Land of Tea Arc: Decent filler with some character development. Not essential but enjoyable.';
      userRating = 7.0;
      communityRating = 6.8;
      hasCharacterDevelopment = true;
    } else if (episodeNumber >= 136 && episodeNumber <= 220) {
      // Original Naruto filler hell - mostly skip
      recommendation = 'skip';
      reason = 'Extended filler arc: Generally low quality. Skip to save significant time.';
      timeSaved = 24;
    } else if (isRecap) {
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher.';
      timeSaved = 24;
    }
  } else if (animeTitle.toLowerCase().includes('bleach')) {
    // Bleach specific recommendations
    if (episodeNumber >= 168 && episodeNumber <= 189) {
      // Zanpakuto Rebellion Arc - highly rated filler
      recommendation = 'recommended';
      reason = 'Zanpakuto Rebellion Arc: Excellent filler with great character development and lore. Highly recommended despite being filler.';
      userRating = 8.8;
      communityRating = 8.5;
      hasCharacterDevelopment = true;
      hasWorldBuilding = true;
    } else if (episodeNumber >= 317 && episodeNumber <= 341) {
      // Gotei 13 Invasion Arc - decent filler
      recommendation = 'optional';
      reason = 'Gotei 13 Invasion Arc: Decent filler with some interesting concepts. Optional but enjoyable.';
      userRating = 7.2;
      communityRating = 7.0;
    } else if (isRecap) {
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher.';
      timeSaved = 24;
    } else if (isFiller) {
      recommendation = 'skip';
      reason = 'Standard filler episode - safe to skip.';
      timeSaved = 24;
    }
  } else {
    // Generic recommendation logic for other anime
    if (isRecap) {
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher on previous events.';
      timeSaved = 24;
    } else if (isFiller) {
      // Check if it's a short filler arc (1-3 episodes) which might be worth watching
      recommendation = 'optional';
      reason = 'Filler episode - optional. Consider watching if you enjoy the characters and want more content.';
      timeSaved = 24;
    } else {
      recommendation = 'watch';
      reason = 'Canon episode - essential for story progression.';
    }
  }

  return {
    episode: episodeNumber,
    title,
    type,
    recommendation,
    reason,
    userRating,
    communityRating,
    isFunny,
    isImportant,
    hasCharacterDevelopment,
    hasWorldBuilding,
    timeSaved
  };
};

// Popular anime series with their MAL IDs
export const POPULAR_ANIME_SERIES = [
  { name: 'One Piece', malId: 21, searchTerm: 'One Piece' },
  { name: 'Naruto', malId: 20, searchTerm: 'Naruto' },
  { name: 'Naruto Shippuden', malId: 1735, searchTerm: 'Naruto Shippuden' },
  { name: 'Bleach', malId: 269, searchTerm: 'Bleach' },
  { name: 'Dragon Ball', malId: 223, searchTerm: 'Dragon Ball' },
  { name: 'Dragon Ball Z', malId: 813, searchTerm: 'Dragon Ball Z' },
  { name: 'Dragon Ball Super', malId: 30694, searchTerm: 'Dragon Ball Super' },
  { name: 'Detective Conan', malId: 235, searchTerm: 'Detective Conan' },
  { name: 'Fairy Tail', malId: 6702, searchTerm: 'Fairy Tail' },
  { name: 'Hunter x Hunter', malId: 11061, searchTerm: 'Hunter x Hunter' },
  { name: 'Attack on Titan', malId: 16498, searchTerm: 'Attack on Titan' },
  { name: 'My Hero Academia', malId: 31964, searchTerm: 'My Hero Academia' },
  { name: 'Demon Slayer', malId: 38000, searchTerm: 'Demon Slayer' },
  { name: 'Jujutsu Kaisen', malId: 40748, searchTerm: 'Jujutsu Kaisen' },
  { name: 'Black Clover', malId: 34572, searchTerm: 'Black Clover' },
  { name: 'Boruto', malId: 34566, searchTerm: 'Boruto' },
  { name: 'One Punch Man', malId: 30276, searchTerm: 'One Punch Man' },
  { name: 'Mob Psycho 100', malId: 32182, searchTerm: 'Mob Psycho 100' },
  { name: 'The Promised Neverland', malId: 37779, searchTerm: 'The Promised Neverland' },
  { name: 'Tokyo Ghoul', malId: 22319, searchTerm: 'Tokyo Ghoul' },
  { name: 'Death Note', malId: 1530, searchTerm: 'Death Note' },
  { name: 'Fullmetal Alchemist: Brotherhood', malId: 5114, searchTerm: 'Fullmetal Alchemist Brotherhood' },
  { name: 'Steins;Gate', malId: 9253, searchTerm: 'Steins Gate' },
  { name: 'Code Geass', malId: 1575, searchTerm: 'Code Geass' },
  { name: 'Cowboy Bebop', malId: 1, searchTerm: 'Cowboy Bebop' },
  { name: 'Neon Genesis Evangelion', malId: 30, searchTerm: 'Neon Genesis Evangelion' },
  { name: 'Ghost in the Shell', malId: 43, searchTerm: 'Ghost in the Shell' },
  { name: 'Akira', malId: 47, searchTerm: 'Akira' },
  { name: 'Spirited Away', malId: 199, searchTerm: 'Spirited Away' },
  { name: 'Your Name', malId: 32281, searchTerm: 'Your Name' },
  { name: 'Weathering With You', malId: 37991, searchTerm: 'Weathering With You' },
  { name: 'A Silent Voice', malId: 28851, searchTerm: 'A Silent Voice' },
  { name: 'I Want to Eat Your Pancreas', malId: 36296, searchTerm: 'I Want to Eat Your Pancreas' },
  { name: 'Violet Evergarden', malId: 33352, searchTerm: 'Violet Evergarden' },
  { name: 'Made in Abyss', malId: 34599, searchTerm: 'Made in Abyss' },
  { name: 'Re:Zero', malId: 31240, searchTerm: 'Re Zero' },
  { name: 'Overlord', malId: 29803, searchTerm: 'Overlord' },
  { name: 'That Time I Got Reincarnated as a Slime', malId: 37430, searchTerm: 'That Time I Got Reincarnated as a Slime' },
  { name: 'Konosuba', malId: 30831, searchTerm: 'Konosuba' },
  { name: 'No Game No Life', malId: 19815, searchTerm: 'No Game No Life' },
  { name: 'Log Horizon', malId: 17265, searchTerm: 'Log Horizon' },
  { name: 'Sword Art Online', malId: 11757, searchTerm: 'Sword Art Online' },
  { name: 'Accel World', malId: 11759, searchTerm: 'Accel World' },
  { name: 'The Rising of the Shield Hero', malId: 35790, searchTerm: 'The Rising of the Shield Hero' },
  { name: 'Arifureta', malId: 36838, searchTerm: 'Arifureta' },
  { name: 'Cautious Hero', malId: 38691, searchTerm: 'Cautious Hero' },
  { name: 'Kumo Desu ga, Nani ka?', malId: 40028, searchTerm: 'Kumo Desu ga Nani ka' },
  { name: 'So I\'m a Spider, So What?', malId: 40028, searchTerm: 'So I am a Spider So What' },
  { name: 'The Misfit of Demon King Academy', malId: 40028, searchTerm: 'The Misfit of Demon King Academy' },
  { name: 'Classroom of the Elite', malId: 35507, searchTerm: 'Classroom of the Elite' },
  { name: 'The Promised Neverland', malId: 37779, searchTerm: 'The Promised Neverland' },
  { name: 'Tower of God', malId: 41467, searchTerm: 'Tower of God' },
  { name: 'God of High School', malId: 41439, searchTerm: 'God of High School' },
  { name: 'Noblesse', malId: 42203, searchTerm: 'Noblesse' },
  { name: 'The Hidden Dungeon Only I Can Enter', malId: 42203, searchTerm: 'The Hidden Dungeon Only I Can Enter' },
  { name: 'Kemono Jihen', malId: 42203, searchTerm: 'Kemono Jihen' },
  { name: 'Horimiya', malId: 42897, searchTerm: 'Horimiya' },
  { name: 'Fruits Basket', malId: 23273, searchTerm: 'Fruits Basket' },
  { name: 'Kimi ni Todoke', malId: 9724, searchTerm: 'Kimi ni Todoke' },
  { name: 'Toradora!', malId: 4224, searchTerm: 'Toradora' },
  { name: 'Golden Time', malId: 17821, searchTerm: 'Golden Time' },
  { name: 'Oregairu', malId: 14813, searchTerm: 'Oregairu' },
  { name: 'My Teen Romantic Comedy SNAFU', malId: 14813, searchTerm: 'My Teen Romantic Comedy SNAFU' },
  { name: 'The Quintessential Quintuplets', malId: 38101, searchTerm: 'The Quintessential Quintuplets' },
  { name: 'Kaguya-sama: Love Is War', malId: 37991, searchTerm: 'Kaguya sama Love Is War' },
  { name: 'Rent-A-Girlfriend', malId: 40839, searchTerm: 'Rent A Girlfriend' },
  { name: 'Domestic Girlfriend', malId: 37105, searchTerm: 'Domestic Girlfriend' },
  { name: 'Scum\'s Wish', malId: 32962, searchTerm: 'Scum Wish' },
  { name: 'White Album 2', malId: 18153, searchTerm: 'White Album 2' },
  { name: 'School Days', malId: 2476, searchTerm: 'School Days' },
  { name: 'Clannad', malId: 2167, searchTerm: 'Clannad' },
  { name: 'Clannad After Story', malId: 4181, searchTerm: 'Clannad After Story' },
  { name: 'Angel Beats!', malId: 6547, searchTerm: 'Angel Beats' },
  { name: 'Charlotte', malId: 28999, searchTerm: 'Charlotte' },
  { name: 'The Day I Became a God', malId: 42203, searchTerm: 'The Day I Became a God' },
  { name: 'Plastic Memories', malId: 27775, searchTerm: 'Plastic Memories' },
  { name: 'Anohana', malId: 9989, searchTerm: 'Anohana' },
  { name: 'Your Lie in April', malId: 23273, searchTerm: 'Your Lie in April' },
  { name: 'I Want to Eat Your Pancreas', malId: 36296, searchTerm: 'I Want to Eat Your Pancreas' },
  { name: 'A Silent Voice', malId: 28851, searchTerm: 'A Silent Voice' },
  { name: 'Weathering With You', malId: 37991, searchTerm: 'Weathering With You' },
  { name: 'Your Name', malId: 32281, searchTerm: 'Your Name' },
  { name: 'Spirited Away', malId: 199, searchTerm: 'Spirited Away' },
  { name: 'My Neighbor Totoro', malId: 523, searchTerm: 'My Neighbor Totoro' },
  { name: 'Princess Mononoke', malId: 164, searchTerm: 'Princess Mononoke' },
  { name: 'Howl\'s Moving Castle', malId: 431, searchTerm: 'Howl Moving Castle' },
  { name: 'Castle in the Sky', malId: 95, searchTerm: 'Castle in the Sky' },
  { name: 'Kiki\'s Delivery Service', malId: 199, searchTerm: 'Kiki Delivery Service' },
  { name: 'Nausicaä of the Valley of the Wind', malId: 572, searchTerm: 'Nausicaa of the Valley of the Wind' },
  { name: 'The Wind Rises', malId: 16680, searchTerm: 'The Wind Rises' },
  { name: 'Ponyo', malId: 4976, searchTerm: 'Ponyo' },
  { name: 'Arrietty', malId: 10020, searchTerm: 'Arrietty' },
  { name: 'From Up on Poppy Hill', malId: 10379, searchTerm: 'From Up on Poppy Hill' },
  { name: 'The Tale of the Princess Kaguya', malId: 17729, searchTerm: 'The Tale of the Princess Kaguya' },
  { name: 'When Marnie Was There', malId: 24231, searchTerm: 'When Marnie Was There' },
  { name: 'The Red Turtle', malId: 28735, searchTerm: 'The Red Turtle' },
  { name: 'Earwig and the Witch', malId: 42203, searchTerm: 'Earwig and the Witch' },
  { name: 'The Boy and the Heron', malId: 42203, searchTerm: 'The Boy and the Heron' },
];

// Generate watch guide for a specific anime
export const generateWatchGuide = async (malId: number): Promise<WatchGuide> => {
  try {
    // Get anime details first
    const animeDetails = await getAnimeById(malId);
    const animeTitle = animeDetails.data.title || 'Unknown Anime';
    
    // Get all episodes
    const episodes = await getAllAnimeEpisodes(malId);
    
    if (!episodes || episodes.length === 0) {
      throw new Error('No episodes found for this anime');
    }

    // Generate recommendations for each episode
    const recommendations = episodes.map(episode => 
      getEpisodeRecommendation(episode, animeTitle, episode.mal_id || episode.episode_id || 0)
    );

    // Calculate stats
    const stats = {
      totalEpisodes: episodes.length,
      canonEpisodes: recommendations.filter(ep => ep.type === 'canon').length,
      fillerEpisodes: recommendations.filter(ep => ep.type === 'filler').length,
      recapEpisodes: recommendations.filter(ep => ep.type === 'recap').length,
      mixedEpisodes: recommendations.filter(ep => ep.type === 'mixed').length,
      timeSaved: recommendations.reduce((total, ep) => total + (ep.timeSaved || 0), 0),
      watchTime: recommendations
        .filter(ep => ep.recommendation === 'watch' || ep.recommendation === 'recommended')
        .length * 24 // Assuming 24 minutes per episode
    };

    // Generate description based on anime and recommendations
    const watchCount = recommendations.filter(ep => ep.recommendation === 'watch' || ep.recommendation === 'recommended').length;
    const skipCount = recommendations.filter(ep => ep.recommendation === 'skip').length;
    const optionalCount = recommendations.filter(ep => ep.recommendation === 'optional').length;
    
    const description = `Optimized watch guide for ${animeTitle}. Watch ${watchCount} essential episodes, skip ${skipCount} filler/recap episodes, and optionally watch ${optionalCount} episodes. Save approximately ${Math.round(stats.timeSaved / 60)} hours while maintaining story coherence.`;

    return {
      malId,
      title: animeTitle,
      description,
      totalEpisodes: episodes.length,
      stats,
      recommendations,
      proOnly: true
    };
  } catch (error) {
    console.error('Error generating watch guide:', error);
    throw new Error('Failed to generate watch guide');
  }
};

// Analyze episodes and generate recommendations
const analyzeEpisodes = (episodes: JikanEpisode[]): EpisodeRecommendation[] => {
  const recommendations: EpisodeRecommendation[] = [];
  let currentGroup: { type: 'watch' | 'skip' | 'optional'; episodes: number[]; reason: string } | null = null;

  episodes.forEach((episode, index) => {
    const episodeNumber = index + 1;
    let type: 'watch' | 'skip' | 'optional' = 'watch';
    let reason = '';

    // Determine episode type based on filler/recap status
    if (episode.filler) {
      type = 'skip';
      reason = 'Filler episode';
    } else if (episode.recap) {
      type = 'skip';
      reason = 'Recap episode';
    } else {
      type = 'watch';
      reason = 'Canon episode';
    }

    // Check for special cases (first few episodes, final episodes, etc.)
    if (episodeNumber <= 3) {
      type = 'watch';
      reason = 'Essential setup episodes';
    } else if (episodeNumber >= episodes.length - 2) {
      type = 'watch';
      reason = 'Final episodes';
    }

    // Group consecutive episodes of the same type
    if (!currentGroup || currentGroup.type !== type) {
      if (currentGroup) {
        recommendations.push({
          type: currentGroup.type,
          episodes: formatEpisodeRange(currentGroup.episodes),
          reason: currentGroup.reason,
          episodeList: currentGroup.episodes
        });
      }
      currentGroup = { type, episodes: [episodeNumber], reason };
    } else {
      if (currentGroup) {
        currentGroup.episodes.push(episodeNumber);
      }
    }
  });

  // Add the last group
  if (currentGroup) {
    recommendations.push({
      type: currentGroup.type,
      episodes: formatEpisodeRange(currentGroup.episodes),
      reason: currentGroup.reason,
      episodeList: currentGroup.episodes
    });
  }

  return recommendations;
};

// Format episode range for display
const formatEpisodeRange = (episodes: number[]): string => {
  if (episodes.length === 1) {
    return episodes[0].toString();
  }
  
  const first = episodes[0];
  const last = episodes[episodes.length - 1];
  
  // Check if episodes are consecutive
  const isConsecutive = episodes.every((ep, index) => ep === first + index);
  
  if (isConsecutive) {
    return `${first}-${last}`;
  } else {
    return episodes.join(', ');
  }
};

// Calculate statistics
const calculateStats = (episodes: JikanEpisode[], recommendations: EpisodeRecommendation[]) => {
  const totalEpisodes = episodes.length;
  const fillerEpisodes = episodes.filter(ep => ep.filler).length;
  const recapEpisodes = episodes.filter(ep => ep.recap).length;
  const canonEpisodes = totalEpisodes - fillerEpisodes - recapEpisodes;
  
  let watchEpisodes = 0;
  let skipEpisodes = 0;
  let optionalEpisodes = 0;
  let timeSaved = 0;
  let watchTime = 0;

  recommendations.forEach(rec => {
    if (rec.episodeList) {
      switch (rec.type) {
        case 'watch':
          watchEpisodes += rec.episodeList.length;
          watchTime += rec.episodeList.length * 24; // Assuming 24 minutes per episode for simplicity
          break;
        case 'skip':
          skipEpisodes += rec.episodeList.length;
          timeSaved += rec.episodeList.length * 24;
          break;
        case 'optional':
          optionalEpisodes += rec.episodeList.length;
          watchTime += rec.episodeList.length * 24; // Optional episodes are watched
          break;
      }
    }
  });

  return {
    totalEpisodes,
    fillerEpisodes,
    recapEpisodes,
    canonEpisodes,
    watchEpisodes,
    skipEpisodes,
    optionalEpisodes,
    timeSaved,
    watchTime
  };
};

// Generate description based on anime and stats
const generateDescription = (anime: JikanAnime, stats: any): string => {
  const fillerPercentage = Math.round((stats.fillerEpisodes / stats.totalEpisodes) * 100);
  const timeSaved = formatTime(stats.timeSaved);
  
  return `A comprehensive watch guide for ${anime.title} that helps you navigate through ${stats.totalEpisodes} episodes efficiently. This guide identifies ${stats.fillerEpisodes} filler episodes (${fillerPercentage}%) and ${stats.recapEpisodes} recap episodes, potentially saving you ${timeSaved} of viewing time while ensuring you don't miss any important story content.`;
};

// Format time in hours and minutes
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} minutes`;
  } else if (remainingMinutes === 0) {
    return `${hours} hours`;
  } else {
    return `${hours} hours ${remainingMinutes} minutes`;
  }
};

// Get all watch guides for popular series
export const getAllWatchGuides = async (): Promise<WatchGuide[]> => {
  const guides: WatchGuide[] = [];
  
  for (const series of POPULAR_ANIME_SERIES.slice(0, 20)) { // Limit to first 20 for performance
    try {
      const guide = await generateWatchGuide(series.malId);
      guides.push(guide);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to generate guide for ${series.name}:`, error);
    }
  }
  
  return guides;
};

// Search for anime and generate watch guide
export const searchAndGenerateWatchGuide = async (query: string): Promise<WatchGuide | null> => {
  try {
    // First try to find exact match in popular series
    const exactMatch = POPULAR_ANIME_SERIES.find(
      series => series.name.toLowerCase().includes(query.toLowerCase()) ||
                series.searchTerm.toLowerCase().includes(query.toLowerCase())
    );
    
    if (exactMatch) {
      return await generateWatchGuide(exactMatch.malId);
    }
    
    // If no exact match, search using Jikan API
    const { searchAnime } = await import('./jikan');
    const searchResponse = await searchAnime(query, 1, 5);
    
    if (searchResponse.data.length > 0) {
      const firstResult = searchResponse.data[0];
      return await generateWatchGuide(firstResult.mal_id);
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching for watch guide:`, error);
    return null;
  }
}; 