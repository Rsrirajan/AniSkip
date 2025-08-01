# Development Setup Guide

## 🎯 Environment-Based Configuration

This project now supports environment-based Supabase configuration, allowing you to develop locally without affecting production users.

## 📁 Environment Files

### `.env.local` (Development)
```bash
VITE_SUPABASE_URL=https://kuqiblpyfyutjvqepioj.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=http://localhost:5173
VITE_ENVIRONMENT=development
```

### `.env.production` (Production)
```bash
VITE_SUPABASE_URL=https://kuqiblpyfyutjvqepioj.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=https://animeskip.pro
VITE_ENVIRONMENT=production
```

## 🚀 How It Works

### Development Mode (`npm run dev`)
- Uses `.env.local` configuration
- Redirects to `http://localhost:5173`
- Shows development environment in console logs
- Uses same Supabase project but different redirect URLs

### Production Mode (`npm run build`)
- Uses `.env.production` configuration
- Redirects to `https://animeskip.pro`
- Optimized for production
- Uses production Supabase project

## 🔧 Supabase Configuration

### Current Setup
- **Development**: Uses same Supabase project but different redirect URLs
- **Production**: Uses same Supabase project with production redirect URLs

### Future Setup (Recommended for 1000+ users)
- **Development**: Create separate Supabase project for development
- **Production**: Use production Supabase project

## 📊 Environment Detection

The app automatically detects the environment:

```typescript
// Development
console.log('🔧 Supabase Client Config:', {
  environment: 'development',
  siteUrl: 'http://localhost:5173',
  isDevelopment: true,
  isProduction: false
});

// Production
console.log('🔧 Supabase Client Config:', {
  environment: 'production',
  siteUrl: 'https://animeskip.pro',
  isDevelopment: false,
  isProduction: true
});
```

## 🎯 Authentication Redirects

### Development
- Auth callback: `http://localhost:5173/auth-callback`
- Reset password: `http://localhost:5173/reset`
- Sign out: `http://localhost:5173`

### Production
- Auth callback: `https://animeskip.pro/auth-callback`
- Reset password: `https://animeskip.pro/reset`
- Sign out: `https://animeskip.pro`

## 🔍 Debugging

### Console Logs
- **Supabase Client**: Shows environment configuration
- **Auth Config**: Shows redirect URLs and environment
- **Watch Guides**: Shows when guides are loaded

### Visual Indicators
- **Development**: Red "🚀 UPDATED VERSION" badge
- **Production**: No debug badges

## 🚀 Quick Start

1. **Development**:
   ```bash
   npm run dev
   # Uses .env.local
   # Redirects to localhost:5173
   ```

2. **Production Build**:
   ```bash
   npm run build
   # Uses .env.production
   # Redirects to animeskip.pro
   ```

## 🔒 Security

- Environment files are in `.gitignore`
- Sensitive keys are not committed to version control
- Development and production use separate configurations

## 📈 Scaling Plan

### Phase 1: Current (10 users)
- Same Supabase project, different redirect URLs
- Environment-based configuration

### Phase 2: Growth (100+ users)
- Separate development Supabase project
- Feature flags for testing

### Phase 3: Scale (1000+ users)
- Full staging environment
- Automated testing
- Blue-green deployments

## 🎯 Benefits

✅ **No production impact** during development  
✅ **Environment-specific redirects**  
✅ **Easy debugging** with console logs  
✅ **Scalable architecture** for future growth  
✅ **Secure configuration** management  

---

**Last Updated**: January 2024  
**Version**: 1.0 