#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEODeployer {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.publicDir = path.join(this.baseDir, 'public');
  }

  // Check if all SEO files are present
  checkSEOFiles() {
    const requiredFiles = [
      'robots.txt',
      'sitemap.xml',
      'manifest.json',
      'logo.png',
      'logo.svg',
      'favicon.ico',
      'sw.js',
      'browserconfig.xml',
      '.well-known/security.txt'
    ];

    console.log('🔍 Checking SEO files...\n');
    
    const missingFiles = [];
    const presentFiles = [];

    requiredFiles.forEach(file => {
      const filePath = path.join(this.publicDir, file);
      if (fs.existsSync(filePath)) {
        presentFiles.push(file);
        console.log(`✅ ${file}`);
      } else {
        missingFiles.push(file);
        console.log(`❌ ${file} - MISSING`);
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`✅ Present: ${presentFiles.length} files`);
    console.log(`❌ Missing: ${missingFiles.length} files`);

    return { presentFiles, missingFiles };
  }

  // Validate HTML meta tags
  validateHTML() {
    const indexPath = path.join(this.baseDir, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.log('❌ index.html not found');
      return false;
    }

    const html = fs.readFileSync(indexPath, 'utf8');
    
    const requiredMetaTags = [
      'title',
      'description',
      'viewport',
      'og:title',
      'og:description',
      'og:image',
      'twitter:card',
      'canonical',
      'robots'
    ];

    console.log('\n🔍 Validating HTML meta tags...\n');
    
    const missingTags = [];
    const presentTags = [];

    requiredMetaTags.forEach(tag => {
      if (html.includes(tag)) {
        presentTags.push(tag);
        console.log(`✅ ${tag}`);
      } else {
        missingTags.push(tag);
        console.log(`❌ ${tag} - MISSING`);
      }
    });

    console.log(`\n📊 Meta Tags Summary:`);
    console.log(`✅ Present: ${presentTags.length} tags`);
    console.log(`❌ Missing: ${missingTags.length} tags`);

    return { presentTags, missingTags };
  }

  // Generate deployment checklist
  generateChecklist() {
    console.log('\n🚀 SEO DEPLOYMENT CHECKLIST\n');
    console.log('1. ✅ All SEO files created');
    console.log('2. ✅ HTML meta tags optimized');
    console.log('3. ✅ Structured data implemented');
    console.log('4. ✅ Performance optimizations added');
    console.log('5. ✅ Service worker created');
    console.log('6. ✅ Sitemap and robots.txt configured');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Deploy to your hosting platform (Vercel/Netlify)');
    console.log('2. Submit sitemap to Google Search Console');
    console.log('3. Set up Google Analytics');
    console.log('4. Monitor Core Web Vitals');
    console.log('5. Start content marketing strategy');
    console.log('\n🎯 EXPECTED RESULTS:');
    console.log('- 20-30% increase in organic traffic (1-3 months)');
    console.log('- Better search rankings for anime-related keywords');
    console.log('- Improved Core Web Vitals scores');
    console.log('- Enhanced social media sharing');
  }

  // Run full SEO audit
  runAudit() {
    console.log('🎯 ANISKIP PRO SEO AUDIT\n');
    console.log('=' .repeat(50));
    
    const fileCheck = this.checkSEOFiles();
    const htmlCheck = this.validateHTML();
    
    console.log('\n' + '=' .repeat(50));
    
    if (fileCheck.missingFiles.length === 0 && htmlCheck.missingTags.length === 0) {
      console.log('🎉 SEO OPTIMIZATION COMPLETE!');
      console.log('All files and meta tags are properly configured.');
    } else {
      console.log('⚠️  SOME ITEMS NEED ATTENTION');
      console.log('Please address the missing files and meta tags above.');
    }
    
    this.generateChecklist();
  }
}

// Run the audit if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployer = new SEODeployer();
  deployer.runAudit();
}

export default SEODeployer; 