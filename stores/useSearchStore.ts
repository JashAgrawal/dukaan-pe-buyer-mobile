import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  searchStores,
  searchProductsOverall,
  getPopularStores,
} from "@/lib/api/services/searchService";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface SearchItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  tagline?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  storeId?: string;
  storeName?: string;
}

interface SearchState {
  recentSearches: SearchItem[];
  popularStores: SearchItem[];
  searchQuery: string;
  isSearching: boolean;
  searchResults: SearchItem[];
  productResults: SearchItem[];
  storeResults: SearchItem[];
  activeTab: "all" | "products" | "stores";

  // Actions
  setSearchQuery: (query: string) => void;
  addToRecentSearches: (item: SearchItem) => void;
  clearRecentSearches: () => void;
  removeFromRecentSearches: (id: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (results: SearchItem[]) => void;
  setActiveTab: (tab: "all" | "products" | "stores") => void;

  // API search functions
  performSearch: (query: string) => void;
  loadPopularStores: () => void;
}

// Initial popular stores data will be loaded from the service

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      popularStores: [],
      searchQuery: "",
      isSearching: false,
      searchResults: [],
      productResults: [],
      storeResults: [],
      activeTab: "all",

      setSearchQuery: (query) => set({ searchQuery: query }),

      addToRecentSearches: (item) => {
        const currentSearches = get().recentSearches;
        // Remove if already exists to avoid duplicates
        const filteredSearches = currentSearches.filter(
          (search) => search.id !== item.id
        );
        // Add to the beginning of the array (most recent first)
        set({ recentSearches: [item, ...filteredSearches].slice(0, 10) }); // Keep only 10 most recent
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      removeFromRecentSearches: (id) => {
        const currentSearches = get().recentSearches;
        set({
          recentSearches: currentSearches.filter((item) => item.id !== id),
        });
      },

      setIsSearching: (isSearching) => set({ isSearching }),

      setSearchResults: (results) => set({ searchResults: results }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      performSearch: async (query) => {
        set({ isSearching: true });

        try {
          // Call search service for stores and products in parallel
          const [stores, products] = await Promise.all([
            searchStores(query),
            searchProductsOverall(query),
          ]);

          // Combine results for the 'all' tab
          const allResults = [...stores, ...products];

          set({
            searchResults: allResults,
            productResults: products,
            storeResults: stores,
            isSearching: false,
          });
        } catch (error) {
          console.error("Search error:", error);
          set({
            searchResults: [],
            productResults: [],
            storeResults: [],
            isSearching: false,
          });
        }
      },

      // Load popular stores from API
      loadPopularStores: async () => {
        try {
          const stores = await getPopularStores();
          set({ popularStores: stores });
        } catch (error) {
          console.error("Error loading popular stores:", error);
        }
      },
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        popularStores: state.popularStores,
      }),
    }
  )
);
