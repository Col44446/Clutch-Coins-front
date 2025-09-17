import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import SEOHead from './components/common/SEOHead';
import CustomScrollbar from "./components/common/CustomScrollbar";
import './App.css';
import { Home } from './pages/Home';
// Main Pages

import AccountPage from './pages/Account/AccountPage';
import CartPage from './pages/Cart/CartPage';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Common Components
import UserDashboard from "./pages/User/UserDashboard";
import CreateBlog from "./pages/Admin/PostBlog";
import AddGame from "./pages/Admin/addGame";
import AllGames from "./pages/Admin/AllGames";
import AllGame from "./pages/AllGames";

// Purchase Pages
import PaymentGateway from "./pages/Purchase/PaymentGateway";
import PurchaseSuccess from "./pages/Purchase/PurchaseSuccess";

// Components
import BlogsList from "./components/BlogList";
import GameDetails from "./components/GameSection/GameDetails";
import Login from "./components/Login";
import Signup from "./components/LogSign";
import OTPVerify from "./components/OTPVerify";
import AdminRoute from "./components/AdminRoute";
import PackageButtons from "./pages/Admin/PackageButtons";

// Policy & Info Pages
import Terms from './components/Policies/Terms';
import Privacy from './components/Policies/Privacy';
import ReturnPolicy from './components/Policies/ReturnPolicy';
import OurStory from './components/About/OurStory';
import PaymentOptions from './pages/PaymentOptions';
import FAQ from './pages/FAQ';
import HowToUse from './pages/HowToUse';
import DeliveryInfo from './pages/DeliveryInfo';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import HomeGames from './pages/Admin/HomeGames';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/games" element={<AllGame />} />
        <Route path="/games/:id" element={<GameDetails />} />
        
        {/* Purchase Routes */}
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/purchase-success" element={<PurchaseSuccess />} />
        
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/returns" element={<ReturnPolicy />} />
        <Route path="/about" element={<OurStory />} />
        <Route path="/payments" element={<PaymentOptions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/guide" element={<HowToUse />} />
        <Route path="/shipping" element={<DeliveryInfo />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog-post" element={<AdminRoute><CreateBlog /></AdminRoute>} />
        <Route path="/admin/game" element={<AdminRoute><AllGames /></AdminRoute>} />
        <Route path="/admin/game/add" element={<AdminRoute><AddGame /></AdminRoute>} />
        <Route path="/admin/packages" element={<AdminRoute><PackageButtons /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/home-games" element={<AdminRoute><HomeGames /></AdminRoute>} />

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <CustomScrollbar />
    </div>
    </ErrorBoundary>
  );
}

export default App;