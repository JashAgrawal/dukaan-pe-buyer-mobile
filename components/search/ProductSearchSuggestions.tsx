import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SearchItem } from "@/stores/useSearchStore";
import SearchSection from "./SearchSection";

interface ProductSearchSuggestionsProps {
  recentSearches: SearchItem[];
  popularProducts: SearchItem[];
  onItemPress: (item: SearchItem) => void;
  onClearRecentSearches: () => void;
  searchQuery: string;
  storeName?: string;
}

const ProductSearchSuggestions: React.FC<ProductSearchSuggestionsProps> = ({
  recentSearches,
  popularProducts,
  onItemPress,
  onClearRecentSearches,
  searchQuery,
  storeName,
}) => {
  // Only filter if search query is more than 2 characters
  const shouldFilter = searchQuery.length > 2;

  // Filter recent searches based on query
  const filteredRecentSearches = shouldFilter
    ? recentSearches.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentSearches;

  // Filter popular products based on query
  const filteredPopularProducts = shouldFilter
    ? popularProducts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularProducts;

  const showPopularProducts = !shouldFilter || filteredPopularProducts.length > 0;

  // Show sections based on if we have items to display
  const showRecentSearches = filteredRecentSearches.length > 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <View>
            {showRecentSearches && (
              <SearchSection
                title="PAST SEARCHES"
                items={filteredRecentSearches}
                onItemPress={onItemPress}
                onClearPress={onClearRecentSearches}
              />
            )}

            {showPopularProducts && (
              <SearchSection
                title={`POPULAR IN ${storeName?.toUpperCase() || 'THIS STORE'}`}
                items={filteredPopularProducts}
                onItemPress={onItemPress}
              />
            )}
          </View>
        )}
        keyExtractor={() => "product-suggestions"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductSearchSuggestions;
