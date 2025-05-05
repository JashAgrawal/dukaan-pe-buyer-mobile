import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import productService, { ProductFilterOptions } from "../services/productService";

/**
 * Hook to fetch products by store with pagination
 */
export const useProductsByStore = (storeId: string, limit = 10, categoryId?: string | null) => {
  return useInfiniteQuery({
    queryKey: ["products", "store", storeId, categoryId],
    queryFn: ({ pageParam = 1 }) => {
      // If categoryId is provided, use it to filter products
      if (categoryId) {
        return productService.searchProductsWithFilters({
          store_id: storeId,
          categoryIds: [categoryId],
          page: pageParam,
          limit,
        });
      }
      // Otherwise, fetch all products for the store
      return productService.getProductsByStore(storeId, pageParam, limit);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storeId,
  });
};

/**
 * Hook to fetch top selling products with pagination
 */
export const useTopSellingProducts = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["products", "top-selling"],
    queryFn: ({ pageParam = 1 }) =>
      productService.getTopSellingProducts(pageParam, limit),
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

/**
 * Hook to fetch best rated products with pagination
 */
export const useBestRatedProducts = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["products", "best-rated"],
    queryFn: ({ pageParam = 1 }) =>
      productService.getBestRatedProducts(pageParam, limit),
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

/**
 * Hook to search products with filters
 */
export const useProductSearch = (filters: ProductFilterOptions) => {
  return useInfiniteQuery({
    queryKey: ["productSearch", filters],
    queryFn: ({ pageParam = 1 }) => {
      return productService.searchProductsWithFilters({
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
 * Helper function to flatten products response
 */
export const flattenProducts = (data: any): any[] => {
  if (!data) return [];

  return data.pages?.reduce((acc: any[], page: any) => {
    if (page?.data?.products) {
      return [...acc, ...page.data.products];
    }
    return acc;
  }, []) || [];
};
