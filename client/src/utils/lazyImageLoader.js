/**
 * Advanced Lazy Image Loader with WebP Support and Performance Optimization
 * This utility provides intelligent image loading with modern format support
 */

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
})();

/**
 * Convert image URL to WebP if supported and available
 */
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl) return '';
  
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // If it's already a WebP or if WebP is not supported, return original
  if (originalUrl.includes('.webp') || !supportsWebP) {
    return originalUrl;
  }
  
  // For external CDN services, you might want to add transformation parameters
  // This is a placeholder for CDN-specific optimizations
  if (originalUrl.includes('cloudinary') || originalUrl.includes('imagekit')) {
    // Add CDN-specific transformations here
    return originalUrl;
  }
  
  return originalUrl;
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    // Set attributes for better performance
    if (options.crossOrigin) img.crossOrigin = options.crossOrigin;
    if (options.referrerPolicy) img.referrerPolicy = options.referrerPolicy;
    
    img.src = getOptimizedImageUrl(src, options);
  });
};

/**
 * Batch preload multiple images
 */
export const preloadImages = async (imageUrls, options = {}) => {
  const { concurrent = 3 } = options;
  const results = [];
  
  for (let i = 0; i < imageUrls.length; i += concurrent) {
    const batch = imageUrls.slice(i, i + concurrent);
    const batchPromises = batch.map(url => 
      preloadImage(url, options).catch(error => ({ error, url }))
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * Intersection Observer for lazy loading
 */
export class LazyImageObserver {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
    
    this.imageCache = new Map();
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }
  
  async loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    try {
      // Check cache first
      if (this.imageCache.has(src)) {
        img.src = src;
        img.classList.add('loaded');
        return;
      }
      
      // Add loading state
      img.classList.add('loading');
      
      // Preload the image
      await preloadImage(src);
      
      // Set the source and update classes
      img.src = src;
      img.classList.remove('loading');
      img.classList.add('loaded');
      
      // Cache the loaded image
      this.imageCache.set(src, true);
      
    } catch (error) {
      console.warn('Failed to load image:', src, error);
      img.classList.remove('loading');
      img.classList.add('error');
      
      // Set fallback image if provided
      if (img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    }
  }
  
  observe(img) {
    this.observer.observe(img);
  }
  
  unobserve(img) {
    this.observer.unobserve(img);
  }
  
  disconnect() {
    this.observer.disconnect();
    this.imageCache.clear();
  }
}

/**
 * React Hook for lazy image loading
 */
export const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const imgRef = React.useRef();
  
  React.useEffect(() => {
    if (!src || !imgRef.current) return;
    
    const observer = new LazyImageObserver({
      ...options,
      onLoad: () => {
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
      onStart: () => {
        setIsLoading(true);
      }
    });
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, [src, options]);
  
  return { imgRef, isLoaded, isLoading, error };
};

/**
 * Generate responsive image srcSet
 */
export const generateSrcSet = (baseUrl, sizes = [320, 640, 960, 1280]) => {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Default export with all utilities
 */
export default {
  supportsWebP,
  getOptimizedImageUrl,
  preloadImage,
  preloadImages,
  LazyImageObserver,
  useLazyImage,
  generateSrcSet
};
