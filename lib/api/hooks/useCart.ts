import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import cartService from "../services/cartService";
import { AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, ApplyCouponRequest } from "@/types/cart";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch user's cart
 */
export const useCart = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getUserCart,
    enabled: isAuthenticated,
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addItemToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook to update cart item
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateCartItemRequest) => cartService.updateCartItem(data.itemId,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook to remove item from cart
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RemoveFromCartRequest) => cartService.removeItemFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook to apply coupon to cart
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ApplyCouponRequest) => cartService.applyCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook to remove coupon from cart
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
