import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartHeaderProps {
  onBackPress: () => void;
  savingsAmount?: number;
}

export default function CartHeader({ onBackPress, savingsAmount }: CartHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <MaterialIcons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <Typography style={styles.title}>Your Cart</Typography>

        <View style={styles.placeholder} />
      </View>

      {savingsAmount !== undefined && savingsAmount > 0 && (
        <View style={styles.savingsBadge}>
          <Typography style={styles.savingsText}>SAVED ₹{savingsAmount ? savingsAmount.toFixed(2) : "0.00"}</Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  placeholder: {
    width: 24,
  },
  savingsBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: SPACING.MD,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.SUCCESS,
  },
});
