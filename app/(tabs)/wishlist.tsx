import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import AppHeader from "@/components/ui/AppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import {
  useStoreWishlist,
  getWishlistedStores,
} from "@/lib/api/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import SmallStoreCard from "@/components/store/SmallStoreCard";
import { getImageUrl } from "@/lib/helpers";
import { router, useFocusEffect } from "expo-router";

export default function WishlistScreen() {
  const { isAuthenticated } = useAuth();
  const wishlistQuery = useStoreWishlist(20);
  const stores = getWishlistedStores(wishlistQuery.data);

  // Refetch wishlist when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        wishlistQuery.refetch();
      }
    }, [isAuthenticated])
  );

  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  // No need for handleToggleFavorite here as it's handled in the SmallStoreCard component

  const renderStoreItem = ({ item }: { item: any }) => {
    const imageUrl = item.mainImage || item.logo || item.coverImage;
    return (
      <View style={styles.storeCardContainer}>
        <SmallStoreCard
          id={item._id}
          imageUrl={getImageUrl(imageUrl)}
          name={item.name}
          type={item.categories?.[0] || "Store"}
          rating={item.averageRating}
          loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
          isFavorite={true} // It's in the wishlist, so it's favorited by default
          onPress={() => handleStorePress(item._id)}
        />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (wishlistQuery.isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Text style={styles.emptyStateText}>Loading your wishlist...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Please log in to view your wishlist
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Your wishlist is empty. Add stores to your favorites!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper headerComponent={<AppHeader />}>
        <View style={styles.content}>
          <H1>Wishlist</H1>
          <Body1 style={styles.description}>
            Your favorite stores will appear here.
          </Body1>

          {stores.length > 0 ? (
            <FlatList
              data={stores}
              renderItem={renderStoreItem}
              keyExtractor={(item) => item._id}
              numColumns={2}
              contentContainerStyle={styles.storeGrid}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (
                  wishlistQuery.hasNextPage &&
                  !wishlistQuery.isFetchingNextPage
                ) {
                  wishlistQuery.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                wishlistQuery.isFetchingNextPage ? (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#8A3FFC" />
                  </View>
                ) : null
              }
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: "center",
    color: "#666666",
  },
  storeGrid: {
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  storeCardContainer: {
    width: "50%",
    padding: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyStateText: {
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
});
