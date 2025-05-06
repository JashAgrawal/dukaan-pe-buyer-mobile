import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { COLORS, SPACING } from "@/lib/constants/Styles";
import { Typography } from "@/components/ui/Typography";
import { useLocationStore } from "@/stores/locationStore";
import { useGetUserAddresses } from "@/lib/api/services/addressService";
import { Address } from "@/types/address";
import { DeliveryType, PaymentType } from "@/types/order";
import { useCreateOrder, useCreateRazorpayOrder, useVerifyPayment } from "@/lib/api/hooks/useOrder";
import { RazorpaySuccessResponse, RazorpayErrorResponse } from "@/lib/utils/razorpay";
import RazorpayCheckout from 'react-native-razorpay';
import { useAuthStore } from "@/stores/authStore";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import { useCartStore } from "@/stores/cartStore";

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
import DeliveryMethodSection, { DeliveryMethod } from "@/components/cart/DeliveryMethodSection";
import BillSummarySection from "@/components/cart/BillSummarySection";
import PaymentOptions from "@/components/cart/PaymentOptions";
import CustomerNotesSection from "@/components/cart/CustomerNotesSection";

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
  // Get params from URL (for retry payment)
  const { retryOrderId } = useLocalSearchParams<{ retryOrderId: string }>();

  // Get user data from auth store
  const { user } = useAuthStore();

  // Get location data from the location store
  const { selectedAddress, fullAddress, city, pincode } = useLocationStore();

  // Fetch user addresses
  const { data: userAddresses, isLoading: isLoadingAddresses } = useGetUserAddresses();

  // State for selected delivery address
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);

  // Get active store from store (used in useEffect for fetching cart)

  // Get cart data from Zustand store
  const {
    cart: cartData,
    summary: cartSummary,
    isLoading: isLoadingCart,
    error: cartError,
    removeCartItem
  } = useCartStore();

  // Order and payment mutations
  const createOrder = useCreateOrder();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyPayment();

  // State for loading indicators
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Set delivery address when data is available
  useEffect(() => {
    if (selectedAddress) {
      // If there's a selected address in the location store, use it
      setDeliveryAddress(selectedAddress);
    } else if (userAddresses && userAddresses.length > 0) {
      // Otherwise, try to find a default address or use the first one
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      setDeliveryAddress(defaultAddress || userAddresses[0]);
    }
  }, [selectedAddress, userAddresses]);

  // Fetch cart data when the cart page loads
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        console.log("Cart page - Fetching cart data on page load");
        const { activeStore } = useActiveStoreStore.getState();
        if (activeStore?._id) {
          console.log("Cart page - Fetching cart for store:", activeStore._id);
          await useCartStore.getState().fetchCart(activeStore._id);
        }
      } catch (error) {
        console.error("Cart page - Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, []);

  // Handle retry payment if retryOrderId is provided
  useEffect(() => {
    if (retryOrderId) {
      // Process payment for the existing order
      const handleRetry = async () => {
        try {
          await processRazorpayPayment(retryOrderId);
        } catch (error) {
          console.error("Error retrying payment:", error);
        }
      };

      handleRetry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryOrderId]);

  // State for UI interactions
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("self");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>("delivery");

  // Convert delivery method to API delivery type
  const deliveryType: DeliveryType = selectedDeliveryMethod === "delivery" ? "home_delivery" : "pickup";
  const isDelivery = selectedDeliveryMethod === "delivery";

  // State for modals
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [isGiftModalVisible, setIsGiftModalVisible] = useState(false);
  const [isTipModalVisible, setIsTipModalVisible] = useState(false);
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);

  // State for modal data
  const [tipAmount, setTipAmount] = useState(0);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Handle remove item from cart
  const handleRemoveItem = (productId: string) => {
    console.log("Cart page - removing item with product ID:", productId);
    removeCartItem({ itemId: productId });
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

  // Handle address press - navigate to address selection
  const handleAddressPress = () => {
    router.push("/address");
  };

  // Handle add more items press
  const handleAddMorePress = () => {
    router.back(); // Go back to store or product listing
  };

  // Handle manual refresh of cart data
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshCart = async () => {
    try {
      setIsRefreshing(true);
      console.log("Cart page - Manually refreshing cart");
      const { activeStore } = useActiveStoreStore.getState();
      if (activeStore?._id) {
        console.log("Cart page - Manually refreshing cart for store:", activeStore._id);
        await useCartStore.getState().fetchCart(activeStore._id);
      }
    } catch (error) {
      console.error("Cart page - Error refreshing cart:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // This function is used directly in the JSX

  // Process payment with Razorpay
  const processRazorpayPayment = async (orderId: string) => {
    try {
      setIsProcessingOrder(true);

      // Create Razorpay order
      const razorpayOrderResponse = await createRazorpayOrder.mutateAsync({ orderId });

      if (!razorpayOrderResponse.data) {
        throw new Error("Failed to create Razorpay order");
      }

      const { razorpayOrderId, amount, currency, keyId } = razorpayOrderResponse.data;

      // Configure Razorpay options
      const options = {
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || keyId,
        amount: amount.toString(),
        currency: currency,
        name: "Dukaan-Pe",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          email: user?.email || "",
          contact: user?.mobileNumber || "",
          name: user?.name || "",
        },
        theme: {
          color: "#FF3B7F",
        },
        notes: {
          orderId: orderId,
        },
      };

      // Open Razorpay checkout directly inside the component
      const paymentData = await new Promise<RazorpaySuccessResponse>((resolve, reject) => {
        RazorpayCheckout.open(options)
          .then((data: RazorpaySuccessResponse) => {
            // Handle success
            resolve(data);
          })
          .catch((error: RazorpayErrorResponse) => {
            // Handle failure
            reject(error);
          });
      });

      // Verify payment
      await verifyPayment.mutateAsync({
        orderId,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
      });

      // Navigate to success page
      router.replace(`/order/success?orderId=${orderId}&storeId=${cartData?.store._id}`);
    } catch (error: any) {
      console.error("Payment processing error:", error);

      // Navigate to failure page
      router.replace({
        pathname: "/order/failure",
        params: {
          orderId,
          errorMessage: error.description || error.message || "Payment failed",
          storeId: cartData?.store._id || "",
        }
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle payment options press
  const handlePayOnline = async () => {
    try {
      setIsProcessingOrder(true);

      // If we have a retry order ID, process payment directly
      if (retryOrderId) {
        await processRazorpayPayment(retryOrderId);
        return;
      }

      // Check if cart data is available
      if (!cartData) {
        throw new Error("Cart data is not available");
      }

      // Create order first
      const orderData = {
        cartId: cartData._id,
        paymentType: 'card' as PaymentType,
        deliveryAddressId: isDelivery ? deliveryAddress?._id : undefined,
        isDelivery,
        deliveryType,
        specialNoteBuyer: customerNotes || undefined,
        specialNoteSeller: deliveryInstructions || undefined,
      };

      const orderResponse = await createOrder.mutateAsync(orderData);
      // Cast the response to any to access the nested order object
      const responseData = orderResponse.data as any;

      if (!responseData?.order?._id) {
        throw new Error("Failed to create order");
      }

      // Process payment with Razorpay
      await processRazorpayPayment(responseData.order._id);
    } catch (error: any) {
      console.error("Error in online payment flow:", error);
      Alert.alert(
        "Payment Error",
        error.message || "There was an error processing your payment. Please try again."
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePayCash = async () => {
    try {
      setIsProcessingOrder(true);

      // Check if cart data is available
      if (!cartData) {
        throw new Error("Cart data is not available");
      }

      // Create order with COD payment type
      const orderData = {
        cartId: cartData._id,
        paymentType: 'cod' as PaymentType,
        deliveryAddressId: isDelivery ? deliveryAddress?._id : undefined,
        isDelivery,
        deliveryType,
        specialNoteBuyer: customerNotes || undefined,
        specialNoteSeller: deliveryInstructions || undefined,
      };

      const orderResponse = await createOrder.mutateAsync(orderData);
      // Cast the response to any to access the nested order object
      const responseData = orderResponse.data as any;

      if (!responseData?.order?._id) {
        throw new Error("Failed to create order");
      }

      // Navigate to success page
      router.replace(`/order/success?orderId=${responseData.order._id}&storeId=${cartData?.store._id}`);
    } catch (error: any) {
      console.error("Error in COD payment flow:", error);
      Alert.alert(
        "Order Error",
        error.message || "There was an error placing your order. Please try again."
      );
    } finally {
      setIsProcessingOrder(false);
    }
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
    if (!cartSummary) return 0;

    return cartSummary.productDiscount + cartSummary.couponDiscount + cartSummary.offerDiscount;
  };

  // Prepare bill items
  const getBillItems = () => {
    if (!cartData || !cartSummary) return [];

    const items: BillItemType[] = [
      { label: "Item Total", value: cartSummary.subtotal },
    ];

    // Add product discount if any
    if (cartSummary.productDiscount > 0) {
      items.push({ label: "Product Discount", value: cartSummary.productDiscount, isDiscount: true });
    }

    // Add coupon discount if any
    if (cartSummary.couponDiscount > 0) {
      items.push({ label: "Coupon Discount", value: cartSummary.couponDiscount, isDiscount: true });
    }

    // Add offer discount if any
    if (cartSummary.offerDiscount > 0) {
      items.push({ label: "Offer Discount", value: cartSummary.offerDiscount, isDiscount: true });
    }

    // Add GST (calculated as 5% of the total)
    const gstAmount = Math.round(cartSummary.subtotal * 0.05 * 100) / 100;
    items.push({ label: "GST (5%)", value: gstAmount });

    // Add delivery fee (free for now)
    items.push({ label: "Delivery Fee", value: 0, isStrikethrough: true });

    return items;
  };

  // Render loading state
  if (isLoadingCart || isLoadingAddresses) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={COLORS.PRIMARY_DARK} />
      </View>
    );
  }

  // Render error state
  if (cartError) {
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
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <CartHeader
          onBackPress={handleBackPress}
          onRefresh={handleRefreshCart}
          isRefreshing={isRefreshing}
        />

        <View style={styles.centerContainer}>
          <Typography style={styles.emptyCartText}>
            Your cart is empty
          </Typography>
        </View>
      </View>
    );
  }

  // We have a valid cart at this point
  const cart = cartData;
  console.log(cart);

  // Make sure we have a summary
  if (!cartSummary) {
    console.log("Cart page - No cart summary available");

    // State for refresh button loading
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Try to fetch the cart again
    useEffect(() => {
      const fetchCartData = async () => {
        try {
          const { activeStore } = useActiveStoreStore.getState();
          if (activeStore?._id) {
            console.log("Cart page - Attempting to fetch cart for store:", activeStore._id);
            await useCartStore.getState().fetchCart(activeStore._id);
          }
        } catch (error) {
          console.error("Cart page - Error fetching cart:", error);
        }
      };

      fetchCartData();
    }, []);

    // Handle refresh button press
    const handleRefresh = async () => {
      try {
        setIsRefreshing(true);
        const { activeStore } = useActiveStoreStore.getState();
        if (activeStore?._id) {
          console.log("Cart page - Manually refreshing cart for store:", activeStore._id);
          await useCartStore.getState().fetchCart(activeStore._id);
        }
      } catch (error) {
        console.error("Cart page - Error refreshing cart:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    return (
      <View style={[styles.container, styles.centerContainer]}>
        <StatusBar style="dark" />
        <CartHeader
          onBackPress={handleBackPress}
          onRefresh={handleRefreshCart}
          isRefreshing={isRefreshing}
        />
        <Typography style={styles.errorText}>
          Error loading cart summary.
        </Typography>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Typography style={styles.refreshButtonText}>
              Refresh Cart
            </Typography>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const summary = cartSummary;
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
        onRefresh={handleRefreshCart}
        isRefreshing={isRefreshing}
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
        <CouponSection
          onPress={handleCouponPress}
          appliedCouponId={cart.coupon}
        />

        {/* Delivery Info Section */}
        {/* <DeliveryInfoSection estimatedTime="24 mins" /> */}

        {/* Cart Items */}
        {cart.items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onRemove={handleRemoveItem}
            coupon={cart.coupon}
            offerDiscount={summary.offerDiscount > 0 ? summary.offerDiscount : 0}
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

        {/* Delivery Method Section */}
        <DeliveryMethodSection
          selectedMethod={selectedDeliveryMethod}
          onSelectMethod={setSelectedDeliveryMethod}
        />

        {/* Delivery Options Section - Only showing "Ordering for myself" */}
        <DeliveryOptionsSection
          options={[deliveryOptions[0]]} // Only include the "self" option
          selectedOptionId={selectedDeliveryOption}
          onSelectOption={setSelectedDeliveryOption}
          onAddDetailsPress={() => setIsGiftModalVisible(true)}
        />

        {/* Customer Notes Section */}
        <CustomerNotesSection
          notes={customerNotes}
          onNotesChange={setCustomerNotes}
          placeholder="Add any special instructions or notes for your order..."
          maxLength={200}
        />

        {/* Bill Summary Section */}
        <BillSummarySection
          items={billItems}
          total={summary.total}
          originalTotal={summary.subtotal}
          savings={savings}
          onPress={() => setIsBillModalVisible(true)}
        />

        {/* Delivery Address Section - Only show if delivery method is selected */}
        {selectedDeliveryMethod === "delivery" && (
          <DeliveryAddressSection
            address={deliveryAddress || undefined}
            fullAddress={fullAddress || `${city || ""} ${pincode ? `, ${pincode}` : ""}`}
            addressType={deliveryAddress?.type || "Home"}
            distance={deliveryAddress ? "12.7 Kms" : undefined}
            onPress={handleAddressPress}
          />
        )}


      </ScrollView>

      {/* Payment Options */}
      <PaymentOptions
        totalAmount={summary.total}
        originalAmount={summary.subtotal}
        savings={savings}
        onPayOnline={handlePayOnline}
        onPayCash={handlePayCash}
        isAddressSelected={
          selectedDeliveryMethod === "pickup" ||
          (!!deliveryAddress && !!deliveryAddress.houseDetails && !!deliveryAddress.streetAddress)
        }
        onAddressPress={handleAddressPress}
        isPickup={selectedDeliveryMethod === "pickup"}
        isLoading={isProcessingOrder}
      />

      {/* Modals */}
      <CouponModal
        visible={isCouponModalVisible}
        onClose={() => setIsCouponModalVisible(false)}
        appliedCouponId={cart.coupon}
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
    marginBottom: SPACING.MD,
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
  refreshButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 8,
    marginTop: SPACING.MD,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
