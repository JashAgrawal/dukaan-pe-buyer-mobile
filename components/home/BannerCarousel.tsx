import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import PromoBanner from './PromoBanner';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40; // 20px padding on each side

interface BannerCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function BannerCarousel({
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Banner data
  const banners = [
    {
      title: 'Discover the best',
      subtitle: 'through your',
      highlightedText: 'products',
      features: ['No Ads', 'No search', 'Trusted recommends'],
      backgroundColor: '#000',
      textColor: '#FFF',
      highlightColor: '#CCFF00',
    },
    {
      title: 'Shop with',
      subtitle: 'your favorite',
      highlightedText: 'stores',
      features: ['Free delivery', 'Best prices', 'Exclusive deals'],
      backgroundColor: '#8A3FFC',
      textColor: '#FFF',
      highlightColor: '#FFD700',
    },
    {
      title: 'Scan & Pay',
      subtitle: 'for instant',
      highlightedText: 'rewards',
      features: ['Cashback', 'Loyalty points', 'Special offers'],
      backgroundColor: '#005249',
      textColor: '#FFF',
      highlightColor: '#FF9500',
    },
  ];
  
  // Auto play functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay) {
      interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % banners.length;
        setActiveIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * BANNER_WIDTH,
          animated: true,
        });
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeIndex, autoPlay, autoPlayInterval, banners.length]);
  
  // Handle scroll
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / BANNER_WIDTH);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.duration(800).springify()}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.bannerContainer}>
            <PromoBanner
              title={banner.title}
              subtitle={banner.subtitle}
              highlightedText={banner.highlightedText}
              features={banner.features}
              backgroundColor={banner.backgroundColor}
              textColor={banner.textColor}
              highlightColor={banner.highlightColor}
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    paddingHorizontal: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#8A3FFC',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
