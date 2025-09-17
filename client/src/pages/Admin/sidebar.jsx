import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, Gamepad2, FileText, LogOut, PlusCircle } from 'lucide-react';

function Sidebar() {
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin-dashboard' },
    { icon: Gamepad2, label: 'All Games', to: '/admin/game' },
    { icon: PlusCircle, label: 'Add Game', to: '/admin/game/add' },
    { icon: FileText, label: 'Create Blog', to: '/blog-post' },
    { icon: PlusCircle, label: 'Packages', to: '/admin/packages' },
    { icon: Gamepad2, label: 'Home Games', to: '/admin/home-games' },
    { icon: LogOut, label: 'Logout', action: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }},
  ];

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 } }),
  };

  return (
    <>
      <Helmet>
        <title>Game Zone Admin</title>
        <meta name="description" content="Admin panel for managing games and content" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b pt-26 from-blue-900 to-slate-950 h-screen fixed left-0 top-0 w-48 z-40 shadow-lg hidden lg:block"
      >
        <div className="flex flex-col h-full p-3">
          <div className="flex-1 space-y-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex items-center w-full p-2 text-white rounded hover:bg-blue-800"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className="flex items-center p-2 text-white rounded hover:bg-blue-800"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span className="text-sm">{item.label}</span>
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