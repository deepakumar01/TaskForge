// src/api/axios.js
// Configured Axios instance for making API requests

import axios from "axios";

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("taskforge_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the token is invalid or expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("taskforge_token");
      localStorage.removeItem("taskforge_user");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
