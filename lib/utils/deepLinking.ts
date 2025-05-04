import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

/**
 * Parse a deep link URL and extract the store ID
 * @param url The deep link URL to parse
 * @returns The store ID if found, otherwise null
 */
export const parseDeepLink = (
  url: string
): { storeId: string | null; isStoreHome: boolean } => {
  try {
    // Parse the URL
    const { hostname, path } = Linking.parse(url);

    // Check if it's a store link
    if (hostname === "store" || path?.includes("store/")) {
      // Extract the store ID
      const storeId = path?.split("store/")[1] || hostname.split("store/")[1];
      return { storeId: storeId || null, isStoreHome: false };
    }

    // Check if it's a store-home link
    if (hostname === "store-home" || path?.includes("store-home/")) {
      // Extract the store ID
      const storeId =
        path?.split("store-home/")[1] || hostname.split("store-home/")[1];
      return { storeId: storeId || null, isStoreHome: true };
    }

    return { storeId: null, isStoreHome: false };
  } catch (error) {
    console.error("Error parsing deep link:", error);
    return { storeId: null, isStoreHome: false };
  }
};

/**
 * Handle a deep link by navigating to the appropriate screen
 * @param url The deep link URL to handle
 * @returns True if the link was handled, false otherwise
 */
export const handleDeepLink = (url: string): boolean => {
  try {
    // Parse the URL to get the store ID and type
    const { storeId, isStoreHome } = parseDeepLink(url);

    if (storeId) {
      if (isStoreHome) {
        // For store-home links, set the active store and navigate to store-home
        useActiveStoreStore.getState().visitStore(storeId);
      } else {
        // For regular store links, navigate to the store profile page
        router.navigate(`/store/${storeId}`);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error handling deep link:", error);
    return false;
  }
};

/**
 * Set up deep link handling for the app
 */
export const setupDeepLinking = () => {
  // Handle deep links when the app is already open
  Linking.addEventListener("url", (event) => {
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

/**
 * Generate a deep link URL for a store-home
 * @param storeId The ID of the store
 * @returns The deep link URL
 */
export const generateStoreHomeDeepLink = (storeId: string): string => {
  return `dune://store-home/${storeId}`;
};
