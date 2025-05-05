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
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApplyCoupon, useRemoveCoupon } from "@/lib/api/hooks/useCart";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: string;
  isApplied?: boolean;
}

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  appliedCouponId?: string;
}

export default function CouponModal({
  visible,
  onClose,
  appliedCouponId,
}: CouponModalProps) {
  const insets = useSafeAreaInsets();
  const [couponCode, setCouponCode] = useState("");
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();

  // Mock coupons data
  const coupons: Coupon[] = [
    {
      id: "coupon1",
      code: "WELCOME50",
      description: "50% off on your first order",
      discount: "Up to ₹100",
      isApplied: appliedCouponId === "coupon1",
    },
    {
      id: "coupon2",
      code: "SUMMER25",
      description: "25% off on all summer items",
      discount: "Up to ₹200",
      isApplied: appliedCouponId === "coupon2",
    },
    {
      id: "coupon3",
      code: "FREESHIP",
      description: "Free shipping on orders above ₹500",
      discount: "Free Delivery",
      isApplied: appliedCouponId === "coupon3",
    },
  ];

  const handleApplyCoupon = (couponId: string, code: string) => {
    applyCoupon.mutate(
      { couponCode: code },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Error applying coupon:", error);
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
      },
    });
  };

  const handleApplyCouponCode = () => {
    if (couponCode.trim()) {
      applyCoupon.mutate(
        { couponCode: couponCode.trim() },
        {
          onSuccess: () => {
            setCouponCode("");
            onClose();
          },
          onError: (error) => {
            console.error("Error applying coupon:", error);
          },
        }
      );
    }
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <View style={styles.couponItem}>
      <View style={styles.couponLeft}>
        <Typography style={styles.couponCode}>{item.code}</Typography>
        <Typography style={styles.couponDescription}>{item.description}</Typography>
        <Typography style={styles.couponDiscount}>{item.discount}</Typography>
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
                !couponCode.trim() && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyCouponCode}
              disabled={!couponCode.trim()}
            >
              <Typography
                style={[
                  styles.applyButtonText,
                  !couponCode.trim() && styles.applyButtonTextDisabled,
                ]}
              >
                APPLY
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Available Coupons */}
          <Typography style={styles.sectionTitle}>Available Coupons</Typography>
          <FlatList
            data={coupons}
            renderItem={renderCouponItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.couponsList}
            showsVerticalScrollIndicator={false}
          />
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
