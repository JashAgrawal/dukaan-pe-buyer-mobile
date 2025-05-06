import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { CartItem as CartItemType, CartCoupon } from "@/types/cart";
import { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";
import { useUpdateCartItem } from "@/lib/api/hooks/useCart";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ImageViewer from "@/components/ui/ImageViewer";
import { router } from "expo-router";

interface CartItemProps {
  item: CartItemType;
  onRemove?: (itemId: string) => void;
  coupon?: CartCoupon | null;
  offerDiscount?: number;
}

export default function CartItem({ item, onRemove, coupon, offerDiscount = 0 }: CartItemProps) {
  const updateCartItem = useUpdateCartItem();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  // Extract product data
  const product = typeof item.product === 'string'
    ? { _id: item.product, name: 'Product', mainImage: '', price: item.price, sellingPrice: item.price }
    : item.product as Product;

  // Calculate discount if available
  const originalPrice = product.price;
  const discountedPrice = product.sellingPrice || item.price;
  const hasDiscount = originalPrice > discountedPrice;

  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

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

  // Handle image press to open image viewer
  const handleImagePress = () => {
    setImageViewerVisible(true);
  };

  // Handle product press to navigate to product details
  const handleProductPress = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <View style={styles.container}>
      {/* Product image and details */}
      <View style={styles.productContainer}>
        {/* Product image - now clickable */}
        <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
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
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Typography style={styles.discountText}>{discountPercentage}%</Typography>
              <Typography style={[styles.discountText, { marginTop: -2, fontSize: 8 }]}>Off</Typography>
            </View>
          )}
        </TouchableOpacity>

        {/* Product details */}
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={handleProductPress} activeOpacity={0.7}>
            <Typography style={styles.name} numberOfLines={2}>
              {product.name}
            </Typography>
          </TouchableOpacity>

          {/* Variant and Size information */}
          {item.variant && (
            <Typography style={styles.variant}>
              Variant: {item.variant}
            </Typography>
          )}

          {item.size && (
            <Typography style={styles.size}>
              Size: {item.size}
            </Typography>
          )}

          {/* Price information */}
          <View style={styles.priceContainer}>
            <Typography style={styles.price}>₹{discountedPrice}</Typography>
            {hasDiscount && (
              <Typography style={styles.originalPrice}>
                ₹{originalPrice}
              </Typography>
            )}
          </View>

          {/* Coupon and offer discount information */}
          {coupon && (
            <View style={styles.discountInfoContainer}>
              <Ionicons name="pricetag-outline" size={12} color={COLORS.SUCCESS} />
              <Typography style={styles.discountInfo}>
                {coupon.type === 'percentage'
                  ? `${coupon.discountPercentage}% off with ${coupon.code}`
                  : `₹${coupon.discountAmt} off with ${coupon.code}`}
              </Typography>
            </View>
          )}

          {offerDiscount > 0 && (
            <View style={styles.discountInfoContainer}>
              <Ionicons name="gift-outline" size={12} color={COLORS.SUCCESS} />
              <Typography style={styles.discountInfo}>
                ₹{offerDiscount} offer discount applied
              </Typography>
            </View>
          )}
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

      {/* Image Viewer Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <ImageViewer
          images={
            'allImages' in product && product.allImages && product.allImages.length > 0
              ? [product.mainImage, ...product.allImages]
              : [product.mainImage]
          }
          onClose={() => setImageViewerVisible(false)}
        />
      </Modal>
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
    marginBottom: SPACING.SM,
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
    justifyContent: "flex-start",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: COLORS.PRIMARY_DARK,
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
    marginBottom: 4,
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
  discountBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopRightRadius: BORDER_RADIUS.SM,
    borderBottomLeftRadius: BORDER_RADIUS.SM,
    alignItems: "center",
    justifyContent: "center",
  },
  discountText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: "600",
  },
  discountInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  discountInfo: {
    fontSize: 11,
    color: COLORS.SUCCESS,
    marginLeft: 4,
    fontWeight: "500",
  },
});
