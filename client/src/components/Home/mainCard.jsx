import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MainCard() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [heroGames, setHeroGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch Hero Games with optimized image URLs (e.g., WebP or smaller sizes)
  useEffect(() => {
    const fetchHeroGames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/featured/hero`);
        const games = response.data.data || [];
        if (!games.length) {
          setError("No featured games available");
        } else {
          // Assume API provides optimized image URLs (e.g., WebP or resized)
          setHeroGames(
            games.map((game) => ({
              ...game,
              displayImage: game.displayImage, // Primary image URL
              displayImageWebP: game.displayImageWebP || game.displayImage, // WebP format if available
              displayImageSmall: game.displayImageSmall || game.displayImage, // Smaller image for mobile
            }))
          );
        }
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError("Failed to load featured games");
      }
    };
    fetchHeroGames();
  }, [API_BASE_URL]);

  // Auto-slide for carousel
  useEffect(() => {
    if (heroGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroGames.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroGames.length]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length);
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % heroGames.length);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [heroGames.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % heroGames.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleImageClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroGames.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Loading and error states
  if (!heroGames.length && !error) {
    return (
      <div className="text-white text-center py-8" role="status">
        Loading featured games...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-300 text-center py-8" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section
      className="flex flex-col mt-20 justify-center items-center bg-gray-900 text-white px-4 py-8"
      aria-label="Featured Games Carousel"
    >
      <h2 className="sr-only">Featured Games</h2> {/* Screen-reader-only heading for SEO */}
      <div
        className="relative w-full max-w-6xl h-40 sm:h-56 md:h-72 lg:h-80 overflow-hidden rounded-xl shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured games slideshow"
      >
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 sm:p-4 rounded-full z-10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Previous featured game"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 sm:p-4 rounded-full z-10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Next featured game"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {heroGames.map((game, index) => {
          let position = "translate-x-full opacity-0";
          if (index === currentIndex) {
            position = "translate-x-0 opacity-100";
          } else if (index === (currentIndex - 1 + heroGames.length) % heroGames.length) {
            position = "-translate-x-full opacity-0";
          }
          return (
            <picture key={game._id} className="absolute top-0 left-0 w-full h-full">
              <source
                srcSet={game.displayImageWebP}
                type="image/webp"
                media="(min-width: 768px)"
                sizes="100vw"
              />
              <source
                srcSet={game.displayImageSmall}
                type="image/jpeg"
                media="(max-width: 767px)"
                sizes="100vw"
              />
              <img
                src={game.displayImage}
                alt={game.gameId?.title ? `Featured game: ${game.gameId.title}` : "Featured game image"}
                onClick={() => handleImageClick(game.gameId?._id || game.gameId)}
                onError={(e) => {
                  console.error(`Image failed to load: ${game.displayImage}`);
                  e.target.src = "/fallback-image.jpg"; // Fallback image
                }}
                loading={index === currentIndex ? "eager" : "lazy"}
                className={`w-full h-full object-cover rounded-xl shadow-2xl border border-white/20 transform transition-all duration-500 ease-in-out cursor-pointer hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400 ${position}`}
                role="img"
                aria-hidden={index !== currentIndex}
                decoding="async" // Optimize image decoding
              />
            </picture>
          );
        })}
      </div>
      <div className="flex space-x-2 mt-6" role="tablist" aria-label="Carousel navigation">
        {heroGames.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              index === currentIndex ? "bg-sky-400 w-8" : "bg-gray-500 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentIndex}
            role="tab"
          ></button>
        ))}
      </div>
    </section>
  );
}

export default MainCard;