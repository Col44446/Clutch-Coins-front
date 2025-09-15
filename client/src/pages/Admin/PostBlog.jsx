import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Sidebar from './sidebar';

function CreateBlogWithSidebar() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />; // 🔹 Token guard

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔹 Token send
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/blogs'), 2000);
      } else {
        setError(response.data.error || 'Failed to create blog');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.response?.data?.error || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Blog - Game Zone Admin</title>
        <meta name="description" content="Create a new blog post for Game Zone admin panel." />
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
              Create New Blog <span className="text-cyan-500">Post</span>
            </h1>
            {error && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500 text-white p-3 mb-4 rounded-lg" role="alert">
                Blog created successfully! Redirecting...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-white text-lg font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-white text-lg font-medium mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-40 resize-y"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-white text-lg font-medium mb-2">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  accept="image/*"
                />
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="Blog preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Blog'}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default CreateBlogWithSidebar;
