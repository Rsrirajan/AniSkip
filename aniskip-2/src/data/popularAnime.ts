export interface PopularAnime {
  name: string;
  malId: number;
  estimatedFillers: number;
  fillerRanges?: string[];
  specialNotes?: string;
  franchise?: string;
  watchOrder?: number;
}

export interface FranchiseGuide {
  name: string;
  entries: PopularAnime[];
  description: string;
  recommendedOrder: string[];
}

export const POPULAR_ANIME_DATABASE: PopularAnime[] = [
  // Top 50 Popular Anime with Fillers
  { name: "Naruto", malId: 20, estimatedFillers: 91, fillerRanges: ["26", "97-106", "136-220"], franchise: "Naruto" },
  { name: "Naruto: Shippuden", malId: 1735, estimatedFillers: 200, fillerRanges: ["57-71", "91-112", "144-151", "170-171", "176-196", "223-242", "257-260", "271", "279-281", "284-295", "303-320", "347-361", "376-377", "388-390", "394-413", "416", "422-423", "427-450", "464-469", "480-483", "486-488", "490-493"], franchise: "Naruto" },
  { name: "One Piece", malId: 21, estimatedFillers: 110, fillerRanges: ["54-61", "131-143", "196-206", "220-224", "279-283", "291-292", "303", "317-319", "326-335", "382-384", "406-407", "426-429", "457-458", "492", "542-543", "575-578"], specialNotes: "G-8 Arc (196-206) is highly recommended filler" },
  { name: "Bleach", malId: 269, estimatedFillers: 160, fillerRanges: ["64-109", "128-137", "147-149", "168-189", "204-205", "213-214", "227-265", "287", "298-299", "303-305", "311-341", "355"], specialNotes: "Zanpakuto Rebellion Arc (168-189) is recommended" },
  { name: "Dragon Ball Z", malId: 813, estimatedFillers: 39, fillerRanges: ["10-11", "42", "124-129", "174-194", "195-199", "200-207"], franchise: "Dragon Ball" },
  { name: "Dragon Ball Super", malId: 30694, estimatedFillers: 14, fillerRanges: ["16-17", "42-46", "69-76", "93", "131"], franchise: "Dragon Ball" },
  { name: "Boruto: Naruto Next Generations", malId: 34566, estimatedFillers: 190, fillerRanges: ["16-18", "40-41", "48-50", "67-92", "93-95", "105-111", "113-119", "138-140", "155-156", "176-180", "186-187", "192-207", "212-220"], franchise: "Naruto" },
  { name: "Fairy Tail", malId: 6702, estimatedFillers: 60, fillerRanges: ["69-75", "202-218", "219-226", "227-233", "265-266"] },
  { name: "Black Clover", malId: 34572, estimatedFillers: 15, fillerRanges: ["29", "66", "123-129", "130", "160-170"] },
  { name: "Attack on Titan", malId: 16498, estimatedFillers: 5, fillerRanges: ["13.5", "22.5", "25", "59.5"], specialNotes: "Mostly recap specials" },
  { name: "Detective Conan", malId: 235, estimatedFillers: 400, fillerRanges: ["6", "9-10", "22-23", "33", "36", "38-39", "49-50"], specialNotes: "Too many to list - use filler guides" },
  { name: "Inuyasha", malId: 249, estimatedFillers: 35, fillerRanges: ["78-95", "97-103", "105-111", "130-136", "147-162"] },
  { name: "Yu-Gi-Oh! Duel Monsters", malId: 481, estimatedFillers: 40, fillerRanges: ["53-80", "98-121", "185-189"], franchise: "Yu-Gi-Oh!" },
  { name: "Sword Art Online", malId: 11757, estimatedFillers: 6, fillerRanges: ["2", "4", "7", "12"], franchise: "Sword Art Online" },
  { name: "Tokyo Revengers", malId: 42249, estimatedFillers: 5, fillerRanges: ["12.5", "24.5"], specialNotes: "Mostly recap episodes" },
  { name: "Reborn! (Katekyo Hitman Reborn)", malId: 1604, estimatedFillers: 30, fillerRanges: ["66-73", "142-153", "189-200"] },
  { name: "Gintama", malId: 918, estimatedFillers: 25, fillerRanges: ["166-167", "236-237", "291-307"], specialNotes: "Most 'filler' is high-quality parody" },
  { name: "Rurouni Kenshin", malId: 45, estimatedFillers: 40, fillerRanges: ["28-62", "95"] },
  { name: "Black Butler", malId: 4898, estimatedFillers: 15, fillerRanges: ["15-24"], specialNotes: "Season 1 diverges from manga" },
  { name: "Pokemon", malId: 527, estimatedFillers: 300, fillerRanges: ["Too many"], specialNotes: "Most episodes are technically filler" },
  { name: "Yu Yu Hakusho", malId: 392, estimatedFillers: 8, fillerRanges: ["57", "66-67", "94-95", "107-108"] },
  { name: "Shaman King", malId: 154, estimatedFillers: 20, fillerRanges: ["32-63"] },
  { name: "Sailor Moon", malId: 530, estimatedFillers: 80, fillerRanges: ["Various"], specialNotes: "Many monster-of-the-week episodes" },
  { name: "The Seven Deadly Sins", malId: 23755, estimatedFillers: 10, fillerRanges: ["Various OVAs"] },
  { name: "D.Gray-man", malId: 1482, estimatedFillers: 25, fillerRanges: ["50-51", "76-103"] },
  { name: "Digimon Adventure", malId: 552, estimatedFillers: 25, fillerRanges: ["Various"] },
  { name: "Zatch Bell!", malId: 250, estimatedFillers: 30, fillerRanges: ["104-150"] },
  { name: "Blue Exorcist", malId: 9919, estimatedFillers: 10, fillerRanges: ["17-25"], specialNotes: "Anime-original ending" },
  { name: "Trigun Stampede", malId: 48583, estimatedFillers: 5, fillerRanges: ["Various recap"], specialNotes: "Reimagining of original" },
  { name: "Hellsing", malId: 270, estimatedFillers: 10, fillerRanges: ["Various"], specialNotes: "Deviates from manga" },
  { name: "Great Teacher Onizuka", malId: 245, estimatedFillers: 8, fillerRanges: ["Various"] },
  { name: "Fullmetal Alchemist (2003)", malId: 121, estimatedFillers: 30, fillerRanges: ["26-51"], specialNotes: "Anime-original story after episode 25" },
  { name: "Yu-Gi-Oh! GX", malId: 482, estimatedFillers: 45, fillerRanges: ["Various"], franchise: "Yu-Gi-Oh!" },
  { name: "Yu-Gi-Oh! 5D's", malId: 3972, estimatedFillers: 25, fillerRanges: ["Various"], franchise: "Yu-Gi-Oh!" },
  { name: "Beyblade", malId: 687, estimatedFillers: 25, fillerRanges: ["Various"] },
  { name: "Medaka Box", malId: 11761, estimatedFillers: 8, fillerRanges: ["Various"] },
  { name: "Saint Seiya", malId: 1254, estimatedFillers: 50, fillerRanges: ["Various"] },
  { name: "Hikaru no Go", malId: 135, estimatedFillers: 5, fillerRanges: ["Various"] },
  { name: "Ranma ½", malId: 210, estimatedFillers: 100, fillerRanges: ["Various"] },
  { name: "Hunter x Hunter (1999)", malId: 136, estimatedFillers: 10, fillerRanges: ["Various"], franchise: "Hunter x Hunter" },
  { name: "Hunter x Hunter (2011)", malId: 11061, estimatedFillers: 0, fillerRanges: [], specialNotes: "No filler episodes", franchise: "Hunter x Hunter" },
  { name: "Baki", malId: 287, estimatedFillers: 15, fillerRanges: ["Various"] },
  { name: "Bakugan Battle Brawlers", malId: 3368, estimatedFillers: 15, fillerRanges: ["Various"] },
  { name: "Yu-Gi-Oh! Zexal", malId: 10015, estimatedFillers: 30, fillerRanges: ["Various"], franchise: "Yu-Gi-Oh!" },
  { name: "Naruto SD: Rock Lee", malId: 12979, estimatedFillers: 51, fillerRanges: ["All"], specialNotes: "Entirely non-canon spin-off", franchise: "Naruto" },
  { name: "Inazuma Eleven", malId: 5231, estimatedFillers: 50, fillerRanges: ["Various"] },
  { name: "Duel Masters", malId: 1964, estimatedFillers: 30, fillerRanges: ["Various"] },

  // Danganronpa Series
  { name: "Danganronpa: The Animation", malId: 16592, estimatedFillers: 0, fillerRanges: [], franchise: "Danganronpa", watchOrder: 1 },
  { name: "Danganronpa 3: The End of Hope's Peak Academy - Future Arc", malId: 32189, estimatedFillers: 0, fillerRanges: [], franchise: "Danganronpa", watchOrder: 2 },
  { name: "Danganronpa 3: The End of Hope's Peak Academy - Despair Arc", malId: 33028, estimatedFillers: 0, fillerRanges: [], franchise: "Danganronpa", watchOrder: 3 },

  // Fate Series
  { name: "Fate/stay night", malId: 356, estimatedFillers: 5, fillerRanges: ["Various"], franchise: "Fate", watchOrder: 1 },
  { name: "Fate/Zero", malId: 10087, estimatedFillers: 0, fillerRanges: [], franchise: "Fate", watchOrder: 2 },
  { name: "Fate/stay night: Unlimited Blade Works", malId: 22297, estimatedFillers: 0, fillerRanges: [], franchise: "Fate", watchOrder: 3 },
  { name: "Fate/stay night: Heaven's Feel", malId: 25537, estimatedFillers: 0, fillerRanges: [], franchise: "Fate", watchOrder: 4 },
  { name: "Fate/Apocrypha", malId: 34662, estimatedFillers: 5, fillerRanges: ["Various"], franchise: "Fate", watchOrder: 5 },
  { name: "Fate/Extra Last Encore", malId: 33047, estimatedFillers: 3, fillerRanges: ["Various"], franchise: "Fate", watchOrder: 6 },
  { name: "Fate/Grand Order - Absolute Demonic Front: Babylonia", malId: 38084, estimatedFillers: 0, fillerRanges: [], franchise: "Fate", watchOrder: 7 },
];

// Only export One Piece and Black Clover franchise guides for launch
export const FRANCHISE_GUIDES: FranchiseGuide[] = [
  // One Piece and Black Clover franchise guides go here
];

export const getAnimeByMalId = (malId: number): PopularAnime | undefined => {
  return POPULAR_ANIME_DATABASE.find(anime => anime.malId === malId);
};

export const getAnimesByFranchise = (franchise: string): PopularAnime[] => {
  return POPULAR_ANIME_DATABASE.filter(anime => anime.franchise === franchise);
};

export const getFranchiseGuide = (franchise: string): FranchiseGuide | undefined => {
  return FRANCHISE_GUIDES.find(guide => guide.name === franchise);
};

export const getTopAnimeWithFillers = (limit: number = 50): PopularAnime[] => {
  return POPULAR_ANIME_DATABASE
    .filter(anime => anime.estimatedFillers > 0)
    .sort((a, b) => b.estimatedFillers - a.estimatedFillers)
    .slice(0, limit);
};
