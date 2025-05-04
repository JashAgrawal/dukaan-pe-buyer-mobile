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
      console.log("Visiting store with ID:", storeId);

      // Fetch store data from API
      const storeData = await storeService.getStoreById(storeId);
      console.log("Fetched store data:", JSON.stringify(storeData, null, 2));

      if (storeData) {
        // Ensure we have a valid store object with required fields
        const validStore: Store = {
          _id: storeData._id || storeId,
          name: storeData.name || "Unknown Store",
          description: storeData.description || "",
          logo: storeData.logo || "",
          coverImage: storeData.coverImage || "",
          createdAt: storeData.createdAt || new Date().toISOString(),
          updatedAt: storeData.updatedAt || new Date().toISOString(),
          ...storeData // Include all other fields from the API response
        };

        console.log("Setting active store:", validStore.name);
        set({ activeStore: validStore, isLoading: false });

        // Navigate to store-home page
        console.log("Navigating to store home page");
        router.navigate(`/store-home/${storeId}`);
        return;
      }

      console.error("Store data not found for ID:", storeId);
      set({ error: "Store not found", isLoading: false });
    } catch (error) {
      console.error("Error visiting store:", error);
      set({ error: "Failed to visit store", isLoading: false });
    }
  },
}));
