import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StoreCardData } from "../../types/storeCard";

interface StoreCardProps {
  imageUrl: string;
  name: string;
  type: string;
  location: string;
  distance: string;
  rating?: number;
  loyaltyBenefit?: string;
  rewardText?: string;
  onPress?: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
  imageUrl,
  name,
  type,
  location,
  distance,
  rating,
  loyaltyBenefit,
  rewardText,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Store Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Loyalty Badge */}
        {loyaltyBenefit && (
          <View style={styles.loyaltyBadgeContainer}>
            <LinearGradient
              colors={["#8A3FFC", "#6F3BFA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loyaltyBadge}
            >
              <Text style={styles.loyaltyText}>🎁 Loyalty Benefits</Text>
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
              <MaterialIcons name="star" size={12} color="white" />
            </View>
          )}
        </View>

        <Text style={styles.type}>{type}</Text>

        <View style={styles.locationRow}>
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.distance}>{distance}</Text>
        </View>

        {/* Reward Text */}
        {rewardText && (
          <View style={styles.rewardContainer}>
            <View style={styles.rewardIconContainer}>
              <Text style={{ color: "white", fontSize: 10 }}>💰</Text>
            </View>
            <Text style={styles.rewardText}>{rewardText}</Text>
          </View>
        )}
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
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loyaltyBadgeContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  loyaltyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  loyaltyText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Jost-Medium",
  },
  infoContainer: {
    padding: 12,
  },
  nameRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: "Jost-Bold",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Jost-Medium",
    marginRight: 2,
  },
  type: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
  },
  dot: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 4,
  },
  distance: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rewardIconContainer: {
    backgroundColor: "#8A3FFC",
    borderRadius: 50,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
});

export default StoreCard;
