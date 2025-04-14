import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { useStoreWishlistStatus } from "@/lib/api/hooks/useWishlist";
import useWishlistToggle from "@/hooks/useWishlistToggle";

interface StoreHeroProps {
  id: string;
  name: string;
  imageUrl?: string;
  logoUrl?: string;
  categories?: string[];
  rating?: number;
  location?: string;
  costForOne?: number;
  openingHours?: string;
  isOpen?: boolean;
  recommendationCount?: number;
  recommendedBy?: string;
  isFavorite?: boolean;
}

const StoreHero: React.FC<StoreHeroProps> = ({
  id,
  name,
  imageUrl,
  logoUrl,
  categories = [],
  rating,
  location,
  costForOne,
  openingHours,
  isOpen = true,
  recommendationCount,
  recommendedBy,
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const imageHeight = screenWidth * 0.7; // 70% of screen width for image height

  // Use the wishlist hooks
  const { data: hookIsFavorite } = useStoreWishlistStatus(id);
  const { toggleWishlist } = useWishlistToggle();

  // Use prop value if provided, otherwise use the hook value
  const isFavorite = hookIsFavorite || false;

  // Handle toggling favorite status
  const handleToggleFavorite = (e: any) => {
    // Stop event propagation to prevent card click
    if (e) e.stopPropagation();
    toggleWishlist(id, isFavorite);
  };

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: getImageUrl(imageUrl || "") }}
          style={styles.heroImage}
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.3)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Logo */}
        {logoUrl && (
          <View style={[styles.logoContainer, { top: insets.top + 16 }]}>
            <Image source={{ uri: getImageUrl(logoUrl) }} style={styles.logo} />
          </View>
        )}

        {/* Back button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 16 }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Favorite button */}
        <TouchableOpacity
          style={[styles.favoriteButton, { top: insets.top + 16 }]}
          onPress={handleToggleFavorite}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={24}
            color={isFavorite ? "#FF3B30" : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Store Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRatingRow}>
          <Typography variant="h1" weight="bold" style={styles.storeName}>
            {name}
          </Typography>

          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Typography style={styles.ratingText}>{rating} ★</Typography>
            </View>
          )}
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <Typography style={styles.categories}>
            {categories.join(", ")}
          </Typography>
        )}

        {/* Location */}
        {location && (
          <View style={styles.locationContainer}>
            <Typography style={styles.locationText}>{location}</Typography>
            {costForOne && (
              <>
                <View style={styles.dot} />
                <Typography style={styles.costText}>
                  Cost for one ₹{costForOne}
                </Typography>
              </>
            )}
          </View>
        )}

        {/* Opening Hours */}
        {openingHours && (
          <View style={styles.openingHoursContainer}>
            <Typography
              style={[
                styles.openStatus,
                { color: isOpen ? "#4CAF50" : "#FF3B30" },
              ]}
            >
              {isOpen ? "Open now" : "Closed"}
            </Typography>
            <Typography style={styles.openingHours}>
              {" - " + openingHours}
            </Typography>
          </View>
        )}

        {/* Recommendations */}
        {recommendationCount && recommendedBy && (
          <View style={styles.recommendationContainer}>
            <View style={styles.recommendationIconContainer}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${recommendedBy}`,
                }}
                style={styles.recommendationIcon}
              />
            </View>
            <Typography style={styles.recommendationText}>
              {recommendedBy} & {recommendationCount} others highly recommend
              this business
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logoContainer: {
    position: "absolute",
    left: 16,
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#000",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 16,
  },
  nameRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 28,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
  categories: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
    marginHorizontal: 8,
  },
  costText: {
    fontSize: 14,
    color: "#666",
  },
  openingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  openStatus: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
  },
  openingHours: {
    fontSize: 14,
    color: "#666",
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  recommendationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
  },
  recommendationIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recommendationText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
});

export default StoreHero;
