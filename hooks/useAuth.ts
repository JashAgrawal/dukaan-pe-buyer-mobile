import { useAuthStore } from '@/stores/authStore';

// Re-export the auth store as a hook for better organization
// This allows us to maintain the same import pattern in components
export const useAuth = useAuthStore;

export default useAuth;
