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

// Cart
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon: string | null;
  offer: string | null;
  isActive: boolean;
  state: 'active' | 'checkout' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

// Add item to cart request
export interface AddToCartRequest {
  productId: string;
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

// Cart response
export interface CartResponse extends ApiResponse<{ cart: Cart }> {}
