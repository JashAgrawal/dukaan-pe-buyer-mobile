import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { SearchItem } from "@/stores/useSearchStore";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "@/lib/helpers";

interface SearchResultItemProps {
  item: SearchItem;
  onPress: (item: SearchItem) => void;
  onRemove?: (id: string) => void;
  isPastSearch?: boolean;
}

export default function SearchResultItem({
  item,
  onPress,
  onRemove,
  isPastSearch = false,
}: SearchResultItemProps) {
  // Handle remove button press
  const handleRemove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: getImageUrl(item.imageUrl) }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Typography style={styles.name}>{item.name}</Typography>
          <View style={styles.rightContent}>
            {/* Remove button for past searches */}
            {isPastSearch && onRemove && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={(e: any) => handleRemove(e)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            )}

            {/* Badge to indicate if it's a product or store */}
            {item.price ? (
              <View style={[styles.badge, styles.productBadge]}>
                <Typography style={styles.badgeText}>Product</Typography>
              </View>
            ) : (
              <View style={[styles.badge, styles.storeBadge]}>
                <Typography style={styles.badgeText}>Store</Typography>
              </View>
            )}
          </View>
        </View>
        {item.tagline ? (
          <Typography style={styles.tagline}>{item.tagline}</Typography>
        ) : (
          <Typography style={styles.category}>{item.category}</Typography>
        )}

        {/* Show rating if available */}
        {item.rating ? (
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
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
        {/* {item.price ? (
          <Typography style={styles.price}>
            ₹{item.price.toLocaleString()}
          </Typography>
        ) : null} */}

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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  name: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    marginRight: 8,
    padding: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productBadge: {
    backgroundColor: "#E6D8FF",
  },
  storeBadge: {
    backgroundColor: "#D8F2FF",
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Jost-Medium",
    color: "#333",
  },
  category: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 0,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 0,
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
  storeName: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 0,
  },
});
