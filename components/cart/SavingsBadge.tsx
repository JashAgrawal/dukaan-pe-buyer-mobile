import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface SavingsBadgeProps {
  amount: number;
  includesFreeDelivery?: boolean;
  freeDeliveryAmount?: number;
}

export default function SavingsBadge({
  amount,
  includesFreeDelivery = false,
  freeDeliveryAmount = 0,
}: SavingsBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="check-circle" size={20} color={COLORS.SUCCESS} />
      </View>
      <View style={styles.textContainer}>
        <Typography style={styles.savingsText}>
          Saved ₹{amount ? amount.toFixed(2) : "0.00"}{" "}
          {includesFreeDelivery && freeDeliveryAmount > 0
            ? `including ₹${freeDeliveryAmount ? freeDeliveryAmount.toFixed(2) : "0.00"} through free delivery!`
            : ""}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
  },
  iconContainer: {
    marginRight: SPACING.SM,
  },
  textContainer: {
    flex: 1,
  },
  savingsText: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
});
