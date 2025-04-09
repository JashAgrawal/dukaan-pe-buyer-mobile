import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import SearchSection from "@/components/search/SearchSection";
import SearchInput, { SearchInputRef } from "@/components/search/SearchInput";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<SearchInputRef>(null);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    recentSearches, 
    popularStores, 
    clearRecentSearches
  } = useSearchStore();
  
  // Focus the input when the screen mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  // Navigate to results screen when search is performed
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      router.push({
        pathname: "/search/results",
        params: { query: searchQuery },
      });
    }
  }, [searchQuery]);
  
  const handleItemPress = (item: SearchItem) => {
    // Add to recent searches
    useSearchStore.getState().addToRecentSearches(item);
    
    // Navigate to store/product detail
    router.push(`/store/${item.id}`);
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
          <IconSymbol name="arrow.left" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <SearchInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
        </View>
      </View>
      
      {/* Search Content */}
      <View style={styles.searchContent}>
        {/* Recent Searches and Popular Stores */}
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={() => (
            <>
              {recentSearches.length > 0 && (
                <SearchSection
                  title="PAST SEARCHES"
                  items={recentSearches}
                  onItemPress={handleItemPress}
                  onClearPress={clearRecentSearches}
                />
              )}
              
              <SearchSection
                title="POPULAR STORES"
                items={popularStores}
                onItemPress={handleItemPress}
              />
            </>
          )}
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
