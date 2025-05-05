import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import SlimProductCard from "./SlimProductCard";
import { Typography } from "@/components/ui/Typography";

interface Product {
  _id: string;
  name: string;
  mainImage?: string;
  sellingPrice: number;
  price?: number;
  unit?: string;
  averageRating?: number;
  reviewCount?: number;
  deliveryTime?: string;
}

interface SlimProductGridProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
}

const { width } = Dimensions.get("window");
// Calculate number of columns to fit 2.5 cards per row
const numColumns = 3;

export default function SlimProductGrid({
  products,
  loading,
  error,
  onRefresh,
  refreshing = false,
  onEndReached,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
}: SlimProductGridProps) {
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Typography style={styles.errorText}>
          Error loading products. Please try again.
        </Typography>
      </View>
    );
  }

  if (loading && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8A3FFC" />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Product; index: number }) => (
    <View
      style={[
        styles.productCardContainer,
        // Add extra margin to the middle item to create the 2.5 cards effect
        { marginRight: 6 },
      ]}
    >
      <SlimProductCard
        id={item._id}
        name={item.name}
        imageUrl={item.mainImage}
        price={item.sellingPrice}
        originalPrice={item.price}
        unit={item.unit || "pc"}
        rating={item.averageRating}
        reviewCount={item.reviewCount}
        deliveryTime={item.deliveryTime || "7 Mins"}
      />
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.emptyContainer}>
            <Typography style={styles.emptyText}>No products found</Typography>
          </View>
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        <>
          {loading && products.length > 0 && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#8A3FFC" />
            </View>
          )}
          {ListFooterComponent}
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  productCardContainer: {
    // Width is calculated to fit 2.5 cards in a row
    width: (width - 40) / 3,
    marginBottom: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#8E8E93",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
