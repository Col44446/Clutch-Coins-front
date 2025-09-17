import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../../components/common/SEOHead';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchCartItems(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchCartItems = async (isMounted = true) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setError('Please login to view your cart');
          setLoading(false);
        }
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (isMounted) {
        if (data.success) {
          setCartItems(data.data.items || []);
        } else {
          setError(data.message || 'Failed to fetch cart items');
        }
      }
    } catch (err) {
      if (isMounted) {
        setError('Error fetching cart items');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cart/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(data.data.items);
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        } else {
          setError(data.message || 'Failed to update quantity');
        }
      }
    } catch (err) {
      setError('Error updating quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(data.data.items);
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        } else {
          setError(data.message || 'Failed to remove item');
        }
      }
    } catch (err) {
      setError('Error removing item');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    setClearing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems([]);
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        } else {
          setError(data.message || 'Failed to clear cart');
        }
      }
    } catch (err) {
      setError('Error clearing cart');
    } finally {
      setClearing(false);
    }
  };

  const navigateToGame = (gameId) => {
    if (gameId) {
      navigate(`/game/${gameId}`);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.amount * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const cartStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shopping Cart",
    "description": "Review your gaming recharge items and proceed to checkout",
    "url": "https://clutchcoins.com/cart"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-24">
      <SEOHead
        title="Shopping Cart - ClutchCoins"
        description="Review your gaming recharge items, update quantities, and proceed to secure checkout. Fast and reliable gaming top-up services."
        keywords="shopping cart, gaming recharge checkout, game top-up cart, secure payment"
        structuredData={cartStructuredData}
        type="webpage"
      />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 text-cyan-400 hover:text-cyan-300 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back
          </motion.button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
            Your Cart
          </h1>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some games to get started!</p>
            <motion.button
              onClick={() => navigate('/games')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Games
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => navigateToGame(item.gameId?._id)}
                >
                  <img
                    src={item.gameId?.image || '/placeholder-game.jpg'}
                    alt={item.gameId?.title}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-900"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 hover:text-cyan-400 transition-colors">
                      {item.gameId?.title || 'Unknown Game'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {item.currencyType}: ${item.amount}
                    </p>
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating[item._id]}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white p-1 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="text-white font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <motion.button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updating[item._id]}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white p-1 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="text-right" onClick={(e) => e.stopPropagation()}>
                    <p className="text-lg font-semibold text-white mb-2">
                      ${(item.amount * item.quantity).toFixed(2)}
                    </p>
                    <motion.button
                      onClick={() => removeItem(item._id)}
                      disabled={updating[item._id]}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-32">
                <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({cartItems.length})</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                <motion.button
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </motion.button>
                <motion.button
                  onClick={clearCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
