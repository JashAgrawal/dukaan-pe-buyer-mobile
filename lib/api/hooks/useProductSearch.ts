import { useInfiniteQuery } from "@tanstack/react-query";
import { productService, ProductFilterOptions } from "../services/productService";
import { Product } from "@/types/product";

/**
 * Hook to search products with filters and infinite scrolling
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
 * Hook to search products within a specific store
 */
export const useStoreProductSearch = (storeId: string, filters: ProductFilterOptions) => {
  return useInfiniteQuery({
    queryKey: ["storeProductSearch", storeId, filters],
    queryFn: ({ pageParam = 1 }) => {
      return productService.searchProductsInStore(storeId, {
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
    enabled: !!storeId && (!!filters.query || !!filters.categoryIds?.length),
  });
};

/**
 * Helper function to flatten paginated product search results
 */
export const flattenProductSearchResults = (data: any): Product[] => {
  if (!data || !data.pages) return [];
  
  // Flatten the pages
  const allProducts = data.pages.flatMap(
    (page: any) => page.data?.products || []
  );
  
  // Remove duplicates by _id
  const uniqueProducts = Array.from(
    new Map(allProducts.map((product: Product) => [product._id, product])).values()
  ) as Product[];
  
  return uniqueProducts;
};
