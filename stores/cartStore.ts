import { create } from "zustand";
import { Cart, CartSummary, AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, ApplyCouponRequest } from "@/types/cart";
import cartService from "@/lib/api/services/cartService";
import { useActiveStoreStore } from "./activeStoreStore";

// Define the Cart store state
interface CartState {
  cart: Cart | null;
  summary: CartSummary | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchCart: (storeId?: string) => Promise<void>;
  addToCart: (data: AddToCartRequest) => Promise<void>;
  updateCartItem: (data: UpdateCartItemRequest) => Promise<void>;
  removeCartItem: (data: RemoveFromCartRequest) => Promise<void>;
  applyCoupon: (data: ApplyCouponRequest) => Promise<void>;
  removeCoupon: () => Promise<void>;

  // Helper methods
  isProductInCart: (productId: string) => { isInCart: boolean; quantity: number; cartItemId: string };
  clearCart: () => void;
}

// Create the Cart store
export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  summary: null,
  isLoading: false,
  error: null,

  // Fetch cart for a specific store
  fetchCart: async (storeId?: string) => {
    try {
      // Set loading state but keep existing cart data until we have new data
      set(state => ({ ...state, isLoading: true, error: null }));
      console.log("cartStore - fetchCart - storeId:", storeId);

      // Check if the requested store ID matches the active store
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;
      if (storeId && activeStoreId && storeId !== activeStoreId) {
        console.log("cartStore - fetchCart - store ID mismatch, clearing cart");
        set({
          cart: null,
          summary: null,
          isLoading: false
        });
        return;
      }

      const response = await cartService.getUserCart(storeId);
      console.log("cartStore - fetchCart - response:", JSON.stringify(response, null, 2));

      // Check if we have a valid cart response
      if (response && response.data && response.data.cart) {
        // Double-check if the cart belongs to the active store
        console.log("cartStore - fetchCart - cart store:", response.data.cart.store);
        const isCurrentStoreCart = activeStoreId && response.data.cart.store?._id === activeStoreId;

        if (isCurrentStoreCart || !activeStoreId) {
          console.log("cartStore - fetchCart - setting cart data");
          set({
            cart: response.data.cart,
            summary: response.data.summary,
            isLoading: false
          });
        } else {
          console.log("cartStore - fetchCart - cart does not belong to active store");
          set({
            cart: null,
            summary: null,
            isLoading: false
          });
        }
      } else {
        console.log("cartStore - fetchCart - no valid cart in response");
        set({
          cart: null,
          summary: null,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // On error, clear the cart to prevent stale data
      set({
        cart: null,
        summary: null,
        error: error as Error,
        isLoading: false
      });
    }
  },

  // Add item to cart
  addToCart: async (data: AddToCartRequest) => {
    try {
      set({ isLoading: true, error: null });
      console.log("cartStore - addToCart - data:", JSON.stringify(data, null, 2));

      // Call the API to add the item
      await cartService.addItemToCart(data);
      console.log("cartStore - addToCart - item added successfully");

      // Refetch the entire cart to get the latest state
      const { fetchCart } = get();
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;

      if (activeStoreId) {
        console.log("cartStore - addToCart - refetching cart for store:", activeStoreId);
        await fetchCart(activeStoreId);
      } else {
        console.log("cartStore - addToCart - no active store, refetching cart without storeId");
        await fetchCart();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Update cart item
  updateCartItem: async (data: UpdateCartItemRequest) => {
    try {
      set({ isLoading: true, error: null });
      console.log("cartStore - updateCartItem - data:", JSON.stringify(data, null, 2));

      if (!data.itemId) {
        throw new Error("No itemId provided");
      }

      // Call the API to update the item
      await cartService.updateCartItem(data.itemId, data);
      console.log("cartStore - updateCartItem - item updated successfully");

      // Refetch the entire cart to get the latest state
      const { fetchCart } = get();
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;

      if (activeStoreId) {
        console.log("cartStore - updateCartItem - refetching cart for store:", activeStoreId);
        await fetchCart(activeStoreId);
      } else {
        console.log("cartStore - updateCartItem - no active store, refetching cart without storeId");
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Remove item from cart
  removeCartItem: async (data: RemoveFromCartRequest) => {
    try {
      set({ isLoading: true, error: null });
      console.log("cartStore - removeCartItem - data:", JSON.stringify(data, null, 2));

      if (!data.itemId) {
        throw new Error("No itemId provided");
      }

      // Call the API to remove the item
      await cartService.removeItemFromCart(data);
      console.log("cartStore - removeCartItem - item removed successfully");

      // Refetch the entire cart to get the latest state
      const { fetchCart } = get();
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;

      if (activeStoreId) {
        console.log("cartStore - removeCartItem - refetching cart for store:", activeStoreId);
        await fetchCart(activeStoreId);
      } else {
        console.log("cartStore - removeCartItem - no active store, refetching cart without storeId");
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Apply coupon to cart
  applyCoupon: async (data: ApplyCouponRequest) => {
    try {
      set({ isLoading: true, error: null });
      console.log("cartStore - applyCoupon - data:", JSON.stringify(data, null, 2));

      // Call the API to apply the coupon
      await cartService.applyCoupon(data);
      console.log("cartStore - applyCoupon - coupon applied successfully");

      // Refetch the entire cart to get the latest state
      const { fetchCart } = get();
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;

      if (activeStoreId) {
        console.log("cartStore - applyCoupon - refetching cart for store:", activeStoreId);
        await fetchCart(activeStoreId);
      } else {
        console.log("cartStore - applyCoupon - no active store, refetching cart without storeId");
        await fetchCart();
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("cartStore - removeCoupon");

      // Call the API to remove the coupon
      await cartService.removeCoupon();
      console.log("cartStore - removeCoupon - coupon removed successfully");

      // Refetch the entire cart to get the latest state
      const { fetchCart } = get();
      const activeStoreId = useActiveStoreStore.getState().activeStore?._id;

      if (activeStoreId) {
        console.log("cartStore - removeCoupon - refetching cart for store:", activeStoreId);
        await fetchCart(activeStoreId);
      } else {
        console.log("cartStore - removeCoupon - no active store, refetching cart without storeId");
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing coupon:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Check if a product is in the cart
  isProductInCart: (productId: string) => {
    const { cart } = get();

    // If cart is empty or doesn't exist, product is not in cart
    if (!cart || !cart.items || cart.items.length === 0) {
      return { isInCart: false, quantity: 0, cartItemId: '' };
    }

    // Find the item in the cart
    const cartItem = cart.items.find(item => {
      // Handle both string product IDs and object products
      if (typeof item.product === 'string') {
        return item.product === productId;
      }
      return item.product._id === productId;
    });

    // If item found, return its details
    if (cartItem) {
      return {
        isInCart: true,
        quantity: cartItem.quantity,
        cartItemId: cartItem._id,
      };
    }

    // Item not found in cart
    return {
      isInCart: false,
      quantity: 0,
      cartItemId: '',
    };
  },

  // Clear cart
  clearCart: () => {
    set({ cart: null, summary: null });
  },
}));
