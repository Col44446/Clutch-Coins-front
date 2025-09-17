import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaDownload, FaHome, FaShoppingCart } from 'react-icons/fa';

function PurchaseSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Get order details from navigation state or localStorage
    const details = location.state?.orderDetails || JSON.parse(localStorage.getItem('lastOrder') || '{}');
    setOrderDetails(details);

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleContinueShopping = () => {
    navigate('/games');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/account');
  };

  return (
    <>
      <Helmet>
        <title>Purchase Successful - ClutchCoins</title>
        <meta name="description" content="Your purchase has been completed successfully. Thank you for choosing ClutchCoins!" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center p-4">
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-10">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    rotate: 0,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: 360,
                    x: Math.random() * window.innerWidth,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    ease: "easeOut",
                    delay: Math.random() * 2,
                  }}
                  exit={{ opacity: 0 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl w-full bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
            >
              <FaCheckCircle className="text-4xl text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold mb-2"
            >
              Purchase Successful!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-green-100 text-lg"
            >
              Thank you for your purchase. Your order has been processed successfully.
            </motion.p>
          </div>

          {/* Order Details Section */}
          <div className="p-8">
            {orderDetails && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Order Details</h2>
                <div className="bg-gray-700/50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Order ID:</span>
                    <span className="font-mono text-cyan-400">
                      {orderDetails.orderId || `ORD-${Date.now()}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Game:</span>
                    <span className="font-semibold">{orderDetails.gameName || 'Game Package'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Package:</span>
                    <span>{orderDetails.packageName || 'Premium Package'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-semibold text-green-400">
                      ₹{orderDetails.amount || '999'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Payment Method:</span>
                    <span>{orderDetails.paymentMethod || 'UPI'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-200">What's Next?</h3>
              <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-700/30">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
                    <span>Your purchase has been confirmed and processed</span>
                  </li>
                  <li className="flex items-center">
                    <FaDownload className="text-blue-400 mr-3 flex-shrink-0" />
                    <span>Game credits will be added to your account within 5-10 minutes</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
                    <span>You'll receive an email confirmation shortly</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <FaShoppingCart />
                Continue Shopping
              </button>
              
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                View Orders
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <FaHome />
                Go Home
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default PurchaseSuccess;
