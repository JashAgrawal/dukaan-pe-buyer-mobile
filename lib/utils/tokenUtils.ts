import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";

// Token key in secure storage
const TOKEN_KEY = "auth_token";

/**
 * Decode a JWT token to get its payload
 * @param token JWT token
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): any | null => {
  try {
    // JWT tokens are in format: header.payload.signature
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    
    // Replace characters that are not valid in base64 URL encoding
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param token JWT token
 * @returns True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
};

/**
 * Check if the stored token is valid and not expired
 * @returns Promise that resolves to true if token is valid, false otherwise
 */
export const isStoredTokenValid = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) return false;
    
    return !isTokenExpired(token);
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

/**
 * Handle token expiration by logging out and redirecting to auth
 */
export const handleTokenExpiration = async (): Promise<void> => {
  try {
    const isValid = await isStoredTokenValid();
    
    if (!isValid) {
      console.log('Token expired or invalid, logging out...');
      
      // Get logout function from auth store
      const logout = useAuthStore.getState().logout;
      
      // Log the user out
      await logout();
      
      // Redirect to auth screen
      router.replace('/auth/phone');
    }
  } catch (error) {
    console.error('Error handling token expiration:', error);
  }
};
