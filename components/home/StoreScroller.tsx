import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Store } from "@/types/store";
import StoreCard from "../store/StoreCard";
import SmallStoreCard from "../store/SmallStoreCard";
import { getImageUrl } from "@/lib/helpers";
import { storeToCardData } from "@/utils/storeUtils";

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
            location={`${item.address?.city || ""}, ${
              item.address?.state || ""
            }`}
            distance={item.distance ? `${item.distance.toFixed(1)} km` : ""}
            rating={item.averageRating}
            loyaltyBenefit={item.isVerified ? "Loyalty Benefits" : undefined}
            rewardText={
              item.isVerified ? "Get 💰 20 for every recommendation" : undefined
            }
            onPress={() => handleStorePress(item._id)}
          />
        </View>
      );
    },
    [variant]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isLoading && stores.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : stores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stores available</Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item._id}
          renderItem={renderStore}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            variant === "big" && styles.bigScrollContent,
          ]}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#8A3FFC" />
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
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
  seeAllButton: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
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
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontFamily: "Jost-Regular",
    textAlign: "center",
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Jost-Regular",
  },
  footerLoader: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
});

export default StoreScroller;
