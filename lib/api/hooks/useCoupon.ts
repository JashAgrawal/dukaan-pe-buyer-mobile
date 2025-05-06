import { useQuery } from "@tanstack/react-query";
import couponService from "../services/couponService";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch available coupons for a store
 * If cartId is provided, it will only return coupons applicable to the cart
 */
export const useAvailableCoupons = (storeId: string, cartId?: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coupons", "available", storeId, cartId],
    queryFn: () => couponService.getAvailableCoupons(storeId, cartId),
    enabled: isAuthenticated && !!storeId,
  });
};

/**
 * Hook to fetch coupon details by ID
 */
export const useCouponDetails = (couponId: string | null) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coupons", couponId],
    queryFn: () => couponService.getCouponById(couponId as string),
    enabled: isAuthenticated && !!couponId,
  });
};

/**
 * Hook to validate a coupon code for a specific store
 */
export const useValidateCouponCode = (couponCode: string, storeId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coupons", "validate-code", couponCode, storeId],
    queryFn: () => couponService.validateCouponCode(couponCode, storeId),
    enabled: isAuthenticated && !!couponCode && !!storeId,
  });
};

/**
 * Hook to validate a coupon for a specific cart
 */
export const useValidateCouponForCart = (couponCode: string, storeId: string, cartId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coupons", "validate-cart", couponCode, storeId, cartId],
    queryFn: () => couponService.validateCouponForCart(couponCode, storeId, cartId),
    enabled: isAuthenticated && !!couponCode && !!storeId && !!cartId,
  });
};
