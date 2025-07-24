import { getAnimeById } from './jikan';
import { POPULAR_ANIME_DATABASE, getFranchiseGuide, getAnimesByFranchise } from '../data/popularAnime';
import { EpisodeRecommendation } from './watchGuideService';

export interface FranchiseWatchGuide {
  franchiseName: string;
  description: string;
  watchOrder: string[];
  totalAnimeEntries: number;
  totalEpisodes: number;
  combinedStats: {
    totalEpisodes: number;
    canonEpisodes: number;
    fillerEpisodes: number;
    recapEpisodes: number;
    mixedEpisodes: number;
    timeSaved: number; // in minutes
    watchTime: number; // in minutes
  };
  animeGuides: {
    malId: number;
    title: string;
    watchOrder: number;
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
    specialInstructions?: string;
  }[];
  specialWatchingInstructions?: string;
  proOnly: boolean;
}

// Specific franchise watch order instructions
const FRANCHISE_WATCH_INSTRUCTIONS: Record<string, {
  description: string;
  watchOrder: string[];
  specialInstructions: string;
}> = {
  'Danganronpa': {
    description: 'Complete Danganronpa anime series with proper alternating watch order.',
    watchOrder: [
      'Danganronpa: The Animation (Episodes 1-13)',
      'Danganronpa 3: Despair Arc Episode 1',
      'Danganronpa 3: Future Arc Episode 1',
      'Continue alternating: Despair Arc Ep 2 → Future Arc Ep 2, etc.',
      'Danganronpa 2.5: Nagito Komaeda and the World Vanquisher (Optional OVA)',
      'Danganronpa 3: Hope Arc (Final episode)'
    ],
    specialInstructions: `
      IMPORTANT WATCH ORDER:
      1. Watch Danganronpa: The Animation completely first (13 episodes)
      2. For Danganronpa 3, alternate between Despair Arc and Future Arc:
         - Despair Arc Ep 1 → Future Arc Ep 1 → Despair Arc Ep 2 → Future Arc Ep 2
         - Continue this pattern through Episode 11 of both arcs
      3. Optionally watch Nagito 2.5 OVA after episode 11
      4. Watch Hope Arc as the finale
      
      This alternating order is crucial for understanding the interconnected storyline!
    `
  },
  'Fate': {
    description: 'Comprehensive Fate series watch guide with multiple viewing order options.',
    watchOrder: [
      'RECOMMENDED ORDER 1 (Chronological): Fate/Zero → Fate/stay night: UBW → Heaven\'s Feel',
      'RECOMMENDED ORDER 2 (Release): Fate/stay night: UBW → Fate/Zero → Heaven\'s Feel',
      'Standalone entries: Fate/Apocrypha, Fate/Extra Last Encore, FGO: Babylonia'
    ],
    specialInstructions: `
      FATE SERIES WATCH OPTIONS:
      
      FOR NEWCOMERS (Recommended):
      1. Fate/stay night: Unlimited Blade Works (2014-2015)
      2. Fate/Zero
      3. Fate/stay night: Heaven's Feel trilogy
      
      ALTERNATIVE (Chronological):
      1. Fate/Zero (prequel, but spoils some mysteries)
      2. Fate/stay night: Unlimited Blade Works
      3. Heaven's Feel trilogy
      
      STANDALONE ENTRIES (watch anytime):
      - Fate/Apocrypha
      - Fate/Extra Last Encore  
      - Fate/Grand Order: Babylonia
      
      AVOID: Original 2006 Fate/stay night anime (poor adaptation)
    `
  },
  'Naruto': {
    description: 'Complete Naruto franchise with optimal filler-skipping strategy.',
    watchOrder: [
      'Naruto (Skip most filler: episodes 26, 97-106, 136-220)',
      'Naruto: Shippuden (Skip major filler arcs - see detailed list)',
      'Boruto: Naruto Next Generations (Optional, mostly filler)'
    ],
    specialInstructions: `
      NARUTO FILLER STRATEGY:
      
      NARUTO (Original):
      - Skip: Episodes 26, 97-106, 136-220
      - Watch: All other episodes for main story
      
      NARUTO SHIPPUDEN:
      - Major filler arcs to skip: 57-71, 91-112, 144-151, 170-171, 176-196
      - Long filler blocks: 223-242, 257-260, 271, 279-281, 284-295
      - Final filler hell: 347-361, 376-377, 388-390, 394-413, 416, 422-423, 427-450
      
      TIME SAVED: Approximately 200+ hours by skipping filler!
    `
  },
  'Dragon Ball': {
    description: 'Dragon Ball series optimized for modern viewing.',
    watchOrder: [
      'Dragon Ball Z Kai (Recommended - no filler)',
      'OR Dragon Ball Z (Original with filler)',
      'Dragon Ball Super'
    ],
    specialInstructions: `
      DRAGON BALL VIEWING OPTIONS:
      
      RECOMMENDED:
      1. Dragon Ball Z Kai - Remastered, no filler, better pacing
      2. Dragon Ball Super - Direct sequel to Z
      
      ALTERNATIVE (For completionists):
      1. Dragon Ball Z (Original) - Includes filler but iconic
      2. Dragon Ball Super
      
      NOTE: Original Dragon Ball (Kid Goku) is optional but recommended for full story.
      TIME SAVED with Kai: ~100 hours vs original Z
    `
  },
  'Yu-Gi-Oh!': {
    description: 'Yu-Gi-Oh! franchise viewing guide across different generations.',
    watchOrder: [
      'Yu-Gi-Oh! Duel Monsters (Original)',
      'Yu-Gi-Oh! GX (Next generation)',
      'Yu-Gi-Oh! 5D\'s (Future setting)',
      'Yu-Gi-Oh! Zexal (New protagonist)'
    ],
    specialInstructions: `
      YU-GI-OH! SERIES GUIDE:
      
      Each series is largely standalone with different protagonists:
      1. Duel Monsters - Original Yugi story
      2. GX - Academy setting, new protagonist
      3. 5D's - Futuristic setting, card games on motorcycles
      4. Zexal - Younger audience focus
      
      Most filler episodes are tournament matches - skip if desired.
      Each series introduces new card mechanics and rules.
    `
  }
};

const generateEpisodeRecommendations = (animeTitle: string, episodeCount: number, fillerRanges: string[] = []): EpisodeRecommendation[] => {
  const recommendations: EpisodeRecommendation[] = [];
  
  // Parse filler ranges
  const fillerEpisodes = new Set<number>();
  fillerRanges.forEach(range => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(num => parseInt(num));
      for (let i = start; i <= end; i++) {
        fillerEpisodes.add(i);
      }
    } else if (!isNaN(parseInt(range))) {
      fillerEpisodes.add(parseInt(range));
    }
  });

  for (let i = 1; i <= episodeCount; i++) {
    const isFiller = fillerEpisodes.has(i);
    const isRecap = i % 25 === 0; // Assume every 25th episode might be recap
    
    let type: 'canon' | 'filler' | 'recap' | 'mixed' = 'canon';
    let recommendation: 'watch' | 'skip' | 'optional' | 'recommended' = 'watch';
    let reason = 'Canon episode - essential for story progression.';
    let timeSaved = 0;

    if (isRecap) {
      type = 'recap';
      recommendation = 'skip';
      reason = 'Recap episode - skip unless you need a refresher.';
      timeSaved = 24;
    } else if (isFiller) {
      type = 'filler';
      recommendation = 'skip';
      reason = 'Filler episode - safe to skip for main story.';
      timeSaved = 24;
    }

    // Special recommendations for known high-quality filler
    if (animeTitle.toLowerCase().includes('one piece') && i >= 196 && i <= 206) {
      recommendation = 'recommended';
      reason = 'G-8 Arc: Exceptional filler arc - highly recommended!';
      timeSaved = 0;
    }

    recommendations.push({
      episode: i,
      title: `Episode ${i}`,
      type,
      recommendation,
      reason,
      timeSaved
    });
  }

  return recommendations;
};

export const generateFranchiseWatchGuide = async (franchiseName: string): Promise<FranchiseWatchGuide | null> => {
  try {
    const franchiseData = getFranchiseGuide(franchiseName);
    const franchiseAnimes = getAnimesByFranchise(franchiseName);
    
    if (!franchiseData || franchiseAnimes.length === 0) {
      return null;
    }

    const animeGuides = [];
    let totalEpisodes = 0;
    let combinedStats = {
      totalEpisodes: 0,
      canonEpisodes: 0,
      fillerEpisodes: 0,
      recapEpisodes: 0,
      mixedEpisodes: 0,
      timeSaved: 0,
      watchTime: 0
    };

    // Sort by watch order if available
    const sortedAnimes = franchiseAnimes.sort((a, b) => (a.watchOrder || 0) - (b.watchOrder || 0));

    for (const anime of sortedAnimes) {
      try {
        // Try to get episode data from API, fallback to estimated episodes
        let episodeCount = 0;
        try {
          const animeDetails = await getAnimeById(anime.malId);
          episodeCount = animeDetails.data.episodes || anime.estimatedFillers || 12;
        } catch {
          // Fallback to reasonable episode counts based on anime
          const episodeCounts: { [key: string]: number } = {
            'Danganronpa: The Animation': 13,
            'Danganronpa 3: The End of Hope\'s Peak Academy - Future Arc': 12,
            'Danganronpa 3: The End of Hope\'s Peak Academy - Despair Arc': 11,
            'Fate/stay night': 24,
            'Fate/Zero': 25,
            'Fate/stay night: Unlimited Blade Works': 25,
            'Fate/stay night: Heaven\'s Feel': 3,
            'Naruto': 220,
            'Naruto: Shippuden': 500
          };
          episodeCount = episodeCounts[anime.name] || 12;
        }

        const recommendations = generateEpisodeRecommendations(
          anime.name, 
          episodeCount, 
          anime.fillerRanges || []
        );

        const stats = {
          totalEpisodes: episodeCount,
          canonEpisodes: recommendations.filter(ep => ep.type === 'canon').length,
          fillerEpisodes: recommendations.filter(ep => ep.type === 'filler').length,
          recapEpisodes: recommendations.filter(ep => ep.type === 'recap').length,
          mixedEpisodes: recommendations.filter(ep => ep.type === 'mixed').length,
          timeSaved: recommendations.reduce((total, ep) => total + (ep.timeSaved || 0), 0),
          watchTime: recommendations
            .filter(ep => ep.recommendation === 'watch' || ep.recommendation === 'recommended')
            .length * 24
        };

        // Add to combined stats
        combinedStats.totalEpisodes += stats.totalEpisodes;
        combinedStats.canonEpisodes += stats.canonEpisodes;
        combinedStats.fillerEpisodes += stats.fillerEpisodes;
        combinedStats.recapEpisodes += stats.recapEpisodes;
        combinedStats.mixedEpisodes += stats.mixedEpisodes;
        combinedStats.timeSaved += stats.timeSaved;
        combinedStats.watchTime += stats.watchTime;

        animeGuides.push({
          malId: anime.malId,
          title: anime.name,
          watchOrder: anime.watchOrder || 0,
          description: `${anime.name} - ${episodeCount} episodes`,
          totalEpisodes: episodeCount,
          stats,
          recommendations,
          specialInstructions: anime.specialNotes
        });

        totalEpisodes += episodeCount;

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to process ${anime.name}:`, error);
      }
    }

    const instructions = FRANCHISE_WATCH_INSTRUCTIONS[franchiseName];

    return {
      franchiseName,
      description: instructions?.description || franchiseData.description,
      watchOrder: instructions?.watchOrder || franchiseData.recommendedOrder,
      totalAnimeEntries: animeGuides.length,
      totalEpisodes,
      combinedStats,
      animeGuides,
      specialWatchingInstructions: instructions?.specialInstructions,
      proOnly: true
    };
  } catch (error) {
    console.error('Error generating franchise watch guide:', error);
    return null;
  }
};

export const searchFranchiseWatchGuide = async (query: string): Promise<FranchiseWatchGuide | null> => {
  // First check if the query matches any franchise name
  const franchiseNames = ['Naruto', 'Fate', 'Danganronpa', 'Dragon Ball', 'Yu-Gi-Oh!', 'Hunter x Hunter'];
  
  for (const franchiseName of franchiseNames) {
    if (franchiseName.toLowerCase().includes(query.toLowerCase()) || 
        query.toLowerCase().includes(franchiseName.toLowerCase())) {
      return await generateFranchiseWatchGuide(franchiseName);
    }
  }

  // Check if query matches any anime in our database that belongs to a franchise
  const matchingAnime = POPULAR_ANIME_DATABASE.find(anime => 
    anime.name.toLowerCase().includes(query.toLowerCase()) && anime.franchise
  );

  if (matchingAnime && matchingAnime.franchise) {
    return await generateFranchiseWatchGuide(matchingAnime.franchise);
  }

  return null;
};

export const getAllFranchiseGuides = async (): Promise<FranchiseWatchGuide[]> => {
  const franchiseNames = ['Naruto', 'Fate', 'Danganronpa', 'Dragon Ball', 'Yu-Gi-Oh!'];
  const guides: FranchiseWatchGuide[] = [];

  for (const franchiseName of franchiseNames) {
    try {
      const guide = await generateFranchiseWatchGuide(franchiseName);
      if (guide) {
        guides.push(guide);
      }
      // Add delay between franchise generations
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to generate franchise guide for ${franchiseName}:`, error);
    }
  }

  return guides;
};
