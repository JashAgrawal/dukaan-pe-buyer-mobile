import { useEffect } from 'react';
import { useSearchStore } from '@/stores/useSearchStore';

/**
 * Hook to initialize search-related data
 */
export const useSearchInit = () => {
  const { loadPopularStores } = useSearchStore();
  
  useEffect(() => {
    // Load popular stores when the app initializes
    loadPopularStores();
  }, [loadPopularStores]);
};
