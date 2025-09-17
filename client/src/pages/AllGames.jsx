import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

function AllGames() {
  const [games, setGames] = useState([]);
  const [groupedGames, setGroupedGames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/games`);
        setGames(response.data.data);
      } catch (err) {
        setError('Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [API_BASE_URL]);

  useEffect(() => {
    const filtered = games
      .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title));
    const groups = {};
    filtered.forEach((game) => {
      const firstLetter = game.title[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(game);
    });
    setGroupedGames(groups);
  }, [games, searchTerm]);

  const letters = Object.keys(groupedGames).sort();

  useEffect(() => {
    const handleScroll = () => {
      let curr = letters[0] || '';
      for (let l of letters) {
        const el = sectionRefs.current[l];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            curr = l;
          } else {
            break;
          }
        }
      }
      setCurrentLetter(curr);
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [letters]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToLetter = (letter) => {
    const el = sectionRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOHead 
        title="All Games - ClutchCoins Gaming Hub"
        description="Browse our complete collection of games for instant recharge and top-up. Find PUBG, Valorant, Roblox, Minecraft and more games sorted alphabetically."
        keywords="all games, gaming recharge, PUBG UC, Valorant points, Roblox Robux, game top-up, mobile games, PC games, gaming credits"
        url="https://clutchcoins.com/games"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "ClutchCoins Games Collection",
          "description": "Complete collection of games available for recharge and top-up",
          "itemListElement": games.map((game, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "VideoGame",
              "name": game.title,
              "image": game.image || '',
              "publisher": {
                "@type": "Organization",
                "name": game.publisher || 'Unknown Publisher'
              },
              "url": `https://clutchcoins.com/games/${game._id}`
            }
          }))
        }}
      />
      <div className="min-h-screen bg-gray-900 text-white">
        <main className=" container mx-auto p-3 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm"
                aria-label="Search games"
              />
            </div>
            <h1 className=" pt-10 text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
              All Games
            </h1>
            {error && (
              <div className="bg-red-500 text-white p-2 mb-3 rounded-md text-center text-sm" role="alert">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center text-base">Loading...</div>
            ) : (
              <>
                <div className="relative">
                  {letters.map((letter) => (
                    <div
                      key={letter}
                      id={`letter-${letter}`}
                      ref={(el) => (sectionRefs.current[letter] = el)}
                      className="mb-6"
                    >
                      <h2 className="text-xl font-semibold mb-3 sticky top-0 bg-gray-900 py-1 z-10 text-cyan-400">
                        {letter}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {groupedGames[letter].map((game) => (
                          <motion.article
                            key={game._id}
                            onClick={() => navigate(`/games/${game._id}`)}
                            whileHover={{ scale: 1.03, boxShadow: '0 6px 12px rgba(0, 255, 255, 0.2)' }}
                            transition={{ duration: 0.2 }}
                            className="bg-indigo-950/70 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-white/10 overflow-hidden group relative cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <div className="relative h-40 sm:h-48">
                              {game.image && (
                                <img
                                  src={game.image}
                                  alt={`${game.title} cover`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center text-center z-20">
                                <div>
                                  <h3 className="text-base font-semibold mb-1">{game.title}</h3>
                                  <p className="text-xs">{game.publisher || 'Unknown'}</p>
                                </div>
                              </div>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-30 transition-all duration-300">
                                <button className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full shadow hover:shadow-md hover:scale-105 transition-transform duration-200">
                                  Top Up
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-center py-1 text-xs font-semibold z-20">
                                {game.title}
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <aside className="fixed right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 p-1 rounded-md shadow-md z-20 max-h-[50vh] overflow-y-auto">
                  <ul className="space-y-0.5 text-center">
                    {letters.map((letter) => (
                      <li key={letter}>
                        <button
                          onClick={() => scrollToLetter(letter)}
                          className={`text-base font-semibold ${
                            currentLetter === letter ? 'text-cyan-500' : 'text-white'
                          } hover:text-cyan-300 transition-colors`}
                        >
                          {letter}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
              </>
            )}
          </motion.div>
          {showTopBtn && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed bottom-6 right-6 bg-cyan-500 text-white p-2 rounded-full shadow-md hover:bg-cyan-600 transition-all text-sm"
              aria-label="Scroll to top"
            >
              ↑
            </motion.button>
          )}
        </main>
      </div>
    </>
  );
}

export default AllGames;