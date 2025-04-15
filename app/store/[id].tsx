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

      <ScrollView style={styles.content}>
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
          <View style={styles.divider} />

          {/* About Card */}
          <View style={styles.aboutCard}>
            <View style={styles.aboutSection}>
              <Typography style={styles.aboutTitle}>
                About this store
              </Typography>
              <Body1 style={styles.aboutContent}>
                {store.description ||
                  `${store.name} is one of the leading businesses in the Fast Food Delivery Services lorem ipsum`}
              </Body1>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.addressSection}>
              <Typography style={styles.addressTitle}>Address</Typography>
              <Body1 style={styles.addressContent}>
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

              <View style={styles.addressButtonsContainer}>
                <TouchableOpacity
                  style={styles.addressButton}
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
                  <Typography style={styles.addressButtonText}>
                    Get directions
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addressButton}
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
                  <Typography style={styles.addressButtonText}>
                    Call us
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Hours</Typography>
            <Body1 style={styles.sectionContent}>
              {store.is_24_7
                ? "Open 24/7"
                : store.opensAt && store.closesAt
                ? `Open: ${store.opensAt} - ${store.closesAt}`
                : `Monday - Friday: 9:00 AM - 9:00 PM\nSaturday - Sunday: 10:00 AM - 8:00 PM`}
            </Body1>
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

          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Contact</Typography>
            <Body1 style={styles.sectionContent}>
              Phone:{" "}
              {store.business_phone_number ||
                store.contactPhone ||
                "+1 (123) 456-7890"}
              {"\n"}
              Email:{" "}
              {store.business_email ||
                store.contactEmail ||
                `info@${store.name.toLowerCase().replace(/\s+/g, "")}.com`}
            </Body1>
          </View>

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
              onSeeAllPress={() => router.push(`/store/${store._id}/gallery`)}
            />
          )}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
    position: "relative",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
    color: "#000",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 24,
  },
  statusBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#FFFFFF",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  shareButtonText: {
    marginLeft: 8,
    color: "#8A3FFC",
    fontWeight: "600",
  },
  // About Card Styles
  aboutCard: {
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
  },
  aboutSection: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: "Jost-SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  aboutContent: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 24,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  addressSection: {
    padding: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontFamily: "Jost-SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  addressContent: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  addressButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  addressButton: {
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
  },
  addressButtonText: {
    marginLeft: 8,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 14,
  },
});
