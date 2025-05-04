import apiClient from "../apiClient";
import { Store, StoresListResponse } from "@/types/store";

/**
 * Interface for store filter options
 */
export interface StoreFilterOptions {
  query?: string;
  categoryIds?: string[];
  tags?: string[];
  type?: string;
  isOpen?: boolean;
  isBrand?: boolean;
  isPanIndia?: boolean;
  pincode?: string;
  sortBy?: "popularity" | "nearest" | "avgRating";
  page?: number;
  limit?: number;
}

/**
 * Service for interacting with store-related API endpoints
 */
export const storeService = {
  /**
   * Get all stores with pagination
   */
  getAllStores: async (page = 1, limit = 10, sort = "-createdAt") => {
    const response = await apiClient.get<StoresListResponse>("/stores", {
      params: { page, limit, sort },
    });
    return response.data;
  },

  /**
   * Get a single store by ID
   */
  getStoreById: async (id: string) => {
    const response = await apiClient.get(`/stores/${id}`);
    console.log("API Response for getStoreById:", response.data);

    // Check if the response has a data property containing the store
    if (response.data && response.data.data && response.data.data.store) {
      return response.data.data.store;
    }

    // If the response structure is different, try to find the store data
    if (response.data && response.data.store) {
      return response.data.store;
    }

    // If we can't find the store in the expected structure, return the raw data
    return response.data;
  },

  /**
   * Get top selling stores
   */
  getTopSellingStores: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/stores/top-selling", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get best rated stores
   */
  getBestRatedStores: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/stores/best-rated", {
      params: { page, limit },
    });
    console.log(
      `Best rated stores: ${JSON.stringify(response.data.data.stores)}`
    );
    return response.data;
  },

  /**
   * Get nearby stores based on location
   */
  getNearbyStores: async (
    lat: number,
    lng: number,
    distance = 100000,
    page = 1,
    limit = 10
  ) => {
    const response = await apiClient.get("/stores/nearby", {
      params: { latitude: lat, longitude: lng, distance, limit },
    });
    return response.data;
  },

  /**
   * Search stores by query
   */
  searchStores: async (q: string, page = 1, limit = 10) => {
    const response = await apiClient.get("/stores/search", {
      params: { q, page, limit },
    });
    return response.data;
  },

  /**
   * Search stores with advanced filters
   */
  searchStoresWithFilters: async (filters: StoreFilterOptions) => {
    const response = await apiClient.get("/stores/search-with-filters", {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get top brands (stores with isBrand=true)
   */
  getTopBrands: async (page = 1, limit = 10) => {
    const response = await apiClient.get<StoresListResponse>("/stores", {
      params: {
        page,
        limit,
        isBrand: true,
        sort: "-popularity_index",
      },
    });
    return response.data;
  },

  /**
   * Get favorite stores from user's wishlist
   */
  getFavoriteStores: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/store-wishlist", {
      params: { page, limit },
    });
    return response.data;
  },
};

export default storeService;
