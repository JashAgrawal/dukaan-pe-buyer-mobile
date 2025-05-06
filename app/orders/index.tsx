import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useUserOrders } from "@/lib/api/hooks/useOrder";
import { MaterialIcons } from "@expo/vector-icons";
import { Order, OrderStatus } from "@/types/order";
import moment from "moment";
import { getImageUrl } from "@/lib/helpers";
// import { Image } from "expo-image";

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

export default function OrderHistoryScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useUserOrders(page, 10);

  // Handle refresh
  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  // Handle load more
  const handleLoadMore = () => {
    // Check if there are more orders to load
    if (data?.data?.orders && data.data.orders.length >= 10) {
      setPage(page + 1);
    }
  };

  // Navigate to order details
  const handleOrderPress = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  // Render order item
  const renderOrderItem = ({ item }: { item: Order }) => {
    // Get the first product image to display
    const firstItem = item.items[0];

    // Format date
    const orderDate = moment(item.createdAt).format("MMM DD, YYYY");

    // Get status color and label
    const statusColor = STATUS_COLORS[item.orderStatus] || COLORS.GRAY_MEDIUM;
    const statusLabel = STATUS_LABELS[item.orderStatus] || "Unknown";

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View>
            <Typography style={styles.orderNumber}>{item.orderNumber}</Typography>
            <Typography style={styles.orderDate}>{orderDate}</Typography>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Typography style={styles.statusText}>{statusLabel}</Typography>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.storeInfo}>
            <Typography style={styles.storeName}>
              {typeof item.store === 'string' ? 'Store' : (item.store as any).name || 'Store'}
            </Typography>
            <Typography style={styles.itemCount}>
              {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
            </Typography>
          </View>

          <View style={styles.orderSummary}>
            <View style={styles.thumbnailContainer}>
              {item.items.slice(0, 3).map((orderItem:any, index) => (
                <View
                  key={orderItem._id}
                  style={[
                    styles.thumbnail,
                    { marginLeft: index > 0 ? -15 : 0, zIndex: 3 - index }
                  ]}
                >
                  <Image
                    source={{ uri: typeof orderItem.product === 'string' ? getImageUrl(""):getImageUrl(orderItem.product.mainImage) }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
              {item.items.length > 3 && (
                <View style={[styles.thumbnail, styles.moreThumbnail]}>
                  <Typography style={styles.moreText}>+{item.items.length - 3}</Typography>
                </View>
              )}
            </View>

            <View style={styles.priceContainer}>
              <Typography style={styles.totalPrice}>₹{item.totalPayableAmount.toFixed(2)}</Typography>
              {item.totalDiscount > 0 && (
                <Typography style={styles.savedText}>
                  Saved ₹{item.totalDiscount.toFixed(2)}
                </Typography>
              )}
            </View>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleOrderPress(item._id)}
          >
            <Typography style={styles.detailsButtonText}>View Details</Typography>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-bag" size={64} color={COLORS.GRAY_LIGHT} />
        <Typography style={styles.emptyTitle}>No Orders Yet</Typography>
        <Typography style={styles.emptyText}>
          You haven't placed any orders yet. Start shopping to see your orders here.
        </Typography>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => router.replace("/")}
        >
          <Typography style={styles.shopNowButtonText}>Shop Now</Typography>
        </TouchableOpacity>
      </View>
    );
  };

  // Render footer (loading indicator for pagination)
  const renderFooter = () => {
    if (!isFetching || page === 1) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      </View>
    );
  };

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
        <Typography style={styles.headerTitle}>My Orders</Typography>
        <View style={styles.headerRight} />
      </View>

      {/* Order List */}
      <FlatList
        data={data?.data?.orders || []}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && page === 1}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.GRAY_LIGHTEST,
    paddingTop: 30,
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
  listContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XXXL,
  },
  orderCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.WHITE,
  },
  orderContent: {
    padding: SPACING.MD,
  },
  storeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.SM,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.SM,
  },
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GRAY_LIGHTER,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  moreThumbnail: {
    marginLeft: -15,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.PRIMARY_DARK,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  savedText: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    marginTop: 2,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    padding: SPACING.MD,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.PRIMARY,
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.XXXL,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  shopNowButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
  },
  shopNowButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  footerLoader: {
    paddingVertical: SPACING.LG,
    alignItems: "center",
  },
});
