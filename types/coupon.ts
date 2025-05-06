import { ApiResponse } from './api';

/**
 * Coupon related types
 */

// Coupon discount type
export type CouponDiscountType = 'amount' | 'percentage';

// Coupon
export interface Coupon {
  id: string;
  code: string;
  type: CouponDiscountType;
  discountAmt: number;
  discountPercentage: number;
  maxDiscount?: number;
  isActive: boolean;
  products: CouponProduct[];
}

// Product that a coupon applies to
export interface CouponProduct {
  _id: string;
  name: string;
  mainImage?: string;
  price: number;
  sellingPrice: number;
}

// Discount details for a product when a coupon is applied
export interface DiscountDetail {
  product: {
    id: string;
    name: string;
    price: number;
    sellingPrice: number;
  };
  quantity: number;
  discount: number;
}

// Coupon response
export interface CouponResponse extends ApiResponse<{ coupon: Coupon }> {}

// Coupons list response
export interface CouponsListResponse extends ApiResponse<{ coupons: Coupon[] }> {}

// Coupon validation response
export interface CouponValidationResponse extends ApiResponse<{
  valid: boolean;
  coupon?: Coupon;
  totalDiscount?: number;
  discountDetails?: DiscountDetail[];
}> {}
