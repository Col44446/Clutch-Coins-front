import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
  const [portraitImage, setPortraitImage] = useState(null);
  const [squareImage, setSquareImage] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [squarePreview, setSquarePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, WEBP, or AVIF images are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Validate aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let isValid = false;
        let expectedRatio = '';

        if (imageType === 'portrait') {
          isValid = Math.abs(aspectRatio - 9/16) < 0.01;
          expectedRatio = '9:16';
        } else if (imageType === 'square') {
          isValid = Math.abs(aspectRatio - 1) < 0.01;
          expectedRatio = '1:1';
        }

        if (!isValid) {
          setError(`${imageType === 'portrait' ? 'Portrait' : 'Square'} image must have ${expectedRatio} aspect ratio`);
          return;
        }

        if (imageType === 'portrait') {
          setPortraitImage(file);
          setPortraitPreview(URL.createObjectURL(file));
        } else {
          setSquareImage(file);
          setSquarePreview(URL.createObjectURL(file));
        }
        setError('');
      };
      img.src = URL.createObjectURL(file);
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
          setPortraitPreview(game.portraitImage || game.image || null);
          setSquarePreview(game.squareImage || null);
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

    try {
      // Validate required fields
      if (!title.trim() || !publisher.trim() || !description.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (!isEdit && (!portraitImage || !squareImage)) {
        throw new Error('Both portrait (9:16) and square (1:1) images are required');
      }

      // Create FormData
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', title.trim());
      formData.append('publisher', publisher.trim());
      formData.append('description', description.trim());
      
      // Add offers if any
      formData.append('offers', JSON.stringify(offersList.length > 0 ? offersList : []));
      
      // Add currencies if any
      formData.append('currencies', JSON.stringify(currenciesList.length > 0 ? currenciesList : []));
      
      // Add images if provided
      if (portraitImage) {
        formData.append('portraitImage', portraitImage);
      }
      if (squareImage) {
        formData.append('squareImage', squareImage);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const url = isEdit ? `${API_BASE_URL}/games/${id}` : `${API_BASE_URL}/games`;
      const method = isEdit ? 'put' : 'post';
      
      // Log the form data for debugging
      console.log('Submitting form with data:', {
        title: title.trim(),
        publisher: publisher.trim(),
        description: description.trim(),
        hasPortraitImage: !!portraitImage,
        hasSquareImage: !!squareImage,
        offersCount: offersList.length,
        currenciesCount: currenciesList.length
      });

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // Increased timeout to 30 seconds
      });

      if (response.data && response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/game'), 2000);
      } else {
        const errorMsg = response.data?.message || `Failed to ${isEdit ? 'update' : 'create'} game`;
        setError(errorMsg);
        console.error('Server response:', response.data);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      `Failed to ${isEdit ? 'update' : 'create'} game. Please try again.`;
      setError(errorMsg);
      
      // Log detailed error information
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">Portrait Image (9:16) *</label>
                  <input
                    id="portrait-image"
                    type="file"
                    onChange={(e) => handleImageChange(e, 'portrait')}
                    className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    accept="image/*"
                    required={!isEdit}
                  />
                  {portraitPreview && (
                    <img 
                      src={portraitPreview} 
                      alt="Portrait preview" 
                      className="mt-2 w-16 h-28 object-cover rounded" 
                      style={{ aspectRatio: '9/16' }}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-1">Square Image (1:1) *</label>
                  <input
                    id="square-image"
                    type="file"
                    onChange={(e) => handleImageChange(e, 'square')}
                    className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    accept="image/*"
                    required={!isEdit}
                  />
                  {squarePreview && (
                    <img 
                      src={squarePreview} 
                      alt="Square preview" 
                      className="mt-2 w-24 h-24 object-cover rounded" 
                      style={{ aspectRatio: '1/1' }}
                    />
                  )}
                </div>
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