import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";

interface SlimProductCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  unit?: string;
  deliveryTime?: string;
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
// Make card width such that 2.5 cards fit in a row
const cardWidth = (width - 40) / 3;
// Set image height proportional to width but slightly shorter
const imageHeight = cardWidth * 0.9;

export default function SlimProductCard({
  id,
  name,
  imageUrl,
  price,
  originalPrice,
  unit = "pc",
  deliveryTime = "7 Mins",
  rating,
  reviewCount,
  onPress,
}: SlimProductCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // @ts-ignore - router.push type issue
      router.push(`/product/${id}`);
    }
  };

  // Calculate discount percentage if originalPrice is provided
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Format review count for display (e.g., 5800 -> 5.8k)
  const formattedReviewCount = reviewCount
    ? reviewCount >= 1000
      ? `${(reviewCount / 1000).toFixed(1)}k`
      : reviewCount.toString()
    : "0";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Image with discount badge */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imageUrl
              ? imageUrl.startsWith("http")
                ? imageUrl
                : getImageUrl(imageUrl)
              : "https://via.placeholder.com/150",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Discount badge - only show if there's a discount */}
        {discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Typography style={styles.discountText}>{discountPercentage}%</Typography>
            <Typography style={[styles.discountText, { marginTop: -2, fontSize: 8 }]}>Off</Typography>
          </View>
        )}
      </View>

      {/* Delivery time */}
      <View style={styles.deliveryTimeContainer}>
        <Ionicons name="time-outline" size={12} color="#666" />
        <Typography style={styles.deliveryTimeText}>{deliveryTime}</Typography>
      </View>

      {/* Product details */}
      <View style={styles.detailsContainer}>
        {/* Product name */}
        <Typography style={styles.name} numberOfLines={2}>
          {name}
        </Typography>

        {/* Unit */}
        <Typography style={styles.unit}>1 {unit}</Typography>

        {/* Rating - only show if rating is provided */}
        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            <View style={styles.starContainer}>
              <Ionicons name="star" size={8} color="#FFFFFF" />
              <Typography style={styles.rating}>{rating.toFixed(1)}</Typography>
            </View>
            {reviewCount !== undefined && reviewCount > 0 && (
              <Typography style={styles.reviewCount}>
                ({formattedReviewCount})
              </Typography>
            )}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Typography style={styles.price}>₹{price}</Typography>
          {originalPrice && originalPrice > price && (
            <Typography style={styles.originalPrice}>
              ₹{originalPrice}
            </Typography>
          )}
        </View>
      </View>

      {/* Add to cart button */}
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Typography style={styles.addButtonText}>Add to Cart</Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 4,
    // marginRight: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: imageHeight,
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#8A2BE2", // Purple color for discount badge
    paddingHorizontal: 2,
    paddingVertical: 2,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    // Custom shape for ribbon effect
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 10,
    // Add a small triangle at the bottom to create ribbon effect
    transform: [{ translateX: -2 }],
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 14,
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 0,
    backgroundColor: "#F5F5F5",
  },
  deliveryTimeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingTop: 4,
  },
  name: {
    maxWidth: cardWidth,
    flex: 1,
    textOverflow: "ellipsis",
    lineHeight: 20,
    // borderWidth: 1,
    fontSize: 14,
    // fontWeight: "600",
    fontFamily: "Jost-Medium",
    // marginBottom: 2,
    color: "#222",
  },
  unit: {
    lineHeight:12,
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 6,
  },
  starContainer: {
    backgroundColor: "#008000", // Green color for star background
    borderRadius: 4,
    padding: 2,
    paddingHorizontal: 4,
    marginRight: 4,
    // width: 20,
    height: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rating: {
    lineHeight:8,
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: "Jost-Medium",
    marginLeft: 2,
    // fontWeight: "bold",
    // color: "#000",
    // marginRight: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000",
    // fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  addButton: {
    borderColor: "#E91E63", // Pink color for button border
    borderWidth: 1,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 8, // More rounded corners
    margin: 6,
    marginTop: 2,
    backgroundColor:"#E91E6310"
    // marginTop: 2,
  },
  addButtonText: {
    color: "#E91E63", // Pink color for text
    fontSize: 12,
    // fontWeight: "bold",
    fontFamily: "Jost-Medium",
  },
});
