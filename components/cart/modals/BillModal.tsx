import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BillItem {
  label: string;
  value: number;
  isDiscount?: boolean;
  isStrikethrough?: boolean;
}

interface BillModalProps {
  visible: boolean;
  onClose: () => void;
  items: BillItem[];
  total: number;
  originalTotal?: number;
  savings?: number;
}

export default function BillModal({
  visible,
  onClose,
  items,
  total,
  originalTotal,
  savings,
}: BillModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
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
            <Typography style={styles.title}>Bill Details</Typography>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Bill Items */}
            <View style={styles.billItemsContainer}>
              {items.map((item, index) => (
                <View key={index} style={styles.billItem}>
                  <Typography
                    style={[
                      styles.itemLabel,
                      item.isDiscount && styles.discountLabel,
                      item.isStrikethrough && styles.strikethrough,
                    ]}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    style={[
                      styles.itemValue,
                      item.isDiscount && styles.discountValue,
                      item.isStrikethrough && styles.strikethrough,
                    ]}
                  >
                    {item.isDiscount ? "-" : ""}₹{item.value ? item.value.toFixed(2) : "0.00"}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.totalContainer}>
              <View>
                <Typography style={styles.totalLabel}>To Pay</Typography>
                <Typography style={styles.totalSubtext}>
                  Incl. all taxes and charges
                </Typography>
              </View>

              <View style={styles.totalAmountContainer}>
                {originalTotal && originalTotal > total && (
                  <Typography style={styles.originalTotal}>
                    ₹{originalTotal ? originalTotal.toFixed(2) : "0.00"}
                  </Typography>
                )}
                <Typography style={styles.totalAmount}>
                  ₹{total ? total.toFixed(2) : "0.00"}
                </Typography>
                {savings && savings > 0 && (
                  <Typography style={styles.savingsAmount}>
                    SAVING ₹{savings ? savings.toFixed(2) : "0.00"}
                  </Typography>
                )}
              </View>
            </View>

            {/* Payment Policy */}
            <View style={styles.policyContainer}>
              <Typography style={styles.policyTitle}>Payment Policy</Typography>
              <Typography style={styles.policyText}>
                • All prices are inclusive of GST
              </Typography>
              <Typography style={styles.policyText}>
                • Delivery charges may vary based on your location and order value
              </Typography>
              <Typography style={styles.policyText}>
                • Discounts are applied based on the eligible items in your cart
              </Typography>
              <Typography style={styles.policyText}>
                • Promo codes cannot be combined with other offers
              </Typography>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeFullButton} onPress={onClose}>
            <Typography style={styles.closeFullButtonText}>Close</Typography>
          </TouchableOpacity>
        </View>
      </View>
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
  scrollView: {
    maxHeight: "70%",
  },
  scrollContent: {
    padding: 16,
  },
  billItemsContainer: {
    marginBottom: 16,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  discountLabel: {
    color: COLORS.SUCCESS,
  },
  discountValue: {
    color: COLORS.SUCCESS,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLORS.TEXT_LIGHT,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY_LIGHTER,
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  totalAmountContainer: {
    alignItems: "flex-end",
  },
  originalTotal: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  savingsAmount: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.SUCCESS,
  },
  policyContainer: {
    backgroundColor: COLORS.GRAY_LIGHTEST,
    padding: 16,
    borderRadius: BORDER_RADIUS.MD,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  policyText: {
    fontSize: 12,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: 4,
    lineHeight: 18,
  },
  closeFullButton: {
    margin: 16,
    height: 48,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    justifyContent: "center",
    alignItems: "center",
  },
  closeFullButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
});
