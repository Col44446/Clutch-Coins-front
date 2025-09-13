import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pic1 from '../../assets/temp-11.jpg'
import pic2 from '../../assets/temp-12.jpg';
import pic3 from '../../assets/temp-13.jpg';
import pic4 from '../../assets/temp-14.jpg';
import pic5 from '../../assets/temp-15.jpg';
import pic6 from '../../assets/temp-16.jpg';
import pic7 from '../../assets/temp-17.jpg';


function MainCard() {
  const navigate = useNavigate();
  
  const images = [
    { src: pic1, alt: 'Speed Racing game', gameId: 'speed-racing' },
    { src: pic2, alt: 'Adventure World game', gameId: 'adventure-world' },
    { src: pic3, alt: 'Puzzle Master game', gameId: 'puzzle-master' },
    { src: pic4, alt: 'Strategy Empire game', gameId: 'strategy-empire' },
    { src: pic5, alt: 'Fantasy RPG game', gameId: 'fantasy-rpg' },
    { src: pic6, alt: 'Sports Champions game', gameId: 'sports-champions' },
    { src: pic7, alt: 'Action Hero game', gameId: 'action-hero' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-slide with faster transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500); // Faster transition (2.5s instead of 4s)
    return () => clearInterval(interval);
  }, [images.length]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-2 sm:px-4">
      {/* Carousel container */}
      <div className="mt-20 sm:mt-40 relative w-full max-w-7xl h-56 sm:h-96 overflow-hidden rounded-xl sm:rounded-3xl">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full z-10 transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full z-10 transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {images.map((img, index) => {
          let position = 'translate-x-full opacity-0'; // default hidden right
          if (index === currentIndex) {
            position = 'translate-x-0 opacity-100'; // active
          } else if (index === (currentIndex - 1 + images.length) % images.length) {
            position = '-translate-x-full opacity-0'; // gone left
          }

          return (
            <img
              key={index}
              src={img.src}
              alt={img.alt}
              onClick={() => handleImageClick(img.gameId)}
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 transform transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 ${position}`}
              style={{ aspectRatio: '9/16' }}
            />
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="flex space-x-2 mt-4 sm:mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 hover:bg-sky-300 ${index === currentIndex ? 'bg-sky-400 w-6 sm:w-8' : 'bg-gray-500 w-3 sm:w-4'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Keyboard navigation hint */}
      <p className="text-xs text-gray-400 mt-2 opacity-75">
        Use ← → arrow keys to navigate
      </p>
    </section>
  );
}

export default MainCard;
