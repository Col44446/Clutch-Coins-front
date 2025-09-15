import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';
import Sidebar from './sidebar';

function PackageButtons() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    link: '',
    buttonText: 'Top Up',
    isActive: true
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingId 
        ? `${API_BASE_URL}/packages/${editingId}`
        : `${API_BASE_URL}/packages`;
      
      const method = editingId ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          description: '',
          price: '',
          link: '',
          buttonText: 'Top Up',
          isActive: true
        });
        setEditingId(null);
        setShowAddForm(false);
        fetchPackages();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      link: pkg.link,
      buttonText: pkg.buttonText,
      isActive: pkg.isActive
    });
    setEditingId(pkg._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPackages();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to delete package');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      link: '',
      buttonText: 'Top Up',
      isActive: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <>
      <Helmet>
        <title>Package Buttons - ClutchCoins Admin</title>
        <meta name="description" content="Manage package buttons configuration for ClutchCoins platform" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
        } mt-16 sm:mt-20 md:mt-24`}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Package <span className="text-cyan-500">Buttons</span>
              </h1>
              
              <motion.button
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Package
              </motion.button>
            </div>

            {error && (
              <div className="bg-red-500 text-white p-3 mb-4 rounded-lg" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 text-white p-3 mb-4 rounded-lg" role="alert">
                Package saved successfully!
              </div>
            )}

            {/* Add/Edit Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Package' : 'Add New Package'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Package Name
                    </label>
                    <input
                      id="package-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., Basic Package"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Price ($)
                    </label>
                    <input
                      id="package-price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="9.99"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="package-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-20 resize-y"
                      placeholder="Package description..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Link URL
                    </label>
                    <input
                      id="package-link"
                      name="link"
                      type="url"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="https://example.com/package"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Button Text
                    </label>
                    <input
                      id="package-button-text"
                      name="buttonText"
                      type="text"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Top Up"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3">
                    <input
                      id="package-active"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="package-active" className="text-white text-sm font-medium">
                      Active (visible to users)
                    </label>
                  </div>

                  <div className="md:col-span-2 flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Packages List */}
            {loading && !showAddForm ? (
              <div className="text-white text-center">Loading packages...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-cyan-400">${pkg.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(pkg)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(pkg._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Button Text:</span>
                        <span className="text-white">{pkg.buttonText}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={pkg.isActive ? 'text-green-400' : 'text-red-400'}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Link:</span>
                        <a 
                          href={pkg.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 truncate max-w-32"
                        >
                          {pkg.link}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {packages.length === 0 && !loading && (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-400 mb-4">No packages found</h3>
                <p className="text-gray-500 mb-6">Create your first package to get started</p>
                <motion.button
                  onClick={() => setShowAddForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Add First Package
                </motion.button>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default PackageButtons;
