import React, { useEffect, useState } from "react";
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

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const { query } = useLocalSearchParams<{ query: string }>();

  const [searchQuery, setSearchQuery] = useState(query || "");

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
      setSearchQuery(query);
      storeSetSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  // Perform search when search query changes
  useEffect(() => {
    if (searchQuery && searchQuery !== query) {
      storeSetSearchQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleItemPress = (item: SearchItem) => {
    // Add to recent searches
    useSearchStore.getState().addToRecentSearches(item);

    // Navigate to store/product detail
    router.push(`/store/${item.id}`);
  };

  const handleSearchPress = () => {
    router.push("/search");
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
        </TouchableOpacity>
      </View>

      {/* Search Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
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
          onPress={() => setActiveTab("products")}
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
          onPress={() => setActiveTab("stores")}
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
                  results found for "{searchQuery}"
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
