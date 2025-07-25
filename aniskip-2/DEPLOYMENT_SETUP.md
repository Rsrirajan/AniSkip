# Deployment Setup Guide

## Fixing OAuth Login Issues

If you're getting "ERR_CONNECTION_REFUSED" or redirects to localhost when deployed, follow these steps:

### 1. Set Environment Variables

Create a `.env.local` file in the aniskip-2 directory with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-vercel-app.vercel.app
```

For Vercel deployment, add these in the Vercel dashboard under Settings → Environment Variables.

### 2. Configure Supabase Auth Settings

In your Supabase dashboard:

1. Go to Authentication → Settings
2. Under "Site URL", set your production domain (e.g., `https://your-app.vercel.app`)
3. Under "Redirect URLs", add:
   - `https://your-app.vercel.app/dashboard` (for OAuth success)
   - `https://your-app.vercel.app/reset` (for password reset)
   - `http://localhost:5173/dashboard` (for local development)
   - `http://localhost:5173/reset` (for local development)

### 3. Google OAuth Configuration

If using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your project → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your production domain to "Authorized redirect URIs":
   - `https://[your-supabase-project].supabase.co/auth/v1/callback`

### Troubleshooting

- Check browser console for OAuth redirect URL logs
- Verify all domains match exactly (no trailing slashes)
- Ensure HTTPS is used for production domains
- Test with a fresh browser session/incognito mode