import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import wishlistService from "../services/wishlistService";
import { Store } from "@/types/store";
import { useAuth } from "@/hooks/useAuth";

// Hook for fetching user's store wishlist with pagination
export const useStoreWishlist = (limit = 10) => {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: ["wishlist", "stores"],
    queryFn: ({ pageParam = 1 }) =>
      wishlistService.getStoreWishlist(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAuthenticated,
  });
};

// Hook for checking if a store is in the wishlist
export const useStoreWishlistStatus = (storeId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["wishlist", "status", storeId],
    queryFn: () => wishlistService.checkStoreWishlistStatus(storeId),
    enabled: !!storeId && isAuthenticated,
  });
};

// Hook for toggling store wishlist status with optimistic updates
export const useToggleStoreWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async ({
      storeId,
      isCurrentlyWishlisted,
    }: {
      storeId: string;
      isCurrentlyWishlisted: boolean;
    }) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      if (isCurrentlyWishlisted) {
        return wishlistService.removeStoreFromWishlist(storeId);
      } else {
        return wishlistService.addStoreToWishlist(storeId);
      }
    },

    // Optimistic update
    onMutate: async ({ storeId, isCurrentlyWishlisted }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      await queryClient.cancelQueries({
        queryKey: ["wishlist", "status", storeId],
      });

      // Snapshot the previous values
      const previousStatus = queryClient.getQueryData([
        "wishlist",
        "status",
        storeId,
      ]);

      const previousWishlist = queryClient.getQueryData([
        "wishlist",
        "stores",
      ]) as any;

      // Optimistically update the status
      queryClient.setQueryData(
        ["wishlist", "status", storeId],
        !isCurrentlyWishlisted
      );

      // If removing from wishlist, update the wishlist data
      if (isCurrentlyWishlisted && previousWishlist) {
        // This is a simplified approach - in a real app, you'd need to handle the pagination structure
        // For now, we'll just update the first page if it exists
        const updatedWishlist = { ...previousWishlist };
        if (updatedWishlist.pages && updatedWishlist.pages.length > 0) {
          updatedWishlist.pages = updatedWishlist.pages.map((page: any) => {
            if (!page.data || !page.data.wishlist) return page;

            return {
              ...page,
              data: {
                ...page.data,
                wishlist: page.data.wishlist.filter((item: any) => {
                  const itemStoreId =
                    typeof item.store === "string"
                      ? item.store
                      : item.store._id;
                  return itemStoreId !== storeId;
                }),
              },
            };
          });

          queryClient.setQueryData(["wishlist", "stores"], updatedWishlist);
        }
      }

      // Return a context object with the snapshotted values
      return { previousStatus, previousWishlist };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_error, variables, context) => {
      // Restore previous status
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          ["wishlist", "status", variables.storeId],
          context.previousStatus
        );
      }

      // Restore previous wishlist data
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          ["wishlist", "stores"],
          context.previousWishlist
        );
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "status", variables.storeId],
      });
    },
  });
};

// Export a function to get all wishlisted stores from the infinite query data
export const getWishlistedStores = (data: any): Store[] => {
  if (!data || !data.pages) return [];

  return data.pages.flatMap((page: any) =>
    page.data.wishlist.map(
      (item: any) =>
        typeof item.store === "string"
          ? { _id: item.store } // If store is just an ID
          : item.store // If store is a full object
    )
  );
};
