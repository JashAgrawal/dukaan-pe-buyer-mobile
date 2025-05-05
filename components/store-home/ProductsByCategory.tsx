import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from "react-native";
import SlimProductCard from "../product/SlimProductCard";
import { Typography } from "@/components/ui/Typography";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "@/lib/helpers";
import productService from "@/lib/api/services/productService";

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

interface ProductsByCategoryProps {
  storeId: string;
  categoryId: string | null;
  title?: string;
}

export default function ProductsByCategory({
  storeId,
  categoryId,
  title = "Shop by Category",
}: ProductsByCategoryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("Products");

  // Fetch products for the selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // If categoryId is null, fetch all products for the store
        if (categoryId === null) {
          const response = await productService.getProductsByStore(storeId, 1, 20);
          setProducts(response.data?.products || []);
          setCategoryName("All Products");
        } else {
          // Fetch products for the specific category
          const response = await productService.getProductsByCategory(categoryId, storeId, 1, 20);
          setProducts(response.data?.products || []);

          // Get category name
          try {
            const categoryResponse = await productService.getProductCategoryById(categoryId);
            setCategoryName(categoryResponse.name || "Products");
          } catch (err) {
            console.error("Error fetching category name:", err);
            setCategoryName("Products");
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products by category:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    if (storeId) {
      fetchProducts();
    }
  }, [storeId, categoryId]);

  // Render a product item
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCardContainer}>
      <SlimProductCard
        id={item._id}
        name={item.name}
        imageUrl={item.mainImage ? getImageUrl(item.mainImage) : undefined}
        price={item.sellingPrice}
        originalPrice={item.price}
        unit={item.unit || "pc"}
        rating={item.averageRating}
        reviewCount={item.reviewCount}
        deliveryTime={item.deliveryTime || "7 Mins"}
      />
    </View>
  );

  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
          <Typography style={styles.emptyStateText}>
            {error}
          </Typography>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="inventory" size={48} color="#8E8E93" />
        <Typography style={styles.emptyStateText}>
          No products found in this category
        </Typography>
      </View>
    );
  };

  // Limit to 6 products for the grid view
  const displayProducts = products.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>{title}</Typography>
        <Typography style={styles.subtitle}>{categoryName}</Typography>
      </View>

      {displayProducts.length > 0 ? (
        <FlatList
          data={displayProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={3}
          contentContainerStyle={styles.productGrid}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scrolling as this will be inside a ScrollView
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Medium",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
  productGrid: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    gap: 12,
  },
  productCardContainer: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    height: 200,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: "center",
    color: "#8E8E93",
  },
});
