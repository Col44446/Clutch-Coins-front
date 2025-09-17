import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { showToast } from './Toast';

const ProfileDropdown = ({ userName = "User" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const url = role === "admin"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/logout`
        : `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`;
      
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event('authStateChanged'));
      
      showToast('Successfully logged out', 'success');
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => {
        setIsOpen(false);
        navigate('/account');
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => {
        setIsOpen(false);
        navigate('/account');
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      action: handleLogout,
      className: 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gray-800 text-white rounded-full px-3 py-1.5 hover:bg-cyan-600 transition-colors"
        aria-label="Profile menu"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:block">{userName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  onClick={item.action}
                  whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors ${item.className || ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
