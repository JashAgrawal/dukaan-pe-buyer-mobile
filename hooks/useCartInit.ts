import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useActiveStoreStore } from '@/stores/activeStoreStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to initialize cart data when the app starts or when the active store changes
 */
export const useCartInit = () => {
  const { activeStore } = useActiveStoreStore();
  const { isAuthenticated } = useAuthStore();
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    const initCart = async () => {
      try {
        if (isAuthenticated) {
          if (activeStore?._id) {
            console.log('useCartInit - Fetching cart for store:', activeStore._id);
            await fetchCart(activeStore._id);
          } else {
            console.log('useCartInit - Fetching all carts (no active store)');
            await fetchCart();
          }
        } else {
          console.log('useCartInit - User not authenticated, skipping cart fetch');
        }
      } catch (error) {
        console.error('useCartInit - Error fetching cart:', error);
      }
    };

    initCart();
  }, [isAuthenticated, activeStore?._id, fetchCart]);
};
