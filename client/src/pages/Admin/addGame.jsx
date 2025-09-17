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

  const handleAddOffer = () => {
    if (!offerKey.trim() || !offerValue.trim()) {
      setError('Offer key and value cannot be empty');
      return;
    }
    setOffersList(prev => [...prev, { key: offerKey.trim(), value: offerValue.trim() }]);
    setOfferKey('');
    setOfferValue('');
  };

  const handleRemoveOffer = (index) => {
    setOffersList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCurrency = () => {
    if (!currencyName.trim() || !currencyAmount.trim()) {
      setError('Currency name and amount cannot be empty');
      return;
    }
    if (isNaN(currencyAmount) || Number(currencyAmount) <= 0) {
      setError('Currency amount must be a valid positive number');
      return;
    }
    setCurrenciesList(prev => [...prev, { name: currencyName.trim(), amount: Number(currencyAmount) }]);
    setCurrencyName('');
    setCurrencyAmount('');
  };

  const handleRemoveCurrency = (index) => {
    setCurrenciesList(prev => prev.filter((_, i) => i !== index));
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
    if (image) formData.append('image', image);

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
        setTimeout(() => navigate('/admin/game'), 2000);
      } else {
        setError(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} game`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} game`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Game' : 'Add Game'} - Game Zone Admin</title>
        <meta name="description" content={`${isEdit ? 'Edit' : 'Create'} a game in the Game Zone admin panel.`} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 flex">
        <main className="flex-1 pt-28 pb-6 px-4 sm:px-6 lg:pr-8 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-4">
              {isEdit ? 'Edit' : 'Add'} Game <span className="text-cyan-500">Entry</span>
            </h1>
            {error && (
              <div className="bg-red-500/20 text-red-300 p-2 mb-3 rounded" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 text-green-300 p-2 mb-3 rounded" role="alert">
                Game {isEdit ? 'updated' : 'created'} successfully! Redirecting...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-1">Title</label>
                <input
                  id="game-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Enter game title"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Publisher</label>
                <input
                  id="game-publisher"
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Enter publisher name"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Description</label>
                <textarea
                  id="game-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-y text-sm"
                  placeholder="Enter game description"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Offers (optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="offer-key"
                    type="text"
                    placeholder="Offer Key (e.g. discount)"
                    value={offerKey}
                    onChange={(e) => setOfferKey(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded text-sm"
                  />
                  <input
                    id="offer-value"
                    type="text"
                    placeholder="Offer Value (e.g. 10%)"
                    value={offerValue}
                    onChange={(e) => setOfferValue(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddOffer}
                    className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-white text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {offersList.map((offer, index) => (
                    <span key={index} className="bg-cyan-600/50 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      {offer.key}: {offer.value}
                      <button type="button" onClick={() => handleRemoveOffer(index)} className="text-red-300 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Currencies (optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="currency-name"
                    type="text"
                    placeholder="Currency Name (e.g. USD)"
                    value={currencyName}
                    onChange={(e) => setCurrencyName(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded text-sm"
                  />
                  <input
                    id="currency-amount"
                    type="number"
                    placeholder="Amount"
                    value={currencyAmount}
                    onChange={(e) => setCurrencyAmount(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded text-sm"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={handleAddCurrency}
                    className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-white text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currenciesList.map((curr, index) => (
                    <span key={index} className="bg-cyan-600/50 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      {curr.name}: {curr.amount}
                      <button type="button" onClick={() => handleRemoveCurrency(index)} className="text-red-300 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Image (optional)</label>
                <input
                  id="game-image"
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  accept="image/*"
                />
                {preview && <img src={preview} alt="Game preview" className="mt-2 w-24 h-24 object-cover rounded" />}
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm disabled:opacity-50"
              >
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Game' : 'Create Game')}
              </motion.button>
            </form>
          </motion.div>
        </main>
        <Sidebar className="fixed right-0 top-0 h-screen z-40 hidden lg:block" />
      </div>
    </>
  );
}

export default AddGame;