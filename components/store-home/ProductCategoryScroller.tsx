import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { MaterialIcons } from "@expo/vector-icons";
import productService from "@/lib/api/services/productService";

interface ProductCategory {
  _id: string;
  name: string;
  image?: string;
}

interface ProductCategoryScrollerProps {
  storeId: string;
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export default function ProductCategoryScroller({
  storeId,
  onCategorySelect,
  selectedCategoryId,
}: ProductCategoryScrollerProps) {
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
  const handleCategoryPress = (categoryId: string | null) => {
    onCategorySelect(categoryId === "all" ? null : categoryId);
  };

  // Get background color for category
  const getCategoryBgColor = (isSelected: boolean) => {
    return isSelected ? "#8A3FFC" : "#F5F5F5";
  };

  // Get text color for category
  const getCategoryTextColor = (isSelected: boolean) => {
    return isSelected ? "#FFFFFF" : "#333333";
  };

  // Render category item
  const renderCategoryItem = useCallback(
    ({ item }: { item: ProductCategory }) => {
      const isSelected = 
        (selectedCategoryId === null && item._id === "all") || 
        selectedCategoryId === item._id;
      
      return (
        <TouchableOpacity
          style={[
            styles.categoryItem,
            { backgroundColor: getCategoryBgColor(isSelected) },
          ]}
          onPress={() => handleCategoryPress(item._id === "all" ? null : item._id)}
          activeOpacity={0.7}
        >
          {item.image && item._id !== "all" ? (
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={styles.categoryImage}
            />
          ) : (
            <MaterialIcons
              name={item._id === "all" ? "apps" : "category"}
              size={16}
              color={getCategoryTextColor(isSelected)}
            />
          )}
          <Text
            style={[
              styles.categoryName,
              { color: getCategoryTextColor(isSelected) },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategoryId]
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Typography style={styles.loadingText}>Loading categories...</Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Typography style={styles.errorText}>{error}</Typography>
      </View>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  loadingText: {
    textAlign: "center",
    padding: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    padding: 16,
    color: "#FF3B30",
  },
});
