import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { SearchItem } from "@/stores/useSearchStore";
import SearchSection from "./SearchSection";

export type SearchTab = "all" | "stores" | "products";

interface SearchSuggestionsProps {
  recentSearches: SearchItem[];
  popularStores: SearchItem[];
  onItemPress: (item: SearchItem) => void;
  onClearRecentSearches: () => void;
  searchQuery: string;
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  recentSearches,
  popularStores,
  onItemPress,
  onClearRecentSearches,
  searchQuery,
  activeTab,
  onTabChange,
}) => {
  // Only filter if search query is more than 2 characters
  const shouldFilter = searchQuery.length > 2;

  // Filter recent searches based on query and active tab
  const filteredRecentSearches = shouldFilter
    ? recentSearches.filter((item) => {
        const matchesQuery = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (activeTab === "all") return matchesQuery;
        if (activeTab === "stores") return matchesQuery && !item.price;
        if (activeTab === "products") return matchesQuery && !!item.price;
        return false;
      })
    : recentSearches.filter((item) => {
        if (activeTab === "all") return true;
        if (activeTab === "stores") return !item.price;
        if (activeTab === "products") return !!item.price;
        return false;
      });

  // Filter popular stores based on query and active tab
  // Only show stores in the stores or all tab
  const filteredPopularStores = shouldFilter
    ? popularStores.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularStores;

  const showPopularStores =
    (activeTab === "all" || activeTab === "stores") &&
    (!shouldFilter || filteredPopularStores.length > 0);

  // Show sections based on if we have items to display
  const showRecentSearches = filteredRecentSearches.length > 0;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => onTabChange("all")}
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
          style={[styles.tab, activeTab === "stores" && styles.activeTab]}
          onPress={() => onTabChange("stores")}
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

        <TouchableOpacity
          style={[styles.tab, activeTab === "products" && styles.activeTab]}
          onPress={() => onTabChange("products")}
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
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
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
          </>
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
    fontFamily: "Jost-Bold",
  },
});

export default SearchSuggestions;
