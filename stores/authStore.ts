import { create } from "zustand";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/auth";

// Token key in secure storage
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Auth store state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create auth store
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  // Check authentication status
  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userDataString = await SecureStore.getItemAsync(USER_KEY);
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (token && userData) {
        set({ isAuthenticated: true, user: userData });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  // Login function
  login: async (token: string, userData: User) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      set({ isAuthenticated: true, user: userData });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      set({ isAuthenticated: false, user: null });
      router.replace("/auth/phone");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
}));

// Initialize auth state on app start
useAuthStore.getState().checkAuth();
