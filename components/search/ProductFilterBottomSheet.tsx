import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@/components/ui/BottomSheet";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

interface ProductFilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: {
    minPrice: number;
    maxPrice: number;
    sortBy: "popularity" | "price_low" | "price_high" | "newest" | "rating";
  };
}

export default function ProductFilterBottomSheet({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}: ProductFilterBottomSheetProps) {
  // Local state for filters
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);

  // Shared values for sliders
  const minProgress = useSharedValue(minPrice);
  const maxProgress = useSharedValue(maxPrice);
  const minBound = useSharedValue(0);
  const maxBound = useSharedValue(1000);
  const maxPriceBound = useSharedValue(10000);

  // Reset filters when the sheet opens
  useEffect(() => {
    if (isVisible) {
      setMinPrice(initialFilters.minPrice);
      setMaxPrice(initialFilters.maxPrice);
      setSortBy(initialFilters.sortBy);

      // Update slider values
      if (minProgress) minProgress.value = initialFilters.minPrice;
      if (maxProgress) maxProgress.value = initialFilters.maxPrice;
    }
  }, [isVisible, initialFilters]);

  // Handle apply filters
  const handleApply = () => {
    onApply({
      minPrice,
      maxPrice,
      sortBy,
    });
  };

  // Handle reset filters
  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy("popularity");
  };

  // Sort options
  const sortOptions = [
    { id: "popularity", label: "Popularity" },
    { id: "price_low", label: "Price: Low to High" },
    { id: "price_high", label: "Price: High to Low" },
    { id: "newest", label: "Newest First" },
    { id: "rating", label: "Rating" },
  ];

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      title="Filter Products"
      height={500}
    >
      <ScrollView style={styles.container}>
        {/* Price Range */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>Price Range</Typography>
          <View style={styles.priceContainer}>
            <View style={styles.priceBox}>
              <Typography style={styles.priceLabel}>Min</Typography>
              <Typography style={styles.priceValue}>₹{minPrice}</Typography>
            </View>
            <View style={styles.priceBox}>
              <Typography style={styles.priceLabel}>Max</Typography>
              <Typography style={styles.priceValue}>₹{maxPrice}</Typography>
            </View>
          </View>
          {/* Min Price Slider */}
          <View style={styles.sliderContainer}>
            <Typography style={styles.sliderLabel}>Min Price (₹0 - ₹1000)</Typography>
            <Slider
              style={styles.slider}
              progress={minProgress}
              minimumValue={minBound}
              maximumValue={maxBound}
              onValueChange={(value) => {
                setMinPrice(Math.round(value));
              }}
              theme={{
                minimumTrackTintColor: '#8A3FFC',
                maximumTrackTintColor: '#CCCCCC',
                bubbleBackgroundColor: '#8A3FFC',
              }}
            />
          </View>

          {/* Max Price Slider */}
          <View style={styles.sliderContainer}>
            <Typography style={styles.sliderLabel}>Max Price (₹1000 - ₹10000)</Typography>
            <Slider
              style={styles.slider}
              progress={maxProgress}
              minimumValue={maxBound}
              maximumValue={maxPriceBound}
              onValueChange={(value) => {
                setMaxPrice(Math.round(value));
              }}
              theme={{
                minimumTrackTintColor: '#8A3FFC',
                maximumTrackTintColor: '#CCCCCC',
                bubbleBackgroundColor: '#8A3FFC',
              }}
            />
          </View>

          {/* Price Range Buttons */}
          <View style={styles.priceButtonsRow}>
            <Typography style={styles.sliderLabel}>Quick Select:</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceButtonsScroll}>
              <TouchableOpacity
                style={[styles.quickSelectButton, minPrice === 0 && maxPrice === 1000 && styles.selectedQuickButton]}
                onPress={() => {
                  setMinPrice(0);
                  setMaxPrice(1000);
                  if (minProgress) minProgress.value = 0;
                  if (maxProgress) maxProgress.value = 1000;
                }}
              >
                <Typography style={[
                  styles.quickSelectText,
                  minPrice === 0 && maxPrice === 1000 && { color: "#FFFFFF" }
                ]}>Under ₹1000</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickSelectButton, minPrice === 1000 && maxPrice === 5000 && styles.selectedQuickButton]}
                onPress={() => {
                  setMinPrice(1000);
                  setMaxPrice(5000);
                  if (minProgress) minProgress.value = 1000;
                  if (maxProgress) maxProgress.value = 5000;
                }}
              >
                <Typography style={[
                  styles.quickSelectText,
                  minPrice === 1000 && maxPrice === 5000 && { color: "#FFFFFF" }
                ]}>₹1000 - ₹5000</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickSelectButton, minPrice === 5000 && maxPrice === 10000 && styles.selectedQuickButton]}
                onPress={() => {
                  setMinPrice(5000);
                  setMaxPrice(10000);
                  if (minProgress) minProgress.value = 5000;
                  if (maxProgress) maxProgress.value = 10000;
                }}
              >
                <Typography style={[
                  styles.quickSelectText,
                  minPrice === 5000 && maxPrice === 10000 && { color: "#FFFFFF" }
                ]}>₹5000+</Typography>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>Sort By</Typography>
          <View style={styles.sortOptions}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  sortBy === option.id && styles.selectedSortOption,
                ]}
                onPress={() => setSortBy(option.id as any)}
              >
                <Typography
                  style={[
                    styles.sortOptionText,
                    sortBy === option.id && styles.selectedSortOptionText,
                  ]}
                >
                  {option.label}
                </Typography>
                {sortBy === option.id && (
                  <MaterialIcons name="check" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Typography style={styles.resetButtonText}>Reset</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Typography style={styles.applyButtonText}>Apply</Typography>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    width: "48%",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sliderContainer: {
    width: "100%",
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceButtonsRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  priceButtonsScroll: {
    marginTop: 8,
  },
  quickSelectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedQuickButton: {
    backgroundColor: "#8A3FFC",
    borderColor: "#8A3FFC",
  },
  quickSelectText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  sortOptions: {
    flexDirection: "column",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  selectedSortOption: {
    backgroundColor: "#8A3FFC",
  },
  sortOptionText: {
    fontSize: 14,
  },
  selectedSortOptionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8A3FFC",
  },
  resetButtonText: {
    color: "#8A3FFC",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#8A3FFC",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
