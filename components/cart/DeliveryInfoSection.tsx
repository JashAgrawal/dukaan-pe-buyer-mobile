import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface DeliveryInfoSectionProps {
  estimatedTime: string;
}

export default function DeliveryInfoSection({ estimatedTime }: DeliveryInfoSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="access-time" size={24} color="#2196F3" />
      </View>
      <View style={styles.textContainer}>
        <Typography style={styles.title}>Delivery in {estimatedTime}</Typography>
      </View>
    </View>
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
    backgroundColor: "#E3F2FD",
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
