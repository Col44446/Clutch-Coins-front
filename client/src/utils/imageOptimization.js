/**
 * Image optimization utilities for ClutchCoins app
 * Provides lazy loading, responsive images, and performance optimizations
 */
import { useState, useEffect } from 'react';

// Lazy loading observer for images
export const createImageObserver = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
        }
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};

// Initialize lazy loading for images
export const initLazyLoading = () => {
  const observer = createImageObserver();
  
  if (!observer) return;
  
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    img.classList.add('lazy-loading');
    observer.observe(img);
  });
};

// Responsive image srcset generator
export const generateSrcSet = (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920]) => {
  return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
};

// Image preloader for critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload multiple images
export const preloadImages = async (imageSources) => {
  try {
    const promises = imageSources.map(src => preloadImage(src));
    return await Promise.all(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
    return [];
  }
};

// WebP support detection
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Get optimized image format
export const getOptimizedImageUrl = (baseUrl, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = supportsWebP() ? 'webp' : 'jpg'
  } = options;
  
  let url = baseUrl;
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 80) params.append('q', quality);
  if (format !== 'jpg') params.append('f', format);
  
  const queryString = params.toString();
  if (queryString) {
    url += (url.includes('?') ? '&' : '?') + queryString;
  }
  
  return url;
};

// Image loading states
export const ImageLoadingStates = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

// React hook for image loading state
export const useImageLoading = (src) => {
  const [loadingState, setLoadingState] = useState(ImageLoadingStates.LOADING);
  
  useEffect(() => {
    if (!src) return;
    
    setLoadingState(ImageLoadingStates.LOADING);
    
    const img = new Image();
    img.onload = () => setLoadingState(ImageLoadingStates.LOADED);
    img.onerror = () => setLoadingState(ImageLoadingStates.ERROR);
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  return loadingState;
};
