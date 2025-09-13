import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';

// Static games data matching homepage dummy games
const staticGames = [
  {
    _id: 'speed-racing',
    title: 'Speed Racing',
    publisher: 'Velocity Studios',
    image: '/src/assets/temp-11.jpg',
    pageName: 'speed-racing'
  },
  {
    _id: 'adventure-world',
    title: 'Adventure World',
    publisher: 'Quest Games',
    image: '/src/assets/temp-12.jpg',
    pageName: 'adventure-world'
  },
  {
    _id: 'puzzle-master',
    title: 'Puzzle Master',
    publisher: 'Brain Games Inc',
    image: '/src/assets/temp-13.jpg',
    pageName: 'puzzle-master'
  },
  {
    _id: 'strategy-empire',
    title: 'Strategy Empire',
    publisher: 'Empire Studios',
    image: '/src/assets/temp-14.jpg',
    pageName: 'strategy-empire'
  },
  {
    _id: 'fantasy-rpg',
    title: 'Fantasy RPG',
    publisher: 'Mythic Games',
    image: '/src/assets/temp-15.jpg',
    pageName: 'fantasy-rpg'
  },
  {
    _id: 'sports-champions',
    title: 'Sports Champions',
    publisher: 'Athletic Games',
    image: '/src/assets/temp-16.jpg',
    pageName: 'sports-champions'
  },
  {
    _id: 'action-hero',
    title: 'Action Hero',
    publisher: 'Hero Studios',
    image: '/src/assets/temp-17.jpg',
    pageName: 'action-hero'
  },
  {
    _id: 'warrior-quest',
    title: 'Warrior Quest',
    publisher: 'Epic Games Studio',
    image: '/src/assets/temp-18.png',
    pageName: 'warrior-quest'
  },
  {
    _id: 'elite-shooter',
    title: 'Elite Shooter',
    publisher: 'Combat Studios',
    image: '/src/assets/temp-19.png',
    pageName: 'elite-shooter'
  },
  {
    _id: 'life-simulator',
    title: 'Life Simulator',
    publisher: 'Reality Games',
    image: '/src/assets/temp-20.png',
    pageName: 'life-simulator'
  },
  {
    _id: 'horror-nights',
    title: 'Horror Nights',
    publisher: 'Nightmare Studios',
    image: '/src/assets/temp-21.png',
    pageName: 'horror-nights'
  },
  {
    _id: 'survival-island',
    title: 'Survival Island',
    publisher: 'Wilderness Games',
    image: '/src/assets/temp-22.png',
    pageName: 'survival-island'
  },
  {
    _id: 'battlegrounds-mobile',
    title: 'Battlegrounds Mobile India',
    publisher: 'Krafton',
    image: '/src/assets/temp-28.jpg',
    pageName: 'battlegrounds-mobile'
  },
  {
    _id: 'valorant-tactical',
    title: 'Valorant',
    publisher: 'Riot Games',
    image: '/src/assets/temp-29.jpg',
    pageName: 'valorant-tactical'
  },
  {
    _id: 'roblox-platform',
    title: 'Roblox',
    publisher: 'Roblox Corporation',
    image: '/src/assets/temp-30.jpg',
    pageName: 'roblox-platform'
  },
  {
    _id: 'minecraft-sandbox',
    title: 'Minecraft',
    publisher: 'Mojang Studios',
    image: '/src/assets/temp-31.jpg',
    pageName: 'minecraft-sandbox'
  },
  {
    _id: 'cod-mobile',
    title: 'Call of Duty Mobile',
    publisher: 'Activision',
    image: '/src/assets/temp-32.jpg',
    pageName: 'cod-mobile'
  }
];

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
        // Combine API games with static games, prioritizing static games
        const apiGames = response.data.data || [];
        const combinedGames = [...staticGames, ...apiGames.filter(apiGame => 
          !staticGames.some(staticGame => staticGame._id === apiGame._id)
        )];
        setGames(combinedGames);
      } catch (err) {
        // If API fails, use only static games
        setGames(staticGames);
        setError('Using offline game library');
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
        if (el && el.getBoundingClientRect().top <= 100) {
          curr = l;
        } else {
          break;
        }
      }
      setCurrentLetter(curr);
      setShowTopBtn(window.scrollY > 300);
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
      <Helmet>
        <title>All Products - ClutchCoins</title>
        <meta name="description" content="Explore all gaming products in ClutchCoins, sorted alphabetically from A to Z. Find your favorite games by title." />
        <meta name="keywords" content="games, gaming products, clutchcoins, all products, alphabetic order" />
        <meta property="og:title" content="All Products - ClutchCoins" />
        <meta property="og:description" content="Browse our collection of gaming products sorted alphabetically with vibrant and interactive cards." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white">
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by product title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                aria-label="Search products"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center pt-10 text-white">
              All Products 
            </h1>
            {error && (
              <div className="bg-orange-500 text-white p-3 mb-4 rounded-lg text-center" role="alert">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center text-lg">Loading...</div>
            ) : (
              <>
                <div className="relative">
                  {letters.map((letter) => (
                    <div
                      key={letter}
                      id={`letter-${letter}`}
                      ref={(el) => (sectionRefs.current[letter] = el)}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-semibold mb-4 sticky top-0 bg-gray-900 py-2 z-10 text-start text-cyan-400 ">
                        {letter}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {groupedGames[letter].map((game) => (
                          <motion.article
                            key={game._id}
                            onClick={() => navigate(`/game/${game._id}`)}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 255, 255, 0.3)' }}
                            transition={{ duration: 0.3 }}
                            className="min-w-[160px] sm:min-w-[160px]  bg-indigo-950/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden group relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-blue-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10"></div>
                            <div className="relative h-56 sm:h-64">
                              {game.image && (
                                <img
                                  src={game.image}
                                  alt={`${game.title} - Game Cover`}
                                  className="w-full h-full object-contain bg-gray-800 transition-transform duration-500 ease-in-out group-hover:scale-110"
                                  loading="lazy"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/80 text-white p-3 text-[11px] sm:text-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out flex items-center justify-center text-center z-20">
                                <div>
                                  <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                                  <p className="text-sm">{game.publisher || 'Unknown Publisher'}</p>
                                </div>
                              </div>
                              <div className="absolute mb-7 bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-30 transition-all duration-500">
                                <button className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                                  Top Up
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-black/90 to-black/70 text-white text-center py-2 text-xs sm:text-sm font-bold drop-shadow-sm z-20">
                                {game.title}
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <aside className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-lg shadow-lg z-20 max-h-[60vh] overflow-y-auto">
                  <ul className="space-y-1 text-center">
                    {letters.map((letter) => (
                      <li key={letter}>
                        <button
                          onClick={() => scrollToLetter(letter)}
                          className={`text-lg font-bold ${
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed bottom-8 right-8 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-all"
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