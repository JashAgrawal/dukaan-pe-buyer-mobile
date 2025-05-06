import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { useCartStore } from "@/stores/cartStore";

const { width } = Dimensions.get("window");

export default function FloatingCartButtonZustand() {
  const insets = useSafeAreaInsets();
  const { activeStore } = useActiveStoreStore();
  const { cart, summary } = useCartStore();
  const pathname = usePathname();

  // Check if the current path is one of the allowed paths
  const isAllowedPath = () => {
    // For debugging
    console.log("Current pathname:", pathname);

    // Cart page - don't show floating button on cart page
    if (pathname === "/cart") {
      return false;
    }
    if(pathname.includes("/order")){
      return false;
    }

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

    // Product detail page - don't show floating button on product page
    if (pathname.match(/^\/product\/[^\/]+$/)) {
      console.log("On product detail page, not showing floating button");
      return false;
    }

    // For debugging - log unmatched paths
    console.log("Path not explicitly matched:", pathname);

    // Default to showing on other pages if not explicitly excluded
    return true;
  };

  const handlePress = () => {
    router.push("/cart");
  };

  // Calculate values from cart data
  const itemCount = cart?.items.length || 0;
  const totalAmount = summary?.total || 0;
  const hasFreeDelivery = totalAmount >= 500; // Example threshold

  // Don't show if no items, no active store, or not on an allowed page
  const shouldShow = itemCount > 0 && !!activeStore && isAllowedPath();

  if (!shouldShow) {
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
            {itemCount} {itemCount === 1 ? "Item" : "Items"} | ₹{totalAmount.toFixed(2)}
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
