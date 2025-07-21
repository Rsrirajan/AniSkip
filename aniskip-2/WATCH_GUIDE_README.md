# AniSkip Watch Guide System

A comprehensive watch guide system for anime series that helps users navigate through episodes efficiently by identifying filler, recap, and canon content using the Jikan API.

## Features

### 🎯 Core Functionality
- **Dynamic Watch Guide Generation**: Automatically generates watch guides for any anime using MyAnimeList data
- **Filler Detection**: Identifies filler episodes using Jikan API data
- **Recap Detection**: Marks recap episodes separately from filler
- **Episode Recommendations**: Provides watch/skip/optional recommendations with detailed reasoning
- **Time Calculations**: Estimates viewing time and time saved by skipping filler
- **Difficulty Assessment**: Categorizes series by complexity (Easy/Medium/Hard)

### 📊 Statistics & Analytics
- Total episodes count
- Filler episode count and percentage
- Recap episode count
- Canon episode count
- Watch vs Skip episode breakdown
- Time saved calculations

### 🔍 Search & Discovery
- Search for any anime by title
- Popular anime series pre-loaded
- Caching system for performance
- Real-time search results

## Architecture

### Services

#### `jikan.ts` - Jikan API Integration
```typescript
// Core API functions
- searchAnime(query, page, limit)
- getAnimeById(id)
- getAnimeEpisodes(id, page)
- getAllAnimeEpisodes(id) // Handles pagination
- getAnimeEpisode(id, episode)
```

#### `watchGuideService.ts` - Watch Guide Logic
```typescript
// Main functions
- generateWatchGuide(malId) // Creates complete watch guide
- analyzeEpisodes(episodes) // Analyzes episode data
- calculateStats(episodes, recommendations) // Computes statistics
- searchAndGenerateWatchGuide(query) // Search + generate
```

### Components

#### `WatchGuides.tsx` - Main Page
- Search functionality
- Guide grid display
- Modal for detailed view
- Pro feature gating

#### `WatchGuideDisplay.tsx` - Individual Guide Component
- Detailed statistics
- Episode recommendations
- Expandable episode list
- Error handling

#### `WatchGuideDemo.tsx` - Demo Component
- Sample data for testing
- Showcase of features
- Interactive examples

### Hooks

#### `useWatchGuide.ts` - State Management
```typescript
// Main hook
- guides: WatchGuide[]
- loading: boolean
- error: string | null
- searchGuides(query)
- loadPopularGuides()
- clearError()

// Individual guide hook
- useIndividualWatchGuide(malId)
```

## Data Flow

1. **User Search**: User searches for anime title
2. **API Call**: Jikan API searches for anime
3. **Episode Fetch**: Get all episodes for the anime
4. **Analysis**: Analyze episodes for filler/recap/canon status
5. **Guide Generation**: Create comprehensive watch guide
6. **Caching**: Store result in memory cache
7. **Display**: Show guide with recommendations

## Popular Anime Series

The system includes pre-configured data for popular anime series:

- **One Piece** (1000+ episodes, 95 filler)
- **Naruto** (220 episodes, 85 filler)
- **Naruto Shippuden** (500 episodes, 200+ filler)
- **Bleach** (366 episodes, 163 filler)
- **Dragon Ball Series** (Various)
- **Attack on Titan** (75 episodes, 0 filler)
- **My Hero Academia** (138 episodes, 0 filler)
- **Demon Slayer** (44 episodes, 0 filler)
- And many more...

## API Integration

### Jikan API Endpoints Used

```typescript
// Search anime
GET /anime?q={query}&page={page}&limit={limit}

// Get anime details
GET /anime/{id}

// Get episodes
GET /anime/{id}/episodes?page={page}

// Get specific episode
GET /anime/{id}/episodes/{episode}
```

### Rate Limiting
- 1 second delay between requests
- Error handling for API failures
- Graceful degradation with fallback data

## Episode Classification

### Watch (Green)
- Canon episodes essential to the story
- Character development episodes
- Plot-advancing content
- First 3 episodes (setup)
- Final episodes

### Skip (Red)
- Filler episodes (non-canon)
- Recap episodes
- Movie tie-in episodes
- Standalone stories

### Optional (Yellow)
- Mixed quality episodes
- Character-focused filler
- Entertainment value but not essential

## Usage Examples

### Basic Search
```typescript
import { searchAndGenerateWatchGuide } from './services/watchGuideService';

const guide = await searchAndGenerateWatchGuide('One Piece');
console.log(guide.stats.fillerEpisodes); // 95
```

### Using the Hook
```typescript
import { useWatchGuide } from './lib/useWatchGuide';

const { guides, loading, searchGuides } = useWatchGuide();
await searchGuides('Naruto');
```

### Component Integration
```typescript
import WatchGuideDisplay from './components/details/WatchGuideDisplay';

<WatchGuideDisplay malId={21} animeTitle="One Piece" />
```

## Performance Optimizations

### Caching Strategy
- In-memory cache for guides
- Search result caching
- Episode data caching
- Prevents redundant API calls

### Lazy Loading
- Paginated episode loading
- Progressive guide generation
- On-demand data fetching

### Error Handling
- Graceful API failure handling
- Fallback to demo data
- User-friendly error messages
- Retry mechanisms

## Pro Features

### Premium Content
- Detailed episode-by-episode analysis
- Advanced statistics
- Custom recommendations
- Time tracking features

### Feature Gating
- Pro-only watch guides
- Upgrade prompts
- Feature comparison
- Subscription integration

## Future Enhancements

### Planned Features
- **User Customization**: Allow users to customize recommendations
- **Community Ratings**: User ratings for episode quality
- **Watch Progress**: Track user progress through series
- **Export Features**: Export guides to various formats
- **Mobile Optimization**: Enhanced mobile experience

### API Improvements
- **Batch Processing**: Load multiple guides simultaneously
- **Background Sync**: Pre-load popular guides
- **Offline Support**: Cache guides for offline viewing
- **Real-time Updates**: Live episode data updates

## Development Setup

### Prerequisites
- Node.js 16+
- TypeScript
- React 18+
- Vite

### Installation
```bash
cd aniskip-2
npm install
npm run dev
```

### Environment Variables
```env
# Optional: Custom Jikan API endpoint
VITE_JIKAN_API_BASE=https://api.jikan.moe/v4
```

## Contributing

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture

### Testing
- Unit tests for services
- Component testing
- API integration tests
- Performance testing

## License

This project is part of the AniSkip anime tracking platform. The watch guide system is designed to help users make informed decisions about their anime viewing experience. 