import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SearchItem } from '@/stores/useSearchStore';

interface SearchResultItemProps {
  item: SearchItem;
  onPress: (item: SearchItem) => void;
}

export default function SearchResultItem({ item, onPress }: SearchResultItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.content}>
        <Typography style={styles.name}>{item.name}</Typography>
        <Typography style={styles.category}>{item.category}</Typography>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Jost-Medium',
    color: '#000',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Jost-Regular',
    color: '#666',
  },
});
