import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    if (token && userId && userName) {
      setIsLoggedIn(true);
      setUser({ _id: userId, name: userName, role });
      // Verify token on app load
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && response.data.user) {
        setIsLoggedIn(true);
        setUser(response.data.user);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("role", response.data.user.role || "user");
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};