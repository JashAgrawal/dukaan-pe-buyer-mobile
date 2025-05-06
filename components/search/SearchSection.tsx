import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SearchItem } from '@/stores/useSearchStore';
import SearchResultItem from './SearchResultItem';

interface SearchSectionProps {
  title: string;
  items: SearchItem[];
  onItemPress: (item: SearchItem) => void;
  onClearPress?: () => void;
  onRemoveItem?: (id: string) => void;
  isPastSearch?: boolean;
}

export default function SearchSection({
  title,
  items,
  onItemPress,
  onClearPress,
  onRemoveItem,
  isPastSearch = false
}: SearchSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>{title}</Typography>
        {onClearPress && (
          <TouchableOpacity onPress={onClearPress}>
            <Typography style={styles.clearText}>Clear</Typography>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <SearchResultItem
            item={item}
            onPress={onItemPress}
            onRemove={onRemoveItem}
            isPastSearch={isPastSearch}
          />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Jost-Medium',
  },
  clearText: {
    fontSize: 14,
    color: '#8A3FFC',
    fontFamily: 'Jost-Medium',
  },
});
