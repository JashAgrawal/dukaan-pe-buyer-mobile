import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApplyCoupon, useRemoveCoupon } from "@/lib/api/hooks/useCart";
import { useAvailableCoupons } from "@/lib/api/hooks/useCoupon";
import couponService from "@/lib/api/services/couponService";
import { Coupon } from "@/types/coupon";
import { CartCoupon } from "@/types/cart";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

interface CouponItem extends Coupon {
  isApplied?: boolean;
  formattedDiscount?: string;
  description?: string;
  validUntil?: string;
  minOrderValue?: number;
}

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  appliedCouponId?: string | null | CartCoupon;
}

export default function CouponModal({
  visible,
  onClose,
  appliedCouponId,
}: CouponModalProps) {
  const insets = useSafeAreaInsets();
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const { activeStore } = useActiveStoreStore();

  // Check if appliedCouponId is a CartCoupon object
  const isCartCoupon = appliedCouponId && typeof appliedCouponId === 'object';
  const appliedCoupon = isCartCoupon ? appliedCouponId as CartCoupon : null;

  // Fetch available coupons
  const {
    data: couponsData,
    isLoading: isLoadingCoupons,
    error: couponsError
  } = useAvailableCoupons(activeStore?._id || "");

  // Format coupons data for display
  const formatCoupons = (): CouponItem[] => {
    if (!couponsData?.data?.coupons) return [];

    return couponsData.data.coupons.map(coupon => {
      // Format the discount text based on discount type
      let formattedDiscount = "";
      if (coupon.type === "percentage") {
        formattedDiscount = `${coupon.discountPercentage}% off`;
        if (coupon.maxDiscount) {
          formattedDiscount += ` up to ₹${coupon.maxDiscount}`;
        }
      } else {
        formattedDiscount = `₹${coupon.discountAmt} off`;
      }

      // Check if this coupon is applied
      let isApplied = false;
      if (isCartCoupon && appliedCoupon) {
        isApplied = appliedCoupon._id === coupon.id || appliedCoupon.code === coupon.code;
      } else if (typeof appliedCouponId === 'string') {
        isApplied = appliedCouponId === coupon.id;
      }

      // Add additional fields for display
      return {
        ...coupon,
        isApplied,
        formattedDiscount,
        description: `Discount on all products`, // Example description
        validUntil: new Date().toISOString(), // Example date
        minOrderValue: 0 // Example min order value
      };
    });
  };

  const coupons = formatCoupons();

  const handleApplyCoupon = (_couponId: string, code: string) => {
    applyCoupon.mutate(
      { couponCode: code },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Error applying coupon:", error);
          Alert.alert("Error", "Failed to apply coupon. Please try again.");
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    removeCoupon.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error removing coupon:", error);
        Alert.alert("Error", "Failed to remove coupon. Please try again.");
      },
    });
  };

  const handleApplyCouponCode = async () => {
    if (couponCode.trim()) {
      setIsValidating(true);
      try {
        // First validate the coupon code
        const validationResponse = await couponService.validateCouponCode(couponCode.trim(), activeStore?._id || "");

        if (validationResponse.data?.valid && validationResponse.data?.coupon) {
          // If valid, apply the coupon
          applyCoupon.mutate(
            { couponCode: couponCode.trim() },
            {
              onSuccess: () => {
                setCouponCode("");
                onClose();
              },
              onError: (error) => {
                console.error("Error applying coupon:", error);
                Alert.alert("Error", "Failed to apply coupon. Please try again.");
              },
            }
          );
        } else {
          // If invalid, show error
          Alert.alert("Invalid Coupon", "The coupon code you entered is invalid or has expired.");
        }
      } catch (error) {
        console.error("Error validating coupon:", error);
        Alert.alert("Error", "Failed to validate coupon. Please try again.");
      } finally {
        setIsValidating(false);
      }
    }
  };

  const renderCouponItem = ({ item }: { item: CouponItem }) => (
    <View style={styles.couponItem}>
      <View style={styles.couponLeft}>
        <Typography style={styles.couponCode}>{item.code}</Typography>
        <Typography style={styles.couponDescription}>{item.description}</Typography>
        <Typography style={styles.couponDiscount}>{item.formattedDiscount}</Typography>
        {item.minOrderValue && item.minOrderValue > 0 && (
          <Typography style={styles.couponMinOrder}>
            Min. order: ₹{item.minOrderValue}
          </Typography>
        )}
        {item.validUntil && (
          <Typography style={styles.couponValidity}>
            Valid until: {new Date(item.validUntil).toLocaleDateString()}
          </Typography>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.couponButton,
          item.isApplied && styles.couponButtonApplied,
        ]}
        onPress={() =>
          item.isApplied
            ? handleRemoveCoupon()
            : handleApplyCoupon(item.id, item.code)
        }
      >
        <Typography
          style={[
            styles.couponButtonText,
            item.isApplied && styles.couponButtonTextApplied,
          ]}
        >
          {item.isApplied ? "REMOVE" : "APPLY"}
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.content,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.TEXT_DARK} />
            </TouchableOpacity>
            <Typography style={styles.title}>Apply Coupon</Typography>
            <View style={styles.placeholder} />
          </View>

          {/* Coupon Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[
                styles.applyButton,
                (!couponCode.trim() || isValidating) && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyCouponCode}
              disabled={!couponCode.trim() || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator size="small" color={COLORS.WHITE} />
              ) : (
                <Typography
                  style={[
                    styles.applyButtonText,
                    !couponCode.trim() && styles.applyButtonTextDisabled,
                  ]}
                >
                  APPLY
                </Typography>
              )}
            </TouchableOpacity>
          </View>

          {/* Available Coupons */}
          <Typography style={styles.sectionTitle}>Available Coupons</Typography>

          {isLoadingCoupons ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Typography style={styles.loadingText}>Loading coupons...</Typography>
            </View>
          ) : couponsError ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color={COLORS.ERROR} />
              <Typography style={styles.errorText}>
                Failed to load coupons. Please try again.
              </Typography>
            </View>
          ) : coupons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="local-offer" size={24} color={COLORS.GRAY_MEDIUM} />
              <Typography style={styles.emptyText}>
                No coupons available at the moment.
              </Typography>
            </View>
          ) : (
            <FlatList
              data={coupons}
              renderItem={renderCouponItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.couponsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: "80%",
  },
  loadingContainer: {
    padding: SPACING.LG,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: SPACING.SM,
    color: COLORS.TEXT_MEDIUM,
  },
  errorContainer: {
    padding: SPACING.LG,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  errorText: {
    marginLeft: SPACING.SM,
    color: COLORS.ERROR,
  },
  emptyContainer: {
    padding: SPACING.LG,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: SPACING.SM,
    color: COLORS.TEXT_MEDIUM,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  placeholder: {
    width: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    marginRight: 12,
  },
  applyButton: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  applyButtonTextDisabled: {
    color: COLORS.GRAY_MEDIUM,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  couponsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  couponItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: 12,
  },
  couponLeft: {
    flex: 1,
    marginRight: 12,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: 4,
  },
  couponDiscount: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
  couponMinOrder: {
    fontSize: 11,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  couponValidity: {
    fontSize: 11,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  couponButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
  },
  couponButtonApplied: {
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  couponButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  couponButtonTextApplied: {
    color: COLORS.WHITE,
  },
});
