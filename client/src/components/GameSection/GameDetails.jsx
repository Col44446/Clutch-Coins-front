import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  FaGlobe, FaBolt, FaShieldAlt, FaDollarSign, FaShoppingCart,
  FaChevronDown, FaChevronUp, FaCheckCircle, FaExclamationTriangle, FaTimes
} from 'react-icons/fa';

const GameDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullOffers, setShowFullOffers] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' });
  const [addingToCart, setAddingToCart] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const toggleOffers = useCallback(() => setShowFullOffers(!showFullOffers), [showFullOffers]);

  const handleCurrencySelect = useCallback((currency) => setSelectedCurrency(currency), []);

  const showPopup = useCallback((type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => setPopup({ show: false, type: '', title: '', message: '' }), 3000);
  }, []);

  const closePopup = useCallback(() => setPopup({ show: false, type: '', title: '', message: '' }), []);

  const handlePurchase = useCallback(async () => {
    if (!selectedCurrency) {
      showPopup('error', 'Selection Required', 'Please select a currency package');
      return;
    }
    if (!userId) {
      showPopup('error', 'User ID Required', 'Please enter your User ID');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      showPopup('error', 'Login Required', 'Please login to proceed');
      return;
    }
    navigate('/payment', {
      state: {
        orderDetails: {
          gameName: game.title,
          packageName: selectedCurrency.name,
          amount: selectedCurrency.amount * quantity,
          quantity,
          gameId: game._id || id,
          currencyName: selectedCurrency.name,
          gameUserId: userId
        }
      }
    });
  }, [selectedCurrency, game, quantity, id, navigate, showPopup, userId]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedCurrency) {
      showPopup('error', 'Selection Required', 'Please select a currency');
      return;
    }
    if (!userId || userId.trim() === '') {
      showPopup('error', 'User ID Required', 'Please enter your game User ID');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      showPopup('error', 'Login Required', 'Please login to add to cart');
      return;
    }
    setAddingToCart(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/add`, {
        gameId: game._id || id,
        gameName: game.title,
        gamePageName: game.title,
        gameImage: game.portraitImage || game.image || 'https://via.placeholder.com/400x600',
        currencyName: selectedCurrency.name,
        amount: selectedCurrency.amount,
        quantity,
        gameUserId: userId.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        showPopup('success', 'Cart Updated', `${quantity} item(s) added to cart!`);
        setQuantity(1);
        setSelectedCurrency(null);
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { itemCount: response.data.data.items.length } 
        }));
      } else {
        showPopup('error', 'Cart Error', response.data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Cart add error:', error);
      showPopup('error', 'Cart Error', error.response?.data?.message || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  }, [selectedCurrency, game, quantity, id, showPopup, userId, API_BASE_URL]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/games/${id}`);
        if (response.data.success) {
          const fetchedGame = response.data.data;
          setGame({
            ...fetchedGame,
            title: fetchedGame.title || 'Untitled Game',
            publisher: fetchedGame.publisher || 'Unknown',
            description: fetchedGame.description || 'No description available',
            image: fetchedGame.image || 'https://via.placeholder.com/400x600',
            portraitImage: fetchedGame.portraitImage || fetchedGame.image || 'https://via.placeholder.com/400x600',
            squareImage: fetchedGame.squareImage || 'https://via.placeholder.com/400x400',
            offers: fetchedGame.offers || [],
            currencies: fetchedGame.currencies || []
          });
          setSelectedCurrency(fetchedGame.currencies?.[0] || null);
          setError(null);
        } else {
          setError('Failed to fetch game details');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch game details');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-400 text-base">
        Loading...
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-3 text-center">
        <h2 className="text-red-500 text-lg font-semibold mb-3">Game Not Found</h2>
        <p className="text-gray-300 text-sm mb-4">We couldn't find the game you're looking for.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{game.title} - Game Zone</title>
        <meta name="description" content={game.description.substring(0, 120) + '...'} />
        <meta name="keywords" content={`${game.title}, ${game.publisher}, video games, buy game`} />
        <meta property="og:title" content={game.title} />
        <meta property="og:description" content={game.description.substring(0, 120) + '...'} />
        <meta property="og:image" content={game.portraitImage || game.image} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 sm:pt-20 pb-6">
        <div className="max-w-5xl mx-auto px-3 pt-14 sm:px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 border border-gray-700"
          >
            <div className="grid lg:grid-cols-2 gap-4 items-center">
              <div className="order-2 lg:order-1">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-semibold text-white mb-2"
                >
                  {game.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-cyan-400 text-sm mb-2"
                >
                  by {game.publisher}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 text-sm"
                >
                  {game.description}
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center order-1 lg:order-2"
              >
                <img
                  src={game.portraitImage}
                  alt={game.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600'; }}
                  className="w-40 h-48 sm:w-48 sm:h-64 object-contain rounded-md shadow-md border border-cyan-500"
                  style={{ aspectRatio: '9/16' }}
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex flex-col md:flex-row items-start gap-3">
                <img
                  src={game.squareImage}
                  alt={game.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200'; }}
                  className="w-full md:w-24 h-24 object-contain rounded-md shadow border border-cyan-500 hover:scale-105 transition-transform duration-200"
                  style={{ aspectRatio: '1/1' }}
                  loading="lazy"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                    {game.title}
                  </h1>
                  <p className="text-sm text-gray-300">By {game.publisher}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                  <FaGlobe className="text-cyan-500" />
                  <span>Global</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                  <FaBolt className="text-cyan-500" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                  <FaShieldAlt className="text-cyan-500" />
                  <span>Official</span>
                </div>
              </div>

              <p className="text-sm text-gray-200">{game.description}</p>
            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-3"
            >
              {/* Offers Section */}
              <div className="bg-gray-800 p-2 rounded-md shadow">
                <h2 className="text-base font-semibold mb-1 flex items-center gap-1">
                  <FaShoppingCart className="text-cyan-500" />
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
                      <p className="text-xs text-gray-300">
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
                        <li key={index} className="bg-cyan-900 p-1 rounded text-xs">
                          <strong>{offer.key}:</strong> {offer.value}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
                {game.offers.length > 0 && (
                  <button
                    onClick={toggleOffers}
                    className="mt-1 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                  >
                    {showFullOffers ? 'Hide' : 'View'} Details
                    {showFullOffers ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>
                )}
              </div>

              {/* Select Plan Section */}
              <div className="bg-gray-800 p-3 rounded-md shadow border border-gray-700">
                <h2 className="text-base font-semibold mb-2 flex items-center gap-1">
                  <FaDollarSign className="text-cyan-500" />
                  Select Package
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {game.currencies.map((curr, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleCurrencySelect(curr)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-md border ${selectedCurrency?.name === curr.name
                          ? 'bg-cyan-600 border-cyan-400 shadow-md'
                          : 'bg-gray-700 border-gray-600 hover:border-cyan-500'
                        }`}
                    >
                      {selectedCurrency?.name === curr.name && (
                        <div className="absolute top-1 right-1">
                          <FaCheckCircle className="text-cyan-300 text-sm" />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-600">
                          <img
                            src={game.squareImage}
                            alt={game.title}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }}
                            className="w-6 h-6 object-contain rounded"
                            style={{ aspectRatio: '1/1' }}
                            loading="lazy"
                          />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-xs font-semibold text-white">{curr.name}</p>
                          <p className="text-sm font-semibold text-cyan-400">${curr.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Purchase Section */}
              <div className="bg-gray-800 p-2 rounded-md shadow">
                <h2 className="text-base font-semibold mb-1">Purchase</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1">User ID (Numbers only)</label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) setUserId(value);
                      }}
                      placeholder="Your User ID"
                      className="w-full p-1.5 bg-gray-700 text-white rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Quantity</label>
                    <div className="flex items-center gap-2 bg-gray-700 rounded-md p-1">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center text-base"
                      >
                        −
                      </motion.button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setQuantity(Math.max(1, Math.min(99, value)));
                        }}
                        className="w-full py-1 px-2 bg-gray-800 text-white rounded focus:outline-none text-center text-sm border border-gray-600"
                      />
                      <motion.button
                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center text-base"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Item:</span>
                    <span className="font-semibold">{game.title} ({selectedCurrency?.name || 'N/A'})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Quantity:</span>
                    <span className="font-semibold">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Total:</span>
                    <span className="font-semibold text-cyan-400">
                      ${selectedCurrency ? (selectedCurrency.amount * quantity).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <motion.button
                    onClick={handlePurchase}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-1 bg-cyan-500 text-white font-semibold rounded text-xs"
                  >
                    Purchase
                  </motion.button>
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-1 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white font-semibold rounded flex items-center justify-center gap-1 text-xs"
                  >
                    <FaShoppingCart className="text-sm" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Popup Notification */}
          <AnimatePresence>
            {popup.show && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="fixed bottom-3 left-3 right-3 max-w-xs mx-auto z-50"
              >
                <div className={`rounded-md p-3 shadow-md border-l-4 ${popup.type === 'success'
                    ? 'bg-green-900 border-green-500 text-green-100'
                    : 'bg-red-900 border-red-500 text-red-100'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {popup.type === 'success' ? (
                        <FaCheckCircle className="text-green-400 text-base" />
                      ) : (
                        <FaExclamationTriangle className="text-red-400 text-base" />
                      )}
                      <div>
                        <h3 className="text-sm font-semibold">{popup.title}</h3>
                        <p className="text-xs">{popup.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={closePopup}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
});

export default GameDetails;