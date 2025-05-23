import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import SearchSuggestions from "@/components/search/SearchSuggestions";
import SearchInput, { SearchInputRef } from "@/components/search/SearchInput";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<SearchInputRef>(null);

  // Get initial query from params if available
  const { initialQuery } = useLocalSearchParams<{ initialQuery?: string }>();

  // Use local state for input value to prevent navigation on every keystroke
  const [inputValue, setInputValue] = useState(initialQuery || "");

  const {
    setSearchQuery,
    recentSearches,
    popularStores,
    clearRecentSearches,
    removeFromRecentSearches: removeRecentSearch,
    loadPopularStores,
  } = useSearchStore();

  // Focus the input and load popular stores when the screen mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Load popular stores if not already loaded
    if (popularStores.length === 0) {
      loadPopularStores();
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = () => {
    if (inputValue.trim().length > 0) {
      // Update the store's search query
      setSearchQuery(inputValue);

      // Always navigate to store results
      router.navigate({
        pathname: "/search/store-results",
        params: { query: inputValue },
      });
    }
  };

  const handleItemPress = (item: SearchItem) => {
    // Add to recent searches
    useSearchStore.getState().addToRecentSearches(item);

    // Navigate to store/product detail
    router.navigate(`/store/${item.id}`);
  };

  // No tab change handler needed anymore

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Custom Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <SearchInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearchSubmit}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Search Content */}
      <View style={styles.searchContent}>
        {/* Show suggestions when typing more than 2 characters or default content */}
        <SearchSuggestions
          recentSearches={recentSearches}
          popularStores={popularStores}
          onItemPress={handleItemPress}
          onClearRecentSearches={clearRecentSearches}
          onRemoveRecentSearch={removeRecentSearch}
          searchQuery={inputValue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchContent: {
    flex: 1,
  },
});
