import React, { useState, useEffect, useRef } from 'react';

const CustomScrollbar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const updateScrollbar = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      // Calculate thumb height based on viewport vs total content ratio
      const viewportHeight = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;
      const thumbHeightPercentage = Math.max((viewportHeight / contentHeight) * 100, 8);
      
      setScrollPercentage(percentage);
      setThumbHeight(thumbHeightPercentage);
      setIsVisible(contentHeight > viewportHeight + 10); // Add small buffer
    };

    const handleScroll = () => {
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only update if scroll position actually changed
        if (Math.abs(currentScrollTop - lastScrollTop.current) > 1) {
          lastScrollTop.current = currentScrollTop;
          updateScrollbar();
        }
      });
    };

    const handleResize = () => {
      // Debounce resize events
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateScrollbar);
    };

    // Initial calculation
    updateScrollbar();

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleScrollbarClick = (e) => {
    e.preventDefault();
    const scrollbarRect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - scrollbarRect.top;
    const scrollbarHeight = scrollbarRect.height;
    const clickPercentage = (clickY / scrollbarHeight) * 100;
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (clickPercentage / 100) * maxScroll;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleThumbDrag = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startScrollTop = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollbarHeight = window.innerHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollRatio = deltaY / scrollbarHeight;
      const newScrollTop = startScrollTop + (scrollRatio * maxScroll);
      
      // Use immediate scrolling for drag operations
      window.scrollTo({
        top: Math.max(0, Math.min(maxScroll, newScrollTop)),
        behavior: 'auto'
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
  };

  if (!isVisible) return null;

  const thumbTop = Math.max(0, Math.min(100 - thumbHeight, (scrollPercentage / 100) * (100 - thumbHeight)));

  return (
    <div 
      className="custom-scrollbar"
      onClick={handleScrollbarClick}
      style={{ zIndex: 9999 }}
    >
      <div
        className="custom-scrollbar-thumb"
        style={{
          height: `${thumbHeight}%`,
          top: `${thumbTop}%`,
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'transform, top' // Optimize for animations
        }}
        onMouseDown={handleThumbDrag}
      />
    </div>
  );
};

export default CustomScrollbar;
