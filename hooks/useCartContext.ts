import { useCartContext as useCart } from "@/components/providers/CartProvider";

/**
 * Hook to access the cart context
 */
const useCartContext = () => {
  return useCart();
};

export default useCartContext;
