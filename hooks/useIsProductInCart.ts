import { useCartContext } from "@/components/providers/CartProvider";

/**
 * Hook to check if a product is in the cart
 * @param productId The product ID to check
 * @returns An object with isInCart and quantity
 */
export const useIsProductInCart = (productId: string) => {
  const { cart } = useCartContext();

  if (!cart || !cart.items || cart.items.length === 0) {
    return { isInCart: false, quantity: 0 };
  }

  const cartItem = cart.items.find(item => {
    if (typeof item.product === 'string') {
      return item.product === productId;
    }
    return item.product._id === productId;
  });

  return {
    isInCart: !!cartItem,
    quantity: cartItem ? cartItem.quantity : 0,
    cartItemId: cartItem ? cartItem._id : '',
  };
};

export default useIsProductInCart;
