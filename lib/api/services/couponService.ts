import apiClient from "../apiClient";
import { ApiResponse } from "@/types/api";
import { Coupon, CouponValidationResponse } from "@/types/coupon";

/**
 * Service for interacting with coupon-related API endpoints
 */
export const couponService = {
  /**
   * Get available coupons for a store
   * If cartId is provided, it will only return coupons applicable to the cart
   *
   * @param storeId - The ID of the store
   * @param cartId - Optional cart ID to check coupon applicability
   */
  getAvailableCoupons: async (storeId: string, cartId?: string): Promise<ApiResponse<{ coupons: Coupon[] }>> => {
    try {
      const params: Record<string, string> = { storeId };
      if (cartId) {
        params.cartId = cartId;
      }

      const response = await apiClient.get("/coupons/available", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching available coupons:", error);
      throw error;
    }
  },

  /**
   * Get coupon details by ID
   *
   * @param couponId - The ID of the coupon
   */
  getCouponById: async (couponId: string): Promise<ApiResponse<{ coupon: Coupon }>> => {
    try {
      const response = await apiClient.get(`/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching coupon with ID ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Validate a coupon code for a specific store
   *
   * @param couponCode - The coupon code to validate
   * @param storeId - The ID of the store
   */
  validateCouponCode: async (couponCode: string, storeId: string): Promise<ApiResponse<{ valid: boolean; coupon?: Coupon }>> => {
    try {
      const response = await apiClient.get(`/coupons/validate/${couponCode}`, {
        params: { store: storeId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error validating coupon code ${couponCode}:`, error);
      throw error;
    }
  },

  /**
   * Validate a coupon for a specific cart
   * This checks if the coupon is applicable to the items in the cart and calculates the discount
   *
   * @param couponCode - The coupon code to validate
   * @param storeId - The ID of the store
   * @param cartId - The ID of the cart
   */
  validateCouponForCart: async (
    couponCode: string,
    storeId: string,
    cartId: string
  ): Promise<CouponValidationResponse> => {
    try {
      const response = await apiClient.post("/coupons/validate", {
        couponCode,
        storeId,
        cartId
      });
      return response.data;
    } catch (error) {
      console.error(`Error validating coupon for cart:`, error);
      throw error;
    }
  },

  /**
   * Apply a coupon to the user's cart
   *
   * @param couponCode - The coupon code to apply
   */
  applyCouponToCart: async (couponCode: string): Promise<ApiResponse<{ cart: any }>> => {
    try {
      const response = await apiClient.post("/cart/apply-coupon", {
        couponCode
      });
      return response.data;
    } catch (error) {
      console.error(`Error applying coupon to cart:`, error);
      throw error;
    }
  },

  /**
   * Remove a coupon from the user's cart
   */
  removeCouponFromCart: async (): Promise<ApiResponse<{ cart: any }>> => {
    try {
      const response = await apiClient.delete("/cart/remove-coupon");
      return response.data;
    } catch (error) {
      console.error(`Error removing coupon from cart:`, error);
      throw error;
    }
  }
};

export default couponService;
