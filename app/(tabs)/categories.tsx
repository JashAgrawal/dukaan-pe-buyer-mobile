import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import {
  useStoreCategories,
  flattenCategories,
} from "@/lib/api/hooks/useStoreCategories";
import { Category } from "@/lib/api/services/categoryService";
import { getImageUrl } from "@/lib/helpers";

export default function CategoriesScreen() {
  // Fetch categories
  const categoriesQuery = useStoreCategories();
  const categories = flattenCategories(categoriesQuery.data);

  // Handle category press
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: "/category/[id]",
      params: { id: category._id },
    });
  };

  // Render category item
  const renderCategoryItem = useCallback(({ item }: { item: Category }) => {
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryContent}>
          <View style={styles.iconContainer}>
            {item.image ? (
              <Image
                source={{ uri: getImageUrl(item.image) }}
                style={styles.categoryImage}
              />
            ) : (
              <MaterialIcons name="category" size={24} color="#8A3FFC" />
            )}
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.storeCount}>{item.noOfStores || 0} stores</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper
        headerComponent={
          <ShortAppHeader title="Categories" showBackButton={false} />
        }
        isShortHeader={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Browse stores by category</Text>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            categoriesQuery.isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Loading categories...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No categories found</Text>
              </View>
            )
          }
        />
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingTop: 32,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Jost-Bold",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#666666",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000000",
  },
  storeCount: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666666",
    marginTop: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#666666",
    textAlign: "center",
  },
});
