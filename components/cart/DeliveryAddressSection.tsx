import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Address } from "@/types/address";

interface DeliveryAddressSectionProps {
  address?: Address;
  fullAddress?: string;
  addressType?: string;
  distance?: string;
  onPress: () => void;
}

export default function DeliveryAddressSection({
  address,
  fullAddress,
  addressType = "Home",
  distance,
  onPress,
}: DeliveryAddressSectionProps) {
  // Check if address is complete (has house details and street address)
  const isAddressComplete = address && address.houseDetails && address.streetAddress;

  // Determine what to display based on available data
  const displayAddress = address ?
    `${address.houseDetails || ""}, ${address.streetAddress || ""}, ${address.city}, ${address.pincode}` :
    fullAddress || "No address selected";

  // Determine the icon based on address type
  const addressIcon =
    addressType?.toLowerCase() === "home" ? "home" :
    addressType?.toLowerCase() === "work" ? "work" :
    "place";

  return (
    <TouchableOpacity
      style={[styles.container, !isAddressComplete && styles.incompleteContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Typography style={styles.title}>Delivery Address</Typography>
        <MaterialIcons name="edit" size={18} color={COLORS.PRIMARY} />
      </View>

      <View style={styles.addressRow}>
        <View style={[styles.iconContainer, !isAddressComplete && styles.warningIconContainer]}>
          <MaterialIcons
            name={!isAddressComplete ? "error-outline" : addressIcon}
            size={20}
            color={!isAddressComplete ? COLORS.ERROR : "#8A3FFC"}
          />
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <Typography style={styles.deliveryLabel}>
              {address?.type ? address.type.charAt(0).toUpperCase() + address.type.slice(1) : addressType}
            </Typography>
            {address?.isDefault && (
              <View style={styles.defaultBadge}>
                <Typography style={styles.defaultText}>Default</Typography>
              </View>
            )}
          </View>

          <Typography
            style={[styles.addressText, !isAddressComplete && styles.incompleteAddressText]}
            numberOfLines={2}
          >
            {!address ? "No address selected" : displayAddress}
          </Typography>

          {!isAddressComplete && address && (
            <View style={styles.warningContainer}>
              <MaterialIcons name="info-outline" size={12} color={COLORS.ERROR} />
              <Typography style={styles.warningText}>
                Complete address details to proceed
              </Typography>
            </View>
          )}

          {distance && isAddressComplete && (
            <View style={styles.distanceContainer}>
              <MaterialIcons name="directions" size={12} color="#FF3B30" />
              <Typography style={styles.distanceText}>{distance} Away</Typography>
            </View>
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
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.MEDIUM,
  },
  incompleteContainer: {
    borderWidth: 1,
    borderColor: COLORS.ERROR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
    marginBottom: SPACING.SM,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SPACING.SM,
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
  warningIconContainer: {
    backgroundColor: "#FFEBEE",
  },
  addressContainer: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginRight: SPACING.SM,
  },
  defaultBadge: {
    backgroundColor: COLORS.SUCCESS_LIGHT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  defaultText: {
    fontSize: 10,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 6,
    lineHeight: 18,
  },
  incompleteAddressText: {
    color: COLORS.ERROR,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginLeft: 4,
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
