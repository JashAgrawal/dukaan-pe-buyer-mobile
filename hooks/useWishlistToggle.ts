import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./useAuth";
import { useToggleStoreWishlist } from "@/lib/api/hooks/useWishlist";

/**
 * Custom hook to handle wishlist toggling with authentication check
 * This hook returns a function that can be used to toggle a store's wishlist status
 */
export const useWishlistToggle = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const toggleWishlist = useToggleStoreWishlist();

  // Return a memoized function to handle toggling
  const handleToggleWishlist = useCallback(
    (storeId: string, isCurrentlyWishlisted: boolean) => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.navigate("/auth/phone");
        return;
      }

      // Use the mutation with optimistic updates
      toggleWishlist.mutate(
        {
          storeId,
          isCurrentlyWishlisted,
        },
        {
          // Add onSuccess callback to show feedback
          onSuccess: () => {
            console.log(
              `Store ${
                isCurrentlyWishlisted ? "removed from" : "added to"
              } wishlist`
            );
          },
          // Add onError callback to show error
          onError: (error) => {
            console.error("Error toggling wishlist:", error);
          },
        }
      );
    },
    [isAuthenticated, router, toggleWishlist]
  );

  return {
    toggleWishlist: handleToggleWishlist,
    isLoading: toggleWishlist.isPending,
  };
};

export default useWishlistToggle;
