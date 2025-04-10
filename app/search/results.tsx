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
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import SearchResultItem from "@/components/search/SearchResultItem";
import SearchInput from "@/components/search/SearchInput";
import { SearchTab } from "@/components/search/SearchSuggestions";

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const { query } = useLocalSearchParams<{ query: string }>();

  const [inputValue, setInputValue] = useState(query || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query || "");

  const {
    performSearch,
    isSearching,
    searchResults,
    productResults,
    storeResults,
    activeTab,
    setActiveTab,
    setSearchQuery: storeSetSearchQuery,
  } = useSearchStore();

  // Set initial search query and perform search when component mounts
  useEffect(() => {
    if (query) {
      setInputValue(query);
      setDebouncedQuery(query);
      storeSetSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() !== debouncedQuery.trim()) {
        setDebouncedQuery(inputValue);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim() !== "") {
      storeSetSearchQuery(debouncedQuery);
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleItemPress = (item: SearchItem) => {
    // Add to recent searches
    useSearchStore.getState().addToRecentSearches(item);

    // Navigate to store/product detail
    router.push(`/store/${item.id}`);
  };

  const handleSearchSubmit = useCallback(() => {
    if (inputValue.trim() !== "") {
      setDebouncedQuery(inputValue);
    }
  }, [inputValue]);

  const handleSearchPress = () => {
    router.push({
      pathname: "/search",
      params: { initialQuery: inputValue },
    });
  };

  // Handle tab change
  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);

    // Navigate to the appropriate screen based on the selected tab
    if (tab === "stores") {
      router.push({
        pathname: "/search/store-results",
        params: { query: inputValue },
      });
    }
    // Stay on the current screen for "all" and "products" tabs
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

        <TouchableOpacity
          style={styles.searchInputContainer}
          onPress={handleSearchPress}
        >
          <SearchInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearchSubmit}
            autoFocus={false}
          />
        </TouchableOpacity>
      </View>

      {/* Search Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => handleTabChange("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "products" && styles.activeTab]}
          onPress={() => handleTabChange("products")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "products" && styles.activeTabText,
            ]}
          >
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stores" && styles.activeTab]}
          onPress={() => handleTabChange("stores")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "stores" && styles.activeTabText,
            ]}
          >
            Stores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.searchContent}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8A3FFC" />
          </View>
        ) : (
          <FlatList
            data={
              activeTab === "all"
                ? searchResults
                : activeTab === "products"
                ? productResults
                : storeResults
            }
            renderItem={({ item }) => (
              <SearchResultItem item={item} onPress={handleItemPress} />
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Typography style={styles.emptyText}>
                  No{" "}
                  {activeTab === "all"
                    ? ""
                    : activeTab === "products"
                    ? "product "
                    : "store "}
                  results found for "{debouncedQuery}"
                </Typography>
              </View>
            }
          />
        )}
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#8A3FFC",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666666",
  },
  activeTabText: {
    color: "#8A3FFC",
    fontWeight: "600",
  },
  searchContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
