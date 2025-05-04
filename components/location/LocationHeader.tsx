import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useLocation } from '@/hooks/useLocation';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LocationHeader() {
  const { isLocationSet, city, pincode, fullAddress } = useLocation();
  
  const handlePress = () => {
    router.navigate('/location/search');
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <IconSymbol name="location-on" size={20} color="#8A3FFC" />
      <View style={styles.textContainer}>
        <Text style={styles.locationText} numberOfLines={1}>
          {isLocationSet
            ? city || `Pincode: ${pincode}`
            : 'Set your location'}
        </Text>
        {isLocationSet && fullAddress ? (
          <Text style={styles.addressText} numberOfLines={1}>
            {fullAddress}
          </Text>
        ) : null}
      </View>
      <IconSymbol name="keyboard-arrow-down" size={20} color="#8A3FFC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A3FFC',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
