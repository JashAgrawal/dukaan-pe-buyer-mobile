import { ApiResponse } from './api';
import { Address } from './address';
import { Cart, CartItem } from './cart';
import { User } from './auth';

/**
 * Order related types
 */

// Order status
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

// Payment status
export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

// Payment type
export type PaymentType = 
  | 'card' 
  | 'upi' 
  | 'netbanking' 
  | 'wallet' 
  | 'cod';

// Order
export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon: string | null;
  offer: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  paymentId?: string;
  deliveryAddress: string | Address;
  specialNoteBuyer?: string;
  specialNoteSeller?: string;
  createdAt: string;
  updatedAt: string;
}

// Create order request
export interface CreateOrderRequest {
  cartId: string;
  paymentType: PaymentType;
  deliveryAddressId: string;
  specialNoteBuyer?: string;
  specialNoteSeller?: string;
}

// Order response
export interface OrderResponse extends ApiResponse<{ order: Order }> {}

// Orders list response
export interface OrdersListResponse extends ApiResponse<{ orders: Order[] }> {}
