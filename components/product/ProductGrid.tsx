import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import ProductCard from "./ProductCard";
import { Typography } from "@/components/ui/Typography";

interface Product {
  _id: string;
  name: string;
  mainImage?: string;
  sellingPrice: number;
  price?: number;
  averageRating?: number;
  reviewCount?: number;
  store?: {
    _id: string;
    name: string;
  };
}

interface ProductGridProps {
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

export default function ProductGrid({
  products,
  loading,
  error,
  onRefresh,
  refreshing = false,
  onEndReached,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
}: ProductGridProps) {
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

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      id={item._id}
      name={item.name}
      imageUrl={item.mainImage}
      price={item.sellingPrice}
      originalPrice={item.price}
      rating={item.averageRating}
      reviewCount={item.reviewCount}
      storeId={item.store?._id}
      storeName={item.store?.name}
    />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContainer}
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
        ListFooterComponent || (
          loading && products.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#8A3FFC" />
            </View>
          ) : null
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
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
    padding: 24,
    alignItems: "center",
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
