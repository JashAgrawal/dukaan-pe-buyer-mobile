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
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import SmallStoreCard from "@/components/store/SmallStoreCard";
import StoreFilterBottomSheet from "@/components/search/StoreFilterBottomSheet";
import { getImageUrl } from "@/lib/helpers";
import {
  useStoreCategories,
  useStoreSubcategories,
  flattenCategories,
  flattenSubcategories,
} from "@/lib/api/hooks/useStoreCategories";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService, Category } from "@/lib/api/services/categoryService";
import { StoreFilterOptions } from "@/lib/api/services/storeService";

// Define the screen width for responsive layout
const { width } = Dimensions.get("window");
// Adjust card width calculation to account for padding and margins
const CARD_WIDTH = (width - 110) / 2; // 2 cards per row with margins, accounting for sidebar width (80px) and padding

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"popularity" | "nearest" | "avgRating">(
    "popularity"
  );
  const [filters, setFilters] = useState<StoreFilterOptions>({
    categoryIds: [id],
    page: 1,
    limit: 10,
    sortBy: "popularity",
  });

  // Fetch parent categories for the sidebar
  const categoriesQuery = useStoreCategories();
  const categories = flattenCategories(categoriesQuery.data);

  // Fetch subcategories for the selected category
  const subcategoriesQuery = useStoreSubcategories(id);
  const subcategories = flattenSubcategories(subcategoriesQuery.data);

  // Fetch stores for the selected category/subcategory
  const storesQuery = useInfiniteQuery({
    queryKey: ["storesByCategory", selectedSubcategory || id, filters],
    queryFn: ({ pageParam = 1 }) => {
      return categoryService.getStoresByCategory(
        selectedSubcategory || id,
        pageParam,
        filters.limit
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
    enabled: !!id,
  });

  // Fetch category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const categoryData = await categoryService.getCategoryById(id);
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
    setFilters((prev) => ({
      ...prev,
      categoryIds: subcategoryId ? [subcategoryId] : [id],
      page: 1,
    }));
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: StoreFilterOptions) => {
    setFilters({
      ...newFilters,
      categoryIds: selectedSubcategory ? [selectedSubcategory] : [id],
    });
  };

  // Handle sort change
  const handleSortChange = (sort: "popularity" | "nearest" | "avgRating") => {
    setSortBy(sort);
    setFilters((prev) => ({
      ...prev,
      sortBy: sort,
      page: 1,
    }));
  };

  // Handle store press
  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Render store item
  const renderStoreItem = ({ item }: any) => {
    const imageUrl = item.mainImage || item.logo || item.coverImage;
    // Generate random distance and delivery time for demo purposes
    const distance = `${(Math.random() * 5).toFixed(1)} km`;
    const deliveryTime = `${Math.floor(Math.random() * 30) + 15} min`;

    return (
      <View style={styles.storeCardContainer}>
        <SmallStoreCard
          id={item._id}
          imageUrl={getImageUrl(imageUrl)}
          name={item.name}
          type={item.categories?.[0] || "Store"}
          rating={item.averageRating}
          loyaltyBenefit={item.isVerified ? "10% Off" : undefined}
          distance={distance}
          deliveryTime={deliveryTime}
        />
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (storesQuery.isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      );
    }

    if (storesQuery.error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Error loading stores. Please try again.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No stores found</Text>
      </View>
    );
  };

  // Render footer (loading indicator or end of list)
  const renderFooter = () => {
    if (storesQuery.isFetchingNextPage) {
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
    if (storesQuery.hasNextPage && !storesQuery.isFetchingNextPage) {
      storesQuery.fetchNextPage();
    }
  };

  // Flatten stores data
  const stores =
    storesQuery.data?.pages?.flatMap((page) => page.data?.stores || []) || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ShortAppHeader
        title={category?.name || "Category"}
        onBackPress={handleBackPress}
        onSearchPress={() => router.push("/search")}
      />

      {/* Filter Button - Floating */}
      <TouchableOpacity
        style={styles.floatingFilterButton}
        onPress={() => setShowFilters(true)}
      >
        <MaterialIcons name="filter-list" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
            {subcategories.map((subcategory) => (
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
                sortBy === "nearest" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortChange("nearest")}
            >
              <Text
                style={[
                  styles.sortText,
                  sortBy === "nearest" && styles.selectedSortText,
                ]}
              >
                Brands
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "avgRating" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortChange("avgRating")}
            >
              <MaterialIcons
                name="filter-list"
                size={16}
                color={sortBy === "avgRating" ? "#8A3FFC" : "#666"}
              />
              <Text
                style={[
                  styles.sortText,
                  sortBy === "avgRating" && styles.selectedSortText,
                ]}
              >
                Filters
              </Text>
            </TouchableOpacity>

            {/* Add more filter options */}
            <TouchableOpacity style={styles.sortOption}>
              <MaterialIcons name="local-offer" size={16} color="#666" />
              <Text style={styles.sortText}>Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOption}>
              <MaterialIcons name="star" size={16} color="#666" />
              <Text style={styles.sortText}>Top Rated</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOption}>
              <MaterialIcons name="local-shipping" size={16} color="#666" />
              <Text style={styles.sortText}>Fast Delivery</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Store Grid */}
          <FlatList
            data={stores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.storeGrid}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            style={styles.storeList}
            removeClippedSubviews={false}
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={8}
          />
        </View>
      </View>

      {/* Filter Bottom Sheet */}
      <StoreFilterBottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
        categories={categories.map((cat) => ({ id: cat._id, name: cat.name }))}
        isLoadingCategories={categoriesQuery.isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: "100%",
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Jost-Bold",
    color: "#000000",
  },
  filterButton: {
    padding: 8,
  },
  floatingFilterButton: {
    position: "absolute",
    right: 16,
    top: 70 + 16, // Below header
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 100,
  },

  contentContainer: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    minHeight: "100%",
  },
  sidebar: {
    width: 80,
    backgroundColor: "#F5F5F5",
    paddingTop: 16,
    borderRightWidth: 1,
    borderRightColor: "#EEEEEE",
    height: "100%",
    minHeight: "100%",
  },
  categoryItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  selectedCategoryItem: {
    borderLeftColor: "#8A3FFC",
    backgroundColor: "#FFFFFF",
  },
  categoryImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImagePlaceholderText: {
    fontSize: 18,
    fontFamily: "Jost-Bold",
    color: "#666666",
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#333333",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: "100%",
    minHeight: "100%",
  },
  sortContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  sortContentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  selectedSortOption: {
    backgroundColor: "#E3D5FF",
  },
  sortText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666666",
    marginLeft: 4,
  },
  selectedSortText: {
    color: "#8A3FFC",
  },
  storeGrid: {
    padding: 8,
    paddingBottom: 80, // Add extra padding at bottom to ensure last items are visible
    flexGrow: 1,
  },
  storeList: {
    flex: 1,
    height: "100%",
    minHeight: "100%",
  },
  storeCardContainer: {
    width: CARD_WIDTH,
    margin: 4,
    marginBottom: 10,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#666666",
    textAlign: "center",
  },
  footerContainer: {
    padding: 16,
    alignItems: "center",
  },
});
