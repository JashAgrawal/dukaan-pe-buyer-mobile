import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { SearchItem } from "@/stores/useSearchStore";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface SearchResultItemProps {
  item: SearchItem;
  onPress: (item: SearchItem) => void;
}

export default function SearchResultItem({
  item,
  onPress,
}: SearchResultItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.content}>
        <Typography style={styles.name}>{item.name}</Typography>
        {item.tagline ? (
          <Typography style={styles.tagline}>{item.tagline}</Typography>
        ) : (
          <Typography style={styles.category}>{item.category}</Typography>
        )}

        {/* Show rating if available */}
        {item.rating ? (
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <Typography style={styles.rating}>
              {item.rating.toFixed(1)}
            </Typography>
            {item.reviewCount ? (
              <Typography style={styles.reviewCount}>
                ({item.reviewCount})
              </Typography>
            ) : null}
          </View>
        ) : null}

        {/* Show price if it's a product */}
        {item.price ? (
          <Typography style={styles.price}>
            ₹{item.price.toLocaleString()}
          </Typography>
        ) : null}

        {/* Show store name if it's a product from a store */}
        {item.storeName ? (
          <Typography style={styles.storeName}>
            from {item.storeName}
          </Typography>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#000",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
    marginTop: 2,
  },
  storeName: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
});
