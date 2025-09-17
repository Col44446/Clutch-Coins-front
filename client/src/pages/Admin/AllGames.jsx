import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Sidebar from './sidebar';

function AllGames() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    setFilteredGames(
      games.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, games]);

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

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Helmet>
        <title>All Games - Game Zone Admin</title>
        <meta name="description" content="Manage and view all games in the Game Zone admin panel." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 flex mt-14">
        <main className="flex-1 pt-16 pb-6 px-4 sm:px-6 lg:pr-8 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-4">
              All Games <span className="text-cyan-500">List</span>
            </h1>
            {error && (
              <div className="bg-red-500/20 text-red-300 p-2 mb-3 rounded" role="alert">
                {error}
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by game title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                aria-label="Search games"
              />
            </div>
            {loading ? (
              <div className="text-white text-center text-sm">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {filteredGames.map((game) => (
                  <motion.li
                    key={game._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded p-3 flex items-center space-x-3"
                  >
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`Cover for ${game.title}`}
                        loading="lazy"
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <h3 className="text-base font-semibold text-white flex-1 truncate">{game.title}</h3>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => navigate(`/admin/game/add/${game._id}`)}
                        whileHover={{ scale: 1.05 }}
                        className="py-1 px-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs"
                        aria-label={`Edit ${game.title}`}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => openDeleteModal(game._id)}
                        whileHover={{ scale: 1.05 }}
                        className="py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-gray-800 p-4 rounded max-w-xs w-full">
                <h2 className="text-lg font-bold text-white mb-3">Confirm Deletion</h2>
                <p className="text-white text-sm mb-4">Are you sure you want to delete this game?</p>
                <div className="flex justify-end space-x-2">
                  <motion.button
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    className="py-1 px-3 bg-gray-600 text-white rounded text-sm"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    whileHover={{ scale: 1.05 }}
                    className="py-1 px-3 bg-red-500 text-white rounded text-sm"
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
        <Sidebar className="fixed right-0 top-0 h-screen z-40 hidden lg:block" />
      </div>
    </>
  );
}

export default AllGames;