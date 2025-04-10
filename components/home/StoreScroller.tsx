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
  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  const renderStore = useCallback(
    ({ item }: { item: Store }) => {
      const imageUrl = item.mainImage || item.logo || item.coverImage;

      if (variant === "small") {
        return (
          <SmallStoreCard
            imageUrl={getImageUrl(imageUrl)}
            name={item.name}
            type={item.categories?.[0] || "Store"}
            rating={item.averageRating}
            loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
            onPress={() => handleStorePress(item._id)}
          />
        );
      }

      return (
        <View style={styles.bigCardContainer}>
          <StoreCard
            imageUrl={getImageUrl(imageUrl)}
            name={item.name}
            type={item.categories?.[0] || "Store"}
            location={
              item.address?.city && item.address?.state
                ? `${item.address.city}, ${item.address.state}`
                : item.address?.city ||
                  item.address?.state ||
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
            onPress={() => handleStorePress(item._id)}
          />
        </View>
      );
    },
    [variant]
  );

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
      contentContainerStyle={[
        styles.scrollContent,
        variant === "big" && styles.bigScrollContent,
      ]}
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
