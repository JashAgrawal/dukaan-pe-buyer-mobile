import React, { createContext, useContext, ReactNode } from "react";
import { useCart, useStoreCart } from "@/lib/api/hooks/useCart";
import { Cart, CartSummary } from "@/types/cart";
import FloatingCartButton from "../cart/FloatingCartButton";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

interface CartContextType {
  cart: Cart | null;
  summary: CartSummary | null;
  isLoading: boolean;
  error: Error | null;
  storeId: string | null;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  summary: null,
  isLoading: false,
  error: null,
  storeId: null,
});

export const useCartContext = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const { activeStore } = useActiveStoreStore();
  const storeId = activeStore?._id || null;

  console.log("CartProvider - activeStore:", JSON.stringify(activeStore, null, 2));
  console.log("CartProvider - storeId:", storeId);

  // Use the store-specific cart hook if we have an active store
  const {
    data,
    isLoading,
    error
  } = useCart(storeId || undefined);

  console.log("CartProvider - cart data:", JSON.stringify(data, null, 2));

  const cart = data?.data?.cart || null;
  const summary = data?.data?.summary || null;

  console.log("CartProvider - extracted cart:", JSON.stringify(cart, null, 2));
  console.log("CartProvider - extracted summary:", JSON.stringify(summary, null, 2));

  // Only show the cart for the active store
  const isCurrentStoreCart = cart && storeId && cart.store === storeId;
  console.log("CartProvider - isCurrentStoreCart:", isCurrentStoreCart);
  console.log("CartProvider - cart store:", cart?.store);
  console.log("CartProvider - active storeId:", storeId);

  const activeCart = isCurrentStoreCart ? cart : null;
  const activeSummary = isCurrentStoreCart ? summary : null;

  console.log("CartProvider - activeCart:", JSON.stringify(activeCart, null, 2));
  console.log("CartProvider - activeSummary:", JSON.stringify(activeSummary, null, 2));

  // Determine if free delivery is unlocked (for example, if total is over 500)
  const hasFreeDelivery = activeSummary?.total ? activeSummary.total >= 500 : false;

  // Debug the conditions for showing the floating cart button
  const shouldShowFloatingButton = activeCart && activeCart.items.length > 0 && storeId && activeSummary;
  console.log("CartProvider - shouldShowFloatingButton:", shouldShowFloatingButton);
  console.log("CartProvider - activeCart?.items.length:", activeCart?.items?.length);
  console.log("CartProvider - storeId:", storeId);
  console.log("CartProvider - activeSummary:", !!activeSummary);

  return (
    <CartContext.Provider
      value={{
        cart: activeCart,
        summary: activeSummary,
        isLoading,
        error: error as Error | null,
        storeId,
      }}
    >
      {children}

      {/* Render floating cart button only if cart has items AND it belongs to the active store */}
      {shouldShowFloatingButton && (
        <FloatingCartButton
          itemCount={activeCart.items.length}
          totalAmount={activeSummary.total}
          hasFreeDelivery={hasFreeDelivery}
        />
      )}
    </CartContext.Provider>
  );
}
