import apiClient from "../apiClient";

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
  parentId?: string | null;
  popularityIndex?: number;
  noOfStores?: number;
}

export interface CategoriesResponse {
  status: string;
  results: number;
  data: {
    categories: Category[];
  };
  pagination?: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

export interface SubcategoriesResponse {
  status: string;
  results: number;
  data: {
    subcategories: Category[];
  };
  pagination?: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

/**
 * Service for interacting with category-related API endpoints
 */
export const categoryService = {
  /**
   * Get all parent store categories
   */
  getStoreCategories: async (
    page = 1,
    limit = 20
  ): Promise<CategoriesResponse> => {
    try {
      const response = await apiClient.get<CategoriesResponse>(
        "/store-categories",
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return default response in case of error
      return {
        status: "error",
        results: 8,
        data: {
          categories: [
            { _id: "1", name: "Food" },
            { _id: "2", name: "Salon & Spa" },
            { _id: "3", name: "Healthcare" },
            { _id: "4", name: "Online brands" },
            { _id: "5", name: "Office" },
            { _id: "6", name: "Electronics" },
            { _id: "7", name: "Fashion" },
            { _id: "8", name: "Home" },
          ],
        },
        pagination: {
          page: 1,
          pages: 1,
          limit,
          total: 8,
        },
      };
    }
  },

  /**
   * Get subcategories for a parent category
   */
  getStoreSubcategories: async (
    parentCategoryId: string,
    page = 1,
    limit = 20
  ): Promise<SubcategoriesResponse> => {
    try {
      const response = await apiClient.get<SubcategoriesResponse>(
        "/store-categories/sub",
        {
          params: { parentCategoryId, page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subcategories for parent ${parentCategoryId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get stores by category
   */
  getStoresByCategory: async (categoryId: string, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(
        `/store-categories/${categoryId}/stores`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching stores for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<{
        status: string;
        data: { category: Category };
      }>(`/store-categories/${id}`);
      return response.data.data.category;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },
};

// For backward compatibility
export const getCategories = categoryService.getStoreCategories;
export const getCategoryById = categoryService.getCategoryById;

export default categoryService;
