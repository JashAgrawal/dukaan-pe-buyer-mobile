import apiClient from "../apiClient";
import { StoreImagesCollection, StoreImagesCollectionResponse, StoreImagesCollectionsListResponse } from "@/types/store";

/**
 * Service for interacting with store images API endpoints
 */
export const storeImagesService = {
  /**
   * Get all image collections for a store
   * @param storeId Store ID
   * @param page Page number (default: 1)
   * @param limit Number of results per page (default: 10)
   * @returns Promise with store image collections
   */
  getStoreImageCollections: async (storeId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<StoreImagesCollectionsListResponse>(
      `/store-images/store/${storeId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get a specific image collection by ID
   * @param collectionId Collection ID
   * @returns Promise with store image collection
   */
  getImageCollectionById: async (collectionId: string) => {
    const response = await apiClient.get<StoreImagesCollectionResponse>(
      `/store-images/${collectionId}`
    );
    return response.data;
  },
};

export default storeImagesService;
