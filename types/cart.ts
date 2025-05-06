import { ApiResponse } from './api';
import { Product } from './product';

/**
 * Cart related types
 */

// Cart item
export interface CartItem {
  _id: string;
  product: string | Product;
  quantity: number;
  variant?: string;
  size?: string;
  price: number;
  total: number;
}

// Cart coupon
export interface CartCoupon {
  _id: string;
  code: string;
  discountAmt: number;
  discountPercentage: number;
  maxDiscount?: number;
  type: 'amount' | 'percentage';
}

// Cart
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon: CartCoupon | null;
  offer: string | null;
  isActive: boolean;
  state: 'active' | 'checkout' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

// Add item to cart request
export interface AddToCartRequest {
  store: string;
  product: string;
  quantity: number;
  variant?: string;
  size?: string;
}

// Update cart item request
export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

// Remove item from cart request
export interface RemoveFromCartRequest {
  itemId: string;
}

// Apply coupon request
export interface ApplyCouponRequest {
  couponCode: string;
}

// Cart summary
export interface CartSummary {
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  offerDiscount: number;
  total: number;
}

// Cart response
export interface CartResponse extends ApiResponse<{
  cart: Cart;
  summary: CartSummary;
}> {}
