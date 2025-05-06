import apiClient from "../apiClient";
import { 
  PaymentInitiationRequest, 
  PaymentInitiationResponse, 
  PaymentVerificationRequest, 
  PaymentVerificationResponse 
} from "@/types/payment";

/**
 * Service for interacting with payment-related API endpoints
 */
export const paymentService = {
  /**
   * Create a Razorpay order for payment
   * @param data Payment initiation data containing orderId
   * @returns Promise with payment initiation response
   */
  createRazorpayOrder: async (data: PaymentInitiationRequest): Promise<PaymentInitiationResponse> => {
    try {
      const response = await apiClient.post<PaymentInitiationResponse>(
        "/payments/create-razorpay-order", 
        data
      );
      return response.data;
    } catch (error) {
      console.log(error);
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  },

  /**
   * Verify a payment after it's completed
   * @param data Payment verification data
   * @returns Promise with payment verification response
   */
  verifyPayment: async (data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        "/payments/verify-payment", 
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  /**
   * Get payment details for an order
   * @param orderId Order ID
   * @returns Promise with payment details
   */
  getPaymentDetailsByOrderId: async (orderId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment details for order ${orderId}:`, error);
      throw error;
    }
  },
};

export default paymentService;
