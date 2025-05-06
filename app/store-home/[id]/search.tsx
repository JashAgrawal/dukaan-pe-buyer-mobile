import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import SearchInput, { SearchInputRef } from "@/components/search/SearchInput";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import SlimProductCard from "@/components/product/SlimProductCard";
import ProductSearchSuggestions from "@/components/search/ProductSearchSuggestions";

export default function StoreProductSearchScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<SearchInputRef>(null);
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Get active store
  const { activeStore } = useActiveStoreStore();

  // Get search functionality
  const {
    searchProductsInActiveStore,
    productResults,
    isSearching,
    addToRecentSearches,
    recentSearches,
    clearRecentSearches
  } = useSearchStore();

  // Focus the input when the screen mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Perform search when input changes
  useEffect(() => {
    if (inputValue.length > 2 && activeStore) {
      searchProductsInActiveStore(activeStore._id, inputValue);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [inputValue, activeStore]);

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (inputValue.trim().length > 0 && activeStore) {
      // Navigate to product results page with the query
      router.push({
        pathname: "/store-home/[id]/product-results" as any,
        params: { id, query: inputValue }
      });
    }
  };

  // Handle item press from suggestions
  const handleItemPress = (item: SearchItem) => {
    // Add to recent searches
    addToRecentSearches(item);
    // Navigate to product
    router.push(`/product/${item.id}`);
  };

  // Render product item
  const renderProductItem = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.productCardContainer}>
        <SlimProductCard
          id={item.id}
          name={item.name}
          imageUrl={item.imageUrl}
          price={item.price || 0}
          originalPrice={item.originalPrice}
          rating={item.rating}
          reviewCount={item.reviewCount}
          onPress={() => {
            // Add to recent searches
            addToRecentSearches(item);
            // Navigate to product
            router.push(`/product/${item.id}`);
          }}
        />
      </View>
    );
  }, []);

  // Render empty state
  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={styles.emptyText}>Searching...</Typography>
        </View>
      );
    }

    if (inputValue.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={48} color="#8E8E93" />
          <Typography style={styles.emptyText}>
            No products found for "{inputValue}"
          </Typography>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="search" size={48} color="#8E8E93" />
        <Typography style={styles.emptyText}>
          Search for products in {activeStore?.name || "this store"}
        </Typography>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Custom Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <SearchInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearchSubmit}
            placeholder={`Search Products...`}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Content */}
      {showResults ? (
        // Search Results
        <FlatList
          data={productResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}

        />
      ) : (
        // Search Suggestions
        <View style={styles.suggestionsContainer}>
          <ProductSearchSuggestions
            recentSearches={recentSearches.filter(item => item.storeId === activeStore?._id)}
            popularProducts={productResults.length > 0 ? productResults : []}
            onItemPress={handleItemPress}
            onClearRecentSearches={clearRecentSearches}
            searchQuery={inputValue}
            storeName={activeStore?.name}
          />
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  suggestionsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  productCardContainer: {
    flex: 1,
    marginBottom: 16,
    // marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    color: "#8E8E93",
  },
});
