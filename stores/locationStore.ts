import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Address } from '@/types/address';

// Location storage key
const LOCATION_KEY = 'user_location';

// Location types
export type LocationSource = 'current' | 'search' | 'saved' | 'manual';

// Location state interface
export interface LocationState {
  // Location data
  pincode: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
  coordinates: [number, number] | null; // [longitude, latitude]
  
  // Status
  isLoading: boolean;
  isLocationSet: boolean;
  locationSource: LocationSource | null;
  selectedAddress: Address | null;
  
  // Actions
  setLocation: (data: {
    pincode: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
    coordinates?: [number, number];
    source: LocationSource;
    selectedAddress?: Address | null;
  }) => Promise<void>;
  
  clearLocation: () => Promise<void>;
  
  // Check if location is set
  checkLocationStatus: () => Promise<void>;
}

// Create location store
export const useLocationStore = create<LocationState>((set, get) => ({
  // Default state
  pincode: '',
  city: '',
  state: '',
  country: '',
  fullAddress: '',
  coordinates: null,
  isLoading: true,
  isLocationSet: false,
  locationSource: null,
  selectedAddress: null,
  
  // Set location
  setLocation: async (data) => {
    try {
      const locationData = {
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        fullAddress: data.fullAddress,
        coordinates: data.coordinates || null,
        locationSource: data.source,
        selectedAddress: data.selectedAddress || null,
      };
      
      // Save to secure storage
      await SecureStore.setItemAsync(
        LOCATION_KEY, 
        JSON.stringify(locationData)
      );
      
      // Update state
      set({
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        fullAddress: data.fullAddress,
        coordinates: data.coordinates || null,
        isLocationSet: true,
        locationSource: data.source,
        selectedAddress: data.selectedAddress || null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error setting location:', error);
      throw error;
    }
  },
  
  // Clear location
  clearLocation: async () => {
    try {
      await SecureStore.deleteItemAsync(LOCATION_KEY);
      set({
        pincode: '',
        city: '',
        state: '',
        country: '',
        fullAddress: '',
        coordinates: null,
        isLocationSet: false,
        locationSource: null,
        selectedAddress: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error clearing location:', error);
      throw error;
    }
  },
  
  // Check if location is set
  checkLocationStatus: async () => {
    try {
      set({ isLoading: true });
      const locationData = await SecureStore.getItemAsync(LOCATION_KEY);
      
      if (locationData) {
        const parsedData = JSON.parse(locationData);
        set({
          pincode: parsedData.pincode || '',
          city: parsedData.city || '',
          state: parsedData.state || '',
          country: parsedData.country || '',
          fullAddress: parsedData.fullAddress || '',
          coordinates: parsedData.coordinates || null,
          isLocationSet: true,
          locationSource: parsedData.locationSource || null,
          selectedAddress: parsedData.selectedAddress || null,
          isLoading: false,
        });
      } else {
        set({
          isLocationSet: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking location status:', error);
      set({
        isLocationSet: false,
        isLoading: false,
      });
    }
  },
}));

// Initialize location state on app start
useLocationStore.getState().checkLocationStatus();
