import React, { useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useOrder } from "@/lib/api/hooks/useOrder";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: orderData, isLoading, error } = useOrder(orderId || "");

  // Redirect to home if no orderId is provided
  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId]);

  const handleViewOrderDetails = () => {
    router.push(`/order/${orderId}`);
  };

  const handleContinueShopping = () => {
    router.replace("/");
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <Typography style={styles.loadingText}>Loading order details...</Typography>
      </View>
    );
  }

  if (error || !orderData || !orderData.data) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <Typography style={styles.errorText}>
          Error loading order details. Please try again.
        </Typography>
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinueShopping}
        >
          <Typography style={styles.buttonText}>Continue Shopping</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  // Cast the order data to the correct type
  const order = orderData.data as any;
  // Default to delivery if isDelivery is undefined
  const isDelivery = typeof order.isDelivery !== 'undefined' ? order.isDelivery : true;
  // Default to COD if paymentType is undefined
  const isCOD = order.paymentType ? order.paymentType === "cod" : true;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIconContainer}>
          <MaterialIcons name="check-circle" size={80} color={COLORS.SUCCESS} />
        </View>

        <Typography style={styles.successTitle}>Order Placed Successfully!</Typography>

        <Typography style={styles.orderNumber}>
          Order #{order.orderNumber}
        </Typography>

        <View style={styles.infoCard}>
          <Typography style={styles.infoTitle}>
            {isCOD
              ? `Pay ₹${order.totalPayableAmount.toFixed(2)} on ${isDelivery ? 'delivery' : 'pickup'}`
              : 'Payment Completed'
            }
          </Typography>

          <Typography style={styles.infoDescription}>
            {isDelivery
              ? "Your order will be delivered to your address soon."
              : "Your order is ready for pickup at the store."
            }
          </Typography>

          <View style={styles.statusContainer}>
            <Typography style={styles.statusLabel}>Order Status:</Typography>
            <View style={styles.statusBadge}>
              <Typography style={styles.statusText}>{order.orderStatus}</Typography>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <Typography style={styles.statusLabel}>Payment Status:</Typography>
            <View style={[
              styles.statusBadge,
              order.paymentStatus === "completed" ? styles.successBadge : styles.pendingBadge
            ]}>
              <Typography style={styles.statusText}>{order.paymentStatus}</Typography>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleViewOrderDetails}
        >
          <Typography style={styles.buttonText}>View Order Details</Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={handleContinueShopping}
        >
          <Typography style={styles.outlineButtonText}>Continue Shopping</Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.LG,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.LG,
    alignItems: "center",
  },
  successIconContainer: {
    marginTop: SPACING.XL * 2,
    marginBottom: SPACING.LG,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  orderNumber: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SPACING.XL,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    width: "100%",
    marginBottom: SPACING.XL,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.LG,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginRight: SPACING.SM,
  },
  statusBadge: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  successBadge: {
    backgroundColor: COLORS.SUCCESS_LIGHT,
  },
  pendingBadge: {
    backgroundColor: COLORS.WARNING_LIGHT,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.TEXT_DARK,
    textTransform: "capitalize",
  },
  button: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.WHITE,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
  },
});
