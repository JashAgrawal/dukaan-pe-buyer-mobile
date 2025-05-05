import apiClient from "../apiClient";
import { Cart, CartResponse, AddToCartRequest, UpdateCartItemRequest, RemoveFromCartRequest, ApplyCouponRequest } from "@/types/cart";

/**
 * Service for interacting with cart-related API endpoints
 */
export const cartService = {
  /**
   * Get user's cart
   */
  getUserCart: async (): Promise<CartResponse> => {
    try {
      const response = await apiClient.get<CartResponse>("/cart");
      console.log("Cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  },

  /**
   * Add item to cart
   */
  addItemToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    try {
      const response = await apiClient.post<CartResponse>("/cart/add-item", data);
      return response.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  /**
   * Update cart item
   */
  updateCartItem: async (productId: string, data: UpdateCartItemRequest): Promise<CartResponse> => {
    try {
      const response = await apiClient.patch<CartResponse>(`/cart/update-quantity/${productId}`, data);
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
      const response = await apiClient.delete<CartResponse>(`/cart/remove-item/${data.itemId}`, {
        data
      });
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
