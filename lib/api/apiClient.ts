import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { isStoredTokenValid } from "@/lib/utils/tokenUtils";

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

    // Check if token is valid before adding to headers
    if (token) {
      // Check if token is valid (not expired)
      const isValid = await isStoredTokenValid();

      if (isValid) {
        // Add valid token to headers
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token is expired, log the user out
        console.log("Token expired during request, logging out...");
        const logout = useAuthStore.getState().logout;
        await logout();

        // Don't add expired token to headers
        // The request will likely fail with 401, which will be handled by response interceptor
      }
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
  async (error) => {
    // Handle common errors
    if (error.response) {
      // Handle 401 Unauthorized (expired or invalid token)
      if (error.response.status === 401) {
        console.error("Unauthorized access. Token may be expired or invalid.");

        try {
          // Get the logout function from auth store
          const logout = useAuthStore.getState().logout;

          // Log the user out
          await logout();

          // Redirect to auth screen
          if (router.canGoBack()) {
            router.replace("/auth/phone");
          }
        } catch (logoutError) {
          console.error("Error during logout:", logoutError);
        }
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
