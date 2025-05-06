import { ApiResponse } from './api';
import { Address } from './address';
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

// Order item
export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  discountedPrice: number;
  totalPrice: number;
  status: string;
  _id: string;
}

// Cart snapshot
export interface CartSnapshot {
  _id: string;
  originalCartId: string;
  user: string;
  store: string;
  items: {
    product: string;
    quantity: number;
    variant: string | null;
    size: string | null;
    effectivePrice: number;
    price: number;
    discountAmt: number;
    discountPercentage: number;
    couponDiscount: number;
    couponDiscountPercentage: number;
    offerDiscount: number;
    offerDiscountPercentage: number;
    _id: string;
  }[];
  coupon: string | null;
  offer: string | null;
  totalAmount: number;
  totalDiscount: number;
  couponDiscount: number;
  offerDiscount: number;
  deliveryCharges: number;
  payableAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Delivery tracking
export interface DeliveryTracking {
  _id: string;
  order: string;
  currentStatus: string;
  statusUpdates: {
    status: string;
    timestamp: string;
    description: string;
    _id: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order
export interface Order {
  _id: string;
  orderNumber: string;
  cartSnapshot: CartSnapshot;
  user: string | User;
  store: string;
  items: OrderItem[];
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  totalWithoutDiscount: number;
  totalPayableAmount: number;
  totalDiscount: number;
  couponDiscount: number;
  offerDiscount: number;
  coupon: string | null;
  offer: string | null;
  deliveryCharges: number;
  orderStatus: OrderStatus;
  isDelivery: boolean;
  deliveryType: DeliveryType;
  deliveryAddressId: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deliveryTrackingId?: DeliveryTracking;
  specialNoteBuyer?: string;
  specialNoteSeller?: string;
}

// Delivery type
export type DeliveryType =
  | 'home_delivery'
  | 'pickup';

// Create order request
export interface CreateOrderRequest {
  cartId: string;
  paymentType: PaymentType;
  deliveryAddressId?: string; // Optional for pickup
  isDelivery: boolean;
  deliveryType: DeliveryType;
  specialNoteBuyer?: string;
  specialNoteSeller?: string;
}

// Order response
export interface OrderResponse extends ApiResponse<Order> {}

// Orders list response
export interface OrdersListResponse extends ApiResponse<{ orders: Order[] }> {}
