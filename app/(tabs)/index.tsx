import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInRight } from "react-native-reanimated";
import AppHeader from "@/components/ui/AppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import BannerCarousel from "@/components/home/BannerCarousel";
import CategoryScroller from "@/components/home/CategoryScroller";
import BrandScroller from "@/components/home/BrandScroller";
import StoreScroller from "@/components/home/StoreScroller";
import { useTopBrands, flattenBrands } from "@/lib/api/hooks/useBrands";
import {
  useTopSellingStores,
  useBestRatedStores,
  useNearbyStores,
  useFavoriteStores,
  flattenStores,
} from "@/lib/api/hooks/useStores";

export default function HomeScreen() {
  // Fetch top brands using React Query
  const topBrands = useTopBrands(10);

  // Fetch stores using React Query
  const topSelling = useTopSellingStores(10);
  const bestRated = useBestRatedStores(10);
  const nearby = useNearbyStores(10);
  const favorites = useFavoriteStores(10);

  // Flatten paginated results
  const topSellingStores = flattenStores(topSelling.data);
  const bestRatedStores = flattenStores(bestRated.data);
  const nearbyStores = flattenStores(nearby.data);
  const favoriteStores = flattenStores(favorites.data);
  const brands = flattenBrands(topBrands.data);

  // Load more handlers
  const loadMoreTopSelling = useCallback(() => {
    if (topSelling.hasNextPage && !topSelling.isFetchingNextPage) {
      topSelling.fetchNextPage();
    }
  }, [topSelling]);

  // Load more brands
  const loadMoreBrands = useCallback(() => {
    if (topBrands.hasNextPage && !topBrands.isFetchingNextPage) {
      topBrands.fetchNextPage();
    }
  }, [topBrands]);

  const loadMoreBestRated = useCallback(() => {
    if (bestRated.hasNextPage && !bestRated.isFetchingNextPage) {
      bestRated.fetchNextPage();
    }
  }, [bestRated]);

  const loadMoreNearby = useCallback(() => {
    if (nearby.hasNextPage && !nearby.isFetchingNextPage) {
      nearby.fetchNextPage();
    }
  }, [nearby]);

  const loadMoreFavorites = useCallback(() => {
    if (favorites.hasNextPage && !favorites.isFetchingNextPage) {
      favorites.fetchNextPage();
    }
  }, [favorites]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper headerComponent={<AppHeader />}>
        {/* Promo Banner Carousel */}
        <View style={styles.heroSection}>
          <BannerCarousel />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Animated.View entering={FadeInRight.duration(600).springify()}>
            <CategoryScroller
              onSeeAllPress={() => console.log("See all categories pressed")}
            />
          </Animated.View>
        </View>

        {/* Top Brands Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(200)}
          >
            <BrandScroller
              title="Top Brands"
              subtitle="Visit & Recommend"
              brands={brands}
              isLoading={topBrands.isLoading}
              error={topBrands.error?.message}
              onSeeAllPress={() => console.log("See all brands pressed")}
              onEndReached={loadMoreBrands}
              hasNextPage={topBrands.hasNextPage}
              isFetchingNextPage={topBrands.isFetchingNextPage}
            />
          </Animated.View>
        </View>

        {/* Top Selling Stores Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(300)}
          >
            <StoreScroller
              title="Top Selling Stores"
              subtitle="Most popular stores near you"
              stores={topSellingStores}
              isLoading={topSelling.isLoading}
              error={topSelling.error?.message}
              onSeeAllPress={() =>
                console.log("See all top selling stores pressed")
              }
              onEndReached={loadMoreTopSelling}
              hasNextPage={topSelling.hasNextPage}
              isFetchingNextPage={topSelling.isFetchingNextPage}
              variant="big"
            />
          </Animated.View>
        </View>

        {/* Nearby Stores Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(400)}
          >
            <StoreScroller
              title="Nearby Stores"
              subtitle="Discover stores around you"
              stores={nearbyStores}
              isLoading={nearby.isLoading}
              error={nearby.error?.message}
              onSeeAllPress={() => console.log("See all nearby stores pressed")}
              onEndReached={loadMoreNearby}
              hasNextPage={nearby.hasNextPage}
              isFetchingNextPage={nearby.isFetchingNextPage}
              variant="small"
            />
          </Animated.View>
        </View>

        {/* Best Rated Stores Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(500)}
          >
            <StoreScroller
              title="Best Rated Stores"
              subtitle="Highest rated stores"
              stores={bestRatedStores}
              isLoading={bestRated.isLoading}
              error={bestRated.error?.message}
              onSeeAllPress={() =>
                console.log("See all best rated stores pressed")
              }
              onEndReached={loadMoreBestRated}
              hasNextPage={bestRated.hasNextPage}
              isFetchingNextPage={bestRated.isFetchingNextPage}
              variant="small"
            />
          </Animated.View>
        </View>

        {/* Favorite Stores Section */}
        <View style={styles.sectionContainer}>
          <Animated.View
            entering={FadeInRight.duration(600).springify().delay(600)}
          >
            <StoreScroller
              title="Your Favorites"
              subtitle="Stores you love"
              stores={favoriteStores}
              isLoading={favorites.isLoading}
              error={favorites.error?.message}
              onSeeAllPress={() =>
                console.log("See all favorite stores pressed")
              }
              onEndReached={loadMoreFavorites}
              hasNextPage={favorites.hasNextPage}
              isFetchingNextPage={favorites.isFetchingNextPage}
              variant="big"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  heroSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
  },
  seeAllText: {
    color: "#8A3FFC",
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  productCard: {
    width: "50%",
    padding: 10,
  },
  productImageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: "bold",
    color: "#8A3FFC",
  },
  bottomSpacing: {
    height: 100,
  },
});
