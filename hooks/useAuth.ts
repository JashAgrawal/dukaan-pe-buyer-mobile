import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { isStoredTokenValid } from "@/lib/utils/tokenUtils";
import { router } from "expo-router";

/**
 * Enhanced auth hook that includes token expiration checks
 */
export const useAuth = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuthStore();

  // Check for token expiration periodically when authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check token validity immediately
      const checkToken = async () => {
        const isValid = await isStoredTokenValid();
        if (!isValid) {
          console.log("Token expired, logging out...");
          await logout();
          router.replace("/auth/phone");
        }
      };

      checkToken();

      // Set up periodic checks (every 5 minutes)
      const intervalId = setInterval(checkToken, 5 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [isLoading, isAuthenticated, logout]);

  return { isAuthenticated, isLoading, user, logout };
};

// For backward compatibility
export default useAuth;
