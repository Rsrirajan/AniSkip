import fs from 'fs';
import path from 'path';

// SEO optimization utilities
export class SEOOptimizer {
  constructor() {
    this.baseUrl = 'https://animeskip.pro';
    this.siteName = 'AniSkip Pro';
  }

  // Generate meta tags for anime detail pages
  generateAnimeMetaTags(anime) {
    const title = `${anime.title} - Skip Fillers & Watch Guide | AniSkip Pro`;
    const description = `Watch ${anime.title} with filler episodes skipped. Track your progress, find watch guides, and discover the best episodes. ${anime.synopsis || ''}`;
    
    return {
      title,
      description,
      keywords: `anime, ${anime.title}, filler episodes, watch guide, anime tracker, ${anime.genres?.join(', ') || ''}`,
      ogTitle: title,
      ogDescription: description,
      ogImage: anime.image_url || `${this.baseUrl}/logo.png`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonical: `${this.baseUrl}/anime/${anime.mal_id}`,
      structuredData: this.generateAnimeStructuredData(anime)
    };
  }

  // Generate structured data for anime
  generateAnimeStructuredData(anime) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": anime.title,
      "description": anime.synopsis,
      "image": anime.image_url,
      "url": `${this.baseUrl}/anime/${anime.mal_id}`,
      "genre": anime.genres,
      "datePublished": anime.aired_from,
      "dateModified": anime.aired_to,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": anime.score,
        "ratingCount": "1000+"
      },
      "creator": {
        "@type": "Organization",
        "name": anime.studios?.join(', ') || "Various Studios"
      }
    };
  }

  // Generate meta tags for search results
  generateSearchMetaTags(query) {
    const title = `Search Anime: ${query} | AniSkip Pro`;
    const description = `Search and discover anime like "${query}". Find filler episodes, watch guides, and track your progress with AniSkip Pro.`;
    
    return {
      title,
      description,
      keywords: `anime search, ${query}, anime finder, anime database, anime recommendations`,
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/logo.png`,
      canonical: `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    };
  }

  // Generate breadcrumb structured data
  generateBreadcrumbData(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Generate organization structured data
  generateOrganizationData() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": this.siteName,
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "description": "The ultimate anime tracking experience for true fans",
      "sameAs": [
        "https://twitter.com/aniskip_pro",
        "https://github.com/aniskip"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@animeskip.pro"
      }
    };
  }

  // Generate WebSite structured data
  generateWebsiteData() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": this.siteName,
      "url": this.baseUrl,
      "description": "Skip anime fillers, track your progress, and discover amazing anime",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  }
}

// Export the class
export default SEOOptimizer; 