import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FONTS,
  COLORS,
  CARD_STYLES,
  TEXT_STYLES,
  SPACING,
  BORDER_RADIUS,
  BUTTON_STYLES,
  BADGE_STYLES,
} from "@/lib/constants/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getStoreDistanceAndTime } from "@/lib/helpers";

interface StoreCardProps {
  id: string;
  imageUrl: string;
  name: string;
  type: string;
  location: string;
  distance?: string;
  coordinates?: [number, number];
  userCoordinates?: [number, number];
  rating?: number;
  loyaltyBenefit?: string;
  rewardText?: string;
}

const StoreCard: React.FC<StoreCardProps> = ({
  id,
  imageUrl,
  name,
  type,
  location,
  distance,
  coordinates,
  userCoordinates,
  rating,
  loyaltyBenefit,
  rewardText,
}) => {
  const router = useRouter();

  let distanceText: string = distance ?? "";
  let travelTimeText = "";

  if (coordinates && userCoordinates) {
    const { formattedDistance, formattedTravelTime } = getStoreDistanceAndTime(
      coordinates,
      userCoordinates,
      "driving"
    );
    distanceText = formattedDistance;
    travelTimeText = formattedTravelTime;
  }

  const handleClick = () => {
    router.push(`/store/${id}`);
  };

  return (
    <Pressable onPress={handleClick}>
      <View style={styles.container}>
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
            {typeof rating === "number" && (
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
            <Text style={styles.distance}>
              {distanceText || "Near you"}
            </Text>
          </View>

          {travelTimeText ? (
            <View style={styles.travelTimeContainer}>
              <MaterialIcons name="directions-car" size={14} color="#666" />
              <Text style={styles.travelTimeText}>{travelTimeText}</Text>
            </View>
          ) : null}

          {rewardText && (
            <View style={styles.rewardContainer}>
              <View style={styles.rewardIconContainer}>
                <Text style={{ color: "white", fontSize: 10 }}>💰</Text>
              </View>
              <Text style={styles.rewardText}>{rewardText}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CARD_STYLES.storeCard,
  },
  imageContainer: {
    ...CARD_STYLES.imageContainer,
  },
  image: {
    ...CARD_STYLES.image,
  },
  loyaltyBadgeContainer: {
    position: "absolute",
    bottom: SPACING.MD,
    left: SPACING.MD,
  },
  loyaltyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.XS,
  },
  loyaltyText: {
    ...BADGE_STYLES.badgeText,
  },
  infoContainer: {
    ...CARD_STYLES.cardContent,
  },
  nameRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    ...TEXT_STYLES.cardTitle,
    fontSize: 18,
    flex: 1,
    marginRight: SPACING.SM,
  },
  ratingContainer: {
    backgroundColor: COLORS.SUCCESS,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.XS,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.XS,
  },
  ratingText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontFamily: FONTS.MEDIUM,
    marginRight: 2,
  },
  type: {
    ...TEXT_STYLES.cardSubtitle,
    marginBottom: SPACING.XS,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    ...TEXT_STYLES.cardContent,
  },
  dot: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginHorizontal: SPACING.XS,
  },
  distance: {
    ...TEXT_STYLES.cardContent,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rewardIconContainer: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.ROUND,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.XS,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.PRIMARY_DARK,
  },
  travelTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  travelTimeText: {
    ...TEXT_STYLES.cardContent,
    marginLeft: SPACING.XS,
  },
});

export default StoreCard;
