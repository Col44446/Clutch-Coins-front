import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/header";
import { Home } from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import CreateBlog from "./pages/Admin/PostBlog";
import BlogsList from "./components/BlogList";
import AdminRoute from "./components/AdminRoute"; // 🔹 Guard import
import Footer from "./components/common/Footer";
import AddGame from "./pages/Admin/addGame";
import AllGames from "./pages/Admin/AllGames";
import AllGame from "./pages/AllGames";
import GameDetails from "./components/GameSection/GameDetails";
import Login from "./components/Login";
import Signup from "./components/LogSign";
import OTPVerify from "./components/OTPVerify";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/games" element={<AllGame />} />
        <Route path="/games/:id" element={<GameDetails />} /> {/* 🔹 New route for GameDetails */}

        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/blog-post"
          element={
            <AdminRoute>
              <CreateBlog />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/games"
          element={
            <AdminRoute>
              <AllGames />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/games/add"
          element={
            <AdminRoute>
              <AddGame />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/games/edit/:id"
          element={
            <AdminRoute>
              <AddGame isEdit={true} />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;