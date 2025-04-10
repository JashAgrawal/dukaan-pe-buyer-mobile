import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import storeService from "../services/storeService";
import { useLocation } from "@/hooks/useLocation";
import { Store } from "@/types/store";

// Hook for fetching top selling stores with pagination
export const useTopSellingStores = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["stores", "top-selling"],
    queryFn: ({ pageParam = 1 }) => storeService.getTopSellingStores(pageParam, limit),
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

// Hook for fetching best rated stores with pagination
export const useBestRatedStores = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["stores", "best-rated"],
    queryFn: ({ pageParam = 1 }) => storeService.getBestRatedStores(pageParam, limit),
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

// Hook for fetching nearby stores with pagination
export const useNearbyStores = (limit = 10, distance = 10) => {
  const { location } = useLocation();
  
  return useInfiniteQuery({
    queryKey: ["stores", "nearby", location?.latitude, location?.longitude],
    queryFn: ({ pageParam = 1 }) => {
      if (!location?.latitude || !location?.longitude) {
        return { status: "success", results: 0, data: { stores: [] } };
      }
      return storeService.getNearbyStores(
        location.latitude, 
        location.longitude, 
        distance, 
        limit
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!location?.latitude && !!location?.longitude,
  });
};

// Hook for fetching favorite stores (from wishlist)
export const useFavoriteStores = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["stores", "favorites"],
    queryFn: ({ pageParam = 1 }) => storeService.getFavoriteStores(pageParam, limit),
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

// Helper function to flatten paginated results
export const flattenStores = (data: any): Store[] => {
  if (!data || !data.pages) return [];
  return data.pages.flatMap((page: any) => page.data?.stores || []);
};
