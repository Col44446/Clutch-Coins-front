
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertCircle, MessageCircle, Search, User, UserPlus, ShoppingCart } from "lucide-react";
import Signup from "../LogSign";
import Login from "../Login";
import Messages from "../Messages";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  // Game data for search functionality
  const gameData = [
    { id: 'warrior-quest', title: 'Warrior Quest', pageName: 'warrior-quest' },
    { id: 'elite-shooter', title: 'Elite Shooter', pageName: 'elite-shooter' },
    { id: 'battlegrounds-mobile', title: 'Battlegrounds Mobile India', pageName: 'battlegrounds-mobile' },
    { id: 'valorant-tactical', title: 'Valorant', pageName: 'valorant-tactical' },
    { id: 'roblox-platform', title: 'Roblox', pageName: 'roblox-platform' },
    { id: 'minecraft-sandbox', title: 'Minecraft', pageName: 'minecraft-sandbox' },
    { id: 'cod-mobile', title: 'Call of Duty Mobile', pageName: 'cod-mobile' },
    { id: 'speed-racing', title: 'Speed Racing', pageName: 'speed-racing' },
    { id: 'adventure-world', title: 'Adventure World', pageName: 'adventure-world' },
    { id: 'puzzle-master', title: 'Puzzle Master', pageName: 'puzzle-master' },
    { id: 'strategy-empire', title: 'Strategy Empire', pageName: 'strategy-empire' },
    { id: 'fantasy-rpg', title: 'Fantasy RPG', pageName: 'fantasy-rpg' },
    { id: 'sports-champions', title: 'Sports Champions', pageName: 'sports-champions' },
    { id: 'action-hero', title: 'Action Hero', pageName: 'action-hero' },
    { id: 'life-simulator', title: 'Life Simulator', pageName: 'life-simulator' },
    { id: 'horror-nights', title: 'Horror Nights', pageName: 'horror-nights' },
    { id: 'survival-island', title: 'Survival Island', pageName: 'survival-island' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const switchLanguage = (e) => setLanguage(e.target.value);
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      console.error("⌐ Logout failed:", error);
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

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filteredGames = gameData.filter(game => 
        game.pageName.toLowerCase().includes(query.toLowerCase()) || 
        game.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredGames.slice(0, 5)); // Show max 5 results
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (game) => {
    navigate(`/game/${game.pageName}`);
    setSearchQuery("");
    setShowSearchDropdown(false);
    setSearchResults([]);
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow clicks
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  const role = localStorage.getItem("role");
  let navItems = [
    { to: "/games", label: "Games" },
    { to: "/about", label: "About us" },
  ];
  if (isAuthenticated) {
    const dashboardPath = role === "admin" ? "/admin-dashboard" : "/user-dashboard";
    navItems.push({ to: dashboardPath, label: "Dashboard" });
  }

  const menuVariants = {
    closed: { opacity: 0, y: -100 },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.2 },
    }),
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90, transition: { duration: 0.2 } },
  };

  const warningVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const chatButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, boxShadow: "0 0 12px rgba(0, 255, 255, 0.5)" },
    tap: { scale: 0.95 },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const cartButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartItemCount(0);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItemCount(0);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const totalItems = data.data.items.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(totalItems);
        }
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemCount(0);
    }
  };

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated]);

  return (
    <>
      <nav className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-2 sm:p-3 md:p-4 fixed w-full top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                variants={logoVariants}
                initial="initial"
                whileHover="hover"
                className="flex-shrink-0"
              >
                <Link to="/" className="block">
                  <img 
                    src="/public/favicon.svg" 
                    alt="Clutch Coins Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain filter brightness-110"
                  />
                </Link>
              </motion.div>
              
              {/* Brand Text */}
              <div className="flex flex-col items-start">
                <Link
                  to="/"
                  className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white hover:text-cyan-300 transition-colors duration-200"
                >
                  Clutch <span className="text-cyan-500">Coins</span>
                </Link>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-left text-white text-xs sm:text-sm md:text-base font-semibold tracking-wider select-none"
                >
                  INSTANT RECHARGE. INSTANT VICTORY!
                </motion.div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleChatClick}
                variants={chatButtonVariants}
                initial="initial"
                animate="pulse"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-1.5 bg-green-600 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-green-500 transition-colors duration-200"
                aria-label="Open live chat"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Live Chat</span>
              </motion.button>
              <motion.button
                onClick={toggleMenu}
                className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded p-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                variants={hamburgerVariants}
                animate={isOpen ? "open" : "closed"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="md:hidden bg-gradient-to-b from-blue-900 to-slate-950 rounded-md shadow-lg p-4 mt-2"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    className="py-2"
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="text-white text-base font-medium hover:text-cyan-300 block"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <div className="relative flex items-center gap-2">
                    <Search className="w-5 h-5 text-white" />
                    <input
                      id="header-search-desktop"
                      name="search"
                      type="text"
                      value={searchQuery}
                      placeholder="Search games..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                    />
                    {showSearchDropdown && searchResults.length > 0 && (
                      <div className="absolute top-full left-6 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((game) => (
                          <div
                            key={game.id}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-600 last:border-b-0"
                            onClick={() => handleSearchResultClick(game)}
                          >
                            <div className="font-medium">{game.title}</div>
                            <div className="text-xs text-gray-400">{game.pageName}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <select
                    value={language}
                    onChange={switchLanguage}
                    className="bg-gray-800 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="EN">EN</option>
                    <option value="HI">HI</option>
                  </select>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <motion.button
                        onClick={() => {
                          navigate('/account');
                          setIsOpen(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:text-cyan-300"
                      >
                        <User className="w-5 h-5" />
                        My Account
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:text-cyan-300"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={openLogin}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200"
                        aria-label="Login"
                      >
                        <User className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={openSignup}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200"
                        aria-label="Sign Up"
                      >
                        <UserPlus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="hidden md:flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  <Link
                    to={item.to}
                    className="relative text-white text-base font-medium hover:text-cyan-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center gap-2">
                <Search className="w-5 h-5 text-white" />
                <input
                  id="header-search-mobile"
                  name="search"
                  type="text"
                  value={searchQuery}
                  placeholder="Search games..."
                  className="bg-gray-800 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={handleSearch}
                  onBlur={handleSearchBlur}
                />
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-6 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-600 last:border-b-0"
                        onClick={() => handleSearchResultClick(game)}
                      >
                        <div className="font-medium">{game.title}</div>
                        <div className="text-xs text-gray-400">{game.pageName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <select
                value={language}
                onChange={switchLanguage}
                className="bg-gray-800 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="EN">EN</option>
                <option value="HI">HI</option>
              </select>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => navigate('/account')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/cart')}
                    whileHover={cartButtonVariants.hover}
                    className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200 relative"
                    aria-label="Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-white text-sm font-medium hover:text-cyan-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={openLogin}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={openSignup}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center bg-gray-800 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors duration-200"
                    aria-label="Sign Up"
                  >
                    <UserPlus className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-6 rounded-xl shadow-2xl w-full max-w-5xl relative flex justify-center"
            >
              <button
                onClick={() => setShowChat(false)}
                className="absolute -top-1 right-3 text-white hover:text-white text-2xl"
              >
                &times;
              </button>
              <div className="w-full m-[-50px]">
                <Messages />
              </div>
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-6 rounded-xl shadow-2xl max-w-md w-full relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-cyan-300 hover:text-white text-2xl"
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
            className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center px-4"
          >
            <motion.div
              variants={warningVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-6 rounded-xl shadow-2xl max-w-sm w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Are you sure?</h3>
              </div>
              <p className="text-sm text-gray-300 mb-6">Do you want to logout of your account?</p>
              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={cancelLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  No
                </motion.button>
                <motion.button
                  onClick={confirmLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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