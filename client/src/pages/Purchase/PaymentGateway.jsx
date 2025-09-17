import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaCreditCard, 
  FaGoogle, 
  FaPaypal, 
  FaUniversity, 
  FaMobile, 
  FaQrcode,
  FaLock,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';

function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: FaQrcode,
      description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
      color: 'from-green-500 to-emerald-600',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Visa, Mastercard, RuPay cards accepted',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: FaUniversity,
      description: 'All major banks supported',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: FaMobile,
      description: 'Paytm, Mobikwik, Amazon Pay',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: FaGoogle,
      description: 'Quick payment with Google Pay',
      color: 'from-red-500 to-yellow-500'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FaPaypal,
      description: 'International payments via PayPal',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  useEffect(() => {
    const details = location.state?.orderDetails;
    if (!details) {
      navigate('/cart');
      return;
    }
    setOrderDetails(details);
  }, [location.state, navigate]);

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      setPopupMessage('Please select a payment method');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentMethod = paymentMethods.find(p => p.id === selectedPayment);
      const orderData = {
        ...orderDetails,
        paymentMethod: paymentMethod.name,
        orderId: `ORD-${Date.now()}`,
        status: 'completed'
      };

      // Store order details for success page
      localStorage.setItem('lastOrder', JSON.stringify(orderData));

      // Navigate to success page
      navigate('/purchase-success', { 
        state: { orderDetails: orderData }
      });
    }, 2000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Gateway - ClutchCoins</title>
        <meta name="description" content="Secure payment gateway for ClutchCoins gaming purchases" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8 pt-8">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FaLock className="mr-2 text-green-400" />
                  Choose Payment Method
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentSelect(method.id)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPayment === method.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                      }`}
                    >
                      {method.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-2 py-1 rounded-full text-black">
                          Popular
                        </div>
                      )}
                      
                      <div className="flex items-center mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color} mr-3`}>
                          <method.icon className="text-xl text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{method.name}</h3>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                      </div>

                      {selectedPayment === method.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <FaCheckCircle className="text-cyan-500 text-xl" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-8"
              >
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Game:</span>
                    <span className="font-semibold">{orderDetails.gameName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Package:</span>
                    <span>{orderDetails.packageName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Quantity:</span>
                    <span>{orderDetails.quantity || 1}</span>
                  </div>
                  
                  <hr className="border-gray-600" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-400">₹{orderDetails.amount}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedPayment || processing}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    selectedPayment && !processing
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${orderDetails.amount}`
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-400">
                  <FaLock className="inline mr-1" />
                  Secured by 256-bit SSL encryption
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Popup Message */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              {popupMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default PaymentGateway;
