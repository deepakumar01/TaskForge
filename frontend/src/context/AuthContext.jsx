// src/context/AuthContext.jsx
// Authentication context for managing user state across the app

import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component that wraps the app
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("taskforge_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token is still valid on app load
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("taskforge_token");
      if (token && user) {
        try {
          const response = await API.get("/auth/me");
          setUser((prev) => ({ ...prev, ...response.data.data }));
        } catch (error) {
          // Token is invalid, clear everything
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  // Register a new user
  const register = async (name, email, password, role) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    const userData = response.data.data;

    // Store token and user data
    localStorage.setItem("taskforge_token", userData.token);
    localStorage.setItem("taskforge_user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Login an existing user
  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const userData = response.data.data;

    // Store token and user data
    localStorage.setItem("taskforge_token", userData.token);
    localStorage.setItem("taskforge_user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Logout the user
  const logout = () => {
    localStorage.removeItem("taskforge_token");
    localStorage.removeItem("taskforge_user");
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (data) => {
    const response = await API.put("/auth/profile", data);
    const updatedUser = response.data.data;

    // Update stored user data
    const newUserData = { ...user, ...updatedUser };
    localStorage.setItem("taskforge_user", JSON.stringify(newUserData));
    setUser(newUserData);

    return updatedUser;
  };

  // Check if user is an admin
  const isAdmin = user?.role === "admin";

  // Values provided to all components
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
