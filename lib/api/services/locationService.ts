import * as Location from 'expo-location';
import { useMutation } from '@tanstack/react-query';

// Google Maps API key - should be in environment variables
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Get current location
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  // Request permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }
  
  // Get current position
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

// Reverse geocode (coordinates to address)
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{
  pincode: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
}> => {
  try {
    // Try using Expo's geocoding first
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (results && results.length > 0) {
      const location = results[0];
      return {
        pincode: location.postalCode || '',
        city: location.city || '',
        state: location.region || '',
        country: location.country || '',
        fullAddress: [
          location.street,
          location.city,
          location.region,
          location.postalCode,
          location.country,
        ]
          .filter(Boolean)
          .join(', '),
      };
    }
    
    // Fallback to Google Maps API if Expo's geocoding fails or is incomplete
    if (GOOGLE_MAPS_API_KEY) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // Extract address components
        let pincode = '';
        let city = '';
        let state = '';
        let country = '';
        
        for (const component of result.address_components) {
          if (component.types.includes('postal_code')) {
            pincode = component.long_name;
          } else if (component.types.includes('locality')) {
            city = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (component.types.includes('country')) {
            country = component.long_name;
          }
        }
        
        return {
          pincode,
          city,
          state,
          country,
          fullAddress: result.formatted_address,
        };
      }
    }
    
    throw new Error('Failed to get address from coordinates');
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
};

// Search places (for autocomplete)
export const searchPlaces = async (query: string): Promise<Array<{
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}>> => {
  if (!GOOGLE_MAPS_API_KEY || !query) {
    return [];
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${GOOGLE_MAPS_API_KEY}&components=country:in`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.predictions) {
      return data.predictions.map((prediction: any) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting?.main_text || '',
        secondaryText: prediction.structured_formatting?.secondary_text || '',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

// Get place details
export const getPlaceDetails = async (placeId: string): Promise<{
  latitude: number;
  longitude: number;
  pincode: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
}> => {
  if (!GOOGLE_MAPS_API_KEY || !placeId) {
    throw new Error('Missing API key or place ID');
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,address_component,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      const result = data.result;
      
      // Extract coordinates
      const latitude = result.geometry?.location?.lat;
      const longitude = result.geometry?.location?.lng;
      
      // Extract address components
      let pincode = '';
      let city = '';
      let state = '';
      let country = '';
      
      for (const component of result.address_components) {
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
        } else if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (component.types.includes('country')) {
          country = component.long_name;
        }
      }
      
      return {
        latitude,
        longitude,
        pincode,
        city,
        state,
        country,
        fullAddress: result.formatted_address,
      };
    }
    
    throw new Error('Failed to get place details');
  } catch (error) {
    console.error('Error getting place details:', error);
    throw error;
  }
};

// React Query hooks
export const useGetCurrentLocation = () => {
  return useMutation({
    mutationFn: getCurrentLocation,
  });
};

export const useReverseGeocode = () => {
  return useMutation({
    mutationFn: ({ latitude, longitude }: { latitude: number; longitude: number }) =>
      reverseGeocode(latitude, longitude),
  });
};

export const useSearchPlaces = () => {
  return useMutation({
    mutationFn: searchPlaces,
  });
};

export const useGetPlaceDetails = () => {
  return useMutation({
    mutationFn: getPlaceDetails,
  });
};
