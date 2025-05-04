import React, { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import { getStoreById } from "@/lib/api/services/searchService";
import StoreHero from "@/components/store/StoreHero";
import StoreGallery from "@/components/store/StoreGallery";
import StoreFacilities from "@/components/store/StoreFacilities";
import StoreReviews from "@/components/store/StoreReviews";
import StoreRecommendations from "@/components/store/StoreRecommendations";
// StoreFooter is no longer used as we've implemented custom terms & conditions
import {
  generateStoreDeepLink,
  generateStoreHomeDeepLink,
} from "@/lib/utils/deepLinking";
import { ProductCategory } from "@/types/store";
import StoreAboutCard from "@/components/store/StoreAboutCard";
import StoreHoursCard from "@/components/store/StoreHoursCard";
import StoreContactCard from "@/components/store/StoreContactCard";
import StoreTermsCard from "@/components/store/StoreTermsCard";
import StoreReportCard from "@/components/store/StoreReportCard";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Animation for the sticky button
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  // No need for auth or wishlist hooks here as they're handled in the StoreHero component

  useEffect(() => {
    // Animate the button sliding up when the component mounts
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        const storeData = await getStoreById(id as string);
        setStore(storeData);
        setLoading(false);

        // Add to recent searches
        const searchItem: SearchItem = {
          id: storeData._id,
          name: storeData.name,
          category: storeData.category?.name || "",
          imageUrl: storeData.logo || storeData.mainImage || "",
          tagline: storeData.tagline,
          rating: storeData.averageRating,
          reviewCount: storeData.reviewCount,
        };

        useSearchStore.getState().addToRecentSearches(searchItem);
      } catch (err) {
        console.error("Error fetching store details:", err);
        setError("Failed to load store details");
        setLoading(false);
      }
    };

    if (id) {
      fetchStoreDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ShortAppHeader
          title="Store Details"
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={{ marginTop: 16 }}>
            Loading store details...
          </Typography>
        </View>
      </View>
    );
  }

  if (error || !store) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ShortAppHeader
          title="Store Details"
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <MaterialIcons name="error-outline" size={32} color="#FF3B30" />
          <Typography style={{ marginTop: 16 }}>
            {error || "Store not found"}
          </Typography>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Typography style={styles.retryButtonText}>Go Back</Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StoreHero
          id={store._id}
          name={store.name}
          imageUrl={store.mainImage || store.coverImage}
          logoUrl={store.logo}
          categories={
            store.categories ||
            (store.category?.name ? [store.category.name] : []) ||
            (store.productCategories?.length
              ? store.productCategories.map((cat: ProductCategory) => cat.name)
              : [])
          }
          rating={store.averageRating}
          location={
            store.city
              ? `${store.city}, ${store.state || ""}`
              : store.address?.city
              ? `${store.address.city}, ${store.address.state || ""}`
              : store.full_address
              ? store.full_address.split(",")[0]
              : "JVPD Scheme, Juhu"
          }
          costForOne={store.costForOne || 250}
          openingHours={
            store.is_24_7
              ? "24/7"
              : store.opensAt && store.closesAt
              ? `${store.opensAt} - ${store.closesAt}`
              : "11:30am - 1:30pm, 2:30pm - 4:30pm"
          }
          isOpen={store.isOpen !== undefined ? store.isOpen : true}
          recommendationCount={280}
          recommendedBy="Bhagyalaxmi"
        />

        <View style={styles.storeInfo}>
          {/* About & Address Card */}
          <StoreAboutCard store={store} />

          {/* Hours Card */}
          <StoreHoursCard store={store} />

          {/* Contact Card */}
          <StoreContactCard store={store} />

          {/* Facilities Section */}
          <StoreFacilities
            facilities={
              store.facilities || [
                "Takeaway available",
                "Indoor seating",
                "LGBTQIA Friendly",
                "Smoking area",
                "Wifi",
                "Romantic Dining",
                "Parking",
                "Air Conditioning",
              ]
            }
          />

          {/* Customer Reviews Section */}
          <StoreReviews storeId={store._id} />

          {/* Recommended For Section */}
          <StoreRecommendations
            tags={
              store.displayTags || ["Healthy", "Good Music", "Pocket Friendly"]
            }
          />

          {/* Gallery Section */}
          {(store.allImages?.length > 0 ||
            store.mainImage ||
            store.coverImage) && (
            <StoreGallery
              storeId={store._id}
              images={[
                ...(store.mainImage ? [store.mainImage] : []),
                ...(store.coverImage ? [store.coverImage] : []),
                ...(store.allImages || []),
              ]}
              onSeeAllPress={() => router.navigate(`/store/${store._id}/gallery`)}
            />
          )}

          {/* Terms & Conditions and Return Policy Card */}
          <StoreTermsCard store={store} />

          {/* Report Business Card */}
          <StoreReportCard store={store} />

          {/* Share button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {
                const deepLink = generateStoreDeepLink(store._id);
                Share.share({
                  message: `Check out ${store.name} on DUNE! ${deepLink}`,
                  url: deepLink,
                });
              }}
            >
              <MaterialIcons name="share" size={20} color="#8A3FFC" />
              <Typography style={styles.shareButtonText}>
                Share Store
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.visitButton}
              onPress={() => {
                // Set active store and navigate to store-home
                useActiveStoreStore.getState().visitStore(store._id);
              }}
            >
              <MaterialIcons name="storefront" size={20} color="#8A3FFC" />
              <Typography style={styles.shareButtonText}>
                Visit Store
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Add extra space at the bottom for the sticky button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Sticky Open Store Button */}
      <Animated.View
        style={[
          styles.stickyButtonContainer,
          {
            transform: [
              {
                translateY: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0], // Start from below the screen and slide up
                }),
              },
            ],
            opacity: buttonAnimation,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.openStoreButton}
          activeOpacity={0.8}
          onPress={() => {
            console.log(`Visiting store: ${store.name}`);
            // Set active store and navigate to store-home
            useActiveStoreStore.getState().visitStore(store._id);
          }}
        >
          <MaterialIcons
            name="storefront"
            size={20}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Typography style={styles.openStoreButtonText}>
            Visit Store
          </Typography>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Lighter background for contrast with cards
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Jost-Medium",
  },
  content: {
    flex: 1,
  },
  storeInfo: {
    padding: 12,
    overflow: "visible", // Allow content to overflow for horizontal scrolling
  },
  // Card styles
  card: {
    marginBottom: 12,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardSection: {
    padding: 14,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000",
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 20,
    marginBottom: 6,
  },
  contactLabel: {
    fontFamily: "Jost-Medium",
    color: "#555",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Jost-Medium",
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#FFFFFF",
  },
  actionButtonText: {
    marginLeft: 6,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
    marginHorizontal: 6,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    flex: 1,
    marginRight: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  visitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    flex: 1,
    marginLeft: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  shareButtonText: {
    marginLeft: 6,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 14,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  reportButtonText: {
    marginLeft: 6,
    color: "#FF3B30",
    fontFamily: "Jost-Medium",
    fontSize: 13,
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  openStoreButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8A3FFC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  openStoreButtonText: {
    color: "#FFFFFF",
    fontFamily: "Jost-Medium",
    fontSize: 16,
  },
});
