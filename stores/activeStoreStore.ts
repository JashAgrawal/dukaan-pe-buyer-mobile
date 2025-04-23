import { create } from "zustand";
import { Store } from "@/types/store";
import { router } from "expo-router";
import storeService from "@/lib/api/services/storeService";

// Define the ActiveStore store state
interface ActiveStoreState {
  activeStore: Store | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveStore: (store: Store) => void;
  clearActiveStore: () => void;

  // Methods to set active store from different sources
  setActiveStoreById: (storeId: string) => Promise<void>;
  visitStore: (storeId: string) => Promise<void>;
}

// Create the ActiveStore store
export const useActiveStoreStore = create<ActiveStoreState>()((set) => ({
  activeStore: null,
  isLoading: false,
  error: null,

  // Set active store
  setActiveStore: (store) => {
    set({ activeStore: store, error: null });
  },

  // Clear active store
  clearActiveStore: () => {
    set({ activeStore: null, error: null });
  },

  // Set active store by ID (fetches store data from API)
  setActiveStoreById: async (storeId) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch store data from API
      const storeData = await storeService.getStoreById(storeId);

      if (storeData) {
        set({ activeStore: storeData, isLoading: false });
        return;
      }

      set({ error: "Store not found", isLoading: false });
    } catch (error) {
      console.error("Error setting active store by ID:", error);
      set({ error: "Failed to set active store", isLoading: false });
    }
  },

  // Visit store (sets active store and navigates to store-home)
  visitStore: async (storeId) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch store data from API
      const storeData = await storeService.getStoreById(storeId);

      if (storeData) {
        set({ activeStore: storeData, isLoading: false });

        // Navigate to store-home page
        router.push(`/store-home/${storeId}`);
        return;
      }

      set({ error: "Store not found", isLoading: false });
    } catch (error) {
      console.error("Error visiting store:", error);
      set({ error: "Failed to visit store", isLoading: false });
    }
  },
}));
