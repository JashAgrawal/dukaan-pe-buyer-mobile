import apiClient from "../apiClient";
import { Store } from "@/types/store";

export interface WishlistResponse {
  status: string;
  results?: number;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  data: {
    wishlist: {
      _id: string;
      user: string;
      store: Store | string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export interface WishlistItemResponse {
  status: string;
  data: {
    wishlist: {
      _id: string;
      user: string;
      store: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

/**
 * Service for interacting with wishlist-related API endpoints
 */
export const wishlistService = {
  /**
   * Get user's store wishlist
   */
  getStoreWishlist: async (page = 1, limit = 10) => {
    const response = await apiClient.get<WishlistResponse>("/store-wishlist", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Add store to wishlist
   */
  addStoreToWishlist: async (storeId: string) => {
    const response = await apiClient.post<WishlistItemResponse>(
      `/store-wishlist/${storeId}`
    );
    return response.data;
  },

  /**
   * Remove store from wishlist
   */
  removeStoreFromWishlist: async (storeId: string) => {
    const response = await apiClient.delete(`/store-wishlist/${storeId}`);
    return response.data;
  },

  /**
   * Check if store is in wishlist
   * This is a helper method that doesn't directly map to an API endpoint
   * but is useful for checking wishlist status
   */
  checkStoreWishlistStatus: async (storeId: string): Promise<boolean> => {
    try {
      const response = await wishlistService.getStoreWishlist(1, 100);
      const wishlistItems = response.data.wishlist;
      
      return wishlistItems.some((item) => {
        const store = typeof item.store === 'string' 
          ? item.store 
          : item.store._id;
        return store === storeId;
      });
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      return false;
    }
  },
};

export default wishlistService;
