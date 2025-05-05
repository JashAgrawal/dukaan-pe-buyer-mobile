import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import SlimProductCard from "../product/SlimProductCard";
import { getImageUrl } from "@/lib/helpers";
import InfiniteScroller from "../common/InfiniteScroller";

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

interface ProductScrollerProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onSeeAllPress?: () => void;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const ProductScroller: React.FC<ProductScrollerProps> = ({
  title,
  subtitle,
  products = [],
  isLoading = false,
  error = null,
  onSeeAllPress,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const handleProductPress = (productId: string) => {
    // Navigate to product detail screen
    router.navigate({
      pathname: "/product/[id]",
      params: { id: productId }
    });
  };

  // Handle loading more products when reaching the end
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && onEndReached) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, onEndReached]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
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
        onPress={() => handleProductPress(item._id)}
      />
    ),
    []
  );

  if(products.length === 0 && !isLoading) return null;

  return (
    <InfiniteScroller
      title={title}
      subtitle={subtitle}
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      isLoading={isLoading}
      error={error}
      onSeeAllPress={onSeeAllPress}
      onEndReached={handleLoadMore}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      horizontal={true}
      contentContainerStyle={styles.scrollContent}
      emptyText="No products available"
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
  },
});

export default ProductScroller;
