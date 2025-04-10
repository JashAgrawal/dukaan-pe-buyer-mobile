import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Category, getCategories } from "@/lib/api/services/categoryService";
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
}

export default function CategoryScroller({
  onCategoryPress,
}: CategoryScrollerProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories(8);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch categories")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category: Category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Navigate to category page
      router.push({
        pathname: "/search/results",
        params: { category: category._id, categoryName: category.name },
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8A3FFC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load categories</Text>
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No categories found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category._id}
          style={styles.categoryItem}
          onPress={() => handleCategoryPress(category)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getIconBgColor(category.name) },
            ]}
          >
            {/* <MaterialIcons
              // @ts-ignore
              name={getIconName(category.name)}
              size={24}
              color={getIconColor(category.name)}
            /> */}
            {category.image ? (
              <Image
                source={{ uri: `${getImageUrl(category.image)}` }}
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
                name={getIconName(category.name)}
                size={24}
                color={getIconColor(category.name)}
              />
            )}
          </View>
          <Text style={styles.categoryName}>
            {category.name.slice(0, 10) +
              (category.name.length > 10 ? "..." : "")}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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
});
