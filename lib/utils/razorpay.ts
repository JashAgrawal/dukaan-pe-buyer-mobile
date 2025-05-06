import RazorpayCheckout from 'react-native-razorpay';
import { Alert } from 'react-native';

/**
 * Interface for Razorpay options
 */
export interface RazorpayOptions {
  key: string;
  amount: string; // Razorpay expects amount as string
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
  notes?: Record<string, string>;
}

/**
 * Interface for Razorpay success response
 */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Interface for Razorpay error response
 */
export interface RazorpayErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

/**
 * Open Razorpay payment checkout
 * @param options Razorpay options
 * @returns Promise that resolves with payment details on success or rejects with error on failure
 */
export const openRazorpayCheckout = (options: RazorpayOptions): Promise<RazorpaySuccessResponse> => {
  return new Promise((resolve, reject) => {
    RazorpayCheckout.open(options)
      .then((data: RazorpaySuccessResponse) => {
        // Handle success
        resolve(data);
      })
      .catch((error: RazorpayErrorResponse) => {
        // Handle failure
        reject(error);
      });
  });
};

/**
 * Handle Razorpay payment error
 * @param error Razorpay error response
 */
export const handleRazorpayError = (error: RazorpayErrorResponse) => {
  let errorMessage = 'Payment failed. Please try again.';

  if (error.description) {
    errorMessage = error.description;
  } else if (error.reason) {
    errorMessage = error.reason;
  }

  Alert.alert('Payment Failed', errorMessage);
  console.error('Razorpay payment failed:', error);
};
