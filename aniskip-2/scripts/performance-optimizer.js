import fs from 'fs';
import path from 'path';

// Performance optimization utilities
export class PerformanceOptimizer {
  constructor() {
    this.publicDir = 'public';
    this.srcDir = 'src';
  }

  // Generate critical CSS inline styles
  generateCriticalCSS() {
    return `
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      #root { min-height: 100vh; }
      .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; }
      .hero { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
      .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
      .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
      .cta-button { background: #6366f1; color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.1rem; cursor: pointer; }
      .cta-button:hover { background: #4f46e5; }
    `;
  }

  // Generate preload links for critical resources
  generatePreloadLinks() {
    return [
      '<link rel="preload" href="/logo.png" as="image" type="image/png">',
      '<link rel="preload" href="/src/main.tsx" as="script" type="module">',
      '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
      '<link rel="dns-prefetch" href="//pagead2.googlesyndication.com">'
    ].join('\n    ');
  }

  // Generate resource hints
  generateResourceHints() {
    return [
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link rel="preconnect" href="https://pagead2.googlesyndication.com">',
      '<link rel="preconnect" href="https://www.googletagmanager.com">'
    ].join('\n    ');
  }

  // Optimize images
  async optimizeImages() {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const publicDir = path.join(process.cwd(), this.publicDir);
    
    try {
      const files = fs.readdirSync(publicDir);
      const imageFiles = files.filter(file => 
        imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
      );
      
      console.log('Found image files:', imageFiles);
      
      // Here you would implement image optimization
      // For now, we'll just log the files
      return imageFiles;
    } catch (error) {
      console.error('Error optimizing images:', error);
      return [];
    }
  }

  // Generate service worker for caching
  generateServiceWorker() {
    return `
      // Service Worker for AniSkip Pro
      const CACHE_NAME = 'aniskip-v1';
      const urlsToCache = [
        '/',
        '/logo.png',
        '/logo.svg',
        '/favicon.ico',
        '/manifest.json'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => response || fetch(event.request))
        );
      });
    `;
  }

  // Generate compression headers for Vercel
  generateVercelHeaders() {
    return `
      # Performance headers
      /*
        X-Frame-Options: DENY
        X-Content-Type-Options: nosniff
        Referrer-Policy: strict-origin-when-cross-origin
        Permissions-Policy: camera=(), microphone=(), geolocation=()
        Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.jikan.moe https://graphql.anilist.co;
      `;
  }

  // Generate sitemap with dynamic content
  generateDynamicSitemap() {
    const baseUrl = 'https://animeskip.pro';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/library</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/watch-guides</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/settings</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/signup</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  }
}

// Export the class
export default PerformanceOptimizer; 