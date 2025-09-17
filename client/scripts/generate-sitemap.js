#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator for ClutchCoins
 * This script generates a sitemap.xml file based on the current games and content
 * Run this script during the build process to keep the sitemap up-to-date
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://clutchcoins.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/games', priority: '0.9', changefreq: 'daily' },
  { url: '/blogs', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/guide', priority: '0.6', changefreq: 'monthly' },
  { url: '/payments', priority: '0.5', changefreq: 'monthly' },
  { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/returns', priority: '0.3', changefreq: 'yearly' }
];

/**
 * Fetch games from the API
 * In a real implementation, this would make an actual API call
 * For now, we'll use a mock function
 */
async function fetchGames() {
  try {
    // In production, replace this with actual API call
    // const response = await fetch(`${process.env.VITE_API_BASE_URL}/games`);
    // const data = await response.json();
    // return data.data || [];
    
    // Mock data for demonstration
    return [
      { _id: '1', title: 'PUBG Mobile', updatedAt: new Date().toISOString() },
      { _id: '2', title: 'Valorant', updatedAt: new Date().toISOString() },
      { _id: '3', title: 'Roblox', updatedAt: new Date().toISOString() },
      { _id: '4', title: 'Minecraft', updatedAt: new Date().toISOString() },
      { _id: '5', title: 'Free Fire', updatedAt: new Date().toISOString() }
    ];
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

/**
 * Fetch blog posts from the API
 */
async function fetchBlogs() {
  try {
    // In production, replace this with actual API call
    // const response = await fetch(`${process.env.VITE_API_BASE_URL}/blogs`);
    // const data = await response.json();
    // return data.data || [];
    
    // Mock data for demonstration
    return [
      { _id: '1', title: 'Gaming Tips', slug: 'gaming-tips', updatedAt: new Date().toISOString() },
      { _id: '2', title: 'Best Games 2024', slug: 'best-games-2024', updatedAt: new Date().toISOString() }
    ];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url, lastmod, changefreq, priority) {
  const lastmodDate = lastmod ? new Date(lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  
  return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap XML
 */
async function generateSitemap() {
  console.log('🚀 Generating dynamic sitemap...');
  
  try {
    // Fetch dynamic content
    const [games, blogs] = await Promise.all([
      fetchGames(),
      fetchBlogs()
    ]);
    
    console.log(`📊 Found ${games.length} games and ${blogs.length} blog posts`);
    
    // Start building the sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;

    // Add static pages
    STATIC_PAGES.forEach(page => {
      sitemap += generateUrlEntry(page.url, null, page.changefreq, page.priority) + '\n\n';
    });
    
    // Add game pages
    games.forEach(game => {
      sitemap += generateUrlEntry(
        `/games/${game._id}`,
        game.updatedAt,
        'weekly',
        '0.8'
      ) + '\n\n';
    });
    
    // Add blog pages
    blogs.forEach(blog => {
      sitemap += generateUrlEntry(
        `/blogs/${blog.slug || blog._id}`,
        blog.updatedAt,
        'monthly',
        '0.6'
      ) + '\n\n';
    });
    
    // Close the sitemap
    sitemap += '</urlset>';
    
    // Write the sitemap to file
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    console.log(`📈 Total URLs: ${STATIC_PAGES.length + games.length + blogs.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap };
