import { SearchItem } from "@/stores/useSearchStore";
import apiClient from "../apiClient";

/**
 * Search for stores based on query
 * @param query Search query
 * @param page Page number (default: 1)
 * @param limit Number of results per page (default: 10)
 * @returns Promise with search results
 */
export const searchStores = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchItem[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const response = await apiClient.get("/stores/search", {
      params: {
        q: query,
        page,
        limit,
      },
    });

    // Map API response to SearchItem format
    return response.data.data.stores.map((store: any) => ({
      id: store._id,
      name: store.name,
      category: store.category?.name || "",
      imageUrl: store.logo || store.mainImage || "",
      tagline: store.tagline,
      rating: store.averageRating,
      reviewCount: store.reviewCount,
    }));
  } catch (error) {
    console.error("Error searching stores:", error);
    return [];
  }
};

/**
 * Search for products based on query
 * @param query Search query
 * @param page Page number (default: 1)
 * @param limit Number of results per page (default: 10)
 * @returns Promise with search results
 */
export const searchProductsOverall = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  pincode?: string
): Promise<SearchItem[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const response = await apiClient.get("/products/search-overall", {
      params: {
        q: query,
        page,
        limit,
        pincode,
      },
    });

    // Map API response to SearchItem format
    return response.data.data.products.map((product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category?.name || "",
      imageUrl: product.mainImage || "",
      price: product.sellingPrice,
      rating: product.averageRating,
      reviewCount: product.reviewCount,
      storeId: product.store?._id,
      storeName: product.store?.name,
    }));
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

/**
 * Search for products in a specific store
 * @param storeId Store ID
 * @param query Search query
 * @param page Page number (default: 1)
 * @param limit Number of results per page (default: 10)
 * @returns Promise with search results
 */
export const searchProductsInStore = async (
  storeId: string,
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchItem[]> => {
  try {
    if (!query.trim() || !storeId) {
      return [];
    }

    const response = await apiClient.get(`/products/search`, {
      params: {
        q: query,
        page,
        limit,
        store_id: storeId,
      },
    });

    // Map API response to SearchItem format
    return response.data.data.products.map((product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category?.name || "",
      imageUrl: product.mainImage || "",
      price: product.sellingPrice,
      rating: product.averageRating,
      reviewCount: product.reviewCount,
      storeId: storeId,
      storeName: product.store?.name,
    }));
  } catch (error) {
    console.error(`Error searching products in store ${storeId}:`, error);
    return [];
  }
};

/**
 * Search for both stores and products
 * @param query Search query
 * @returns Promise with combined search results
 */
export const searchItems = async (
  query: string,
  pincode?: string
): Promise<SearchItem[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    // Search for both stores and products in parallel
    const [stores, products] = await Promise.all([
      searchStores(query),
      searchProductsOverall(query, 1, 5, pincode),
    ]);

    // Combine and return results
    return [...stores, ...products];
  } catch (error) {
    console.error("Error searching items:", error);
    return [];
  }
};

/**
 * Get popular stores
 * @param limit Number of stores to return (default: 4)
 * @returns Promise with popular stores
 */
export const getPopularStores = async (
  limit: number = 4
): Promise<SearchItem[]> => {
  try {
    // Using top-selling stores as popular stores
    const response = await apiClient.get("/stores/top-selling", {
      params: { limit },
    });

    // Map API response to SearchItem format
    return response.data.data.stores.map((store: any) => ({
      id: store._id,
      name: store.name,
      category: store.category?.name || "",
      imageUrl: store.logo || store.mainImage || "",
      rating: store.averageRating,
      reviewCount: store.reviewCount,
    }));
  } catch (error) {
    console.error("Error fetching popular stores:", error);
    return [];
  }
};

/**
 * Get store details by ID
 * @param id Store ID
 * @returns Promise with store details
 */
export const getStoreById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/stores/${id}`);
    return response.data.data.store;
  } catch (error) {
    console.error(`Error fetching store with ID ${id}:`, error);
    throw error;
  }
};
