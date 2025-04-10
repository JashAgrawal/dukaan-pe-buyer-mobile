import { useEffect } from "react";
import { getCategories } from "@/lib/api/services/categoryService";

/**
 * Hook to prefetch categories data
 */
export const useCategoriesInit = () => {
  useEffect(() => {
    // Prefetch categories when the app starts
    const prefetchCategories = async () => {
      try {
        await getCategories();
      } catch (error) {
        console.error("Error prefetching categories:", error);
      }
    };

    prefetchCategories();
  }, []);
};
