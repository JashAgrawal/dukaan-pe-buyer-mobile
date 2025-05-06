import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useOrderDetails } from "@/lib/api/hooks/useOrder";
import { MaterialIcons } from "@expo/vector-icons";
import { OrderStatus } from "@/types/order";
import moment from "moment";
// import { Image } from "expo-image";
import { getImageUrl } from "@/lib/helpers";

// Status colors for different order statuses
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: COLORS.WARNING,
  processing: COLORS.PRIMARY,
  shipped: COLORS.INFO,
  delivered: COLORS.SUCCESS,
  cancelled: COLORS.ERROR,
  refunded: COLORS.GRAY_MEDIUM,
};

// Status labels for different order statuses
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useOrderDetails(id);

  // Cast the response to any to handle the nested order structure
  const order = data?.data as any;

  // Format date
  const orderDate = order ? moment(order.createdAt).format("MMM DD, YYYY • h:mm A") : "";

  // Get status color and label
  const orderStatus = order?.orderStatus as OrderStatus || 'pending';
  const statusColor = order ? STATUS_COLORS[orderStatus] || COLORS.GRAY_MEDIUM : COLORS.GRAY_MEDIUM;
  const statusLabel = order ? STATUS_LABELS[orderStatus] || "Unknown" : "Unknown";

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <MaterialIcons name="error-outline" size={64} color={COLORS.ERROR} />
        <Typography style={styles.errorTitle}>Order Not Found</Typography>
        <Typography style={styles.errorText}>
          We couldn't find the order you're looking for.
        </Typography>
        <TouchableOpacity
          style={styles.backToOrdersButton}
          onPress={() => router.back()}
        >
          <Typography style={styles.backToOrdersButtonText}>Back to Orders</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>Order Details</Typography>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Typography style={styles.statusText}>{statusLabel}</Typography>
          </View>
          <Typography style={styles.orderNumber}>{order.orderNumber}</Typography>
          <Typography style={styles.orderDate}>{orderDate}</Typography>
        </View>

        {/* Order Items */}
        <View style={styles.sectionContainer}>
          <Typography style={styles.sectionTitle}>Order Items</Typography>

          {order.items.map((item: any) => {
            return (
              <View key={item._id} style={styles.orderItem}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: getImageUrl(item.product.mainImage) }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.productDetails}>
                  <Typography style={styles.productName}>
                    {typeof item.product === 'string' ? 'Product' : item.product.name}
                  </Typography>

                  <View style={styles.priceRow}>
                    <Typography style={styles.quantity}>Qty: {item.quantity}</Typography>
                    <Typography style={styles.itemPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Address */}
        <View style={styles.sectionContainer}>
          <Typography style={styles.sectionTitle}>Delivery Address</Typography>

          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={20} color={COLORS.PRIMARY} style={styles.addressIcon} />
            <View style={styles.addressDetails}>
              <Typography style={styles.addressName}>{order.deliveryAddressId.name}</Typography>
              <Typography style={styles.addressText}>
                {order.deliveryAddressId.addressLine1}
                {order.deliveryAddressId.addressLine2 ? `, ${order.deliveryAddressId.addressLine2}` : ''}
              </Typography>
              <Typography style={styles.addressText}>
                {order.deliveryAddressId.city}, {order.deliveryAddressId.state} {order.deliveryAddressId.pincode}
              </Typography>
              <Typography style={styles.addressPhone}>
                Phone: {order.deliveryAddressId.mobileNumber}
              </Typography>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.sectionContainer}>
          <Typography style={styles.sectionTitle}>Payment Details</Typography>

          <View style={styles.paymentMethod}>
            <MaterialIcons
              name={order.paymentType === 'COD' ? 'payments' : 'credit-card'}
              size={20}
              color={COLORS.TEXT_DARK}
            />
            <Typography style={styles.paymentMethodText}>
              {order.paymentType === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
            </Typography>
          </View>

          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Typography style={styles.priceLabel}>Subtotal</Typography>
              <Typography style={styles.priceValue}>₹{order.totalWithoutDiscount.toFixed(2)}</Typography>
            </View>

            {order.deliveryCharges > 0 && (
              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>Delivery Fee</Typography>
                <Typography style={styles.priceValue}>₹{order.deliveryCharges.toFixed(2)}</Typography>
              </View>
            )}

            {order.totalDiscount > 0 && (
              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>Discount</Typography>
                <Typography style={[styles.priceValue, styles.discountText]}>
                  -₹{order.totalDiscount.toFixed(2)}
                </Typography>
              </View>
            )}

            {order.couponDiscount > 0 && (
              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>Coupon Discount</Typography>
                <Typography style={[styles.priceValue, styles.discountText]}>
                  -₹{order.couponDiscount.toFixed(2)}
                </Typography>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Typography style={styles.totalLabel}>Total</Typography>
              <Typography style={styles.totalValue}>₹{order.totalPayableAmount.toFixed(2)}</Typography>
            </View>
          </View>
        </View>

        {/* Need Help */}
        <TouchableOpacity style={styles.helpButton}>
          <MaterialIcons name="headset-mic" size={20} color={COLORS.PRIMARY} />
          <Typography style={styles.helpButtonText}>Need Help with this Order?</Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.GRAY_LIGHTEST,
    paddingTop: 30,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XXXL,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  backToOrdersButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
  },
  backToOrdersButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: SPACING.SM,
    marginLeft: -SPACING.SM,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XXXL,
  },
  statusContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    alignItems: "center",
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  statusBadge: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: SPACING.SM,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  sectionContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: SPACING.MD,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.SM,
    overflow: "hidden",
    backgroundColor: COLORS.GRAY_LIGHTER,
    marginRight: SPACING.MD,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  variantText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  quantity: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  addressContainer: {
    flexDirection: "row",
  },
  addressIcon: {
    marginRight: SPACING.SM,
    marginTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginTop: 4,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  paymentMethodText: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.SM,
  },
  priceSummary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingTop: SPACING.MD,
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
    marginTop: SPACING.SM,
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
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
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.PRIMARY,
    marginLeft: SPACING.SM,
  },
});
