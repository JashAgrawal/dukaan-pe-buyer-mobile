import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { CartItem as CartItemType } from "@/types/cart";
import { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";
import { useUpdateCartItem } from "@/lib/api/hooks/useCart";
import { MaterialIcons } from "@expo/vector-icons";

interface CartItemProps {
  item: CartItemType;
  onRemove?: (itemId: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  const updateCartItem = useUpdateCartItem();

  // Extract product data
  const product = typeof item.product === 'string'
    ? { _id: item.product, name: 'Product', mainImage: '', price: item.price, sellingPrice: item.price }
    : item.product as Product;

  // Calculate discount if available
  const originalPrice = product.price;
  const discountedPrice = product.sellingPrice || item.price;
  const hasDiscount = originalPrice > discountedPrice;

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0 && onRemove) {
      console.log('Removing item from cart:', item._id);
      onRemove(typeof product === 'string' ? product : product._id);
      return;
    }

    updateCartItem.mutate({
      itemId: typeof product === 'string' ? product : product._id ,
      quantity: newQuantity
    });
  };

  return (
    <View style={styles.container}>
      {/* Product image and details */}
      <View style={styles.productContainer}>
        {/* Product image */}
        <Image
          source={{
            uri: product.mainImage
              ? product.mainImage.startsWith("http")
                ? product.mainImage
                : getImageUrl(product.mainImage)
              : "https://via.placeholder.com/100",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Product details */}
        <View style={styles.detailsContainer}>
          <Typography style={styles.name} numberOfLines={2}>
            {product.name}
          </Typography>

          {item.variant && (
            <Typography style={styles.variant}>
              {item.variant}
            </Typography>
          )}

          {item.size && (
            <Typography style={styles.size}>
              {item.size}
            </Typography>
          )}

          <View style={styles.priceContainer}>
            <Typography style={styles.price}>₹{discountedPrice}</Typography>
            {hasDiscount && (
              <Typography style={styles.originalPrice}>
                ₹{originalPrice}
              </Typography>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {/* Remove button */}
        {onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(typeof product === 'string' ? product : product._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="delete-outline" size={20} color={COLORS.ERROR} />
          </TouchableOpacity>
        )}

        {/* Quantity selector */}
        <View style={styles.quantityContainer}>
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  productContainer: {
    flexDirection: "row",
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.SM,
  },
  detailsContainer: {
    marginLeft: SPACING.MD,
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  variant: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 2,
  },
  size: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: SPACING.SM,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHTER,
    textDecorationLine: "line-through",
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 70,
  },
  removeButton: {
    padding: 4,
    marginBottom: 4,
  },
  quantityContainer: {
    marginLeft: SPACING.MD,
  },
});
