import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import LocationBottomSheet from './LocationBottomSheet';
import { useGetCurrentLocation, useReverseGeocode } from '@/lib/api/services/locationService';
import { useCheckPincodeServiceability } from '@/lib/api/services/addressService';
import { router } from 'expo-router';

export default function LocationDetector() {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { isLocationSet, isLoading, setLocation } = useLocation();
  const getCurrentLocationMutation = useGetCurrentLocation();
  const reverseGeocodeMutation = useReverseGeocode();
  const checkPincodeServiceabilityMutation = useCheckPincodeServiceability();
  
  // Attempt to detect location automatically on mount
  useEffect(() => {
    const detectLocation = async () => {
      // Only try to detect location if it's not already set and not currently loading
      if (!isLocationSet && !isLoading && !isDetecting) {
        setIsDetecting(true);
        
        try {
          // Get current coordinates
          const coords = await getCurrentLocationMutation.mutateAsync();
          
          // Reverse geocode to get address
          const addressInfo = await reverseGeocodeMutation.mutateAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          
          if (!addressInfo.pincode) {
            throw new Error('Could not determine pincode from your location');
          }
          
          // Check if pincode is serviceable
          const serviceabilityResult = await checkPincodeServiceabilityMutation.mutateAsync(
            addressInfo.pincode
          );
          
          if (serviceabilityResult.isServiceable) {
            // Set location automatically if serviceable
            await setLocation({
              pincode: addressInfo.pincode,
              city: addressInfo.city,
              state: addressInfo.state,
              country: addressInfo.country,
              fullAddress: addressInfo.fullAddress,
              coordinates: [coords.longitude, coords.latitude],
              source: 'current',
            });
          } else {
            // Show bottom sheet if not serviceable
            setShowBottomSheet(true);
          }
        } catch (error) {
          console.error('Error auto-detecting location:', error);
          // Show bottom sheet on error
          setShowBottomSheet(true);
        } finally {
          setIsDetecting(false);
        }
      }
    };
    
    detectLocation();
  }, [isLocationSet, isLoading]);
  
  // Show bottom sheet if location is not set and not loading
  useEffect(() => {
    if (!isLocationSet && !isLoading && !isDetecting) {
      setShowBottomSheet(true);
    }
  }, [isLocationSet, isLoading, isDetecting]);
  
  return (
    <View style={styles.container}>
      <LocationBottomSheet
        isVisible={showBottomSheet}
        onClose={() => {
          setShowBottomSheet(false);
          // If location is still not set, navigate to search screen
          if (!isLocationSet) {
            router.push('/location/search');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
