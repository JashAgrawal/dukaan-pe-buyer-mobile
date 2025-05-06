import React from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { CartCoupon } from "@/types/cart";

interface CouponSectionProps {
  onPress: () => void;
  appliedCouponId?: string | null | CartCoupon;
}

export default function CouponSection({ onPress, appliedCouponId }: CouponSectionProps) {
  // Check if appliedCouponId is a CartCoupon object
  const isCartCoupon = appliedCouponId && typeof appliedCouponId === 'object';
  const appliedCoupon = isCartCoupon ? appliedCouponId as CartCoupon : null;
  const isLoadingCoupon = false;

  // Format discount text
  const getDiscountText = () => {
    if (!appliedCoupon) return "";

    if (appliedCoupon.type === "percentage") {
      return `${appliedCoupon.discountPercentage}% off`;
    } else {
      return `₹${appliedCoupon.discountAmt} off`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="local-offer" size={24} color="#00C853" />
      </View>
      <View style={styles.textContainer}>
        {isLoadingCoupon ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Typography style={styles.loadingText}>Loading coupon...</Typography>
          </View>
        ) : appliedCoupon ? (
          <>
            <Typography style={styles.title}>Applied: {appliedCoupon.code}</Typography>
            <View style={styles.couponInfoContainer}>
              <Typography style={styles.discountText}>{getDiscountText()}</Typography>
              <Typography style={styles.couponDescription}>Discount on products</Typography>
            </View>
          </>
        ) : (
          <Typography style={styles.title}>View Coupons & Offers</Typography>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.TEXT_LIGHT} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.LIGHT,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: SPACING.XS,
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
  },
  couponInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  discountText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.SUCCESS,
    marginRight: SPACING.SM,
  },
  couponDescription: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
});
