import React, { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/lib/api/hooks/useCart";
import { Cart, CartSummary } from "@/types/cart";
import FloatingCartButton from "../cart/FloatingCartButton";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

interface CartContextType {
  cart: Cart | null;
  summary: CartSummary | null;
  isLoading: boolean;
  error: Error | null;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  summary: null,
  isLoading: false,
  error: null,
});

export const useCartContext = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const { data, isLoading, error } = useCart();
  const { activeStore } = useActiveStoreStore();

  const cart = data?.data?.cart || null;
  const summary = data?.data?.summary || null;

  // Determine if free delivery is unlocked (for example, if total is over 500)
  const hasFreeDelivery = summary?.total ? summary.total >= 500 : false;

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}

      {/* Render floating cart button only if cart has items AND an active store is set */}
      {cart && cart.items.length > 0 && activeStore && summary && (
        <FloatingCartButton
          itemCount={cart.items.length}
          totalAmount={summary.total}
          hasFreeDelivery={hasFreeDelivery}
        />
      )}
    </CartContext.Provider>
  );
}
