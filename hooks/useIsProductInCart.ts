import { useCartContext } from "@/components/providers/CartProvider";

/**
 * Hook to check if a product is in the cart
 * @param productId The product ID to check
 * @returns An object with isInCart and quantity
 */
export const useIsProductInCart = (productId: string) => {
  const { cart } = useCartContext();
  console.log("useIsProductInCart - cart:", cart); // this is coming as null

  if (!cart || !cart.items || cart.items.length === 0) {
    return { isInCart: false, quantity: 0, cartItemId: '' };
  }

  const cartItem = cart.items.find(item => {
    if (typeof item.product === 'string') {
      const match = item.product === productId;
      return match;
    }
    const match = item.product._id === productId;
    return match;
  });


  // If we found a cart item, make sure we return the correct cartItemId
  if (cartItem) {
    return {
      isInCart: true,
      quantity: cartItem.quantity,
      cartItemId: cartItem._id,
    };
  }

  return {
    isInCart: false,
    quantity: 0,
    cartItemId: '',
  };
};

export default useIsProductInCart;
