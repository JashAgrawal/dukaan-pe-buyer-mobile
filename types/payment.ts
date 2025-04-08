import { ApiResponse } from './api';

/**
 * Payment related types
 */

// Payment verification request
export interface PaymentVerificationRequest {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

// Payment verification response
export interface PaymentVerificationResponse extends ApiResponse<{ 
  success: boolean;
  order: string; // Order ID
}> {}

// Payment initiation request
export interface PaymentInitiationRequest {
  orderId: string;
}

// Payment initiation response
export interface PaymentInitiationResponse extends ApiResponse<{
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}> {}
