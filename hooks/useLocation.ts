import { useLocationStore } from '@/stores/locationStore';

// Re-export the location store as a hook for better organization
export const useLocation = useLocationStore;

export default useLocation;
