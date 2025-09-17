import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized lazy loading image component with performance enhancements
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x600/1f2937/9ca3af?text=Loading...',
  fallback = 'https://via.placeholder.com/400x600/1f2937/ef4444?text=Error',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (!src || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !hasError) {
            setIsLoading(true);
            
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              setIsLoading(false);
              observer.unobserve(entry.target);
            };
            img.onerror = () => {
              setImageSrc(fallback);
              setHasError(true);
              setIsLoading(false);
              observer.unobserve(entry.target);
            };
            img.src = src;
          }
        });
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, isLoaded, hasError, fallback]);

  return (
    <div className="relative">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-all duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        } ${isLoading ? 'animate-pulse' : ''} ${className}`}
        {...props}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
        </div>
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-20">
          <div className="text-red-400 text-xs text-center p-2">
            Failed to load image
          </div>
        </div>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  fallback: PropTypes.string,
};

export default LazyImage;
