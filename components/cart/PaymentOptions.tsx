import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface PaymentOptionsProps {
  totalAmount: number;
  originalAmount?: number;
  savings?: number;
  onPayOnline: () => void;
  onPayCash: () => void;
  isAddressSelected?: boolean;
  onAddressPress?: () => void;
  isPickup?: boolean;
  isLoading?: boolean;
}

export default function PaymentOptions({
  totalAmount,
  originalAmount,
  savings,
  onPayOnline,
  onPayCash,
  isAddressSelected = false,
  onAddressPress,
  isPickup = false,
  isLoading = false,
}: PaymentOptionsProps) {
  const insets = useSafeAreaInsets();

  // Handle payment with address validation
  const handlePayment = (paymentMethod: 'online' | 'cash') => {
    // Don't allow payment if already processing
    if (isLoading) {
      return;
    }

    if (!isAddressSelected) {
      Alert.alert(
        "Address Required",
        isPickup
          ? "Please select a delivery method before proceeding with payment."
          : "Please select a delivery address before proceeding with payment.",
        [
          {
            text: isPickup ? "OK" : "Select Address",
            onPress: !isPickup ? onAddressPress : undefined,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return;
    }

    // If address is selected, proceed with payment
    if (paymentMethod === 'online') {
      onPayOnline();
    } else {
      onPayCash();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      {!isAddressSelected && (
        <View style={styles.addressWarning}>
          <MaterialIcons name="error-outline" size={16} color={COLORS.ERROR} />
          <Typography style={styles.addressWarningText}>
            {isPickup
              ? "Please select a delivery method to proceed"
              : "Please select a delivery address to proceed"
            }
          </Typography>
        </View>
      )}

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
        <TouchableOpacity
          style={[
            styles.onlineButton,
            (!isAddressSelected || isLoading) && styles.disabledButton
          ]}
          onPress={() => handlePayment('online')}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY_DARK} />
          ) : (
            <Typography style={[styles.onlineButtonText, !isAddressSelected && styles.disabledButtonText]}>
              Pay Online
            </Typography>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.cashButton,
            (!isAddressSelected || isLoading) && styles.disabledCashButton
          ]}
          onPress={() => handlePayment('cash')}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Typography style={styles.cashButtonText}>
              Pay Cash/UPI
              <Typography style={styles.cashSubtext}>
                {isPickup ? "(on pickup)" : "(on delivery)"}
              </Typography>
            </Typography>
          )}
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
  addressWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: SPACING.SM,
  },
  addressWarningText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginLeft: SPACING.XS,
    flex: 1,
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
  disabledButton: {
    borderColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  onlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
  },
  disabledButtonText: {
    color: COLORS.GRAY_MEDIUM,
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
  disabledCashButton: {
    backgroundColor: COLORS.GRAY_LIGHT,
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
