import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  FaUsers, 
  FaGamepad, 
  FaShoppingCart, 
  FaDollarSign,
  FaEye,
  FaEdit,
  FaTrash,
  FaCog,
  FaChartLine,
  FaBell,
  FaUserPlus,
  FaDownload,
  FaExclamationTriangle
} from 'react-icons/fa';
import Sidebar from "./sidebar";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalGames: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentOrders: [],
    games: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // Fetch multiple endpoints in parallel
      const [usersRes, gamesRes, ordersRes] = await Promise.allSettled([
        fetch(`${baseURL}/api/users/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${baseURL}/api/games`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${baseURL}/api/cart/all-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Process users data
      let totalUsers = 0;
      let recentUsers = [];
      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const usersData = await usersRes.value.json();
        if (usersData.success) {
          totalUsers = usersData.data.length;
          recentUsers = usersData.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(user => ({
              id: user._id,
              name: user.name,
              email: user.email,
              joinDate: new Date(user.createdAt).toLocaleDateString(),
              status: user.isActive ? 'Active' : 'Inactive'
            }));
        }
      }

      // Process games data
      let totalGames = 0;
      let games = [];
      if (gamesRes.status === 'fulfilled' && gamesRes.value.ok) {
        const gamesData = await gamesRes.value.json();
        if (gamesData.success) {
          totalGames = gamesData.data.length;
          games = gamesData.data.map(game => ({
            id: game._id,
            title: game.title,
            image: game.image,
            price: game.price || 'Free',
            downloads: game.downloads || 0,
            rating: game.rating || 0,
            status: game.isActive ? 'Active' : 'Inactive'
          }));
        }
      }

      // Process orders data
      let totalOrders = 0;
      let totalRevenue = 0;
      let recentOrders = [];
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const ordersData = await ordersRes.value.json();
        if (ordersData.success) {
          totalOrders = ordersData.data.length;
          totalRevenue = ordersData.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          recentOrders = ordersData.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(order => ({
              id: order._id,
              customerName: order.customerName || 'Unknown',
              amount: order.totalAmount || 0,
              status: order.status || 'Pending',
              date: new Date(order.createdAt).toLocaleDateString()
            }));
        }
      }

      setDashboardData({
        totalUsers,
        totalGames,
        totalOrders,
        totalRevenue,
        recentUsers,
        recentOrders,
        games
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Fallback to static data if API fails
      setDashboardData({
        totalUsers: 156,
        totalGames: 24,
        totalOrders: 89,
        totalRevenue: 12450,
        recentUsers: [
          { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14', status: 'Active' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-01-13', status: 'Inactive' }
        ],
        recentOrders: [
          { id: 1, customerName: 'Alice Brown', amount: 29.99, status: 'Completed', date: '2024-01-15' },
          { id: 2, customerName: 'Bob Wilson', amount: 19.99, status: 'Processing', date: '2024-01-14' },
          { id: 3, customerName: 'Carol Davis', amount: 39.99, status: 'Completed', date: '2024-01-13' }
        ],
        games: [
          { id: 1, title: 'Cyber Quest', image: '/api/placeholder/300/400', price: '$29.99', downloads: 1250, rating: 4.8, status: 'Active' },
          { id: 2, title: 'Space Warriors', image: '/api/placeholder/300/400', price: '$19.99', downloads: 890, rating: 4.6, status: 'Active' },
          { id: 3, title: 'Fantasy Realm', image: '/api/placeholder/300/400', price: '$39.99', downloads: 2100, rating: 4.9, status: 'Active' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseURL}/api/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh data after action
        fetchDashboardData();
      }
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  const handleGameAction = async (gameId, action) => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseURL}/api/games/${gameId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh data after action
        fetchDashboardData();
      }
    } catch (error) {
      console.error(`Error performing ${action} on game:`, error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'games', label: 'Games', icon: FaGamepad },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`text-${color}-400 text-xl`} />
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={dashboardData.totalUsers.toLocaleString()}
          change={12.5}
          color="blue"
        />
        <StatCard
          icon={FaGamepad}
          title="Total Games"
          value={dashboardData.totalGames}
          change={8.3}
          color="purple"
        />
        <StatCard
          icon={FaDollarSign}
          title="Total Revenue"
          value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
          change={15.7}
          color="green"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          change={9.2}
          color="orange"
        />
        <StatCard
          icon={FaUsers}
          title="Active Users"
          value={dashboardData.recentUsers.filter(user => user.status === 'Active').length}
          change={-2.1}
          color="cyan"
        />
        <StatCard
          icon={FaExclamationTriangle}
          title="Pending Orders"
          value={dashboardData.recentOrders.filter(order => order.status === 'Pending').length}
          change={-18.5}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <FaBell className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {dashboardData.recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">{user.name} joined</p>
                <p className="text-gray-400 text-xs">{user.joinDate}</p>
              </div>
            </div>
          ))}
          {dashboardData.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">{order.customerName} placed an order</p>
                <p className="text-gray-400 text-xs">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">User Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaUserPlus />
          Add User
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-semibold">Name</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Join Date</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 text-white">{user.name}</td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{user.joinDate}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEye />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Game Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaGamepad />
          Add Game
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">{game.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                game.status === 'Active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {game.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Downloads:</span>
                <span className="text-white font-semibold">{game.downloads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rating:</span>
                <span className="text-green-400 font-semibold">{game.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm"
              >
                Edit
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Order Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaDownload />
          Export Orders
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-12">
          <FaShoppingCart className="text-6xl text-gray-600 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">Order Management</h4>
          <p className="text-gray-400">Order management functionality will be implemented here.</p>
          <p className="text-gray-400 text-sm mt-2">Track orders, manage refunds, and view order analytics.</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">System Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4">General Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="ClutchCoins"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Site Description</label>
              <textarea
                defaultValue="Instant Recharge. Instant Victory!"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-20"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4">Payment Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">UPI Payments</span>
              <div className="w-12 h-6 bg-green-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Card Payments</span>
              <div className="w-12 h-6 bg-green-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Net Banking</span>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'games':
        return renderGames();
      case 'orders':
        return renderOrders();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ClutchCoins</title>
        <meta name="description" content="ClutchCoins admin dashboard for managing users, games, orders, and system settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Admin Dashboard
            </motion.h1>
            <p className="text-gray-400">Manage your ClutchCoins platform</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl border border-gray-700 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="text-sm" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sidebar />
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
