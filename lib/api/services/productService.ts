import apiClient from "../apiClient";

/**
 * Interface for product filter options
 */
export interface ProductFilterOptions {
  query?: string;
  categoryIds?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "popularity" | "price_low" | "price_high" | "newest" | "rating";
  page?: number;
  limit?: number;
  storeId?: string; // Added for filtering by store
}

/**
 * Service for interacting with product-related API endpoints
 */
export const productService = {
  /**
   * Get all products with pagination
   */
  getAllProducts: async (page = 1, limit = 10, sort = "-createdAt") => {
    const response = await apiClient.get("/products", {
      params: { page, limit, sort },
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data.product;
  },

  /**
   * Get products for a specific store
   */
  getProductsByStore: async (storeId: string, page = 1, limit = 10) => {
    const response = await apiClient.get(`/products/store/${storeId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get top selling products
   */
  getTopSellingProducts: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/products/top-selling", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get best rated products
   */
  getBestRatedProducts: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/products/best-rated", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Search products by query
   */
  searchProducts: async (q: string, page = 1, limit = 10) => {
    const response = await apiClient.get("/products/search", {
      params: { q, page, limit },
    });
    return response.data;
  },

  /**
   * Search products with advanced filters
   */
  searchProductsWithFilters: async (filters: ProductFilterOptions) => {
    const response = await apiClient.get("/products/search-with-filters", {
      params: filters,
    });
    return response.data;
  },

  /**
   * Search products within a specific store
   */
  searchProductsInStore: async (storeId: string, filters: ProductFilterOptions) => {
    const response = await apiClient.get(`/products/search`, {
      params: {
        ...filters,
        store_id:storeId, // Include storeId in the params
      },
    });
    return response.data;
  },

  /**
   * Get product categories for a specific store
   */
  getProductCategoriesByStore: async (storeId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/product-categories/store/${storeId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default productService;
