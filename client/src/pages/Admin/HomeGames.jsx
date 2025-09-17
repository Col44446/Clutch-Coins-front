import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Sidebar from "./sidebar";

const HomeGames = () => {
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [games, setGames] = useState([]);
  const [heroGames, setHeroGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch games data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gamesRes, heroRes, trendingRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/games`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/featured/hero`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/featured/trending`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setGames(gamesRes.data.data || gamesRes.data || []);
        setHeroGames(
          (heroRes.data.data || heroRes.data || []).map((game) => ({
            ...game,
            displayImage: game.displayImage,
            displayImageWebP: game.displayImageWebP || game.displayImage,
            displayImageSmall: game.displayImageSmall || game.displayImage,
          }))
        );
        setTrendingGames(
          (trendingRes.data.data || trendingRes.data || []).map((game) => ({
            ...game,
            displayImage: game.displayImage,
            displayImageWebP: game.displayImageWebP || game.displayImage,
            displayImageSmall: game.displayImageSmall || game.displayImage,
          }))
        );
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch data";
        if (err.response?.status === 401 && errorMessage.includes("expired")) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, API_BASE_URL]);

  // Handle image selection with aspect ratio validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUploadImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          
          // Different aspect ratios for different modal types
          let targetAspectRatio, errorMessage;
          if (modalType === "hero") {
            targetAspectRatio = 16 / 9; // Hero games use 16:9
            errorMessage = "Please upload an image with a 16:9 aspect ratio (e.g., 1600px × 900px)";
          } else {
            targetAspectRatio = 9 / 16; // Trending games use 9:16
            errorMessage = "Please upload an image with a 9:16 aspect ratio (e.g., 900px × 1600px)";
          }
          
          if (Math.abs(aspectRatio - targetAspectRatio) > 0.01) {
            setError(errorMessage);
          } else {
            setError(null);
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setError(null);
    }
  };

  // Open upload modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setSelectedGame("");
    setUploadImage(null);
    setImagePreview(null);
    setError(null);
  };

  // Save handler
  const handleSave = async () => {
    if (!selectedGame || !uploadImage) {
      setError("Please select a game and upload an image");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(uploadImage.type)) {
      setError("Only JPEG, PNG, WEBP, or AVIF images are allowed");
      return;
    }
    if (uploadImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Validate aspect ratio before saving
    const img = new Image();
    img.src = URL.createObjectURL(uploadImage);
    await new Promise((resolve) => (img.onload = resolve));
    const aspectRatio = img.width / img.height;
    
    // Different aspect ratios for different modal types
    let targetAspectRatio, errorMessage;
    if (modalType === "hero") {
      targetAspectRatio = 16 / 9; // Hero games use 16:9
      errorMessage = "Image must have a 16:9 aspect ratio";
    } else {
      targetAspectRatio = 9 / 16; // Trending games use 9:16
      errorMessage = "Image must have a 9:16 aspect ratio";
    }
    
    if (Math.abs(aspectRatio - targetAspectRatio) > 0.01) {
      setError(errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("gameId", selectedGame);
    formData.append("displayImage", uploadImage);

    setLoading(true);
    try {
      const url = modalType === "hero" ? `${API_BASE_URL}/featured/hero` : `${API_BASE_URL}/featured/trending`;
      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      modalType === "hero"
        ? setHeroGames(
            (res.data.data || res.data || []).map((game) => ({
              ...game,
              displayImage: game.displayImage,
              displayImageWebP: game.displayImageWebP || game.displayImage,
              displayImageSmall: game.displayImageSmall || game.displayImage,
            }))
          )
        : setTrendingGames(
            (res.data.data || res.data || []).map((game) => ({
              ...game,
              displayImage: game.displayImage,
              displayImageWebP: game.displayImageWebP || game.displayImage,
              displayImageSmall: game.displayImageSmall || game.displayImage,
            }))
          );
      setShowModal(false);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save game");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (type, id) => {
    try {
      const url = type === "hero" ? `${API_BASE_URL}/featured/hero/${id}` : `${API_BASE_URL}/featured/trending/${id}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      type === "hero"
        ? setHeroGames(heroGames.filter((g) => g._id !== id))
        : setTrendingGames(trendingGames.filter((g) => g._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete game");
    }
  };

  // Open preview modal for listed image
  const openImagePreview = (url) => {
    setPreviewImageUrl(url);
    setShowImagePreviewModal(true);
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Helmet>
        <title>Manage Home Games - Game Zone Admin</title>
        <meta name="description" content="Manage hero and trending games for the Game Zone home page." />
        <meta name="robots" content="noindex" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Manage Home Games",
            description: "Admin interface for managing hero and trending games on the Game Zone platform.",
            url: window.location.href,
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 pt-16 pb-4 px-3 sm:px-4 lg:pl-44 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-lg sm:text-xl font-bold text-white mb-3">Manage Home Games</h1>
            {error && (
              <div className="bg-red-500/20 text-red-300 p-2 mb-2 rounded text-sm" role="alert">
                {error}
              </div>
            )}
            {loading && <div className="text-white text-center text-xs">Loading...</div>}
            {!loading && (
              <div className="flex flex-col gap-4">
                {/* Hero Games Section */}
                <section className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-3">
                    <h2 className="text-sm sm:text-base font-semibold text-white">Hero Games</h2>
                    <motion.button
                      onClick={() => openModal("hero")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1 touch-manipulation"
                      aria-label="Add new hero game"
                    >
                      <span>+ Add Hero Game</span>
                    </motion.button>
                  </div>
                  <ul className="space-y-2">
                    {heroGames.map((game) => (
                      <motion.li
                        key={game._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-700/50 p-2 rounded flex items-center gap-3"
                      >
                        <picture>
                          <source
                            srcSet={game.displayImageWebP}
                            type="image/webp"
                            media="(min-width: 768px)"
                            sizes="80px"
                          />
                          <source
                            srcSet={game.displayImageSmall}
                            type="image/jpeg"
                            media="(max-width: 767px)"
                            sizes="80px"
                          />
                          <img
                            src={game.displayImage}
                            alt={game.gameId?.title ? `Hero game: ${game.gameId.title}` : "Hero game image"}
                            className="w-12 h-12 object-cover rounded cursor-pointer"
                            loading="lazy"
                            onClick={() => openImagePreview(game.displayImage)}
                            onError={(e) => {
                              console.error(`Image failed to load: ${game.displayImage}`);
                              e.target.src = "/fallback-image.jpg";
                            }}
                            decoding="async"
                          />
                        </picture>
                        <p className="text-xs sm:text-sm text-white truncate flex-1">
                          {game.gameId?.title || "Unknown Game"}
                        </p>
                        <motion.button
                          onClick={() => handleDelete("hero", game._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded touch-manipulation"
                          aria-label={`Remove ${game.gameId?.title || "game"} from hero games`}
                        >
                          Remove
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                </section>

                {/* Trending Games Section */}
                <section className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-3">
                    <h2 className="text-sm sm:text-base font-semibold text-white">Trending Games</h2>
                    <motion.button
                      onClick={() => openModal("trending")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1 touch-manipulation"
                      aria-label="Add new trending game"
                    >
                      <span>+ Add Trending Game</span>
                    </motion.button>
                  </div>
                  <ul className="space-y-2">
                    {trendingGames.map((game) => (
                      <motion.li
                        key={game._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-700/50 p-2 rounded flex items-center gap-3"
                      >
                        <picture>
                          <source
                            srcSet={game.displayImageWebP}
                            type="image/webp"
                            media="(min-width: 768px)"
                            sizes="48px"
                          />
                          <source
                            srcSet={game.displayImageSmall}
                            type="image/jpeg"
                            media="(max-width: 767px)"
                            sizes="48px"
                          />
                          <img
                            src={game.displayImage}
                            alt={game.gameId?.title ? `Trending game: ${game.gameId.title}` : "Trending game image"}
                            className="w-12 h-[85.33px] object-contain rounded cursor-pointer"
                            loading="lazy"
                            onClick={() => openImagePreview(game.displayImage)}
                            onError={(e) => {
                              console.error(`Image failed to load: ${game.displayImage}`);
                              e.target.src = "/fallback-image.jpg";
                            }}
                            decoding="async"
                          />
                        </picture>
                        <p className="text-xs sm:text-sm text-white truncate flex-1">
                          {game.gameId?.title || "Unknown Game"}
                        </p>
                        <motion.button
                          onClick={() => handleDelete("trending", game._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded touch-manipulation"
                          aria-label={`Remove ${game.gameId?.title || "game"} from trending games`}
                        >
                          Remove
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </motion.div>

          {/* Upload Modal */}
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg max-w-sm w-full">
                <h2 id="modal-title" className="text-sm sm:text-base font-bold text-white mb-2">
                  {modalType === "hero" ? "Add Hero Game" : "Add Trending Game"}
                </h2>
                {error && (
                  <div className="bg-red-500/20 text-red-300 p-2 mb-2 rounded text-xs" role="alert">
                    {error}
                  </div>
                )}
                <select
                  className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm mb-2"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  aria-label="Select a game"
                >
                  <option value="">Select Game</option>
                  {games.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.title}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="w-full p-2 bg-gray-700 text-white rounded text-xs sm:text-sm mb-2"
                  onChange={handleImageChange}
                  aria-label="Upload game image"
                />
                {imagePreview && (
                  <div className="mb-2">
                    <p className="text-xs text-white mb-1">
                      Upload Preview ({modalType === "hero" ? "16:9" : "9:16"}):
                    </p>
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className={modalType === "hero" ? "w-[85.33px] h-12 object-contain rounded" : "w-12 h-[85.33px] object-contain rounded"}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <motion.button
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-1 px-3 bg-gray-600 text-white rounded text-xs sm:text-sm touch-manipulation"
                    aria-label="Cancel"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-1 px-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs sm:text-sm disabled:opacity-50 touch-manipulation"
                    aria-label="Save game"
                  >
                    {loading ? "Saving..." : "Save"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Listed Image Preview Modal */}
          {showImagePreviewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-modal-title"
            >
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg max-w-sm w-full text-center">
                <h2 id="preview-modal-title" className="text-sm sm:text-base font-bold text-white mb-2">
                  Image Preview (9:16)
                </h2>
                <img
                  src={previewImageUrl}
                  alt="Listed image preview"
                  className="max-w-full h-auto object-contain rounded mx-auto"
                  style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
                />
                <div className="flex justify-center mt-4">
                  <motion.button
                    onClick={() => setShowImagePreviewModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-1 px-3 bg-gray-600 text-white rounded text-xs sm:text-sm touch-manipulation"
                    aria-label="Close preview"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default HomeGames;
