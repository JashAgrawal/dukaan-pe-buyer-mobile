import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface FreeCashSectionProps {
  amount: number;
  isApplied: boolean;
  onToggle: () => void;
}

export default function FreeCashSection({
  amount,
  isApplied,
  onToggle,
}: FreeCashSectionProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {isApplied ? (
          <MaterialIcons name="check-box" size={24} color={COLORS.PRIMARY_DARK} />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color={COLORS.GRAY_MEDIUM} />
        )}
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Typography style={styles.title}>
          Apply ₹{amount} Free Cash
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    backgroundColor: "#F5F7FA",
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: SPACING.MD,
  },
  checkbox: {
    marginRight: SPACING.MD,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
});
