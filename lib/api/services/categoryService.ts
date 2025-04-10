import apiClient from "../apiClient";

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
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

// Get all categories
export const getCategories = async (
  page: number = 1,
  limit: number = 10
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
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category> => {
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
};
