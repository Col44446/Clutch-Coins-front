import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PopularGames() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  const scrollRef = useRef(null);

  const [trendingGames, setTrendingGames] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Trending Games
  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/featured/trending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Trending Games Data:", response.data); // Debug log
        setTrendingGames(response.data.data || []);
      } catch (err) {
        console.error("Fetch Trending Games Error:", err.response || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load trending games");
        }
      }
    };
    if (token) fetchTrendingGames();
  }, [token, navigate, API_BASE_URL]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (error) {
    return <div className="text-red-300 text-center py-8">{error}</div>;
  }

  if (!trendingGames.length) {
    return <div className="text-white text-center py-8">No trending games available</div>;
  }

  return (
    <section
      className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 p-6 rounded-xl shadow-lg"
      aria-labelledby="popular-games-title"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          id="popular-games-title"
          className="text-xl sm:text-2xl font-bold text-white tracking-tight"
        >
          Trending Games
        </h2>
        <a
          href="/games"
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          aria-label="Explore more trending games"
        >
          Explore →
        </a>
      </div>

      {/* Cards Row with Arrows */}
      <div className="relative">
        {/* Left Arrow (Desktop Only) */}
        <button
          onClick={scrollLeft}
          className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-30"
          aria-label="Scroll left"
        >
          &lt;
        </button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex flex-row gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {trendingGames.map((game) => (
            <article
              key={game._id}
              onClick={() => navigate(`/games/${game.gameId?._id || game.gameId}`)}
              className="min-w-[140px] sm:min-w-[160px] bg-indigo-950/60 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group relative snap-start cursor-pointer"
            >
              {/* Blue Gradient Light Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

              {/* Image */}
              <div className="relative h-48 sm:h-56">
                <img
                  src={game.displayImage}
                  alt={game.gameId?.title || "Trending Game"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={() => console.error(`Image failed to load: ${game.displayImage}`)}
                />

                {/* Black Overlay with Top Up Button */}
                <div className="absolute inset-0 bg-black/80 text-white p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out flex items-center justify-center z-20">
                  <button className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                    Top Up
                  </button>
                </div>

                {/* Game Name */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-center py-2 px-2 z-20">
                  <h3 className="text-sm font-semibold drop-shadow-lg line-clamp-1">
                    {game.gameId?.title || "Unknown Game"}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right Arrow (Desktop Only) */}
        <button
          onClick={scrollRight}
          className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-30"
          aria-label="Scroll right"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export default PopularGames;