import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography, Body1 } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocation } from '@/hooks/useLocation';
import { router } from 'expo-router';

interface AppHeaderProps {
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;
}

export default function AppHeader({
  onLocationPress,
  onNotificationPress,
  onProfilePress,
  onSearchPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { city, pincode, isLocationSet } = useLocation();
  
  // Default handlers if not provided
  const handleLocationPress = onLocationPress || (() => router.push('/location/search' as any));
  const handleNotificationPress = onNotificationPress || (() => {});
  const handleProfilePress = onProfilePress || (() => router.push('/profile'));
  const handleSearchPress = onSearchPress || (() => {});

  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: insets.top }
      ]}
    >
      {/* Location Section */}
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.locationContainer} 
          onPress={handleLocationPress}
        >
          <IconSymbol name="location-on" size={24} color="#8A3FFC" />
          <View style={styles.locationTextContainer}>
            <View style={styles.locationTextRow}>
              <Typography style={styles.locationText} numberOfLines={1}>
                {isLocationSet ? city || 'Andheri West' : 'Set your location'}
              </Typography>
              <IconSymbol name="keyboard-arrow-down" size={16} color="#000" />
            </View>
            <Typography style={styles.addressText} numberOfLines={1}>
              {isLocationSet ? `${pincode || ''} area north street` : 'C31 area north street'}
            </Typography>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
            <IconSymbol name="notifications" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <View style={styles.profileIcon}>
              <IconSymbol name="person" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <Pressable 
        style={styles.searchBar}
        onPress={handleSearchPress}
      >
        <IconSymbol name="search" size={20} color="#999" />
        <Body1 style={styles.searchText}>Search for stores, products & more</Body1>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 4,
    flex: 1,
  },
  locationTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8A3FFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchText: {
    marginLeft: 8,
    color: '#999',
    flex: 1,
  },
});
