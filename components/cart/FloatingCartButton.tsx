import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

interface FloatingCartButtonProps {
  itemCount: number;
  totalAmount: number;
  hasFreeDelivery?: boolean;
}

const { width } = Dimensions.get("window");

export default function FloatingCartButton({
  itemCount,
  totalAmount,
  hasFreeDelivery = false,
}: FloatingCartButtonProps) {
  const insets = useSafeAreaInsets();
  const { activeStore } = useActiveStoreStore();
  const pathname = usePathname();

  // Check if the current path is one of the allowed paths
  const isAllowedPath = () => {
    // For debugging
    console.log("Current pathname:", pathname);

    // Store Home page
    if (pathname.match(/^\/store-home\/[^\/]+$/)) {
      console.log("Matched store home page");
      return true;
    }

    // Products by category page
    if (pathname.match(/^\/store-home\/[^\/]+\/category\/[^\/]+$/)) {
      console.log("Matched products by category page");
      return true;
    }

    // Search results page
    if (pathname.match(/^\/store-home\/[^\/]+\/search$/)) {
      console.log("Matched search results page");
      return true;
    }

    // Product results page
    if (pathname.match(/^\/store-home\/[^\/]+\/product-results$/)) {
      console.log("Matched product results page");
      return true;
    }

    console.log("Not on an allowed path");
    return false;
  };

  const handlePress = () => {
    router.push("/cart");
  };

  // Don't show if no items, no active store, or not on an allowed page
  if (itemCount <= 0 || !activeStore || !isAllowedPath()) {
    return null;
  }

  return (
    <>
      {/* Free delivery notification */}
      {hasFreeDelivery && (
        <View style={styles.freeDeliveryContainer}>
          <View style={styles.checkIconContainer}>
            <Feather name="check" size={16} color="#FFFFFF" />
          </View>
          <Typography style={styles.freeDeliveryText}>
            Yay! FREE Delivery unlocked
          </Typography>
        </View>
      )}

      {/* Cart button */}
      <TouchableOpacity
        style={[
          styles.container,
          { bottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <Typography style={styles.storeName}>
            {activeStore?.name || "Store"}
          </Typography>
          <Typography style={styles.itemCount}>
            {itemCount || "1"} {itemCount === 1 ? "Item" : "Items"} | ₹{totalAmount ? totalAmount.toFixed(2) : "0.00"}
          </Typography>
        </View>

        <View style={styles.rightSection}>
          <Feather name="shopping-bag" size={20} color="#FFFFFF" />
          <Typography style={styles.viewCartText}>View Cart</Typography>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    backgroundColor: "#FF3B7F",
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  leftSection: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  storeName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  itemCount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  viewCartText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  freeDeliveryContainer: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 999,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  freeDeliveryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
});
