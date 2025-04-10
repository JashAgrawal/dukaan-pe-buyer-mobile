import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Category } from "@/lib/api/services/categoryService";
import {
  useCategories,
  flattenCategories,
} from "@/lib/api/hooks/useCategories";
import { getImageUrl } from "@/lib/helpers";

// Map of category names to icon names
const CATEGORY_ICONS: Record<string, string> = {
  Food: "restaurant",
  "Salon & Spa": "spa",
  Healthcare: "healing",
  "Online brands": "shopping-bag",
  Office: "business-center",
  Electronics: "devices",
  Fashion: "checkroom",
  Home: "home",
  // Default icon for any category not in this map
  default: "category",
};

// Custom colors for categories
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FFD700",
  "Salon & Spa": "#FF69B4",
  Healthcare: "#00BFFF",
  "Online brands": "#32CD32",
  Office: "#FF7F50",
  Electronics: "#9370DB",
  Fashion: "#FF6347",
  Home: "#20B2AA",
  // Default color
  default: "#8A3FFC",
};

interface CategoryScrollerProps {
  onCategoryPress?: (category: Category) => void;
  onSeeAllPress?: () => void;
}

export default function CategoryScroller({
  onCategoryPress,
  onSeeAllPress,
}: CategoryScrollerProps) {
  // Use React Query hook for categories
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories(10);

  // Flatten paginated results
  const categories = flattenCategories(data);

  const handleCategoryPress = (category: Category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Navigate to category page
      router.push({
        pathname: "/category/[id]",
        params: { id: category._id },
      });
    }
  };

  // Get icon name for a category
  const getIconName = (categoryName: string): string => {
    return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS.default;
  };

  // Get color for a category
  const getIconColor = (categoryName: string): string => {
    return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.default;
  };

  // Get background color for icon container (lighter version of the icon color)
  const getIconBgColor = (categoryName: string): string => {
    const color = getIconColor(categoryName);
    return color + "20"; // Add 20% opacity
  };

  // Handle loading more categories when reaching the end
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Render a category item
  const renderCategory = useCallback(({ item }: { item: Category }) => {
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBgColor(item.name) },
          ]}
        >
          {item.image ? (
            <Image
              source={{ uri: `${getImageUrl(item.image)}` }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 999,
                objectFit: "cover",
              }}
            />
          ) : (
            <MaterialIcons
              // @ts-ignore
              name={getIconName(item.name)}
              size={24}
              color={getIconColor(item.name)}
            />
          )}
        </View>
        <Text style={{ ...styles.categoryName }}>
          {item.name.slice(0, 10) + (item.name.length > 10 ? "..." : "")}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Content */}
      {isLoading && categories.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#8A3FFC" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load categories</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No categories found</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          renderItem={renderCategory}
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
            ) : hasNextPage === false && categories.length > 0 ? (
              <View style={styles.endOfListContainer}>
                <Text style={styles.endOfListText}>No more categories</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: 90,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 70,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#333",
    textAlign: "center",
    textTransform: "capitalize",
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontFamily: "Jost-Regular",
  },
  footerLoader: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 90,
    width: 70,
  },
  endOfListContainer: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 90,
    width: 70,
  },
  endOfListText: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    textAlign: "center",
  },
});
