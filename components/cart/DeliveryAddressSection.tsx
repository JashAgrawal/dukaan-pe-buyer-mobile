import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface DeliveryAddressSectionProps {
  address: string;
  distance?: string;
  onPress: () => void;
}

export default function DeliveryAddressSection({
  address,
  distance,
  onPress,
}: DeliveryAddressSectionProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="home" size={20} color="#8A3FFC" />
      </View>
      
      <View style={styles.addressContainer}>
        <View style={styles.addressHeader}>
          <Typography style={styles.deliveryLabel}>Delivering to Home</Typography>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.TEXT_DARK} />
        </View>
        
        <Typography style={styles.addressText} numberOfLines={1}>
          {address}
        </Typography>
        
        {distance && (
          <View style={styles.distanceContainer}>
            <MaterialIcons name="place" size={12} color="#FF3B30" />
            <Typography style={styles.distanceText}>{distance} Away</Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  addressContainer: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginRight: 4,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 12,
    color: "#FF3B30",
    marginLeft: 4,
  },
});
