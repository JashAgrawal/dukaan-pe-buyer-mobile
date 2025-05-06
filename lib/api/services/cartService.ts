import apiClient from "../apiClient";
import { Cart, CartResponse, AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, ApplyCouponRequest } from "@/types/cart";

/**
 * Service for interacting with cart-related API endpoints
 */
export const cartService = {
  /**
   * Get user's cart
   * @param storeId Optional store ID to filter cart by store
   */
  getUserCart: async (storeId?: string): Promise<CartResponse> => {
    try {
      const url = storeId ? `/cart?storeId=${storeId}` : "/cart";
      console.log("cartService - getUserCart - url:", url);
      const response = await apiClient.get<CartResponse>(url);
      console.log("cartService - getUserCart - response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  },

  /**
   * Get user's cart for a specific store
   * @param storeId Store ID to get cart for
   */
  getStoreCart: async (storeId: string): Promise<CartResponse> => {
    try {
      const response = await apiClient.get<CartResponse>(`/cart?storeId=${storeId}`);
      console.log("Store cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart for store ${storeId}:`, error);
      throw error;
    }
  },

  /**
   * Add item to cart
   */
  addItemToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    try {
      console.log("cartService - addItemToCart - data:", JSON.stringify(data, null, 2));
      const response = await apiClient.post<CartResponse>("/cart/add-item", data);
      console.log("cartService - addItemToCart - response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  /**
   * Update cart item
   */
  updateCartItem: async (itemId: string, data: UpdateCartItemRequest): Promise<CartResponse> => {
    try {
      console.log("cartService - updateCartItem - itemId:", itemId);
      console.log("cartService - updateCartItem - data:", JSON.stringify(data, null, 2));
      // Use the product ID instead of item ID for cart operations
      // The itemId parameter should be the product ID
      const productId = data.itemId || itemId;
      console.log("cartService - updateCartItem - using productId:", productId);
      const response = await apiClient.patch<CartResponse>(`/cart/update-quantity/${productId}`, data);
      console.log("cartService - updateCartItem - response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  removeItemFromCart: async (data: RemoveFromCartRequest): Promise<CartResponse> => {
    try {
      console.log("cartService - removeItemFromCart - data:", JSON.stringify(data, null, 2));
      // Use product ID instead of item ID for cart operations
      const productId = data.itemId; // itemId should be the product ID
      const response = await apiClient.delete<CartResponse>(`/cart/remove-item/${productId}`, {
        data
      });
      console.log("cartService - removeItemFromCart - response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  },

  /**
   * Apply coupon to cart
   */
  applyCoupon: async (data: ApplyCouponRequest): Promise<CartResponse> => {
    try {
      const response = await apiClient.post<CartResponse>("/cart/apply-coupon", data);
      return response.data;
    } catch (error) {
      console.error("Error applying coupon to cart:", error);
      throw error;
    }
  },

  /**
   * Remove coupon from cart
   */
  removeCoupon: async (): Promise<CartResponse> => {
    try {
      const response = await apiClient.delete<CartResponse>("/cart/remove-coupon");
      return response.data;
    } catch (error) {
      console.error("Error removing coupon from cart:", error);
      throw error;
    }
  },
};

export default cartService;
