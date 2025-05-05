import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import SlimProductCard from "@/components/product/SlimProductCard";
import productService from "@/lib/api/services/productService";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { Product } from "@/types/product";

interface RecommendedProductsProps {
  title: string;
  subtitle: string;
  onAddPress?: (productId: string) => void;
  onSeeAllPress?: () => void;
}

export default function RecommendedProducts({
  title,
  subtitle,
  onAddPress,
  onSeeAllPress,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeStore } = useActiveStoreStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeStore?._id) return;

      try {
        setLoading(true);
        // Fetch top selling products for the active store
        const response = await productService.searchProductsWithFilters({
          store_id: activeStore._id,
          limit: 10,
          sortBy: "popularity"
        });

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeStore?._id]);

  const renderProduct = ({ item }: { item: Product }) => (
    <SlimProductCard
      id={item._id}
      name={item.name}
      imageUrl={item.mainImage}
      price={item.sellingPrice}
      originalPrice={item.price}
      unit="pc"
      deliveryTime="15 Mins"
      rating={item.averageRating}
      reviewCount={item.reviewCount}
      onPress={onAddPress ? () => onAddPress(item._id) : undefined}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Typography style={styles.title}>{title}</Typography>
          <Typography style={styles.subtitle}>{subtitle}</Typography>
        </View>

        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Typography style={styles.seeAllText}>See all products &gt;</Typography>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography style={styles.emptyText}>No recommended products available</Typography>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8E1",
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.MD,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6A3093",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF3B7F",
    fontWeight: "500",
  },
  productList: {
    paddingVertical: SPACING.SM,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  }
});
