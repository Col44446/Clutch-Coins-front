import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  FaDownload
} from 'react-icons/fa';
import Sidebar from './sidebar';
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

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const [usersRes, gamesRes, ordersRes] = await Promise.allSettled([
        fetch(`${baseURL}/users/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseURL}/games`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseURL}/cart/all-orders`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      let totalUsers = 0, recentUsers = [], totalGames = 0, games = [], totalOrders = 0, totalRevenue = 0, recentOrders = [];

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

      setDashboardData({ totalUsers, totalGames, totalOrders, totalRevenue, recentUsers, recentOrders, games });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        totalUsers: 156,
        totalGames: 24,
        totalOrders: 89,
        totalRevenue: 12450,
        recentUsers: [
          { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14', status: 'Active' }
        ],
        recentOrders: [
          { id: 1, customerName: 'Alice Brown', amount: 29.99, status: 'Completed', date: '2024-01-15' },
          { id: 2, customerName: 'Bob Wilson', amount: 19.99, status: 'Processing', date: '2024-01-14' }
        ],
        games: [
          { id: 1, title: 'Cyber Quest', image: '/api/placeholder/300/400', price: '$29.99', downloads: 1250, rating: 4.8, status: 'Active' },
          { id: 2, title: 'Space Warriors', image: '/api/placeholder/300/400', price: '$19.99', downloads: 890, rating: 4.6, status: 'Active' }
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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchDashboardData();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  const handleGameAction = async (gameId, action) => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/games/${gameId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchDashboardData();
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

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium">{title}</p>
          <p className="text-lg font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded bg-${color}-500/20`}>
          <Icon className={`text-${color}-400 text-lg`} />
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FaUsers} title="Total Users" value={dashboardData.totalUsers.toLocaleString()} color="blue" />
        <StatCard icon={FaGamepad} title="Total Games" value={dashboardData.totalGames} color="purple" />
        <StatCard icon={FaDollarSign} title="Total Revenue" value={`₹${dashboardData.totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={FaShoppingCart} title="Total Orders" value={dashboardData.totalOrders.toLocaleString()} color="orange" />
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {dashboardData.recentUsers.map(user => (
            <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <p className="text-white text-sm">{user.name} joined - <span className="text-gray-400">{user.joinDate}</span></p>
            </div>
          ))}
          {dashboardData.recentOrders.map(order => (
            <div key={order.id} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <p className="text-white text-sm">{order.customerName} ordered - <span className="text-gray-400">{order.date}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Users</h3>
        <motion.button whileHover={{ scale: 1.05 }} className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
          <FaUserPlus /> Add User
        </motion.button>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-3 text-gray-300">Name</th>
              <th className="text-left p-3 text-gray-300">Email</th>
              <th className="text-left p-3 text-gray-300">Status</th>
              <th className="text-left p-3 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3 text-white">{user.name}</td>
                <td className="p-3 text-gray-300">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} className="text-blue-400"><FaEye /></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} className="text-yellow-400"><FaEdit /></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} className="text-red-400"><FaTrash /></motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Games</h3>
        <motion.button whileHover={{ scale: 1.05 }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
          <FaGamepad /> Add Game
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardData.games.map(game => (
          <motion.div key={game.id} whileHover={{ scale: 1.02 }} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-bold text-white">{game.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${game.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {game.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Downloads:</span><span className="text-white">{game.downloads}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Rating:</span><span className="text-green-400">{game.rating}</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              <motion.button whileHover={{ scale: 1.05 }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm">View</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 rounded text-sm">Edit</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Orders</h3>
        <motion.button whileHover={{ scale: 1.05 }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
          <FaDownload /> Export
        </motion.button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center py-8">
        <FaShoppingCart className="text-4xl text-gray-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white mb-1">Order Management</h4>
        <p className="text-gray-400 text-sm">Track orders, manage refunds, and view analytics.</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-base font-bold text-white mb-3">General</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Site Name</label>
              <input type="text" defaultValue="ClutchCoins" className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Description</label>
              <textarea defaultValue="Instant Recharge. Instant Victory!" className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 h-16" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-base font-bold text-white mb-3">Payments</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">UPI Payments</span>
              <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Card Payments</span>
              <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Net Banking</span>
              <div className="w-10 h-5 bg-gray-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ClutchCoins</title>
        <meta name="description" content="ClutchCoins admin dashboard for managing users, games, and orders" />
      </Helmet>
      <div className="mt-20 pl-30 min-h-screen bg-gray-900 flex">
        <main className="flex-1 pt-16 pb-6 px-4 sm:px-6 lg:pr-8 max-w-2xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-2">
            Admin Dashboard
          </motion.h1>
          <p className="text-gray-400 text-sm mb-4">Manage your ClutchCoins platform</p>
          <div className="mb-4 flex space-x-1 bg-gray-800 p-1 rounded-lg border border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-1 px-3 py-1 rounded font-medium text-sm ${activeTab === tab.id ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                <tab.icon className="text-sm" /> {tab.label}
              </motion.button>
            ))}
          </div>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'games' && renderGames()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'settings' && renderSettings()}
          </motion.div>
        </main>
        <Sidebar className="fixed right-0 top-0 h-screen z-40 hidden lg:block" />
      </div>
    </>
  );
};

export default AdminDashboard;