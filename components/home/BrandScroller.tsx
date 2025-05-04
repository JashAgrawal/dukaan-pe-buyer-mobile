import React, { useCallback } from "react";
import { StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { router } from "expo-router";
import { Store } from "@/types/store";
import { getImageUrl } from "@/lib/helpers";
import InfiniteScroller from "../common/InfiniteScroller";

interface BrandScrollerProps {
  title: string;
  subtitle: string;
  brands?: Store[];
  isLoading?: boolean;
  error?: string | null;
  onSeeAllPress?: () => void;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const BrandScroller: React.FC<BrandScrollerProps> = ({
  title,
  subtitle,
  brands = [],
  isLoading = false,
  error = null,
  onSeeAllPress,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const brandItemWidth = Math.min(140, screenWidth * 0.3);

  const handleBrandPress = (brandId: string) => {
    // Navigate to brand detail screen using the object-based navigation
    router.navigate({
      pathname: "/store/[id]",
      params: { id: brandId }
    });
    console.log("Navigating to brand:", brandId);
  };

  // Handle loading more brands when reaching the end
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && onEndReached) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, onEndReached]);

  const renderBrandItem = useCallback(
    ({ item }: { item: Store }) => (
      <TouchableOpacity
        style={[
          styles.brandItem,
          { width: brandItemWidth, height: brandItemWidth },
        ]}
        onPress={() => handleBrandPress(item._id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View ${item.name} store details`}
      >
        <Image
          source={{ uri: getImageUrl(item.logo || item.coverImage) }}
          style={styles.brandLogo}
        />
      </TouchableOpacity>
    ),
    [brandItemWidth]
  );

  return (
    <InfiniteScroller
      title={title}
      subtitle={subtitle}
      data={brands || []}
      renderItem={renderBrandItem}
      keyExtractor={(item: Store) => item._id}
      isLoading={isLoading}
      error={error}
      onSeeAllPress={onSeeAllPress}
      onEndReached={handleLoadMore}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      horizontal={true}
      contentContainerStyle={styles.scrollContent}
      emptyText="No brands available"
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  brandItem: {
    backgroundColor: "#EEEEEE",
    borderRadius: 16,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  brandLogo: {
    width: "80%",
    height: "80%",
    objectFit: "cover",
    resizeMode: "cover",
  },
});

export default BrandScroller;
