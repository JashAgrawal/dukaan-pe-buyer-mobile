import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';
import { useCheckPincodeServiceability } from '@/lib/api/services/addressService';
import { useGetAddress } from '@/lib/api/services/addressService';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LocationSource } from '@/stores/locationStore';

const { width } = Dimensions.get('window');

export default function LocationConfirmScreen() {
  const params = useLocalSearchParams<{
    pincode: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
    source: string;
    addressId?: string;
  }>();
  
  const [isServiceable, setIsServiceable] = useState(true);
  const [serviceabilityMessage, setServiceabilityMessage] = useState('');
  
  const { setLocation } = useLocation();
  const checkPincodeServiceabilityMutation = useCheckPincodeServiceability();
  const { data: savedAddress } = useGetAddress(params.addressId || '');
  
  const latitude = parseFloat(params.latitude || '0');
  const longitude = parseFloat(params.longitude || '0');
  const source = params.source as LocationSource;
  
  // Check pincode serviceability on mount
  useEffect(() => {
    const checkServiceability = async () => {
      if (params.pincode) {
        try {
          const result = await checkPincodeServiceabilityMutation.mutateAsync(params.pincode);
          setIsServiceable(result.isServiceable);
          setServiceabilityMessage(result.message);
        } catch (error) {
          console.error('Error checking pincode serviceability:', error);
          setIsServiceable(false);
          setServiceabilityMessage('Failed to check if this location is serviceable');
        }
      }
    };
    
    checkServiceability();
  }, [params.pincode]);
  
  // Handle confirm location
  const handleConfirmLocation = async () => {
    try {
      await setLocation({
        pincode: params.pincode,
        city: params.city,
        state: params.state,
        country: params.country,
        fullAddress: params.fullAddress,
        coordinates: longitude && latitude ? [longitude, latitude] : undefined,
        source,
        selectedAddress: savedAddress || undefined,
      });
      
      // Navigate back to home or previous screen
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error setting location:', error);
      alert('Failed to set location. Please try again.');
    }
  };
  
  const isLoading = checkPincodeServiceabilityMutation.isPending;
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Map view */}
      {latitude && longitude ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            pinColor="#8A3FFC"
          />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text>Map not available</Text>
        </View>
      )}
      
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      {/* Location details */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationDetailsTitle}>Select location</Text>
        
        <View style={styles.locationDetails}>
          <IconSymbol name="location-on" size={24} color="#8A3FFC" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationName}>
              {params.city || params.state || 'Selected location'}
            </Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {params.fullAddress}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        {/* Serviceability message */}
        {isLoading ? (
          <ActivityIndicator size="small" color="#8A3FFC" style={styles.loader} />
        ) : (
          <Text
            style={[
              styles.serviceabilityMessage,
              !isServiceable && styles.notServiceableMessage,
            ]}
          >
            {serviceabilityMessage}
          </Text>
        )}
        
        {/* Confirm button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isServiceable || isLoading) && styles.disabledButton,
          ]}
          onPress={handleConfirmLocation}
          disabled={!isServiceable || isLoading}
        >
          <Text style={styles.confirmButtonText}>Confirm location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    width: '100%',
    height: '60%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '60%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeButtonText: {
    color: '#8A3FFC',
    fontWeight: '500',
  },
  serviceabilityMessage: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 16,
  },
  notServiceableMessage: {
    color: '#F44336',
  },
  loader: {
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#8A3FFC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
