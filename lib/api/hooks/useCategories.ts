import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories, Category } from "../services/categoryService";

// Hook for fetching categories with pagination
export const useCategories = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: ({ pageParam = 1 }) => getCategories(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

// Helper function to flatten paginated results and remove duplicates
export const flattenCategories = (data: any): Category[] => {
  if (!data || !data.pages) return [];

  // Flatten the pages
  const allCategories = data.pages.flatMap(
    (page: any) => page.data?.categories || []
  );

  // Remove duplicates by _id and ensure correct typing
  const uniqueCategories = Array.from(
    new Map(
      allCategories.map((category: Category) => [category._id, category])
    ).values()
  ) as Category[];

  return uniqueCategories;
};
