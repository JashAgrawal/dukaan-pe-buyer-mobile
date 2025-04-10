import { useInfiniteQuery } from "@tanstack/react-query";
import storeService from "../services/storeService";
import { Store } from "@/types/store";

// Hook for fetching top brands with pagination
export const useTopBrands = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["brands", "top"],
    queryFn: ({ pageParam = 1 }) => storeService.getTopBrands(pageParam, limit),
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
export const flattenBrands = (data: any): Store[] => {
  if (!data || !data.pages) return [];

  // Flatten the pages
  const allBrands = data.pages.flatMap((page: any) => page.data?.stores || []);

  // Remove duplicates by _id
  const uniqueBrands = Array.from(
    new Map(allBrands.map((store: Store) => [store._id, store])).values()
  );

  return uniqueBrands;
};
