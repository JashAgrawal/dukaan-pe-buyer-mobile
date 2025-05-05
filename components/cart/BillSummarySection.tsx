import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface BillItem {
  label: string;
  value: number;
  isDiscount?: boolean;
  isStrikethrough?: boolean;
}

interface BillSummaryProps {
  items: BillItem[];
  total: number;
  originalTotal?: number;
  savings?: number;
  onPress?: () => void;
}

export default function BillSummarySection({
  items,
  total,
  originalTotal,
  savings,
  onPress,
}: BillSummaryProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="receipt" size={20} color={COLORS.TEXT_DARK} />
        </View>
        <Typography style={styles.title}>Bill Summary</Typography>
        {onPress && <MaterialIcons name="chevron-right" size={20} color={COLORS.TEXT_LIGHT} />}
      </View>

      <View style={styles.itemsContainer}>
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
              {item.isDiscount ? "-" : ""}{"\u20B9"}{item.value ? item.value.toFixed(2) : "0.00"}
            </Typography>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.totalContainer}>
        <View>
          <Typography style={styles.totalLabel}>To Pay</Typography>
          <Typography style={styles.totalSubtext}>Incl. all taxes and charges</Typography>
        </View>

        <View style={styles.totalAmountContainer}>
          {originalTotal && originalTotal > total && (
            <Typography style={styles.originalTotal}>{"\u20B9"}{originalTotal ? originalTotal.toFixed(2) : "0.00"}</Typography>
          )}
          <Typography style={styles.totalAmount}>{"\u20B9"}{total ? total.toFixed(2) : "0.00"}</Typography>
          {savings && savings > 0 && (
            <Typography style={styles.savingsAmount}>SAVING {"\u20B9"}{savings ? savings.toFixed(2) : "0.00"}</Typography>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.LG,
  },
  iconContainer: {
    marginRight: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    flex: 1,
  },
  itemsContainer: {
    marginBottom: SPACING.LG,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.MD,
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
    textAlign: "right",
  },
  discountLabel: {
    color: COLORS.SUCCESS,
  },
  discountValue: {
    color: COLORS.SUCCESS,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLORS.TEXT_LIGHTER,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY_LIGHTER,
    marginBottom: SPACING.LG,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  savingsAmount: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
});
