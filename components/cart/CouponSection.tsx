import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface CouponSectionProps {
  onPress: () => void;
}

export default function CouponSection({ onPress }: CouponSectionProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="local-offer" size={24} color="#00C853" />
      </View>
      <View style={styles.textContainer}>
        <Typography style={styles.title}>View Coupons & Offers</Typography>
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
});
