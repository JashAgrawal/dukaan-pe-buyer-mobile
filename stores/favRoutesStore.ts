import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// Key for storing FavRoutes in SecureStore
const FAVROUTES_KEY = 'favroutes_data';

// Define the FavRoute type
export interface FavRoute {
  id: string;
  storeId: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
}

// Define the FavRoutes store state
interface FavRoutesState {
  favRoutes: FavRoute[];
  isLoading: boolean;
  
  // Actions
  addFavRoute: (storeId: string, name: string, imageUrl?: string) => Promise<void>;
  removeFavRoute: (id: string) => Promise<void>;
  getFavRoutes: () => FavRoute[];
  isFavRoute: (storeId: string) => boolean;
  loadFavRoutes: () => Promise<void>;
}

// Create the FavRoutes store
export const useFavRoutesStore = create<FavRoutesState>()(
  persist(
    (set, get) => ({
      favRoutes: [],
      isLoading: false,
      
      // Add a store to FavRoutes
      addFavRoute: async (storeId: string, name: string, imageUrl?: string) => {
        try {
          const newFavRoute: FavRoute = {
            id: `${storeId}_${Date.now()}`, // Create a unique ID
            storeId,
            name,
            imageUrl,
            createdAt: new Date().toISOString(),
          };
          
          // Get current FavRoutes
          const currentFavRoutes = get().favRoutes;
          
          // Check if store is already in FavRoutes
          const isAlreadyFavRoute = currentFavRoutes.some(route => route.storeId === storeId);
          
          if (!isAlreadyFavRoute) {
            // Add to FavRoutes
            const updatedFavRoutes = [...currentFavRoutes, newFavRoute];
            
            // Save to SecureStore
            await SecureStore.setItemAsync(
              FAVROUTES_KEY,
              JSON.stringify(updatedFavRoutes)
            );
            
            // Update state
            set({ favRoutes: updatedFavRoutes });
          }
        } catch (error) {
          console.error('Error adding to FavRoutes:', error);
          throw error;
        }
      },
      
      // Remove a store from FavRoutes
      removeFavRoute: async (id: string) => {
        try {
          // Get current FavRoutes
          const currentFavRoutes = get().favRoutes;
          
          // Filter out the route to remove
          const updatedFavRoutes = currentFavRoutes.filter(route => route.id !== id);
          
          // Save to SecureStore
          await SecureStore.setItemAsync(
            FAVROUTES_KEY,
            JSON.stringify(updatedFavRoutes)
          );
          
          // Update state
          set({ favRoutes: updatedFavRoutes });
        } catch (error) {
          console.error('Error removing from FavRoutes:', error);
          throw error;
        }
      },
      
      // Get all FavRoutes
      getFavRoutes: () => {
        return get().favRoutes;
      },
      
      // Check if a store is in FavRoutes
      isFavRoute: (storeId: string) => {
        const currentFavRoutes = get().favRoutes;
        return currentFavRoutes.some(route => route.storeId === storeId);
      },
      
      // Load FavRoutes from SecureStore
      loadFavRoutes: async () => {
        try {
          set({ isLoading: true });
          
          // Get FavRoutes from SecureStore
          const favRoutesData = await SecureStore.getItemAsync(FAVROUTES_KEY);
          
          if (favRoutesData) {
            // Parse and set FavRoutes
            const parsedData = JSON.parse(favRoutesData) as FavRoute[];
            set({ favRoutes: parsedData, isLoading: false });
          } else {
            // No FavRoutes found
            set({ favRoutes: [], isLoading: false });
          }
        } catch (error) {
          console.error('Error loading FavRoutes:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'favroutes-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await SecureStore.getItemAsync(name);
          return value || null;
        },
        setItem: async (name, value) => {
          await SecureStore.setItemAsync(name, value);
        },
        removeItem: async (name) => {
          await SecureStore.deleteItemAsync(name);
        },
      })),
    }
  )
);

// Initialize FavRoutes on app start
useFavRoutesStore.getState().loadFavRoutes();
