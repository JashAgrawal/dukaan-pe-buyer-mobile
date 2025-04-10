import { useState, useEffect } from 'react';
import { Store } from '@/types/store';
import storeService from '@/lib/api/services/storeService';

/**
 * Custom hook to fetch top brands from the API
 */
export const useTopBrands = (limit = 10) => {
  const [brands, setBrands] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopBrands = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await storeService.getTopBrands(limit);
        
        if (response.status === 'success' && response.data?.stores) {
          setBrands(response.data.stores);
        } else {
          setError('Failed to fetch brands');
        }
      } catch (err) {
        console.error('Error fetching top brands:', err);
        setError('An error occurred while fetching brands');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopBrands();
  }, [limit]);

  return { brands, isLoading, error };
};

export default useTopBrands;
