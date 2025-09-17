import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Head component for dynamic meta tags and structured data
 * Provides comprehensive SEO optimization for each page
 */
const SEOHead = ({
  title = 'ClutchCoins - Premium Gaming Recharge & Top-Up Services',
  description = 'Fast and secure gaming recharge services for popular games. Instant top-ups, competitive prices, and 24/7 support for all your gaming needs.',
  keywords = 'gaming recharge, game top-up, mobile gaming, online gaming, game credits, gaming services',
  image = '/favicon.svg',
  url,
  type = 'website',
  author = 'ClutchCoins',
  siteName = 'ClutchCoins',
  locale = 'en_US',
  twitterHandle = '@clutchcoins',
  structuredData,
  canonical,
  noindex = false,
  nofollow = false,
}) => {
  const fullTitle = title.includes('ClutchCoins') ? title : `${title} | ClutchCoins`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;
  const imageUrl = image.startsWith('http') ? image : `${currentUrl}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ClutchCoins",
    "description": description,
    "url": currentUrl,
    "logo": imageUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-234-567-8900",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://facebook.com/clutchcoins",
      "https://twitter.com/clutchcoins",
      "https://instagram.com/clutchcoins"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0891b2" />
      <meta name="msapplication-TileColor" content="#0891b2" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Helmet>
  );
};

export default SEOHead;
