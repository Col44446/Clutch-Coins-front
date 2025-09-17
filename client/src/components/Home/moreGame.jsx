import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameCard = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await axios.get(`${API_BASE_URL}/games`, { headers });
        console.log("Games Data:", response.data); // Debug log
        setGames(response.data.data || []);
      } catch (err) {
        console.error("Fetch Games Error:", err.response || err.message);
        if (err.response?.status === 401 && token) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load games");
        }
      }
    };
    fetchGames();
  }, [token, navigate, API_BASE_URL]);

  // Handle card navigation
  const handleCardClick = (gameId) => {
    if (!gameId) {
      console.error("Invalid gameId:", gameId);
      setError("Cannot navigate: Invalid game ID");
      return;
    }
    console.log("Navigating to:", `/games/${gameId}`);
    navigate(`/games/${gameId}`);
  };

  // Handle View More navigation
  const handleViewMore = () => {
    console.log("Navigating to: /games");
    navigate("/games");
  };

  if (error) {
    return <div className="text-red-300 text-center py-4">{error}</div>;
  }

  if (!games.length) {
    return <div className="text-white text-center py-4">No games available</div>;
  }

  return (
    <section className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 py-4 px-4 relative overflow-hidden">
      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-4">
        More Games
      </h1>
      <div className="bg-gray-900 p-4 rounded-xl relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <article
              key={game._id || index}
              onClick={() => handleCardClick(game._id)}
              className="bg-indigo-950/60 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group relative cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full aspect-[9/16]">
                <img
                  src={game.image}
                  alt={`${game.title} game cover`}
                  className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Image failed to load: ${game.image}`);
                    e.target.src = "/fallback-image.jpg";
                  }}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-center py-1 px-2">
                  <h2 className="text-xs font-semibold line-clamp-1">
                    {game.title || "Unknown Game"}
                  </h2>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleViewMore}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-800 text-white font-medium text-xs rounded-full shadow-lg hover:from-cyan-500 hover:to-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default GameCard;