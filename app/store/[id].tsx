import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Typography, Body1 } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import { getStoreById } from "@/lib/api/services/searchService";
import StoreHero2 from "@/components/store/StoreHero2";
import StoreGallery from "@/components/store/StoreGallery";
import StoreFacilities from "@/components/store/StoreFacilities";
import StoreReviews from "@/components/store/StoreReviews";
import StoreRecommendations from "@/components/store/StoreRecommendations";
import StoreFooter from "@/components/store/StoreFooter";
import { generateStoreDeepLink } from "@/lib/utils/deepLinking";
import { ProductCategory } from "@/types/store";

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // No need for auth or wishlist hooks here as they're handled in the StoreHero component

  useEffect(() => {
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
        <StoreHero2
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
          {/* About Card */}
          <View style={styles.card}>
            <Typography style={styles.cardTitle}>About this store</Typography>
            <Body1 style={styles.cardContent}>
              {store.description ||
                `${store.name} is one of the leading businesses in the Fast Food Delivery Services lorem ipsum`}
            </Body1>
          </View>

          {/* Address Card */}
          <View style={styles.card}>
            <Typography style={styles.cardTitle}>Address</Typography>
            <Body1 style={styles.cardContent}>
              {store.full_address
                ? store.full_address
                : store.address?.street
                ? `${store.address.street || ""}, ${
                    store.address.city || ""
                  }, ${store.address.state || ""} ${
                    store.address.pincode || ""
                  }`
                : store.city
                ? `${store.city}, ${store.state || ""} ${store.country || ""}`
                : "2 Floor, Khan House, Hill Rd, above McDonald's, Bandra West, Mumbai, Maharashtra 400050"}
            </Body1>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Get the address for directions
                  const address =
                    store.full_address ||
                    (store.address?.street
                      ? `${store.address.street || ""}, ${
                          store.address.city || ""
                        }, ${store.address.state || ""} ${
                          store.address.pincode || ""
                        }`
                      : store.city
                      ? `${store.city}, ${store.state || ""} ${
                          store.country || ""
                        }`
                      : "2 Floor, Khan House, Hill Rd, above McDonald's, Bandra West, Mumbai, Maharashtra 400050");

                  // Open in maps app
                  const encodedAddress = encodeURIComponent(address);
                  const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
                  Linking.openURL(mapsUrl);
                }}
              >
                <Ionicons name="location-outline" size={18} color="#8A3FFC" />
                <Typography style={styles.actionButtonText}>
                  Get directions
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Get the phone number
                  const phoneNumber =
                    store.business_phone_number ||
                    store.contactPhone ||
                    "+1 (123) 456-7890";

                  // Open phone app
                  Linking.openURL(`tel:${phoneNumber}`);
                }}
              >
                <Ionicons name="call-outline" size={18} color="#8A3FFC" />
                <Typography style={styles.actionButtonText}>Call us</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hours Card */}
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Typography style={styles.cardTitle}>Hours</Typography>
              {store.isOpen !== undefined && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: store.isOpen ? "#4CD964" : "#FF3B30" },
                  ]}
                >
                  <Typography style={styles.statusText}>
                    {store.isOpen ? "Open Now" : "Closed"}
                  </Typography>
                </View>
              )}
            </View>
            <Body1 style={styles.cardContent}>
              {store.is_24_7
                ? "Open 24/7"
                : store.opensAt && store.closesAt
                ? `Open: ${store.opensAt} - ${store.closesAt}`
                : `Monday - Friday: 9:00 AM - 9:00 PM\nSaturday - Sunday: 10:00 AM - 8:00 PM`}
            </Body1>
          </View>

          {/* Contact Card */}
          <View style={styles.card}>
            <Typography style={styles.cardTitle}>Contact</Typography>
            <Body1 style={styles.cardContent}>
              <Typography style={styles.contactLabel}>Phone: </Typography>
              {store.business_phone_number ||
                store.contactPhone ||
                "+1 (123) 456-7890"}
            </Body1>
            <Body1 style={styles.cardContent}>
              <Typography style={styles.contactLabel}>Email: </Typography>
              {store.business_email ||
                store.contactEmail ||
                `info@${store.name.toLowerCase().replace(/\s+/g, "")}.com`}
            </Body1>
          </View>

          {/* Facilities Card */}
          <View style={styles.card}>
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
          </View>

          {/* Customer Reviews Card */}
          <View style={styles.card}>
            <StoreReviews storeId={store._id} />
          </View>

          {/* Recommended For Card */}
          <View style={styles.card}>
            <StoreRecommendations
              tags={
                store.displayTags || [
                  "Healthy",
                  "Good Music",
                  "Pocket Friendly",
                ]
              }
            />
          </View>

          {/* Gallery Card */}
          {(store.allImages?.length > 0 ||
            store.mainImage ||
            store.coverImage) && (
            <View style={styles.card}>
              <StoreGallery
                storeId={store._id}
                images={[
                  ...(store.mainImage ? [store.mainImage] : []),
                  ...(store.coverImage ? [store.coverImage] : []),
                  ...(store.allImages || []),
                ]}
                onSeeAllPress={() => router.push(`/store/${store._id}/gallery`)}
              />
            </View>
          )}

          {/* Terms & Conditions Card */}
          <View style={styles.card}>
            <StoreFooter
              storeId={store._id}
              storeName={store.name}
              termsAndConditions={store.termsAndConditions}
              returnPolicy={store.returnPolicy}
            />
          </View>

          {/* Share button */}
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
            <Typography style={styles.shareButtonText}>Share Store</Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontFamily: "Jost-SemiBold",
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
    padding: 16,
  },
  // Card styles
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Jost-SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  contactLabel: {
    fontFamily: "Jost-Medium",
    color: "#555",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
  },
  actionButtonText: {
    marginLeft: 8,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 14,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  shareButtonText: {
    marginLeft: 8,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 16,
  },
});
