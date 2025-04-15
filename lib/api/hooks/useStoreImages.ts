import { useQuery } from "@tanstack/react-query";
import storeImagesService from "../services/storeImagesService";
import { StoreImagesCollection } from "@/types/store";

/**
 * Hook to fetch all image collections for a store
 * @param storeId Store ID
 * @param page Page number (default: 1)
 * @param limit Number of results per page (default: 10)
 * @returns Query result with store image collections
 */
export const useStoreImageCollections = (storeId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["storeImages", storeId, page, limit],
    queryFn: () => storeImagesService.getStoreImageCollections(storeId, page, limit),
    enabled: !!storeId,
  });
};

/**
 * Hook to fetch a specific image collection by ID
 * @param collectionId Collection ID
 * @returns Query result with store image collection
 */
export const useImageCollectionById = (collectionId: string) => {
  return useQuery({
    queryKey: ["storeImageCollection", collectionId],
    queryFn: () => storeImagesService.getImageCollectionById(collectionId),
    enabled: !!collectionId,
  });
};

/**
 * Helper function to flatten store image collections from paginated response
 * @param data Query data from useStoreImageCollections
 * @returns Flattened array of store image collections
 */
export const flattenStoreImageCollections = (data: any): StoreImagesCollection[] => {
  if (!data || !data.data || !data.data.storeImagesCollections) {
    return [];
  }
  return data.data.storeImagesCollections;
};
