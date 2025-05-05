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
const cardWidth = (width - 40) / 2.5;
// Set image height proportional to width but slightly shorter
const imageHeight = cardWidth * 0.9;

export default function SlimProductCard({
  id,
  imageUrl,
  onPress,
  // The following props are not used in this demo version
  // but kept for compatibility with the component interface
  name: _name,
  price: _price,
  originalPrice: _originalPrice,
  unit: _unit = "pc",
  deliveryTime: _deliveryTime = "7 Mins",
  rating: _rating,
  reviewCount: _reviewCount,
}: SlimProductCardProps) {
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
        {/* Discount badge - always show for demo */}
        <View style={styles.discountBadge}>
          <Typography style={styles.discountText}>63%</Typography>
          <Typography style={[styles.discountText, { marginTop: -2,fontSize: 8 }]}>Off</Typography>
        </View>
      </View>

      {/* Delivery time */}
      <View style={styles.deliveryTimeContainer}>
        <Ionicons name="time-outline" size={12} color="#666" />
        <Typography style={styles.deliveryTimeText}>7 Mins</Typography>
      </View>

      {/* Product details */}
      <View style={styles.detailsContainer}>
        {/* Product name */}
        <Typography style={styles.name}>
          Bottle Gourd
        </Typography>

        {/* Unit */}
        <Typography style={styles.unit}>1 pc</Typography>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>
            <Ionicons name="star" size={8} color="#FFFFFF" />
            <Typography style={styles.rating}>4.5</Typography>
          </View>
          <Typography style={styles.reviewCount}>
            (5.8k)
          </Typography>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
        <Typography style={styles.price}>₹22</Typography>
          <Typography style={styles.originalPrice}>
            ₹60
          </Typography>
          
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
    // width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 0,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingTop: 4,
  },
  name: {
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
