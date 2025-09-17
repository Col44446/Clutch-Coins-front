/**
 * SEO Monitoring and Analytics Utility
 * Tracks SEO performance and provides insights for optimization
 */

/**
 * Check if all required SEO elements are present on the page
 */
export const auditPageSEO = () => {
  const audit = {
    score: 0,
    issues: [],
    recommendations: [],
    passed: []
  };

  // Check title tag
  const title = document.querySelector('title');
  if (title && title.textContent.length > 0) {
    if (title.textContent.length >= 30 && title.textContent.length <= 60) {
      audit.passed.push('Title length is optimal (30-60 characters)');
      audit.score += 15;
    } else {
      audit.issues.push(`Title length is ${title.textContent.length} characters (optimal: 30-60)`);
      audit.recommendations.push('Adjust title length to 30-60 characters for better SEO');
    }
  } else {
    audit.issues.push('Missing or empty title tag');
    audit.recommendations.push('Add a descriptive title tag');
  }

  // Check meta description
  const description = document.querySelector('meta[name="description"]');
  if (description && description.content.length > 0) {
    if (description.content.length >= 120 && description.content.length <= 160) {
      audit.passed.push('Meta description length is optimal (120-160 characters)');
      audit.score += 15;
    } else {
      audit.issues.push(`Meta description length is ${description.content.length} characters (optimal: 120-160)`);
      audit.recommendations.push('Adjust meta description to 120-160 characters');
    }
  } else {
    audit.issues.push('Missing meta description');
    audit.recommendations.push('Add a compelling meta description');
  }

  // Check H1 tags
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length === 1) {
    audit.passed.push('Single H1 tag found');
    audit.score += 10;
  } else if (h1Tags.length === 0) {
    audit.issues.push('No H1 tag found');
    audit.recommendations.push('Add exactly one H1 tag per page');
  } else {
    audit.issues.push(`Multiple H1 tags found (${h1Tags.length})`);
    audit.recommendations.push('Use only one H1 tag per page');
  }

  // Check for structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length > 0) {
    audit.passed.push(`${structuredData.length} structured data schema(s) found`);
    audit.score += 20;
  } else {
    audit.issues.push('No structured data found');
    audit.recommendations.push('Add JSON-LD structured data for better search visibility');
  }

  // Check Open Graph tags
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  if (ogTags.length >= 4) {
    audit.passed.push('Open Graph tags present');
    audit.score += 10;
  } else {
    audit.issues.push('Insufficient Open Graph tags');
    audit.recommendations.push('Add og:title, og:description, og:image, og:url tags');
  }

  // Check images without alt text
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
  if (imagesWithoutAlt.length === 0 && images.length > 0) {
    audit.passed.push('All images have alt text');
    audit.score += 10;
  } else if (imagesWithoutAlt.length > 0) {
    audit.issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    audit.recommendations.push('Add descriptive alt text to all images');
  }

  // Check canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    audit.passed.push('Canonical URL present');
    audit.score += 10;
  } else {
    audit.issues.push('Missing canonical URL');
    audit.recommendations.push('Add canonical URL to prevent duplicate content issues');
  }

  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    audit.passed.push('Viewport meta tag present');
    audit.score += 5;
  } else {
    audit.issues.push('Missing viewport meta tag');
    audit.recommendations.push('Add viewport meta tag for mobile optimization');
  }

  // Check robots meta tag
  const robots = document.querySelector('meta[name="robots"]');
  if (robots) {
    audit.passed.push('Robots meta tag present');
    audit.score += 5;
  }

  return {
    ...audit,
    grade: audit.score >= 90 ? 'A' : audit.score >= 80 ? 'B' : audit.score >= 70 ? 'C' : audit.score >= 60 ? 'D' : 'F'
  };
};

/**
 * Performance monitoring for Core Web Vitals
 */
export const monitorWebVitals = () => {
  const vitals = {
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    fcp: null, // First Contentful Paint
    ttfb: null // Time to First Byte
  };

  // Use Web Vitals library if available
  if (typeof window !== 'undefined' && window.webVitals) {
    window.webVitals.getLCP(metric => vitals.lcp = metric);
    window.webVitals.getFID(metric => vitals.fid = metric);
    window.webVitals.getCLS(metric => vitals.cls = metric);
    window.webVitals.getFCP(metric => vitals.fcp = metric);
    window.webVitals.getTTFB(metric => vitals.ttfb = metric);
  } else {
    // Fallback performance measurements
    if (window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.requestStart;
      }
    }
  }

  return vitals;
};

/**
 * Track SEO-relevant user interactions
 */
export const trackSEOEvents = () => {
  const events = [];

  // Track page views
  events.push({
    type: 'pageview',
    url: window.location.href,
    title: document.title,
    timestamp: Date.now()
  });

  // Track search queries (if search functionality exists)
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
  searchInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        events.push({
          type: 'search',
          query: e.target.value.trim(),
          timestamp: Date.now()
        });
      }
    });
  });

  // Track clicks on important elements
  const importantElements = document.querySelectorAll('a[href], button, [role="button"]');
  importantElements.forEach(element => {
    element.addEventListener('click', (e) => {
      events.push({
        type: 'click',
        element: e.target.tagName.toLowerCase(),
        text: e.target.textContent?.trim().substring(0, 50),
        href: e.target.href || null,
        timestamp: Date.now()
      });
    });
  });

  return {
    getEvents: () => events,
    clearEvents: () => events.length = 0
  };
};

/**
 * Generate SEO report
 */
export const generateSEOReport = () => {
  const audit = auditPageSEO();
  const vitals = monitorWebVitals();
  
  return {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    audit,
    performance: vitals,
    recommendations: [
      ...audit.recommendations,
      'Monitor Core Web Vitals regularly',
      'Test on mobile devices',
      'Check page speed with Google PageSpeed Insights',
      'Validate structured data with Google Rich Results Test'
    ]
  };
};

/**
 * Console logger for SEO insights (development only)
 */
export const logSEOInsights = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const report = generateSEOReport();
  
  console.group('🔍 SEO Audit Report');
  console.log(`Grade: ${report.audit.grade} (${report.audit.score}/100)`);
  
  if (report.audit.passed.length > 0) {
    console.group('✅ Passed Checks');
    report.audit.passed.forEach(item => console.log(`• ${item}`));
    console.groupEnd();
  }
  
  if (report.audit.issues.length > 0) {
    console.group('⚠️ Issues Found');
    report.audit.issues.forEach(item => console.warn(`• ${item}`));
    console.groupEnd();
  }
  
  if (report.audit.recommendations.length > 0) {
    console.group('💡 Recommendations');
    report.audit.recommendations.forEach(item => console.log(`• ${item}`));
    console.groupEnd();
  }
  
  console.groupEnd();
};

/**
 * Initialize SEO monitoring
 */
export const initSEOMonitoring = () => {
  if (typeof window === 'undefined') return;
  
  // Run audit after page load
  window.addEventListener('load', () => {
    setTimeout(logSEOInsights, 1000);
  });
  
  // Track events
  const tracker = trackSEOEvents();
  
  // Expose utilities to window for debugging
  if (process.env.NODE_ENV === 'development') {
    window.seoUtils = {
      audit: auditPageSEO,
      report: generateSEOReport,
      vitals: monitorWebVitals,
      tracker
    };
  }
};

export default {
  auditPageSEO,
  monitorWebVitals,
  trackSEOEvents,
  generateSEOReport,
  logSEOInsights,
  initSEOMonitoring
};
