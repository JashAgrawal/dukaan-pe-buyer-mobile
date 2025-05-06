import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useOrder } from "@/lib/api/hooks/useOrder";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orderData, isLoading, error } = useOrder(id || "");

  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={COLORS.PRIMARY_DARK} />
      </View>
    );
  }

  if (error || !orderData?.data) {
    console.log(error);
    console.log(orderData)
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <Typography style={styles.errorText}>
          Error loading order details. Please try again.
        </Typography>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Typography style={styles.buttonText}>Go to Home</Typography>
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
  // Format date with fallback
  const formattedDate = order.createdAt
    ? moment(order.createdAt).format("MMM DD, YYYY [at] h:mm A")
    : "Order date not available";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>Order Details</Typography>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID and Date */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderNumberContainer}>
            <Typography style={styles.orderNumberLabel}>Order #</Typography>
            <Typography style={styles.orderNumber}>{order.orderNumber}</Typography>
          </View>
          <Typography style={styles.orderDate}>{formattedDate}</Typography>
        </View>

        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Typography style={styles.statusLabel}>Order Status:</Typography>
            <View style={styles.statusBadge}>
              <Typography style={styles.statusText}>{order.orderStatus}</Typography>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Typography style={styles.statusLabel}>Payment Status:</Typography>
            <View style={[
              styles.statusBadge,
              order.paymentStatus === "completed" ? styles.successBadge : styles.pendingBadge
            ]}>
              <Typography style={styles.statusText}>{order.paymentStatus}</Typography>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Typography style={styles.statusLabel}>Payment Method:</Typography>
            <Typography style={styles.paymentMethod}>
              {isCOD ? `Cash on ${isDelivery ? 'Delivery' : 'Pickup'}` : 'Online Payment'}
            </Typography>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.sectionCard}>
          <Typography style={styles.sectionTitle}>Order Items</Typography>

          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemDetails}>
                <Typography style={styles.itemName}>
                  {typeof item.product === 'string' ? 'Product' : item.product.name}
                </Typography>
                <Typography style={styles.itemQuantity}>
                  Qty: {item.quantity}
                </Typography>
              </View>
              <Typography style={styles.itemPrice}>
                ₹{item.discountedPrice ? item.discountedPrice.toFixed(2) : item.price.toFixed(2)}
              </Typography>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.sectionCard}>
          <Typography style={styles.sectionTitle}>Price Details</Typography>

          <View style={styles.priceRow}>
            <Typography style={styles.priceLabel}>Item Total</Typography>
            <Typography style={styles.priceValue}>₹{order.totalWithoutDiscount.toFixed(2)}</Typography>
          </View>

          {order.totalDiscount > 0 && (
            <View style={styles.priceRow}>
              <Typography style={styles.priceLabel}>Discount</Typography>
              <Typography style={[styles.priceValue, styles.discountText]}>
                -₹{order.totalDiscount.toFixed(2)}
              </Typography>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Typography style={styles.totalLabel}>Total</Typography>
            <Typography style={styles.totalValue}>₹{order.totalPayableAmount.toFixed(2)}</Typography>
          </View>
        </View>

        {/* Delivery Address */}
        {isDelivery && order.deliveryAddressId && (
          <View style={styles.sectionCard}>
            <Typography style={styles.sectionTitle}>Delivery Address</Typography>

            <View style={styles.addressContainer}>
              <Typography style={styles.addressType}>
                {order.deliveryAddressId.type}
              </Typography>
              <Typography style={styles.addressText}>
                {order.deliveryAddressId.houseDetails}, {order.deliveryAddressId.streetAddress}
              </Typography>
              <Typography style={styles.addressText}>
                {order.deliveryAddressId.city}, {order.deliveryAddressId.state} {order.deliveryAddressId.pincode}
              </Typography>
            </View>
          </View>
        )}
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
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  button: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL * 2,
  },
  orderInfoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  orderNumberLabel: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginRight: SPACING.XS,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  statusCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.SM,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  statusBadge: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  successBadge: {
    backgroundColor: COLORS.SUCCESS + "20",
  },
  pendingBadge: {
    backgroundColor: COLORS.WARNING + "20",
  },
  statusText: {
    fontSize: 12,
    color: COLORS.TEXT_DARK,
    textTransform: "capitalize",
  },
  paymentMethod: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.SM,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
  discountText: {
    color: COLORS.SUCCESS,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
    marginTop: SPACING.SM,
    paddingTop: SPACING.SM,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  addressContainer: {
    paddingVertical: SPACING.SM,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    textTransform: "capitalize",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 2,
  },
});
