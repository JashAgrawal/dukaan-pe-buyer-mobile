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

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  storeId?: string;
  storeName?: string;
  unit?: string;
  deliveryTime?: string;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards per row with 16px padding

export default function ProductCard({
  id,
  imageUrl,
  onPress,
  // The following props are not used in this demo version
  // but kept for compatibility with the component interface
  name: _name,
  price: _price,
  originalPrice: _originalPrice,
  rating: _rating,
  reviewCount: _reviewCount,
  storeId: _storeId,
  storeName: _storeName,
  unit: _unit = "1 pc",
  deliveryTime = "7 Mins",
}: ProductCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // @ts-ignore - router.push type issue
      router.push(`/product/${id}`);
    }
  };

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
        {/* Always show discount badge for demo purposes */}
        <View style={styles.discountBadge}>
          <Typography style={styles.discountText}>
            63% Off
          </Typography>
        </View>
      </View>

      {/* Delivery time */}
      <View style={styles.deliveryTimeContainer}>
        <Ionicons name="time-outline" size={14} color="#666" />
        <Typography style={styles.deliveryTimeText}>{deliveryTime}</Typography>
      </View>

      {/* Product details */}
      <View style={styles.contentContainer}>
        {/* Product name - hardcoded for demo purposes */}
        <Typography style={styles.name} numberOfLines={2}>
          Bottle Gourd
        </Typography>

        {/* Unit */}
        <Typography style={styles.unit}>1 pc</Typography>

        {/* Rating - always show for demo purposes */}
        <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>
            <Ionicons name="star" size={14} color="#FFFFFF" />
          </View>
          <Typography style={styles.rating}>4.5</Typography>
          <Typography style={styles.reviewCount}>
            (5.8k)
          </Typography>
        </View>

        {/* Price - hardcoded for demo purposes */}
        <View style={styles.priceContainer}>
          <Typography style={styles.originalPrice}>
            ₹60
          </Typography>
          <Typography style={styles.price}>₹22</Typography>
        </View>
      </View>

      {/* Add to Cart button */}
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Typography style={styles.addButtonText}>Add to Cart</Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: cardWidth,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    width: 80,
    height: 60,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
  },
  deliveryTimeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starContainer: {
    backgroundColor: "#008000", // Green color for star background
    borderRadius: 4,
    padding: 2,
    marginRight: 4,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    // fontWeight: "bold",
    // fontFamily: "Jost-Regular",
    color: "#000000",
  },
  originalPrice: {
    fontSize: 18,
    color: "#8E8E93",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#E91E63", // Pink color for add button
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    margin: 12,
    marginTop: 0,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  storeName: {
    fontSize: 12,
    color: "#8E8E93",
    flex: 1,
    textAlign: "right",
  },
});
