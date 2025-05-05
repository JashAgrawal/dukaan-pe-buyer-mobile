import React, { useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { COLORS, SPACING } from "@/lib/constants/Styles";
import { Typography } from "@/components/ui/Typography";
import { useCart, useRemoveCartItem } from "@/lib/api/hooks/useCart";

// Import cart components
import CartHeader from "@/components/cart/CartHeader";
import SavingsBadge from "@/components/cart/SavingsBadge";
import CartItem from "@/components/cart/CartItem";
import CouponSection from "@/components/cart/CouponSection";

import MissedItemsSection from "@/components/cart/MissedItemsSection";
import PriceDropAlert from "@/components/cart/PriceDropAlert";
import RecommendedProducts from "@/components/cart/RecommendedProducts";
import DeliveryAddressSection from "@/components/cart/DeliveryAddressSection";
import DeliveryOptionsSection from "@/components/cart/DeliveryOptionsSection";
import BillSummarySection from "@/components/cart/BillSummarySection";
import PaymentOptions from "@/components/cart/PaymentOptions";

// Import modal components
import CouponModal from "@/components/cart/modals/CouponModal";
import GiftModal from "@/components/cart/modals/GiftModal";
import TipModal from "@/components/cart/modals/TipModal";
import InstructionsModal from "@/components/cart/modals/InstructionsModal";
import BillModal from "@/components/cart/modals/BillModal";



// Mock data for delivery options
const deliveryOptions = [
  {
    id: "self",
    title: "Ordering for myself",
    subtitle: "Default option",
    icon: "person",
  },
  {
    id: "other",
    title: "Ordering for someone else",
    subtitle: "Add recipient details",
    icon: "people",
  },
];

// Define interfaces for our components
interface BillItemType {
  label: string;
  value: number;
  isDiscount?: boolean;
  isStrikethrough?: boolean;
}

export default function CartScreen() {
  // Use mock address data for now
  const address = "123 Main St";
  const city = "Mumbai";
  const pincode = "400001";

  const { data: cartData, isLoading, error } = useCart();
  const removeCartItem = useRemoveCartItem();

  // State for UI interactions
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("self");

  // State for modals
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [isGiftModalVisible, setIsGiftModalVisible] = useState(false);
  const [isTipModalVisible, setIsTipModalVisible] = useState(false);
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);

  // State for modal data
  const [tipAmount, setTipAmount] = useState(0);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Handle remove item from cart
  const handleRemoveItem = (itemId: string) => {
    removeCartItem.mutate({ itemId });
  };

  // Handle add product to cart
  const handleAddProduct = (productId: string) => {
    console.log("Adding product to cart:", productId);
    // In a real app, this would call the addToCart mutation
  };

  // Handle coupon press
  const handleCouponPress = () => {
    setIsCouponModalVisible(true);
  };

  // Handle address press
  const handleAddressPress = () => {
    // In a real app, this would navigate to the address selection screen
    console.log("Navigate to address selection");
  };

  // Handle add more items press
  const handleAddMorePress = () => {
    router.back(); // Go back to store or product listing
  };

  // This function is used directly in the JSX

  // Handle payment options press
  const handlePayOnline = () => {
    // In a real app, this would navigate to a payment gateway
    console.log("Pay online requested");
  };

  const handlePayCash = () => {
    // In a real app, this would set the payment method to cash
    console.log("Pay with cash requested");
  };

  // Handle save tip
  const handleSaveTip = (amount: number) => {
    setTipAmount(amount);
    console.log("Tip amount set to:", amount);
  };

  // Handle save instructions
  const handleSaveInstructions = (instructions: string) => {
    setDeliveryInstructions(instructions);
    console.log("Delivery instructions set to:", instructions);
  };

  // Handle save gift options
  const handleSaveGiftOptions = (items: string[], message: string) => {
    console.log("Gift items:", items, "Gift message:", message);
  };

  // Calculate savings
  const calculateSavings = () => {
    if (!cartData?.data?.summary) return 0;

    const summary = cartData.data.summary;
    return summary.productDiscount + summary.couponDiscount + summary.offerDiscount;
  };

  // Prepare bill items
  const getBillItems = () => {
    if (!cartData?.data?.cart || !cartData?.data?.summary) return [];

    const summary = cartData.data.summary;
    const items: BillItemType[] = [
      { label: "Item Total", value: summary.subtotal },
    ];

    // Add product discount if any
    if (summary.productDiscount > 0) {
      items.push({ label: "Product Discount", value: summary.productDiscount, isDiscount: true });
    }

    // Add coupon discount if any
    if (summary.couponDiscount > 0) {
      items.push({ label: "Coupon Discount", value: summary.couponDiscount, isDiscount: true });
    }

    // Add offer discount if any
    if (summary.offerDiscount > 0) {
      items.push({ label: "Offer Discount", value: summary.offerDiscount, isDiscount: true });
    }

    // Add GST (calculated as 5% of the total)
    const gstAmount = Math.round(summary.subtotal * 0.05 * 100) / 100;
    items.push({ label: "GST (5%)", value: gstAmount });

    // Add delivery fee (free for now)
    items.push({ label: "Delivery Fee", value: 0, isStrikethrough: true });

    return items;
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={COLORS.PRIMARY_DARK} />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <Typography style={styles.errorText}>
          Error loading cart. Please try again.
        </Typography>
      </View>
    );
  }

  // Render empty cart state
  if (!cartData?.data?.cart || cartData.data.cart.items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <CartHeader onBackPress={handleBackPress} />

        <View style={styles.centerContainer}>
          <Typography style={styles.emptyCartText}>
            Your cart is empty
          </Typography>
        </View>
      </View>
    );
  }

  const cart = cartData.data.cart;
  const summary = cartData.data.summary;
  const savings = calculateSavings();
  const freeDeliveryAmount = 25; // Mocked value
  const billItems = getBillItems();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Cart Header */}
      <CartHeader
        onBackPress={handleBackPress}
        savingsAmount={savings}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Savings Badge */}
        {savings > 0 && (
          <SavingsBadge
            amount={savings}
            includesFreeDelivery={true}
            freeDeliveryAmount={freeDeliveryAmount}
          />
        )}

        {/* Coupon Section */}
        <CouponSection onPress={handleCouponPress} />

        {/* Delivery Info Section */}
        {/* <DeliveryInfoSection estimatedTime="24 mins" /> */}

        {/* Cart Items */}
        {cart.items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onRemove={handleRemoveItem}
          />
        ))}

        {/* Missed Items Section */}
        <MissedItemsSection onAddMorePress={handleAddMorePress} />

        {/* Price Drop Alert */}
        <PriceDropAlert
          onProductPress={handleAddProduct}
        />

        {/* Recommended Products */}
        <RecommendedProducts
          title="Last-minute cravings?"
          subtitle="Add a quick bite before you order!"
          onAddPress={handleAddProduct}
          onSeeAllPress={handleAddMorePress}
        />

        {/* Delivery Options Section - Only showing "Ordering for myself" */}
        <DeliveryOptionsSection
          options={[deliveryOptions[0]]} // Only include the "self" option
          selectedOptionId={selectedDeliveryOption}
          onSelectOption={setSelectedDeliveryOption}
          onAddDetailsPress={() => setIsGiftModalVisible(true)}
        />

        {/* Bill Summary Section */}
        <BillSummarySection
          items={billItems}
          total={summary.total}
          originalTotal={summary.subtotal}
          savings={savings}
          onPress={() => setIsBillModalVisible(true)}
        />

        {/* Delivery Address Section */}
        <DeliveryAddressSection
          address={address || `${city || ""} ${pincode || ""}`}
          distance="12.7 Kms"
          onPress={handleAddressPress}
        />


      </ScrollView>

      {/* Payment Options */}
      <PaymentOptions
        totalAmount={summary.total}
        originalAmount={summary.subtotal}
        savings={savings}
        onPayOnline={handlePayOnline}
        onPayCash={handlePayCash}
      />

      {/* Modals */}
      <CouponModal
        visible={isCouponModalVisible}
        onClose={() => setIsCouponModalVisible(false)}
        appliedCouponId={cart.coupon as string || ""}
      />

      <GiftModal
        visible={isGiftModalVisible}
        onClose={() => setIsGiftModalVisible(false)}
        onSave={handleSaveGiftOptions}
        cartItems={cart.items.map(item => ({
          id: item._id,
          name: typeof item.product === 'string' ? 'Product' : item.product.name,
          imageUrl: typeof item.product === 'string' ? '' : item.product.mainImage || '',
          price: item.price,
          quantity: item.quantity,
          isGift: false
        }))}
      />

      <TipModal
        visible={isTipModalVisible}
        onClose={() => setIsTipModalVisible(false)}
        onSave={handleSaveTip}
        currentTip={tipAmount}
      />

      <InstructionsModal
        visible={isInstructionsModalVisible}
        onClose={() => setIsInstructionsModalVisible(false)}
        onSave={handleSaveInstructions}
        currentInstructions={deliveryInstructions}
      />

      <BillModal
        visible={isBillModalVisible}
        onClose={() => setIsBillModalVisible(false)}
        items={billItems}
        total={summary.total}
        originalTotal={summary.subtotal}
        savings={savings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.LG,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: "center",
  },
  emptyCartText: {
    fontSize: 18,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.MD,
    paddingBottom: 100, // Extra padding at bottom for payment options
  },
});
