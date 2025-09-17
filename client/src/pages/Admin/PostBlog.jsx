import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Sidebar from './sidebar';

function CreateBlogWithSidebar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/blogs'), 2000);
      } else {
        setError(response.data.error || 'Failed to create blog');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Helmet>
        <title>Create Blog - Game Zone Admin</title>
        <meta name="description" content="Create a new blog post for Game Zone admin panel." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 flex">
        <main className="flex-1 pt-28 pb-6 px-4 sm:px-6 lg:pr-8 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-4">
              Create Blog <span className="text-cyan-500">Post</span>
            </h1>
            {error && (
              <div className="bg-red-500/20 text-red-300 p-2 mb-3 rounded" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 text-green-300 p-2 mb-3 rounded" role="alert">
                Blog created successfully! Redirecting...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-white text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-white text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-y text-sm"
                  placeholder="Enter blog content"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-white text-sm font-medium mb-1">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  accept="image/*"
                />
                {preview && (
                  <div className="mt-2">
                    <img src={preview} alt="Blog preview" className="w-24 h-24 object-cover rounded" />
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm disabled:opacity-50"
                >
                {loading ? 'Creating...' : 'Create Blog'}
              </motion.button>
            </form>
          </motion.div>
        </main>
        <Sidebar className="fixed right-0 top-0 h-screen z-40 hidden lg:block" />
      </div>
    </>
  );
}

export default CreateBlogWithSidebar;