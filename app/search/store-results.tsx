import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import SearchInput from "@/components/search/SearchInput";
import SmallStoreCard from "@/components/store/SmallStoreCard";
import StoreFilterBottomSheet from "@/components/search/StoreFilterBottomSheet";
import {
  useStoreSearch,
  flattenStoreSearchResults,
} from "@/lib/api/hooks/useStoreSearch";
import {
  useStoreCategories,
  flattenCategories,
} from "@/lib/api/hooks/useStoreCategories";
import { StoreFilterOptions } from "@/lib/api/services/storeService";
import { getImageUrl } from "@/lib/helpers";
import { Store } from "@/types/store";
// No more tabs needed

export default function StoreResultsScreen() {
  const insets = useSafeAreaInsets();
  const { query } = useLocalSearchParams<{ query: string }>();

  // State for search input and filters
  const [inputValue, setInputValue] = useState(query || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StoreFilterOptions>({
    query: query || "",
    page: 1,
    limit: 10,
  });

  // Fetch store categories for filter options
  const categoriesQuery = useStoreCategories();
  const categories = flattenCategories(categoriesQuery.data).map(
    (category) => ({
      id: category._id,
      name: category.name,
    })
  );

  // Fetch stores with filters
  const storeSearchQuery = useStoreSearch(filters);
  const stores = flattenStoreSearchResults(storeSearchQuery.data);

  // Set initial search query when component mounts
  useEffect(() => {
    if (query) {
      setInputValue(query);
      setFilters((prev) => ({ ...prev, query }));
    }
  }, [query]);

  // Handle search submission
  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, query: inputValue, page: 1 }));
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: StoreFilterOptions) => {
    setFilters(newFilters);
  };

  // Handle store press
  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  // No tab change handler needed anymore

  // Handle load more (infinite scroll)
  const handleLoadMore = () => {
    if (storeSearchQuery.hasNextPage && !storeSearchQuery.isFetchingNextPage) {
      storeSearchQuery.fetchNextPage();
    }
  };

  // Render store item
  const renderStoreItem = useCallback(({ item }: { item: Store }) => {
    const imageUrl = item.mainImage || item.logo || item.coverImage;
    return (
      <View style={styles.storeCardContainer}>
        <SmallStoreCard
          imageUrl={getImageUrl(imageUrl)}
          name={item.name}
          type={item.categories?.[0] || "Store"}
          rating={item.averageRating}
          loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
          onPress={() => handleStorePress(item._id)}
        />
      </View>
    );
  }, []);

  // Render footer (loading indicator for infinite scroll)
  const renderFooter = () => {
    if (!storeSearchQuery.isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#8A3FFC" />
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (storeSearchQuery.isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      );
    }

    if (storeSearchQuery.isError) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
          <Typography style={styles.emptyText}>
            Error loading stores. Please try again.
          </Typography>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="store" size={48} color="#CCCCCC" />
        <Typography style={styles.emptyText}>
          No stores found for "{filters.query}"
        </Typography>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Search Header */}
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
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="#8A3FFC" />
        </TouchableOpacity>
      </View>

      {/* No tabs needed anymore */}

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Typography style={styles.resultsTitle}>
          Stores matching "{filters.query}"
        </Typography>
        <Typography style={styles.resultsCount}>
          {storeSearchQuery.data?.pages?.[0]?.pagination?.total || 0} results
        </Typography>
      </View>

      {/* Store Results */}
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />

      {/* Filter Bottom Sheet */}
      <StoreFilterBottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
        categories={categories}
        isLoadingCategories={categoriesQuery.isLoading}
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
    borderBottomColor: "#EEEEEE",
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
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#000000",
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666666",
    marginTop: 4,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  storeCardContainer: {
    width: "50%",
    padding: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  // Tab styles removed
});
