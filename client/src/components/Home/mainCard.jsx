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

  // Fetch Hero Games
  useEffect(() => {
    const fetchHeroGames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/featured/hero`);
        const games = response.data.data || [];
        if (!games.length) {
          setError("No featured games available");
        } else {
          setHeroGames(
            games.map((game) => ({
              ...game,
              displayImage: game.displayImage,
              displayImageWebP: game.displayImageWebP || game.displayImage,
              displayImageSmall: game.displayImageSmall || game.displayImage,
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

  // Auto-slide
  useEffect(() => {
    if (heroGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroGames.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroGames.length]);

  // Keyboard navigation
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

  // Touch swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
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

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % heroGames.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length);
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Handle image click for navigation
  const handleImageClick = (gameId) => {
    if (!gameId) {
      console.error("Invalid gameId:", gameId);
      setError("Cannot navigate: Invalid game ID");
      return;
    }
    console.log("Navigating to:", `/games/${gameId}`);
    navigate(`/games/${gameId}`);
  };

  // Loading and error states
  if (!heroGames.length && !error) {
    return <div className="text-white text-center py-4" role="status">Loading featured games...</div>;
  }
  if (error) {
    return <div className="text-red-300 text-center py-4" role="alert">{error}</div>;
  }

  return (
    <section
      className="mt-20 flex flex-col mt-4 justify-center items-center bg-gray-900 text-white px-4 py-4"
      aria-label="Featured Games Carousel"
    >
      <h2 className="sr-only">Featured Games</h2>
      <div
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[16/9] overflow-hidden rounded-xl shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured games slideshow"
      >
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Previous featured game"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Next featured game"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slides */}
        {heroGames.map((game, index) => {
          let position = "translate-x-full opacity-0";
          if (index === currentIndex) position = "translate-x-0 opacity-100";
          else if (index === (currentIndex - 1 + heroGames.length) % heroGames.length) position = "-translate-x-full opacity-0";

          const gameId = typeof game.gameId === "object" ? game.gameId?._id : game.gameId;

          return (
            <picture
              key={game._id}
              className={`absolute top-0 left-0 w-full h-full transform transition-all duration-500 ease-in-out ${position}`}
            >
              <source srcSet={game.displayImageWebP} type="image/webp" media="(min-width: 768px)" sizes="100vw" />
              <source srcSet={game.displayImageSmall} type="image/jpeg" media="(max-width: 767px)" sizes="100vw" />
              <img
                src={game.displayImage}
                alt={game.gameId?.title ? `Featured game: ${game.gameId.title}` : "Featured game image"}
                onClick={() => handleImageClick(gameId)}
                onError={(e) => {
                  console.error(`Image failed to load: ${game.displayImage}`);
                  e.target.src = "/fallback-image.jpg";
                }}
                loading={index === currentIndex ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl border border-white/20 cursor-pointer hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400"
                role="img"
                aria-hidden={index !== currentIndex}
                decoding="async"
              />
            </picture>
          );
        })}
      </div>

      {/* Dot Navigation */}
      <div className="flex space-x-2 mt-3" role="tablist" aria-label="Carousel navigation">
        {heroGames.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              index === currentIndex ? "bg-sky-400 w-6" : "bg-gray-500 w-2"
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
