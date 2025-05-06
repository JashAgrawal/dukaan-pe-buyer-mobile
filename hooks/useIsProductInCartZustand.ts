import { useCartStore } from "@/stores/cartStore";

/**
 * Hook to check if a product is in the cart using Zustand store
 * @param productId The product ID to check
 * @returns An object with isInCart, quantity, and cartItemId
 */
export const useIsProductInCartZustand = (productId: string) => {
  // Get the isProductInCart function from the cart store
  const isProductInCart = useCartStore(state => state.isProductInCart);

  // Call the function and return the result without excessive logging
  return isProductInCart(productId);
};

export default useIsProductInCartZustand;
