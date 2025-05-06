import apiClient from "../apiClient";
import { CreateOrderRequest, OrderResponse, OrdersListResponse, Order } from "@/types/order";

/**
 * Service for interacting with order-related API endpoints
 */
export const orderService = {
  /**
   * Create a new order
   * @param data Order creation data
   * @returns Promise with order response
   */
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      const response = await apiClient.post<OrderResponse>("/orders", data);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  /**
   * Get all orders for the current user
   * @param page Page number (default: 1)
   * @param limit Number of results per page (default: 10)
   * @returns Promise with orders list response
   */
  getUserOrders: async (page = 1, limit = 10): Promise<OrdersListResponse> => {
    try {
      const response = await apiClient.get<OrdersListResponse>("/orders", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  /**
   * Get a specific order by ID
   * @param id Order ID
   * @returns Promise with order response
   */
  getOrderById: async (id: string): Promise<OrderResponse> => {
    try {
      const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
      console.log("Order response:", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param id Order ID
   * @param reason Cancellation reason
   * @returns Promise with order response
   */
  cancelOrder: async (id: string, reason: string): Promise<OrderResponse> => {
    try {
      const response = await apiClient.patch<OrderResponse>(`/orders/${id}/cancel`, {
        cancelReason: reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    }
  },
};

export default orderService;
