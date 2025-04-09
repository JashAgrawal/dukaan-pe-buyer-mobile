import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface PromoBannerProps {
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  features?: string[];
  backgroundColor?: string;
  textColor?: string;
  highlightColor?: string;
}

export default function PromoBanner({
  title = 'Discover the best',
  highlightedText = 'people',
  subtitle = 'through your',
  features = ['No Ads', 'No search', 'Trusted recommends'],
  backgroundColor = '#000',
  textColor = '#FFF',
  highlightColor = '#CCFF00',
}: PromoBannerProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Starburst background effect */}
      <View style={styles.starburst}>
        {Array.from({ length: 20 }).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.starburstLine,
              { 
                transform: [{ rotate: `${index * 18}deg` }],
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            ]} 
          />
        ))}
      </View>
      
      {/* Banner content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { color: textColor }]}>
            {subtitle}{' '}
          </Text>
          <View style={[styles.highlightContainer, { backgroundColor: highlightColor }]}>
            <Text style={[styles.highlightText, { color: '#000' }]}>
              {highlightedText}
            </Text>
          </View>
        </View>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <Text style={[styles.featureText, { color: textColor }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
    marginVertical: 16,
  },
  starburst: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starburstLine: {
    position: 'absolute',
    width: 1,
    height: '200%',
    opacity: 0.5,
  },
  content: {
    zIndex: 1,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Jost-Bold',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Jost-Bold',
  },
  highlightContainer: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  highlightText: {
    fontSize: 28,
    fontFamily: 'Jost-Bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Jost-Medium',
    marginLeft: 6,
  },
});
