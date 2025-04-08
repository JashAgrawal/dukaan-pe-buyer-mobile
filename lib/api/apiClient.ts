import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// Base URL for API requests
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000"; // Replace with your actual API URL

// Token key in secure storage
const TOKEN_KEY = "auth_token";

console.log(API_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // TODO: Implement logout or token refresh logic
        console.error("Unauthorized access. Please login again.");
      }

      // Handle 500 Server Error
      if (error.response.status >= 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Network error
      console.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
