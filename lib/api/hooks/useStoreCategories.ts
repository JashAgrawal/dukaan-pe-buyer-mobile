import { useQuery } from "@tanstack/react-query";
import { categoryService, Category } from "../services/categoryService";

/**
 * Hook to fetch store categories
 */
export const useStoreCategories = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["storeCategories", page, limit],
    queryFn: () => categoryService.getStoreCategories(page, limit),
  });
};

/**
 * Hook to fetch subcategories for a parent category
 */
export const useStoreSubcategories = (parentCategoryId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["storeSubcategories", parentCategoryId, page, limit],
    queryFn: () => categoryService.getStoreSubcategories(parentCategoryId, page, limit),
    enabled: !!parentCategoryId,
  });
};

/**
 * Hook to fetch stores by category
 */
export const useStoresByCategory = (categoryId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["storesByCategory", categoryId, page, limit],
    queryFn: () => categoryService.getStoresByCategory(categoryId, page, limit),
    enabled: !!categoryId,
  });
};

/**
 * Helper function to flatten categories response
 */
export const flattenCategories = (data: any): Category[] => {
  if (!data || !data.data || !data.data.categories) {
    return [];
  }
  return data.data.categories;
};

/**
 * Helper function to flatten subcategories response
 */
export const flattenSubcategories = (data: any): Category[] => {
  if (!data || !data.data || !data.data.subcategories) {
    return [];
  }
  return data.data.subcategories;
};
