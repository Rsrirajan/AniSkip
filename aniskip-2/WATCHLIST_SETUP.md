# Watchlist Setup Guide

## Database Setup

To enable watchlist functionality, you need to set up the database table and policies. Run the following SQL in your Supabase SQL editor:

```sql
-- Create watchlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anime_id INTEGER NOT NULL,
    site VARCHAR(50) DEFAULT 'anilist',
    status VARCHAR(50) NOT NULL,
    current_episode INTEGER DEFAULT 1,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, anime_id)
);

-- Enable Row Level Security
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own watchlist" ON watchlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watchlist items" ON watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items" ON watchlist
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" ON watchlist
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_anime_id ON watchlist(anime_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_watchlist_updated_at 
    BEFORE UPDATE ON watchlist 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Features

### Status Options
- **Watching** - Currently watching the anime
- **Completed** - Finished watching the anime
- **Plan to Watch** - Planning to watch in the future
- **On Hold** - Paused watching temporarily
- **Dropped** - Stopped watching and won't continue

### Functionality
- Add anime to watchlist with status and episode progress
- Update existing entries
- Remove anime from watchlist
- Track episode progress
- User-specific watchlists (RLS enabled)

### UI Features
- Status selection buttons
- Episode progress input
- Loading states during save operations
- Success feedback
- Error handling

## Troubleshooting

### Common Issues

1. **"User not authenticated" error**
   - Make sure user is logged in
   - Check if Supabase auth is properly configured

2. **RLS (Row Level Security) error**
   - Ensure RLS policies are created
   - Check if user_id matches auth.uid()

3. **Foreign key error**
   - Verify the watchlist table exists
   - Check if auth.users table exists

4. **Watchlist not updating**
   - Check browser console for errors
   - Verify database connection
   - Ensure proper error handling in components

### Debug Steps

1. Check browser console for error messages
2. Verify user authentication status
3. Test database connection
4. Check RLS policies
5. Verify table structure

## Usage

The watchlist functionality is available in:
- Anime modals (when user is logged in)
- Dashboard page
- Library page
- Search page

Users can:
- Add anime to their watchlist
- Update status and episode progress
- View their watchlist in the Library
- Track progress across the app 