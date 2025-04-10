import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import BrandScroller from '../components/home/BrandScroller';
import { mockBrands } from '../data/mockBrands';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSeeAllPress = () => {
    // Navigate to brands list screen
    console.log('See all brands pressed');
    // navigation.navigate('BrandsList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Other home screen components would go here */}
        
        {/* Brand Scroller */}
        <BrandScroller
          title="Top Brands"
          subtitle="Visit & Recommend"
          brands={mockBrands.slice(0, 4)}
          onSeeAllPress={handleSeeAllPress}
        />
        
        {/* Other home screen components would go here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
