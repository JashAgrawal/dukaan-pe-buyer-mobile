import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { CreateOrderRequest, Order } from "@/types/order";
import { PaymentVerificationRequest } from "@/types/payment";

/**
 * Hook for creating an order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: () => {
      // Invalidate the cart query to refresh cart data after order creation
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook for getting user orders
 */
export const useUserOrders = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => orderService.getUserOrders(page, limit),
  });
};

/**
 * Hook for getting a specific order
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

/**
 * Hook for getting order details with expanded information
 */
export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ["orderDetails", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

/**
 * Hook for cancelling an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: (data, variables) => {
      // Invalidate the specific order query and the orders list
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Hook for creating a Razorpay order
 */
export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      paymentService.createRazorpayOrder({ orderId }),
  });
};

/**
 * Hook for verifying a payment
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentVerificationRequest) =>
      paymentService.verifyPayment(data),
    onSuccess: (data) => {
      // Invalidate the specific order query and the orders list
      if (data.data?.order) {
        queryClient.invalidateQueries({ queryKey: ["order", data.data.order] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    },
  });
};
