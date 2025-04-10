// This file is deprecated. Use lib/api/services/categoryService.ts instead.
// Keeping this file for backward compatibility.

import {
  getCategories as getCategoriesFromApi,
  Category,
} from "@/lib/api/services/categoryService";

export { Category };

/**
 * Get all categories
 * @param limit Number of categories to return (default: 10)
 * @returns Promise with categories
 */
export const getCategories = async (
  limit: number = 10
): Promise<Category[]> => {
  return getCategoriesFromApi(limit);
};
