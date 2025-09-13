import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Sidebar from './sidebar';

function AddGame({ isEdit = false }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [offerKey, setOfferKey] = useState('');
  const [offerValue, setOfferValue] = useState('');
  const [offersList, setOffersList] = useState([]);
  const [currencyName, setCurrencyName] = useState('');
  const [currencyAmount, setCurrencyAmount] = useState('');
  const [currenciesList, setCurrenciesList] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Token:', token);

  // Add toggleSidebar function
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG or PNG images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add offer handler
  const handleAddOffer = () => {
    if (!offerKey.trim() || !offerValue.trim()) {
      setError('Offer key and value cannot be empty');
      return;
    }
    setOffersList((prev) => [...prev, { key: offerKey.trim(), value: offerValue.trim() }]);
    setOfferKey('');
    setOfferValue('');
  };

  // Remove offer handler
  const handleRemoveOffer = (index) => {
    setOffersList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add currency handler
  const handleAddCurrency = () => {
    if (!currencyName.trim() || !currencyAmount.trim()) {
      setError('Currency name and amount cannot be empty');
      return;
    }
    if (isNaN(currencyAmount) || Number(currencyAmount) <= 0) {
      setError('Currency amount must be a valid positive number');
      return;
    }
    setCurrenciesList((prev) => [
      ...prev,
      { name: currencyName.trim(), amount: Number(currencyAmount) },
    ]);
    setCurrencyName('');
    setCurrencyAmount('');
  };

  // Remove currency handler
  const handleRemoveCurrency = (index) => {
    setCurrenciesList((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchGame = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/games/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const game = response.data.data;
          setTitle(game.title || '');
          setPublisher(game.publisher || '');
          setDescription(game.description || '');
          setOffersList(game.offers || []);
          setCurrenciesList(game.currencies || []);
          setPreview(game.image ? `${API_BASE_URL}/../${game.image}` : null);
        } catch (err) {
          console.error('Fetch game error:', err);
          setError(err.response?.data?.message || 'Failed to fetch game data');
        } finally {
          setLoading(false);
        }
      };
      fetchGame();
    }
  }, [isEdit, id, token, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!title.trim() || !publisher.trim() || !description.trim()) {
      setError('Title, publisher, and description are required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('publisher', publisher.trim());
    formData.append('description', description.trim());
    formData.append('offers', JSON.stringify(offersList));
    formData.append('currencies', JSON.stringify(currenciesList));
    if (image) {
      formData.append('image', image);
    }

    for (const [key, value] of formData.entries()) {
      // FormData validation could be added here if needed
    }

    try {
      const url = isEdit ? `${API_BASE_URL}/games/${id}` : `${API_BASE_URL}/games`;
      const method = isEdit ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/games'), 2000);
      } else {
        setError(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} game`);
      }
    } catch (err) {
      console.error('API error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEdit ? 'update' : 'create'} game`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Game' : 'Add Game'} - Game Zone Admin</title>
        <meta name="description" content={`${isEdit ? 'Edit' : 'Create'} a game in the Game Zone admin panel.`} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 mt-36 p-4 md:p-8 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-white mb-6">
              {isEdit ? 'Edit' : 'Add New'} Game <span className="text-cyan-500">Entry</span>
            </h1>
            {error && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500 text-white p-3 mb-4 rounded-lg" role="alert">
                Game {isEdit ? 'updated' : 'created'} successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">Publisher</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-40 resize-y"
                  required
                />
              </div>

              {/* Offers */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">
                  Offers <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Offer Key (e.g. discount)"
                    value={offerKey}
                    onChange={(e) => setOfferKey(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Offer Value (e.g. 10%)"
                    value={offerValue}
                    onChange={(e) => setOfferValue(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddOffer}
                    className="bg-cyan-500 px-4 py-2 rounded text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {offersList.map((offer, index) => (
                    <span
                      key={index}
                      className="bg-cyan-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {offer.key}: {offer.value}
                      <button
                        type="button"
                        onClick={() => handleRemoveOffer(index)}
                        className="text-red-300 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Currencies */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">
                  Currencies <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Currency Name (e.g. USD)"
                    value={currencyName}
                    onChange={(e) => setCurrencyName(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={currencyAmount}
                    onChange={(e) => setCurrencyAmount(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={handleAddCurrency}
                    className="bg-cyan-500 px-4 py-2 rounded text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currenciesList.map((curr, index) => (
                    <span
                      key={index}
                      className="bg-cyan-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {curr.name}: {curr.amount}
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrency(index)}
                        className="text-red-300 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-white text-lg font-medium mb-2">
                  Image <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  accept="image/*"
                />
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="Game preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Game' : 'Create Game')}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default AddGame;