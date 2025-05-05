import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import SlimProductCard from "@/components/product/SlimProductCard";
import productService from "@/lib/api/services/productService";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { Product } from "@/types/product";

interface PriceDropAlertProps {
  onProductPress?: (productId: string) => void;
}

export default function PriceDropAlert({ onProductPress }: PriceDropAlertProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeStore } = useActiveStoreStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeStore?._id) return;

      try {
        setLoading(true);
        // Fetch products with price drops (products with sellingPrice < price)
        const response = await productService.searchProductsWithFilters({
          store_id: activeStore._id,
          limit: 10,
          sortBy: "price_low"
        });

        // Filter products that have a discount (sellingPrice < price)
        const discountedProducts = response.data.products.filter(
          (product: Product) => product.sellingPrice < product.price
        );

        setProducts(discountedProducts);
      } catch (error) {
        console.error("Error fetching price drop products:", error);
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
      onPress={onProductPress ? () => onProductPress(item._id) : undefined}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>Price Drop Alert</Typography>
        <Typography style={styles.subtitle}>Shop before stocks runs out</Typography>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography style={styles.emptyText}>No price drops available</Typography>
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
    backgroundColor: "#FFF9E6",
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  header: {
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B07B01",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#B07B01",
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
