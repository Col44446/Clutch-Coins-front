import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertCircle, MessageCircle, Search, User, UserPlus, ShoppingCart } from "lucide-react";
import Signup from "../LogSign";
import Login from "../Login";
import Messages from "../Messages";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Listen for authentication state changes and cart updates
  useEffect(() => {
    const handleAuthStateChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    const handleCartUpdate = () => {
      if (isAuthenticated) {
        fetchCartItems();
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Fetch cart items on component mount if authenticated
    if (isAuthenticated) {
      fetchCartItems();
    }

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated]);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const openSignup = () => setModalType("signup");
  const openLogin = () => setModalType("login");
  const closeModal = () => setModalType(null);
  const handleLogout = () => setShowLogoutWarning(true);

  const confirmLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const url =
        role === "admin"
          ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/logout`
          : `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      setShowLogoutWarning(false);
      setShowChat(false);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const cancelLogout = () => setShowLogoutWarning(false);

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setModalType("login");
    } else {
      setShowChat(true);
    }
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setModalType("login");
    } else {
      fetchCartItems();
      setShowCart(true);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCartItems(data.data.items || []);
        }
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  const role = localStorage.getItem("role");
  const navItems = [
    { to: "/games", label: "Games" },
    { to: "/about", label: "About" },
    ...(isAuthenticated ? [{ to: role === "admin" ? "/admin-dashboard" : "/user-dashboard", label: "Dashboard" }] : []),
  ];

  const menuVariants = {
    closed: { opacity: 0, y: -50 },
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.15 },
    }),
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90, transition: { duration: 0.2 } },
  };

  const warningVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  const chatButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    pulse: { scale: [1, 1.03, 1], transition: { duration: 1.2, repeat: Infinity } },
  };

  return (
    <>
      <nav className="bg-gradient-to-b from-blue-900 to-slate-950 p-2 fixed w-full top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col left-0">
              <Link to="/" className="text-xl font-bold text-white hover:text-cyan-300">
                Clutch <span className="text-cyan-500">Coins</span>
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-white font-medium tracking-wide"
              >
                INSTANT RECHARGE. INSTANT VICTORY!
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleChatClick}
                variants={chatButtonVariants}
                initial="initial"
                animate="pulse"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-green-500"
                aria-label="Open live chat"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </motion.button>
              
              <motion.button
                onClick={toggleMenu}
                className="md:hidden text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                variants={hamburgerVariants}
                animate={isOpen ? "open" : "closed"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden bg-gradient-to-b from-blue-900 to-slate-950 rounded shadow-md p-3"
              >
                {navItems.map((item, index) => (
                  <motion.div key={item.to} custom={index} initial="hidden" animate="visible" variants={linkVariants}>
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="text-white text-sm font-medium hover:text-cyan-300 block py-1"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Search className="w-4 h-4 text-white" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-gray-800 text-white rounded px-2 py-1 text-xs w-full"
                    />
                  </div>
                  {isAuthenticated ? (
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-white text-xs font-medium hover:text-cyan-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        onClick={openLogin}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-white rounded-full p-1.5 hover:bg-cyan-600"
                        aria-label="Login"
                      >
                        <User className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={openSignup}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-white rounded-full p-1.5 hover:bg-cyan-600"
                        aria-label="Sign Up"
                      >
                        <UserPlus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden md:flex items-center justify-between mt-1">
            <div className="flex items-center space-x-3">
              {navItems.map((item, index) => (
                <motion.div key={item.to} custom={index} initial="hidden" animate="visible" variants={linkVariants}>
                  <Link to={item.to} className="text-white text-sm font-medium hover:text-cyan-300">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-1">
                <Search className="w-4 h-4 text-white" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-white rounded px-2 py-1 text-xs"
                />
              </div>
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={handleCartClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative bg-gray-800 text-white rounded-full p-1.5 hover:bg-cyan-600"
                    aria-label="View Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-white text-xs font-medium hover:text-cyan-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={openLogin}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800 text-white rounded-full p-1.5 hover:bg-cyan-600"
                    aria-label="Login"
                  >
                    <User className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={openSignup}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800 text-white rounded-full p-1.5 hover:bg-cyan-600"
                    aria-label="Sign Up"
                  >
                    <UserPlus className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-slate-950 p-4 rounded-lg shadow-xl w-full max-w-md relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white text-xl hover:text-cyan-300"
                >
                  &times;
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-gray-300 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={item.gameImage || 'https://via.placeholder.com/60x80'}
                            alt={item.gameName}
                            className="w-10 h-10 object-cover rounded border border-gray-600"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60x80'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-xs truncate">{item.gameName || 'Game Item'}</h4>
                          <p className="text-gray-400 text-xs">{item.currencyName}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="text-white font-bold text-sm">
                          ${(item.amount * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-white font-bold">
                      ${cartItems.reduce((total, item) => total + (item.amount * item.quantity || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-slate-950 p-4 rounded-lg shadow-xl w-full max-w-4xl relative"
            >
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-2 right-2 text-white text-xl"
              >
                &times;
              </button>
              <Messages />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-slate-950 p-4 rounded-lg shadow-xl max-w-sm w-full relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-cyan-300 text-xl"
              >
                &times;
              </button>
              {modalType === "signup" && <Signup onClose={closeModal} onSwitch={openLogin} />}
              {modalType === "login" && (
                <Login
                  onClose={closeModal}
                  onSwitch={openSignup}
                  onLogin={() => {
                    setIsAuthenticated(true);
                    closeModal();
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center px-4"
          >
            <motion.div
              variants={warningVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gradient-to-b from-blue-900 to-slate-950 p-4 rounded-lg shadow-xl max-w-xs w-full"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-semibold text-white">Confirm Logout</h3>
              </div>
              <p className="text-xs text-gray-300 mb-4">Do you want to logout?</p>
              <div className="flex justify-end gap-2">
                <motion.button
                  onClick={cancelLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
                >
                  No
                </motion.button>
                <motion.button
                  onClick={confirmLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Yes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;