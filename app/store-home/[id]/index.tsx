import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { useSearchStore } from "@/stores/useSearchStore";
import storeService from "@/lib/api/services/storeService";
import StoreHomeHeader from "@/components/store-home/StoreHomeHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import BannerCarousel from "@/components/home/BannerCarousel";
import StoreCategoryScroller from "@/components/store-home/StoreCategoryScroller";
import ProductScroller from "@/components/store-home/ProductScroller";
import ProductsByCategory from "@/components/store-home/ProductsByCategory";
import { useProductsByStore, flattenProducts } from "@/lib/api/hooks/useProducts";

export default function StoreHomePage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const tableNumber = 3; // Hardcoded for now, would come from QR code or params
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Get active store from store
  const { activeStore, setActiveStore } = useActiveStoreStore();

  // Get search store for product search
  const { productResults } = useSearchStore();

  // Use a ref to track if we've already loaded this store
  const loadedStoreIdRef = useRef<string | null>(null);

  // Fetch products for this store
  const productsQuery = useProductsByStore(id as string, 20, selectedCategoryId);
  const products = searchQuery.length > 2 ? productResults : flattenProducts(productsQuery.data);

  // Fetch store data if not already in active store
  useEffect(() => {
    const fetchStoreData = async () => {
      console.log("Store home page - ID from params:", id);
      console.log("Current active store:", JSON.stringify(activeStore, null, 2));

      if (!id) {
        console.error("Store ID is missing in params");
        setError("Store ID is missing");
        setLoading(false);
        return;
      }

      // Skip if we've already loaded this store ID
      if (loadedStoreIdRef.current === id) {
        console.log("Already loaded this store ID, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        // If active store is already set and matches the ID, use it
        if (activeStore && activeStore._id === id) {
          console.log("Using existing active store:", activeStore.name);
          setLoading(false);
          loadedStoreIdRef.current = id as string;
          return;
        }

        // Otherwise fetch the store data
        console.log("Fetching store data for ID:", id);
        const storeData = await storeService.getStoreById(id as string);
        console.log("Fetched store data:", JSON.stringify(storeData, null, 2));

        // Ensure we have a valid store object with required fields
        const validStore = {
          _id: storeData._id || id as string,
          name: storeData.name || "Unknown Store",
          description: storeData.description || "",
          logo: storeData.logo || "",
          coverImage: storeData.coverImage || "",
          createdAt: storeData.createdAt || new Date().toISOString(),
          updatedAt: storeData.updatedAt || new Date().toISOString(),
          ...storeData // Include all other fields from the API response
        };

        console.log("Setting active store with valid data:", validStore.name);
        setActiveStore(validStore);
        loadedStoreIdRef.current = id as string;
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Failed to load store data");
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id, setActiveStore]);

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Search functionality is now handled in the search screen

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    // Clear search when changing categories
    setSearchQuery("");
  };

  // Handle load more products
  const handleLoadMore = useCallback(() => {
    if (productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
      productsQuery.fetchNextPage();
    }
  }, [productsQuery]);

  // Products are already filtered by the search store or by category in the query

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={styles.loadingText}>Loading store...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !activeStore) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
          <H1 style={styles.errorTitle}>Error</H1>
          <Body1 style={styles.errorMessage}>
            {error || "Store not found"}
          </Body1>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Typography style={styles.backButtonText}>Go Back</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ensure we have all the store data we need
  const storeName = activeStore?.name || "Store";
  const storeId = activeStore?._id || id as string;

  // Get store location with fallbacks
  const storeLocation =
    activeStore?.city ?
      `${activeStore.city}${activeStore.state ? `, ${activeStore.state}` : ''}` :
    activeStore?.address?.city ?
      `${activeStore.address.city}${activeStore.address.state ? `, ${activeStore.address.state}` : ''}` :
    activeStore?.full_address ?
      activeStore.full_address.split(',')[0] :
    "Location not available";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper
        headerComponent={
          <StoreHomeHeader
            storeName={storeName}
            storeLocation={storeLocation}
            logoUrl={activeStore.logo}
            tableNumber={tableNumber}
            storeId={storeId}
            onBackPress={handleBackPress}
            onSearchPress={() => router.push(`/store-home/${storeId}/search`)}
          />
        }
      >
        {/* Promo Banner Carousel */}
        <View style={styles.heroSection}>
          <BannerCarousel />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Animated.View entering={FadeInRight.duration(600).springify()}>
            <StoreCategoryScroller
              storeId={storeId}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
          </Animated.View>
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(150)}
          >
            <ProductScroller
              title="Featured Products"
              subtitle="Handpicked for you"
              products={products.slice(0, 10)}
              isLoading={productsQuery.isLoading}
              error={productsQuery.error?.message}
              onSeeAllPress={() => console.log("See all featured products pressed")}
              onEndReached={handleLoadMore}
              hasNextPage={productsQuery.hasNextPage}
              isFetchingNextPage={productsQuery.isFetchingNextPage}
            />
          </Animated.View>
        </View>        

        {/* New Arrivals Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(300)}
          >
            <ProductScroller
              title="New Arrivals"
              subtitle="Fresh in store"
              products={products.slice(5, 15)}
              isLoading={productsQuery.isLoading}
              error={productsQuery.error?.message}
              onSeeAllPress={() => console.log("See all new arrivals pressed")}
              onEndReached={handleLoadMore}
              hasNextPage={productsQuery.hasNextPage}
              isFetchingNextPage={productsQuery.isFetchingNextPage}
            />
          </Animated.View>
        </View>

        {/* Best Sellers Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(400)}
          >
            <ProductScroller
              title="Best Sellers"
              subtitle="Most popular items"
              products={products.slice(3, 13)}
              isLoading={productsQuery.isLoading}
              error={productsQuery.error?.message}
              onSeeAllPress={() => console.log("See all best sellers pressed")}
              onEndReached={handleLoadMore}
              hasNextPage={productsQuery.hasNextPage}
              isFetchingNextPage={productsQuery.isFetchingNextPage}
            />
          </Animated.View>
        </View>

        {/* Discounted Products Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(500)}
          >
            <ProductScroller
              title="On Sale"
              subtitle="Great deals for you"
              products={products.slice(7, 17)}
              isLoading={productsQuery.isLoading}
              error={productsQuery.error?.message}
              onSeeAllPress={() => console.log("See all discounted products pressed")}
              onEndReached={handleLoadMore}
              hasNextPage={productsQuery.hasNextPage}
              isFetchingNextPage={productsQuery.isFetchingNextPage}
            />
          </Animated.View>
        </View>

        {/* Spacing at the bottom for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8A3FFC",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#8E8E93",
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  heroSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
  },
  sectionContainer: {
    marginTop: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  productsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    color: "#8E8E93",
  },
});
