import { useInfiniteQuery } from "@tanstack/react-query";
import { storeService, StoreFilterOptions } from "../services/storeService";
import { Store } from "@/types/store";

/**
 * Hook to search stores with filters and infinite scrolling
 */
export const useStoreSearch = (filters: StoreFilterOptions) => {
  return useInfiniteQuery({
    queryKey: ["storeSearch", filters],
    queryFn: ({ pageParam = 1 }) => {
      return storeService.searchStoresWithFilters({
        ...filters,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.page < pagination.pages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!filters.query || !!filters.categoryIds?.length,
  });
};

/**
 * Helper function to flatten store search results
 */
export const flattenStoreSearchResults = (data: any): Store[] => {
  if (!data || !data.pages) {
    return [];
  }

  return data.pages.flatMap((page: any) => {
    if (page && page.data && page.data.stores) {
      return page.data.stores;
    }
    return [];
  });
};
