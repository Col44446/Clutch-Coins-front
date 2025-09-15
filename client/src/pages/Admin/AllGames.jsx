import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Sidebar from './sidebar';

function AllGames() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed by default on mobile
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all games
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/games`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data.data);
        setFilteredGames(response.data.data);
      } catch (err) {
        setError('Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [token, API_BASE_URL]);

  // Handle search
  useEffect(() => {
    setFilteredGames(
      games.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, games]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/games/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(games.filter((game) => game._id !== deleteId));
      setFilteredGames(filteredGames.filter((game) => game._id !== deleteId));
      setShowModal(false);
    } catch (err) {
      setError('Failed to delete game');
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  return (
    <>
      <Helmet>
        <title>All Games - Game Zone Admin</title>
        <meta name="description" content="Manage and view all games in the Game Zone admin panel. Edit or delete games easily." />
        <meta name="keywords" content="game zone, admin panel, manage games, game list" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="All Games - Game Zone Admin" />
        <meta property="og:description" content="View and manage all games in the Game Zone admin panel." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": games.map((game, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Game",
                "name": game.title,
                "image": game.image || '',
              },
            })),
          })}
        </script>
      </Helmet>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
          } mt-16 sm:mt-20 md:mt-24`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              All Games <span className="text-cyan-500">List</span>
            </h1>
            {error && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg" role="alert">
                {error}
              </div>
            )}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by game title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                aria-label="Search games"
              />
            </div>
            {loading ? (
              <div className="text-white text-center text-sm sm:text-base">Loading...</div>
            ) : (
              <ul className="space-y-3">
                {filteredGames.map((game) => (
                  <motion.li
                    key={game._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
                  >
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`Cover for ${game.title}`}
                        loading="lazy"
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                      />
                    )}
                    <h3 className="text-lg sm:text-xl font-semibold text-white flex-1 truncate">{game.title}</h3>
                    <div className="flex space-x-2 sm:space-x-4">
                      <motion.button
                        onClick={() => navigate(`/admin/game/add`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-2 px-3 sm:px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg text-xs sm:text-sm"
                        aria-label={`Edit ${game.title}`}
                      >
                        Update
                      </motion.button>
                      <motion.button
                        onClick={() => openDeleteModal(game._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-2 px-3 sm:px-4 bg-red-500 text-white font-bold rounded-lg text-xs sm:text-sm"
                        aria-label={`Delete ${game.title}`}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Confirm Deletion</h2>
                <p className="text-white mb-6 text-sm sm:text-base">Are you sure you want to delete this game?</p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-4 bg-gray-600 text-white rounded-lg text-sm sm:text-base"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg text-sm sm:text-base"
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}

export default AllGames;