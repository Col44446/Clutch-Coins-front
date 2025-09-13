import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { 
  FaGlobe, FaBolt, FaShieldAlt, FaChevronDown, FaChevronUp, 
  FaDollarSign, FaShoppingCart, FaPaypal, FaSave 
} from 'react-icons/fa';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullOffers, setShowFullOffers] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [userId, setUserId] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/games/${id}`);
        if (response.data.success) {
          setGame(response.data.data);
        } else {
          setError('Failed to fetch game details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch game details');
        console.error('Fetch error:', err); // Debug: Log error
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, API_BASE_URL]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  const toggleOffers = () => {
    setShowFullOffers(!showFullOffers);
  };

  const handleBuyNow = () => {
    alert('Buy Now clicked! (Dummy functionality)');
  };

  const handleBuyWithPaypal = () => {
    alert('Buy with PayPal clicked! (Dummy functionality)');
  };

  const handleSaveForFuture = () => {
    alert('Save for future purchase clicked! (Dummy functionality)');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-t-cyan-500 border-gray-700 rounded-full"
        />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-sm">
        {error || 'Game not found'}
      </div>
    );
  }

  // Use game.image directly as in AllGames
  const imageUrl = game.image || 'https://via.placeholder.com/200x300?text=Game+Image';

  return (
    <>
      <Helmet>
        <title>{game.title} - Game Zone</title>
        <meta name="description" content={game.description.substring(0, 160) + '...'} />
        <meta name="keywords" content={`${game.title}, ${game.publisher}, video games, buy game`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={game.title} />
        <meta property="og:description" content={game.description.substring(0, 160) + '...'} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-16 md:pt-34 px-4 md:px-6 font-sans"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mt-10"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              <img
                src={imageUrl}
                alt={game.title}
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl); // Debug: Log image error
                  e.target.src = 'https://via.placeholder.com/200x300?text=Game+Image';
                }}
                className="w-full md:w-25 h-40 object-cover rounded-xl shadow-lg border-2 border-cyan-500 transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  {game.title}
                </h1>
                <p className="text-lg text-gray-300 font-medium">By {game.publisher}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaGlobe className="text-cyan-500 text-base" />
                <span className="text-sm">Global</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaBolt className="text-cyan-500 text-base" />
                <span className="text-sm">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaShieldAlt className="text-cyan-500 text-base" />
                <span className="text-sm">Official Distribution</span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-gray-200">
              {game.description}
            </p>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 m-5"
          >
            {/* Offers Section */}
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-1">
                <FaShoppingCart className="text-cyan-500 text-base" />
                Offers
              </h2>
              <AnimatePresence>
                {!showFullOffers ? (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-300 mb-2">
                      {game.offers.length > 0 
                        ? `${game.offers[0].key}: ${game.offers[0].value}...`
                        : 'No offers available'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    {game.offers.map((offer, index) => (
                      <li key={index} className="bg-cyan-900 p-1 rounded-lg text-xs">
                        <strong>{offer.key}:</strong> {offer.value}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {game.offers.length > 0 && (
                <button
                  onClick={toggleOffers}
                  className="mt-2 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-xs"
                >
                  {showFullOffers ? 'Hide Details' : 'View Details'}
                  {showFullOffers ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
              )}
            </div>

            {/* Select Plan Section */}
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-1">
                <FaDollarSign className="text-cyan-500 text-base" />
                Select Plan
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.currencies.map((curr, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleCurrencySelect(curr)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 min-w-[100px] max-w-[150px] flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      selectedCurrency?.name === curr.name ? 'bg-cyan-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={game.title}
                      onError={(e) => {
                        console.error('Currency image failed to load:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/32?text=Game';
                      }}
                      className="w-8 h-8 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold">{curr.name}</p>
                      <p className="text-xs text-cyan-400">${curr.amount.toFixed(2)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dummy Buy Section */}
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2">Purchase</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs mb-1">Enter User ID</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Your User ID"
                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>Item:</span>
                  <span className="font-semibold">{game.title} ({selectedCurrency?.name || 'N/A'})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Total:</span>
                  <span className="font-semibold text-cyan-400">
                    ${selectedCurrency ? selectedCurrency.amount.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Discount:</span>
                  <span className="text-green-500">0% (Dummy)</span>
                </div>
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Buy Now
                </motion.button>
                <motion.button
                  onClick={handleSaveForFuture}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-1.5 bg-gray-700 text-cyan-400 font-semibold rounded-lg flex items-center justify-center gap-1 text-xs"
                >
                  <FaSave className="text-sm" /> Save for Future Purchase
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default GameDetails;