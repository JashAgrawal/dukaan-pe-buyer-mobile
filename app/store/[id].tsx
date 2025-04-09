import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Typography, H1, Body1 } from '@/components/ui/Typography';
import { useSearchStore, SearchItem } from '@/stores/useSearchStore';

export default function StoreDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<SearchItem | null>(null);
  
  useEffect(() => {
    // Find the store from popular stores or recent searches
    const { popularStores, recentSearches } = useSearchStore.getState();
    const foundStore = [...popularStores, ...recentSearches].find(item => item.id === id);
    
    if (foundStore) {
      setStore(foundStore);
    }
  }, [id]);
  
  if (!store) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={24} color="#000" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>Store Details</Typography>
        </View>
        <View style={styles.loadingContainer}>
          <Typography>Loading store details...</Typography>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={24} color="#000" />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>{store.name}</Typography>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.storeImageContainer}>
          {store.imageUrl ? (
            <Image source={{ uri: store.imageUrl }} style={styles.storeImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <IconSymbol name="building.2" size={48} color="#999" />
            </View>
          )}
        </View>
        
        <View style={styles.storeInfo}>
          <H1 style={styles.storeName}>{store.name}</H1>
          <Typography style={styles.storeCategory}>{store.category}</Typography>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>About</Typography>
            <Body1 style={styles.sectionContent}>
              This is a placeholder description for {store.name}. In a real app, this would contain
              detailed information about the store, its products, and services.
            </Body1>
          </View>
          
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Location</Typography>
            <Body1 style={styles.sectionContent}>
              123 Main Street, City, Country
            </Body1>
          </View>
          
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Hours</Typography>
            <Body1 style={styles.sectionContent}>
              Monday - Friday: 9:00 AM - 9:00 PM{'\n'}
              Saturday - Sunday: 10:00 AM - 8:00 PM
            </Body1>
          </View>
          
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Contact</Typography>
            <Body1 style={styles.sectionContent}>
              Phone: +1 (123) 456-7890{'\n'}
              Email: info@{store.name.toLowerCase().replace(/\s+/g, '')}.com
            </Body1>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Jost-Medium',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  storeImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  storeInfo: {
    padding: 16,
  },
  storeName: {
    fontSize: 24,
    fontFamily: 'Jost-Bold',
    color: '#000',
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 16,
    fontFamily: 'Jost-Regular',
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Jost-Medium',
    color: '#000',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Jost-Regular',
    color: '#333',
    lineHeight: 24,
  },
});
