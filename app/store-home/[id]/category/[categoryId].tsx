import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import SlimProductCard from "@/components/product/SlimProductCard";
import { getImageUrl } from "@/lib/helpers";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import productService from "@/lib/api/services/productService";
import { useInfiniteQuery } from "@tanstack/react-query";

// No need for screen width as we're using percentages

interface ProductCategory {
  _id: string;
  name: string;
  image?: string;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 70,
    backgroundColor: "#F5F5F5",
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  selectedCategoryItem: {
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 3,
    borderLeftColor: "#8A3FFC",
  },
  categoryImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  categoryImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#8A3FFC20",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImagePlaceholderText: {
    fontSize: 18,
    // fontWeight: "bold",
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333333",
    fontFamily: "Jost-Regular",
  },
  mainContent: {
    flex: 1,
    paddingTop: 16,
  },
  sortContainer: {
    marginBottom: 8,
    maxHeight: 40,
  },
  sortContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  selectedSortOption: {
    backgroundColor: "#8A3FFC20",
  },
  sortText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
    fontFamily: "Jost-Regular",
  },
  selectedSortText: {
    color: "#8A3FFC",
    fontWeight: "500",
    fontFamily: "Jost-Medium",
  },
  productGrid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  productList: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  productCardContainer: {
    width: "46%", // Use percentage instead of fixed width
    marginBottom: 12,
    marginHorizontal: "2%",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    height: 300,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "Jost-Regular",
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default function StoreProductCategoryScreen() {
  // No need for insets as we're using the ShortAppHeader
  const { id, categoryId } = useLocalSearchParams<{ id: string; categoryId: string }>();

  // State
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [subcategories, setSubcategories] = useState<ProductCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popularity" | "price_low" | "price_high">("popularity");
  const { activeStore } = useActiveStoreStore();

  // Fetch products for the selected category/subcategory
  const productsQuery = useInfiniteQuery({
    queryKey: ["productsByCategory", selectedSubcategory || categoryId, sortBy],
    queryFn: ({ pageParam = 1 }) => {
      const categoryToUse = selectedSubcategory || categoryId;
      return productService.getProductsByCategory(
        categoryToUse,
        activeStore?._id || "",
        pageParam,
        20,
        // sortBy
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    enabled: !!id && !!categoryId,
  });

  // Fetch category details and subcategories
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Fetch category details
        const categoryData = await productService.getProductCategoryById(categoryId);
        setCategory(categoryData);

        // Fetch subcategories
        const subcategoriesResponse = await productService.getProductSubCategoryByCategory(categoryId);
        if (subcategoriesResponse.data?.subcategories) {
          // Add "All" category at the beginning
          const allSubcategories = [
            { _id: "all", name: "All" },
            ...subcategoriesResponse.data.subcategories,
          ];
          setSubcategories(allSubcategories);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    if (id && categoryId) {
      fetchCategoryDetails();
    }
  }, [id, categoryId]);

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId === "all" ? null : subcategoryId);
  };

  // Handle sort change
  const handleSortChange = (sort: "popularity" | "price_low" | "price_high") => {
    setSortBy(sort);
  };

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Render product item
  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.productCardContainer}>
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
  };

  // Render empty state
  const renderEmptyState = () => {
    if (productsQuery.isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      );
    }

    if (productsQuery.error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Error loading products. Please try again.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No products found</Text>
      </View>
    );
  };

  // Render footer (loading indicator or end of list)
  const renderFooter = () => {
    if (productsQuery.isFetchingNextPage) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color="#8A3FFC" />
        </View>
      );
    }

    return null;
  };

  // Handle load more
  const handleLoadMore = () => {
    if (productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
      productsQuery.fetchNextPage();
    }
  };

  // Flatten products data
  const products =
    productsQuery.data?.pages?.flatMap((page) => page.data?.products || []) || [];

  // Log products for debugging
  console.log("Products count:", products.length);
  if (products.length > 0) {
    console.log("First product:", products[0]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ShortAppHeader
        title={category?.name || "Products"}
        onBackPress={handleBackPress}
        onSearchPress={() => router.push(`/store-home/${id}/search`)}
      />

      <View style={styles.contentContainer}>
        {/* Category Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* All option */}
            <TouchableOpacity
              style={[
                styles.categoryItem,
                !selectedSubcategory && styles.selectedCategoryItem,
              ]}
              onPress={() => handleSubcategorySelect(null)}
            >
              <View style={styles.categoryImageContainer}>
                {category?.image ? (
                  <Image
                    source={{ uri: getImageUrl(category.image) }}
                    style={styles.categoryImage}
                  />
                ) : (
                  <View style={styles.categoryImagePlaceholder}>
                    <Text style={styles.categoryImagePlaceholderText}>All</Text>
                  </View>
                )}
              </View>
              <Text style={styles.categoryName}>All</Text>
            </TouchableOpacity>

            {/* Subcategories */}
            {subcategories.filter(sub => sub._id !== "all").map((subcategory) => (
              <TouchableOpacity
                key={subcategory._id}
                style={[
                  styles.categoryItem,
                  selectedSubcategory === subcategory._id &&
                    styles.selectedCategoryItem,
                ]}
                onPress={() => handleSubcategorySelect(subcategory._id)}
              >
                <View style={styles.categoryImageContainer}>
                  {subcategory.image ? (
                    <Image
                      source={{ uri: getImageUrl(subcategory.image) }}
                      style={styles.categoryImage}
                    />
                  ) : (
                    <View style={styles.categoryImagePlaceholder}>
                      <Text style={styles.categoryImagePlaceholderText}>
                        {subcategory.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.categoryName}>{subcategory.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Sort Options - Scrollable */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortContainer}
            contentContainerStyle={styles.sortContentContainer}
          >
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "popularity" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortChange("popularity")}
            >
              <MaterialIcons
                name="sort"
                size={16}
                color={sortBy === "popularity" ? "#8A3FFC" : "#666"}
              />
              <Text
                style={[
                  styles.sortText,
                  sortBy === "popularity" && styles.selectedSortText,
                ]}
              >
                By Popularity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "price_low" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortChange("price_low")}
            >
              <MaterialIcons
                name="arrow-upward"
                size={16}
                color={sortBy === "price_low" ? "#8A3FFC" : "#666"}
              />
              <Text
                style={[
                  styles.sortText,
                  sortBy === "price_low" && styles.selectedSortText,
                ]}
              >
                Price: Low to High
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "price_high" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortChange("price_high")}
            >
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={sortBy === "price_high" ? "#8A3FFC" : "#666"}
              />
              <Text
                style={[
                  styles.sortText,
                  sortBy === "price_high" && styles.selectedSortText,
                ]}
              >
                Price: High to Low
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Product Grid */}
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.productGrid}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            style={styles.productList}
            removeClippedSubviews={false}
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={8}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </View>
    </View>
  );
}
