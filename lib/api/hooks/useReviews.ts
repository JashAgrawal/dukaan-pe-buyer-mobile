import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../services/reviewService";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch store reviews
 */
export const useStoreReviews = (storeId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["storeReviews", storeId, page, limit],
    queryFn: () => reviewService.getStoreReviews(storeId, page, limit),
    enabled: !!storeId,
  });
};

/**
 * Hook to create a store review
 */
export const useCreateStoreReview = (storeId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (data: {
      rating: number;
      review: string;
      images?: string[];
      tags?: string[];
    }) => reviewService.createStoreReview(storeId, data),
    onSuccess: () => {
      // Invalidate the store reviews query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["storeReviews", storeId] });
    },
  });
};

/**
 * Hook to fetch product reviews
 */
export const useProductReviews = (productId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["productReviews", productId, page, limit],
    queryFn: () => reviewService.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
};

/**
 * Hook to create a product review
 */
export const useCreateProductReview = (productId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (data: {
      rating: number;
      review: string;
      images?: string[];
      tags?: string[];
    }) => reviewService.createProductReview(productId, data),
    onSuccess: () => {
      // Invalidate the product reviews query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });
};

/**
 * Hook to fetch user's reviews
 */
export const useUserReviews = (page = 1, limit = 10) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["userReviews", page, limit],
    queryFn: () => reviewService.getUserReviews(page, limit),
    enabled: isAuthenticated,
  });
};
