import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import cartService from "../services/cartService";
import { AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, ApplyCouponRequest } from "@/types/cart";
import { useAuth } from "@/hooks/useAuth";
import { useCartContext } from "@/components/providers/CartProvider";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { useCartStore } from "@/stores/cartStore";

/**
 * Hook to fetch user's cart
 * @param storeId Optional store ID to filter cart by store
 */
export const useCart = (storeId?: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart", storeId],
    queryFn: () => cartService.getUserCart(storeId),
    enabled: isAuthenticated,
  });
};

/**
 * Hook to fetch user's cart for a specific store
 * @param storeId Store ID to get cart for
 */
export const useStoreCart = (storeId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart", storeId],
    queryFn: () => cartService.getStoreCart(storeId),
    enabled: isAuthenticated && !!storeId,
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addItemToCart(data),
    onSuccess: (_, variables) => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate the specific store cart query
      if (variables.store) {
        queryClient.invalidateQueries({ queryKey: ["cart", variables.store] });
      }
    },
  });
};

/**
 * Hook to update cart item
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { storeId } = useCartContext();
  const { activeStore } = useActiveStoreStore();
  const activeStoreId = activeStore?._id;

  return useMutation({
    mutationFn: (data: UpdateCartItemRequest) => {
      console.log("useUpdateCartItem - data:", JSON.stringify(data, null, 2));
      if (!data.itemId) {
        console.error("useUpdateCartItem - No itemId provided in data");
        throw new Error("No itemId provided");
      }
      return cartService.updateCartItem(data.itemId, data);
    },
    onSuccess: async (data) => {
      console.log("useUpdateCartItem - onSuccess - Response:", JSON.stringify(data, null, 2));

      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Invalidate the specific store cart query
      if (storeId) {
        console.log("useUpdateCartItem - invalidating cart query for storeId:", storeId);
        queryClient.invalidateQueries({ queryKey: ["cart", storeId] });
      }

      // Also invalidate for activeStoreId if different from storeId
      if (activeStoreId && activeStoreId !== storeId) {
        console.log("useUpdateCartItem - invalidating cart query for activeStoreId:", activeStoreId);
        queryClient.invalidateQueries({ queryKey: ["cart", activeStoreId] });
      }

      // Directly update the cart store with the new data
      try {
        console.log("useUpdateCartItem - updating cart store with new data");
        // Refetch the cart to ensure we have the latest data
        const cartStore = useCartStore.getState();
        if (activeStoreId) {
          await cartStore.fetchCart(activeStoreId);
        } else {
          await cartStore.fetchCart();
        }
      } catch (error) {
        console.error("useUpdateCartItem - Error updating cart store:", error);
      }
    },
    onError: (error) => {
      console.error("useUpdateCartItem - Error:", error);
    }
  });
};

/**
 * Hook to remove item from cart
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { storeId } = useCartContext();

  return useMutation({
    mutationFn: (data: RemoveFromCartRequest) => {
      console.log("useRemoveCartItem - data:", JSON.stringify(data, null, 2));
      if (!data.itemId) {
        console.error("useRemoveCartItem - No itemId provided in data");
        throw new Error("No itemId provided");
      }
      return cartService.removeItemFromCart(data);
    },
    onSuccess: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate the specific store cart query
      if (storeId) {
        queryClient.invalidateQueries({ queryKey: ["cart", storeId] });
      }
    },
  });
};

/**
 * Hook to apply coupon to cart
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const { storeId } = useCartContext();

  return useMutation({
    mutationFn: (data: ApplyCouponRequest) => cartService.applyCoupon(data),
    onSuccess: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate the specific store cart query
      if (storeId) {
        queryClient.invalidateQueries({ queryKey: ["cart", storeId] });
      }
    },
  });
};

/**
 * Hook to remove coupon from cart
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  const { storeId } = useCartContext();

  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate the specific store cart query
      if (storeId) {
        queryClient.invalidateQueries({ queryKey: ["cart", storeId] });
      }
    },
  });
};
