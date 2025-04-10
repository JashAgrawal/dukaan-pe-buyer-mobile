import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { StoreFilterOptions } from "@/lib/api/services/storeService";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface StoreFilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  initialFilters: StoreFilterOptions;
  onApplyFilters: (filters: StoreFilterOptions) => void;
  categories: { id: string; name: string }[];
  isLoadingCategories: boolean;
}

export default function StoreFilterBottomSheet({
  isVisible,
  onClose,
  initialFilters,
  onApplyFilters,
  categories,
  isLoadingCategories,
}: StoreFilterBottomSheetProps) {
  const [filters, setFilters] = useState<StoreFilterOptions>(initialFilters);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);

  // Reset filters to initial state when the component mounts or initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <GestureHandlerRootView>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      </GestureHandlerRootView>
    ),
    []
  );

  // Open/close the sheet based on isVisible prop
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => {
      const categoryIds = prev.categoryIds || [];
      if (categoryIds.includes(categoryId)) {
        return {
          ...prev,
          categoryIds: categoryIds.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categoryIds: [...categoryIds, categoryId],
        };
      }
    });
  };

  // Handle sort selection
  const handleSortChange = (sortBy: "popularity" | "nearest" | "avgRating") => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  // Handle toggle switches
  const handleToggleChange = (field: "isOpen" | "isBrand") => {
    setFilters((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      query: initialFilters.query,
      page: 1,
      limit: 10,
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Stores</Text>
            <TouchableOpacity onPress={handleResetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Sort By Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    filters.sortBy === "popularity" &&
                      styles.selectedSortOption,
                  ]}
                  onPress={() => handleSortChange("popularity")}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === "popularity" &&
                        styles.selectedSortOptionText,
                    ]}
                  >
                    Popularity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    filters.sortBy === "nearest" && styles.selectedSortOption,
                  ]}
                  onPress={() => handleSortChange("nearest")}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === "nearest" &&
                        styles.selectedSortOptionText,
                    ]}
                  >
                    Nearest
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    filters.sortBy === "avgRating" && styles.selectedSortOption,
                  ]}
                  onPress={() => handleSortChange("avgRating")}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === "avgRating" &&
                        styles.selectedSortOptionText,
                    ]}
                  >
                    Rating
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              {isLoadingCategories ? (
                <ActivityIndicator size="small" color="#8A3FFC" />
              ) : (
                <View style={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        filters.categoryIds?.includes(category.id) &&
                          styles.selectedCategoryChip,
                      ]}
                      onPress={() => handleCategoryToggle(category.id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          filters.categoryIds?.includes(category.id) &&
                            styles.selectedCategoryChipText,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Filters Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filters</Text>

              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Open Now</Text>
                <Switch
                  value={filters.isOpen || false}
                  onValueChange={() => handleToggleChange("isOpen")}
                  trackColor={{ false: "#D1D1D6", true: "#8A3FFC" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Brands Only</Text>
                <Switch
                  value={filters.isBrand || false}
                  onValueChange={() => handleToggleChange("isBrand")}
                  trackColor={{ false: "#D1D1D6", true: "#8A3FFC" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 18,
    fontFamily: "Jost-Bold",
    color: "#000000",
  },
  resetText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#000000",
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
  },
  selectedSortOption: {
    backgroundColor: "#8A3FFC",
    borderColor: "#8A3FFC",
  },
  sortOptionText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666666",
  },
  selectedSortOptionText: {
    color: "#FFFFFF",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: "#8A3FFC",
    borderColor: "#8A3FFC",
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666666",
  },
  selectedCategoryChipText: {
    color: "#FFFFFF",
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#000000",
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  applyButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#FFFFFF",
  },
});
