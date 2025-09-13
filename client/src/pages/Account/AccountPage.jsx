import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  FaUser, 
  FaHistory, 
  FaGamepad, 
  FaReceipt, 
  FaCalendarAlt,
  FaDollarSign,
  FaIdCard,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' });

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await Promise.all([
        fetchUserData(isMounted),
        fetchPurchaseHistory(isMounted)
      ]);
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', title: '', message: '' });
    }, 4000);
  };

  const closePopup = () => setPopup({ show: false, type: '', title: '', message: '' });

  const fetchUserData = async (isMounted = true) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setError('Please log in to view your account');
          setLoading(false);
        }
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If API fails, use fallback data from token or localStorage
        const fallbackUser = {
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          createdAt: localStorage.getItem('userCreatedAt') || new Date().toISOString(),
          _id: localStorage.getItem('userId') || 'temp-id'
        };
        
        if (isMounted) {
          setUser(fallbackUser);
          setEditForm({ name: fallbackUser.name, email: fallbackUser.email });
        }
        return;
      }

      const data = await response.json();
      if (isMounted && data.success && data.data) {
        setUser(data.data);
        setEditForm({ name: data.data.name, email: data.data.email });
        
        // Store user data in localStorage for fallback
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('userEmail', data.data.email);
        localStorage.setItem('userCreatedAt', data.data.createdAt);
        localStorage.setItem('userId', data.data._id);
      } else {
        // Use fallback data if API response is invalid
        const fallbackUser = {
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          createdAt: localStorage.getItem('userCreatedAt') || new Date().toISOString(),
          _id: localStorage.getItem('userId') || 'temp-id'
        };
        
        if (isMounted) {
          setUser(fallbackUser);
          setEditForm({ name: fallbackUser.name, email: fallbackUser.email });
        }
      }
    } catch (err) {
      // Use fallback data on error
      const fallbackUser = {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        createdAt: localStorage.getItem('userCreatedAt') || new Date().toISOString(),
        _id: localStorage.getItem('userId') || 'temp-id'
      };
      
      if (isMounted) {
        setUser(fallbackUser);
        setEditForm({ name: fallbackUser.name, email: fallbackUser.email });
        setError(null); // Clear error since we have fallback data
      }
    }
  };

  const fetchPurchaseHistory = async (isMounted = true) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }

      const data = await response.json();
      if (isMounted) {
        setPurchases(data.data);
      }
    } catch (err) {
      // Silently handle purchase history errors as it's not critical
      if (isMounted) {
        setPurchases([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data.data);
      setIsEditing(false);
      showPopup('success', 'Profile Updated', 'Your profile has been successfully updated');
    } catch (err) {
      showPopup('error', 'Update Failed', err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'refunded': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-400 text-lg">
        Loading account details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account - ClutchCoins</title>
        <meta name="description" content="Manage your account and view purchase history" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">My Account</h1>
            <p className="text-gray-400">Manage your profile and view purchase history</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaUser className="text-cyan-400" />
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FaEdit size={18} />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <FaSave size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: user.name, email: user.email });
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white font-medium">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Member Since</label>
                    <p className="text-white font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Total Purchases</label>
                    <p className="text-cyan-400 font-bold text-lg">{purchases.length}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Purchase History Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaHistory className="text-cyan-400" />
                  Purchase History
                </h2>

                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <FaGamepad className="mx-auto text-gray-600 text-4xl mb-4" />
                    <p className="text-gray-400">No purchases yet</p>
                    <p className="text-gray-500 text-sm">Start exploring games to see your purchase history here</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {purchases.map((purchase) => (
                      <motion.div
                        key={purchase._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-cyan-400 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FaGamepad className="text-cyan-400" />
                              <h3 className="text-white font-semibold">{purchase.gameName}</h3>
                              <span className={`text-sm font-medium ${getStatusColor(purchase.status)}`}>
                                {purchase.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <FaDollarSign className="text-green-400" />
                                <span>{purchase.currencyName} - ${purchase.amount}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-400">
                                <FaIdCard className="text-blue-400" />
                                <span>Game ID: {purchase.gameUserId}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-400">
                                <FaReceipt className="text-purple-400" />
                                <span>TXN: {purchase.transactionId}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-400">
                                <FaReceipt className="text-orange-400" />
                                <span>Serial: {purchase.serialNumber}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaCalendarAlt className="text-cyan-400" />
                            <span>{formatDate(purchase.purchaseDate)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {popup.show && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-0 left-0 w-full h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 w-96"
            >
              <h2 className="text-lg font-bold text-white mb-2">{popup.title}</h2>
              <p className="text-gray-400">{popup.message}</p>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-300 transition-colors absolute top-4 right-4"
              >
                <FaTimes size={18} />
              </button>
              {popup.type === 'success' && (
                <FaCheckCircle className="text-green-400 text-4xl absolute bottom-4 right-4" />
              )}
              {popup.type === 'error' && (
                <FaExclamationTriangle className="text-red-400 text-4xl absolute bottom-4 right-4" />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default AccountPage;
