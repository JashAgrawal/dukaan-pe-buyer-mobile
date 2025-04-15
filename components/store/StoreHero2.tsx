import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const StoreHero2: React.FC<StoreHeroProps> = ({
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
  // Use the wishlist hooks
  const { data: hookIsFavorite } = useStoreWishlistStatus(id);
  const { toggleWishlist } = useWishlistToggle();

  // Use prop value if provided, otherwise use the hook value
  const isFavorite = hookIsFavorite || false;

  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    toggleWishlist(id, isFavorite);
  };

  // Handle call button press
  const handleCallPress = () => {
    Alert.alert("Call Business", `Would you like to call ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          // In a real app, this would use the actual phone number
          Linking.openURL("tel:+1234567890");
        },
      },
    ]);
  };

  // Handle loyalty check-in button press
  const handleLoyaltyCheckIn = () => {
    Alert.alert("Loyalty Check-in", "Check in to earn loyalty points", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Check In",
        onPress: () => console.log("Loyalty check-in pressed"),
      },
    ]);
  };

  // Handle scan button press
  const handleScanPress = () => {
    router.push("/scanner");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(imageUrl || "") }}
            style={styles.headerImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "white"}
            />
          </TouchableOpacity>
          {logoUrl && (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: getImageUrl(logoUrl) }}
                style={styles.logo}
              />
            </View>
          )}
        </View>

        {/* Restaurant Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.nameRatingContainer}>
            <Text style={styles.restaurantName}>{name}</Text>
            {rating !== undefined && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{rating} ★</Text>
              </View>
            )}
          </View>

          {categories.length > 0 && (
            <Text style={styles.cuisineText}>{categories.join(", ")}</Text>
          )}

          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>{location}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#6366f1"
              />
              <View style={styles.spacer} />
              <TouchableOpacity style={styles.mapButton}>
                <MaterialIcons name="directions" size={24} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}

          {costForOne && (
            <Text style={styles.costText}>Cost for one ₹{costForOne}</Text>
          )}

          {openingHours && (
            <View style={styles.timingContainer}>
              <Text
                style={[
                  styles.openNowText,
                  { color: isOpen ? "#4CAF50" : "#FF3B30" },
                ]}
              >
                {isOpen ? "Open now" : "Closed"}
              </Text>
              <Text style={styles.timingText}> - {openingHours}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#6366f1"
              />
            </View>
          )}

          {recommendationCount && recommendedBy && (
            <View style={styles.recommendationContainer}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${recommendedBy}`,
                }}
                style={styles.userImage}
              />
              <Text style={styles.recommendationText}>
                <Text style={styles.boldText}>{recommendedBy}</Text> &{" "}
                {recommendationCount} others highly recommend this business
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCallPress}
            >
              <Ionicons name="call-outline" size={24} color="#6366f1" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <View style={styles.buttonDivider} />

            <View style={styles.buttonDivider} />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleScanPress}
            >
              <MaterialIcons name="qr-code-scanner" size={24} color="#6366f1" />
              <Text style={styles.actionButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: "#000",
  },
  imageContainer: {
    height: 250,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#e0e0e0",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  logoContainer: {
    position: "absolute",
    bottom: -40,
    left: 40,
    width: 80,
    height: 80,
    zIndex: 20,
    borderRadius: 8,
    backgroundColor: "#000",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 50,
    marginHorizontal: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#fff",
  },
  nameRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },
  ratingBadge: {
    backgroundColor: "#F5A623",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cuisineText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
  },
  spacer: {
    flex: 1,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  costText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  timingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  openNowText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  timingText: {
    fontSize: 16,
    color: "#666",
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  recommendationText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#6366f1",
    marginLeft: 8,
  },
  buttonDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e0e0e0",
  },
});

export default StoreHero2;
