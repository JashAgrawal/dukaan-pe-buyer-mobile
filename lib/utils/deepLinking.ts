import * as Linking from 'expo-linking';
import { router } from 'expo-router';

/**
 * Parse a deep link URL and extract the store ID
 * @param url The deep link URL to parse
 * @returns The store ID if found, otherwise null
 */
export const parseDeepLink = (url: string): string | null => {
  try {
    // Parse the URL
    const { hostname, path } = Linking.parse(url);
    
    // Check if it's a store link
    if (hostname === 'store' || path?.includes('store/')) {
      // Extract the store ID
      const storeId = path?.split('store/')[1] || hostname.split('store/')[1];
      return storeId || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

/**
 * Handle a deep link by navigating to the appropriate screen
 * @param url The deep link URL to handle
 * @returns True if the link was handled, false otherwise
 */
export const handleDeepLink = (url: string): boolean => {
  try {
    // Parse the URL to get the store ID
    const storeId = parseDeepLink(url);
    
    if (storeId) {
      // Navigate to the store profile page
      router.push(`/store/${storeId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error handling deep link:', error);
    return false;
  }
};

/**
 * Set up deep link handling for the app
 */
export const setupDeepLinking = () => {
  // Handle deep links when the app is already open
  Linking.addEventListener('url', (event) => {
    handleDeepLink(event.url);
  });
  
  // Handle deep links when the app is opened from a link
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink(url);
    }
  });
};

/**
 * Generate a deep link URL for a store
 * @param storeId The ID of the store
 * @returns The deep link URL
 */
export const generateStoreDeepLink = (storeId: string): string => {
  return `dune://store/${storeId}`;
};
