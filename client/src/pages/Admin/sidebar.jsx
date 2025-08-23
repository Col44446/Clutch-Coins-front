import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

function Sidebar() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />; // 🔹 Token guard

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // logout and redirect
  };

  const navItems = [
    { to: '/admin-dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/blog-post', label: 'Post Blog', icon: DocumentTextIcon },
    { to: '/admin/games', label: 'All Games', icon: Squares2X2Icon },
    { to: '/admin/games/add', label: 'Add Game', icon: PlusCircleIcon },
    { to: '/admin/users', label: 'Users', icon: UsersIcon },
    { to: '/admin/settings', label: 'Settings', icon: CogIcon },
    { to: '#', label: 'Logout', icon: ArrowLeftOnRectangleIcon, action: handleLogout },
  ];

  const sidebarVariants = {
    open: { width: '250px', transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { width: '80px', transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: 'easeOut' },
    }),
  };

  return (
    <>
      <Helmet>
        <title>Game Zone Admin Panel</title>
        <meta name="description" content="Admin panel for Game Zone to manage dashboard, blogs, games, users, settings, and more." />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <motion.nav
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="mt-26 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 h-screen fixed left-0 top-0 z-40 shadow-2xl overflow-hidden hidden lg:block"
        aria-label="Admin panel sidebar"
        role="navigation"
      >
        <div className="flex flex-col h-full p-4">
          <button
            onClick={toggleSidebar}
            className="flex justify-end mb-4 text-cyan-400 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
          <div className="flex-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
                className="mb-2"
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex items-center px-4 py-3 w-full text-left text-white text-base font-medium rounded-lg hover:bg-blue-800"
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {isOpen && item.label}
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className="flex items-center px-4 py-3 text-white text-base font-medium rounded-lg hover:bg-blue-800"
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {isOpen && item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default Sidebar;