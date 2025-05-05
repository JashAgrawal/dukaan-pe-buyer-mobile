import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PaymentOptionsProps {
  totalAmount: number;
  originalAmount?: number;
  savings?: number;
  onPayOnline: () => void;
  onPayCash: () => void;
}

export default function PaymentOptions({
  totalAmount,
  originalAmount,
  savings,
  onPayOnline,
  onPayCash,
}: PaymentOptionsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      <View style={styles.amountContainer}>
        <Typography style={styles.toPayLabel}>To Pay</Typography>
        <View style={styles.amountRow}>
          <Typography style={styles.totalAmount}>₹{totalAmount ? totalAmount.toFixed(2) : "0.00"}</Typography>
          {originalAmount && savings && (
            <View style={styles.savingsContainer}>
              <Typography style={styles.originalAmount}>₹{originalAmount ? originalAmount.toFixed(2) : "0.00"}</Typography>
              <Typography style={styles.savingsAmount}>SAVING ₹{savings ? savings.toFixed(2) : "0.00"}</Typography>
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.onlineButton} onPress={onPayOnline} activeOpacity={0.8}>
          <Typography style={styles.onlineButtonText}>Pay Online</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cashButton} onPress={onPayCash} activeOpacity={0.8}>
          <Typography style={styles.cashButtonText}>
            Pay Cash/UPI
            <Typography style={styles.cashSubtext}> (on delivery)</Typography>
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
    paddingTop: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  amountContainer: {
    marginBottom: SPACING.MD,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toPayLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginRight: SPACING.MD,
  },
  savingsContainer: {
    flex: 1,
  },
  originalAmount: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textDecorationLine: "line-through",
  },
  savingsAmount: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 50,
  },
  onlineButton: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.SM,
  },
  onlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
  },
  cashButton: {
    flex: 1,
    backgroundColor: "#FF3B7F",
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.SM,
  },
  cashButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.WHITE,
  },
  cashSubtext: {
    fontSize: 10,
    fontWeight: "normal",
    color: COLORS.WHITE,
  },
});
