import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Store } from "@/types/store";
import StoreCard from "../store/StoreCard";
import SmallStoreCard from "../store/SmallStoreCard";
import { getImageUrl } from "@/lib/helpers";
import InfiniteScroller from "../common/InfiniteScroller";

interface StoreScrollerProps {
  title: string;
  subtitle?: string;
  stores: Store[];
  isLoading?: boolean;
  error?: string | null;
  onSeeAllPress?: () => void;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  variant?: "big" | "small";
}

const StoreScroller: React.FC<StoreScrollerProps> = ({
  title,
  subtitle,
  stores = [],
  isLoading = false,
  error = null,
  onSeeAllPress,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
  variant = "big",
}) => {
  // No need for auth state in this component

  const handleStorePress = (storeId: string) => {
    router.navigate({
      pathname: "/store/[id]",
      params: { id: storeId }
    });
    console.log("Navigating to store:", storeId);
  };

  const renderStore = useCallback(
    ({ item }: { item: Store }) => {
      const imageUrl = item.mainImage || item.logo || item.coverImage;
      // Use the server-provided wishlist status or default to false
      if (variant === "small") {
        return (
          <SmallStoreCard
            id={item._id}
            imageUrl={getImageUrl(imageUrl)}
            name={item.name}
            type={
              item.categories?.[0] ||
              (item.category?.name ? item.category.name : "") ||
              (item.productCategories?.length
                ? item.productCategories[0].name
                : "Store")
            }
            rating={item.averageRating}
            loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
            distance={
              item.distance ? `${item.distance.toFixed(1)} km` : undefined
            }
            coordinates={item.location?.coordinates}
          />
        );
      }

      return (
        <View style={styles.bigCardContainer}>
          <StoreCard
            id={item._id}
            imageUrl={getImageUrl(imageUrl)}
            name={item.name}
            type={
              item.categories?.[0] ||
              (item.category?.name ? item.category.name : "") ||
              (item.productCategories?.length
                ? item.productCategories[0].name
                : "Store")
            }
            location={
              item.city && item.state
                ? `${item.city}, ${item.state}`
                : item.address?.city && item.address?.state
                ? `${item.address.city}, ${item.address.state}`
                : item.full_address
                ? item.full_address.split(",")[0]
                : item.address?.city ||
                  item.address?.state ||
                  item.city ||
                  item.state ||
                  "Location not available"
            }
            distance={
              item.distance
                ? `${item.distance.toFixed(1)} km`
                : "Distance not available"
            }
            rating={item.averageRating}
            loyaltyBenefit={item.isVerified ? "Loyalty Benefits" : undefined}
            rewardText={
              item.isVerified ? "Get 20 for every recommendation" : undefined
            }
            coordinates={item.location?.coordinates}
          />
        </View>
      );
    },
    [variant]
  );

  if(stores.length === 0 && !isLoading) return null;

  return (
    <InfiniteScroller
      title={title}
      subtitle={subtitle}
      data={stores}
      renderItem={renderStore}
      keyExtractor={(item) => item._id}
      isLoading={isLoading}
      error={error}
      onSeeAllPress={onSeeAllPress}
      onEndReached={onEndReached}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      horizontal={true}
      contentContainerStyle={
        variant === "big"
          ? { ...styles.scrollContent, ...styles.bigScrollContent }
          : styles.scrollContent
      }
      emptyText="No stores available"
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  bigScrollContent: {
    paddingRight: 16,
  },
  bigCardContainer: {
    width: 300,
    marginRight: 16,
  },
});

export default StoreScroller;
