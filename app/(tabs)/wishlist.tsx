import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Body1, H3 } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import {
  useStoreWishlist,
  getWishlistedStores,
} from "@/lib/api/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import SmallStoreCard from "@/components/store/SmallStoreCard";
import { getImageUrl } from "@/lib/helpers";
import { useFocusEffect } from "expo-router";
//@ts-ignore
import EmptyImg from "../../assets/images/empty-wishlist.jpg";

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

  // No need for handleToggleFavorite here as it's handled in the SmallStoreCard component

  const renderStoreItem = ({ item }: { item: any }) => {
    // Skip rendering if item is null or doesn't have required properties
    if (!item || !item._id) {
      console.warn("Attempted to render a store item with missing data:", item);
      return null;
    }

    const imageUrl = item.mainImage || item.logo || item.coverImage || "";
    return (
      <View style={styles.storeCardContainer}>
        <SmallStoreCard
          id={item._id}
          imageUrl={getImageUrl(imageUrl)}
          name={item.name || "Unknown Store"}
          type={item.categories?.[0] || "Store"}
          rating={item.averageRating}
          loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
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
        <Image
          source={EmptyImg}
          style={{ width: 250, height: 300, borderRadius: 16 }}
        />
        <Text style={styles.emptyStateText}>
          Your wishlist is empty. Add stores to your favorites!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper
        headerComponent={
          <ShortAppHeader title="Wishlist" showBackButton={false} />
        }
        isShortHeader={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Wishlist</Text>
          <Body1 style={styles.description}>
            Your favorite stores will appear here.
          </Body1>

          {stores.length > 0 ? (
            <FlatList
              data={stores.filter((store) => store && store._id)} // Filter out invalid stores
              renderItem={renderStoreItem}
              keyExtractor={(item) => item?._id || `store-${Math.random()}`} // Fallback for missing IDs
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Jost-Medium",
    color: "#000000",
  },
  description: {
    marginTop: 0,
    marginBottom: 20,
    // textAlign: "center",
    color: "#666666",
  },
  storeGrid: {
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  storeCardContainer: {
    width: "50%",
    paddingVertical: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    padding: 20,
    marginTop: 40,
    borderColor: "#EEEEEE",
    borderRadius: 8,
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
