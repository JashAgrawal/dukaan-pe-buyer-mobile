import apiClient from "../apiClient";
import { Store, StoresListResponse } from "@/types/store";

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
    return response.data;
  },

  /**
   * Get nearby stores based on location
   */
  getNearbyStores: async (
    lat: number,
    lng: number,
    distance = 10,
    limit = 10
  ) => {
    const response = await apiClient.get("/stores/nearby", {
      params: { lat, lng, distance, limit },
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
   * Get top brands (stores with isBrand=true)
   */
  getTopBrands: async (limit = 10) => {
    const response = await apiClient.get<StoresListResponse>("/stores", {
      params: {
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
