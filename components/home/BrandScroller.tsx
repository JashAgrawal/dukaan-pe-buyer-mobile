import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Store } from "@/types/store";
import { getImageUrl } from "@/lib/helpers";

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
    // Navigate to brand detail screen
    router.push(`/store/${brandId}`);
  };

  // Handle loading more brands when reaching the end
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && onEndReached) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, onEndReached]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : brands.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No brands available</Text>
        </View>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.brandItem,
                { width: brandItemWidth, height: brandItemWidth },
              ]}
              onPress={() => handleBrandPress(item._id)}
            >
              <Image
                source={{ uri: getImageUrl(item.logo || item.coverImage) }}
                style={styles.brandLogo}
              />
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#8A3FFC" />
              </View>
            ) : hasNextPage === false && brands.length > 0 ? (
              <View style={styles.endOfListContainer}>
                <Text style={styles.endOfListText}>No more brands</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
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
  },
  brandLogo: {
    width: "80%",
    height: "80%",
    objectFit: "cover",
    resizeMode: "cover",
  },
  loadingContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#E53935",
    textAlign: "center",
  },
  emptyContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666",
  },
  footerLoader: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    width: 140,
  },
  endOfListContainer: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    width: 140,
  },
  endOfListText: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
  },
});

export default BrandScroller;
