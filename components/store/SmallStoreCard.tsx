import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// import useWishlistToggle from "@/hooks/useWishlistToggle";
import {
  useStoreWishlistStatus,
  useToggleStoreWishlist,
} from "@/lib/api/hooks/useWishlist";
import { useRouter } from "expo-router";
import { getStoreDistanceAndTime } from "@/lib/helpers";

interface SmallStoreCardProps {
  id: string;
  imageUrl: string;
  name: string;
  type: string;
  rating?: number;
  loyaltyBenefit?: string;
  distance?: string;
  deliveryTime?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  userCoordinates?: [number, number]; // [longitude, latitude]
}

const SmallStoreCard: React.FC<SmallStoreCardProps> = ({
  id,
  imageUrl,
  name,
  type,
  rating,
  loyaltyBenefit,
  distance,
  deliveryTime,
  coordinates,
  userCoordinates,
}) => {
  const router = useRouter();
  const toggleMutation = useToggleStoreWishlist();
  const { data: isFavorite } = useStoreWishlistStatus(id);

  // Calculate distance and travel time if coordinates are provided
  let distanceText = distance;
  let travelTimeText = deliveryTime;

  if (coordinates && userCoordinates) {
    const { formattedDistance, formattedTravelTime } = getStoreDistanceAndTime(
      coordinates,
      userCoordinates,
      "driving"
    );
    distanceText = formattedDistance;
    if (!deliveryTime) {
      travelTimeText = formattedTravelTime;
    }
  }

  const handleToggleFavorite = () => {
    toggleMutation.mutate({
      storeId: id,
      isCurrentlyWishlisted: isFavorite || false,
    });
  };

  const handleCardPress = () => {
    // Navigate to the store detail page
    router.push({
      pathname: "/store/[id]",
      params: { id },
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      {/* Store Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Favorite Button */}
        {/* <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <View style={styles.favoriteButtonInner}>
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={18}
              color={isFavorite ? "#FF3B30" : "#FFFFFF"}
            />
          </View>
        </TouchableOpacity> */}

        {/* Loyalty Badge */}
        {loyaltyBenefit && (
          <View style={styles.loyaltyBadgeContainer}>
            <LinearGradient
              colors={["#8A3FFC", "#6F3BFA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loyaltyBadge}
            >
              <MaterialIcons name="bolt" size={12} color="white" />
              <Text style={styles.loyaltyText}>{loyaltyBenefit}</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Store Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRatingRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{rating}</Text>
              <MaterialIcons name="star" size={10} color="white" />
            </View>
          )}
        </View>

        <Text style={styles.type} numberOfLines={1}>
          {type}
        </Text>

        {/* Additional Info */}
        <View style={styles.additionalInfoContainer}>
          {distanceText && (
            <View style={styles.infoItem}>
              <MaterialIcons name="place" size={12} color="#666" />
              <Text style={styles.infoText}>{distanceText}</Text>
            </View>
          )}

          {travelTimeText && (
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={12} color="#666" />
              <Text style={styles.infoText}>{travelTimeText}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 140,
    marginBottom: 12,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  favoriteButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loyaltyBadgeContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  loyaltyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  loyaltyText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Jost-Medium",
    marginLeft: 2,
  },
  infoContainer: {
    padding: 10,
  },
  nameRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: "Jost-Bold",
    color: "#000",
    flex: 1,
    marginRight: 4,
  },
  ratingContainer: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  ratingText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Jost-Medium",
    marginRight: 2,
  },
  type: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 6,
  },
  additionalInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 10,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginLeft: 2,
  },
});

export default SmallStoreCard;
