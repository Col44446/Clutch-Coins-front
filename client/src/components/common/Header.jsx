import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertCircle, MessageCircle, Search, User, UserPlus } from "lucide-react";
import Signup from "../LogSign";
import Login from "../Login";
import Messages from "../Messages";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [modalType, setModalType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

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

  const role = localStorage.getItem("role");
  let navItems = [
    { to: "/games", label: "Games" },
    { to: "/blogs", label: "Blogs" },
    { to: "/about", label: "About us" },
  ];
  if (isAuthenticated) {
    const dashboardPath = role === "admin" ? "/admin-dashboard" : "/user-dashboard";
    navItems.push({ to: dashboardPath, label: "Dashboard" });
  }
  navItems.push({ to: "/more", label: "More" });

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

  return (
    <>
      <nav className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-3 fixed w-full top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <Link
                to="/"
                className="text-2xl sm:text-3xl font-bold text-white hover:text-cyan-300 transition-colors duration-200"
              >
                Clutch <span className="text-cyan-500">Coins</span>
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-left text-white text-xs sm:text-sm font-semibold tracking-wider select-none"
              >
                INSTANT RECHARGE. INSTANT VICTORY!
              </motion.div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleChatClick}
                variants={chatButtonVariants}
                initial="initial"
                animate="pulse"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-green-500 transition-colors duration-200"
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
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-white" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-gray-800 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                    />
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
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-white text-sm font-medium hover:text-cyan-300"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </motion.button>
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
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
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
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white text-sm font-medium hover:text-cyan-300"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </motion.button>
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
                  on Close={closeModal}
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