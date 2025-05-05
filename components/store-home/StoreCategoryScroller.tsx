import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import InfiniteScroller from "../common/InfiniteScroller";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "@/lib/helpers";
import productService from "@/lib/api/services/productService";

// Map of category names to icon names
const CATEGORY_ICONS: Record<string, string> = {
  Food: "restaurant",
  Vegetables: "eco",
  Fruits: "nutrition",
  Dairy: "egg",
  Bakery: "bakery-dining",
  Meat: "kebab-dining",
  Beverages: "local-drink",
  Snacks: "lunch-dining",
  // Default icon for any category not in this map
  default: "category",
  all: "apps",
};

// Custom colors for categories
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FFD700",
  Vegetables: "#32CD32",
  Fruits: "#FF6347",
  Dairy: "#00BFFF",
  Bakery: "#FFA500",
  Meat: "#FF4500",
  Beverages: "#9370DB",
  Snacks: "#FF69B4",
  // Default color
  default: "#8A3FFC",
  all: "#8A3FFC",
};

interface ProductCategory {
  _id: string;
  name: string;
  image?: string;
}

interface StoreCategoryScrollerProps {
  storeId: string;
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export default function StoreCategoryScroller({
  storeId,
  onCategorySelect,
  selectedCategoryId,
}: StoreCategoryScrollerProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product categories for the store
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductCategoriesByStore(storeId);

        // Add "All" category at the beginning
        const allCategories = [
          { _id: "all", name: "All" },
          ...(response.data?.categories || []),
        ];

        setCategories(allCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product categories:", err);
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    if (storeId) {
      fetchCategories();
    }
  }, [storeId]);

  // Handle category press
  const handleCategoryPress = (category: ProductCategory) => {
    // Update the selected category in the parent component
    onCategorySelect(category._id === "all" ? null : category._id);

    // Navigate to the category page if it's not "all"
    if (category._id !== "all") {
      router.push(`/store-home/${storeId}/category/${category._id}`);
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

  // Render a category item
  const renderCategory = useCallback(({ item }: { item: ProductCategory }) => {
    const isSelected =
      (selectedCategoryId === null && item._id === "all") ||
      selectedCategoryId === item._id;

    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected
                ? getIconColor(item.name)
                : getIconBgColor(item.name)
            },
          ]}
        >
          {item.image ? (
            <Image
              source={{ uri: getImageUrl(item.image) }}
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
              color={isSelected ? "#FFFFFF" : getIconColor(item.name)}
            />
          )}
        </View>
        <Text style={[
          styles.categoryName,
          isSelected && { color: getIconColor(item.name), fontWeight: "600" }
        ]}>
          {item.name.slice(0, 10) + (item.name.length > 10 ? "..." : "")}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategoryId]);

  return (
    <InfiniteScroller
      title="Shop by Category"
      subtitle="Browse products by category"
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item: ProductCategory) => item._id}
      isLoading={loading}
      error={error}
      onSeeAllPress={() => console.log("See all categories pressed")}
      horizontal={true}
      contentContainerStyle={styles.scrollContent}
      emptyText="No categories found"
      containerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
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
    overflow: "hidden",
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#333",
    textAlign: "center",
    textTransform: "capitalize",
  },
});
