import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SearchItem } from "@/stores/useSearchStore";
import SearchSection from "./SearchSection";

// No tabs needed anymore since we only have store search

interface SearchSuggestionsProps {
  recentSearches: SearchItem[];
  popularStores: SearchItem[];
  onItemPress: (item: SearchItem) => void;
  onClearRecentSearches: () => void;
  searchQuery: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  recentSearches,
  popularStores,
  onItemPress,
  onClearRecentSearches,
  searchQuery,
}) => {
  // Only filter if search query is more than 2 characters
  const shouldFilter = searchQuery.length > 2;

  // Filter recent searches based on query
  const filteredRecentSearches = shouldFilter
    ? recentSearches.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentSearches;

  // Filter popular stores based on query
  const filteredPopularStores = shouldFilter
    ? popularStores.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularStores;

  const showPopularStores = !shouldFilter || filteredPopularStores.length > 0;

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

            {showPopularStores && (
              <SearchSection
                title="POPULAR STORES"
                items={filteredPopularStores}
                onItemPress={onItemPress}
              />
            )}
          </View>
        )}
        keyExtractor={() => "suggestions"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchSuggestions;
