import React, { useEffect, useState, useCallback } from "react";
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
import SearchInput from "@/components/search/SearchInput";
import { useSearchStore } from "@/stores/useSearchStore";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import SlimProductCard from "@/components/product/SlimProductCard";
import ProductFilterBottomSheet from "@/components/search/ProductFilterBottomSheet";
import { useStoreProductSearch, flattenProductSearchResults } from "@/lib/api/hooks/useProductSearch";

export default function ProductResultsScreen() {
  const { id, query } = useLocalSearchParams<{ id: string; query: string }>();
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState(query || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "popularity" as "popularity" | "price_low" | "price_high" | "newest" | "rating",
  });

  // Get active store
  const { activeStore } = useActiveStoreStore();

  // Use the product search hook
  const productSearchQuery = useStoreProductSearch(id, {
    query: inputValue,
    ...filters,
  });

  // Get products from query
  const products = flattenProductSearchResults(productSearchQuery.data);

  // Handle search submit
  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      productSearchQuery.refetch();
    }
  };

  // Handle load more (infinite scroll)
  const handleLoadMore = () => {
    if (productSearchQuery.hasNextPage && !productSearchQuery.isFetchingNextPage) {
      productSearchQuery.fetchNextPage();
    }
  };

  // Handle filter apply
  const handleFilterApply = (newFilters: any) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
    setShowFilters(false);
  };

  // Render product item
  const renderProductItem = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.productCardContainer}>
        <SlimProductCard
          id={item._id}
          name={item.name}
          imageUrl={item.mainImage}
          price={item.sellingPrice}
          originalPrice={item.price}
          rating={item.averageRating}
          reviewCount={item.reviewCount}
          onPress={() => {
            // Add to recent searches
            useSearchStore.getState().addToRecentSearches({
              id: item._id,
              name: item.name,
              category: item.category?.name || "",
              imageUrl: item.mainImage,
              price: item.sellingPrice,
              rating: item.averageRating,
              reviewCount: item.reviewCount,
              storeId: id,
              storeName: activeStore?.name,
            });
            // Navigate to product
            router.push(`/product/${item._id}`);
          }}
        />
      </View>
    );
  }, [id, activeStore]);

  // Render empty state
  const renderEmptyState = () => {
    if (productSearchQuery.isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={styles.emptyText}>Searching...</Typography>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="search-off" size={48} color="#8E8E93" />
        <Typography style={styles.emptyText}>
          No products found for "{inputValue}"
        </Typography>
      </View>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (productSearchQuery.isFetchingNextPage) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color="#8A3FFC" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Custom Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <SearchInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearchSubmit}
            placeholder={`Search in ${activeStore?.name || "store"}...`}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="#8A3FFC" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Filter Bottom Sheet */}
      <ProductFilterBottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />
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
  filterButton: {
    marginLeft: 12,
    padding: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  productCardContainer: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 4,
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
  footerContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
