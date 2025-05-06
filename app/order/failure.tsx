import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function OrderFailureScreen() {
  const { orderId, errorMessage } = useLocalSearchParams<{ 
    orderId: string;
    errorMessage: string;
  }>();

  const handleRetryPayment = () => {
    if (orderId) {
      // Navigate back to cart with the order ID to retry payment
      router.push({
        pathname: "/cart",
        params: { retryOrderId: orderId }
      });
    } else {
      // If no order ID, just go back to cart
      router.push("/cart");
    }
  };

  const handleContinueShopping = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.errorIconContainer}>
          <MaterialIcons name="error" size={80} color={COLORS.ERROR} />
        </View>
        
        <Typography style={styles.errorTitle}>Payment Failed</Typography>
        
        {orderId && (
          <Typography style={styles.orderNumber}>
            Order #{orderId}
          </Typography>
        )}
        
        <View style={styles.infoCard}>
          <Typography style={styles.infoTitle}>
            We couldn't process your payment
          </Typography>
          
          <Typography style={styles.infoDescription}>
            {errorMessage || "There was an issue processing your payment. Please try again or choose a different payment method."}
          </Typography>
          
          <View style={styles.errorDetailsContainer}>
            <MaterialIcons name="info-outline" size={16} color={COLORS.ERROR} />
            <Typography style={styles.errorDetailsText}>
              No amount has been charged from your account for this transaction.
            </Typography>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleRetryPayment}
        >
          <Typography style={styles.buttonText}>Retry Payment</Typography>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={handleContinueShopping}
        >
          <Typography style={styles.outlineButtonText}>Continue Shopping</Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.LG,
    alignItems: "center",
  },
  errorIconContainer: {
    marginTop: SPACING.XL * 2,
    marginBottom: SPACING.LG,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  orderNumber: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SPACING.XL,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    width: "100%",
    marginBottom: SPACING.XL,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.MD,
  },
  errorDetailsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
  },
  errorDetailsText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginLeft: SPACING.XS,
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.WHITE,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
  },
});
