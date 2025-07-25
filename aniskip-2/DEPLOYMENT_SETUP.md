# Deployment Setup Guide

## OAuth Login 404 Error Fix

If you're getting "404: NOT_FOUND" when logging in, this means your OAuth redirect URL isn't properly configured.

### Current Issue
- OAuth tries to redirect to `/dashboard` route
- But the domain in `VITE_SITE_URL` doesn't have your app deployed yet
- Result: 404 error

## Development vs Production Configuration

### For Development (Current Setup)
Use this configuration in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=http://localhost:5173
```

### For Production (When Ready to Launch)
Change to this configuration in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://animeskip.pro
```

## Required Supabase Configuration

**CRITICAL:** You must configure these redirect URLs in your Supabase dashboard:

### 1. Go to Supabase Dashboard
1. Open your project at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to: **Authentication → Settings → URL Configuration**

### 2. Set Site URL
- **Site URL**: `https://animeskip.pro` (your production domain)

### 3. Add Redirect URLs
Add these **exact** URLs to the "Redirect URLs" list:

**For Development:**
- `http://localhost:5173/dashboard`
- `http://localhost:5173/reset`

**For Production:**
- `https://animeskip.pro/dashboard`
- `https://animeskip.pro/reset`

**For Vercel Preview (if using Vercel):**
- `https://*.vercel.app/dashboard`
- `https://*.vercel.app/reset`

### 4. Google OAuth Configuration (if applicable)

If using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your project → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to "Authorized redirect URIs":
   - `https://kuqiblpyfyutjvqepioj.supabase.co/auth/v1/callback`

## When to Use Each Configuration

### Use `localhost:5173` when:
- ✅ Developing locally
- ✅ Testing OAuth flow
- ✅ Your production domain isn't deployed yet

### Use `https://animeskip.pro` when:
- ✅ Ready to deploy to production
- ✅ Domain is set up and pointing to your app
- ✅ SSL certificate is configured

## Deployment Checklist

Before switching to production URL:

1. [ ] Deploy your app to `animeskip.pro`
2. [ ] Verify the `/dashboard` route works on production
3. [ ] Add production redirect URLs to Supabase
4. [ ] Update `VITE_SITE_URL` to production domain
5. [ ] Test OAuth login on production

## Troubleshooting

### Still getting 404 after configuration?
1. **Check Supabase redirect URLs** - Must match exactly
2. **Verify domain deployment** - Ensure `animeskip.pro/dashboard` exists
3. **Clear browser cache** - Hard refresh or incognito mode
4. **Check console logs** - Look for OAuth redirect URL in browser console

### For immediate development:
- Use `VITE_SITE_URL=http://localhost:5173`
- This will allow you to test OAuth locally while preparing production

### Error: "Invalid redirect URL"
- The URL you're redirecting to is not in Supabase's allowed list
- Add the exact URL to Supabase → Authentication → Settings → URL Configuration