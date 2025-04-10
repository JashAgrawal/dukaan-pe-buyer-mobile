import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import { useSearchStore, SearchItem } from "@/stores/useSearchStore";
import { getStoreById } from "@/lib/api/services/searchService";

export default function StoreDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>Store Details</Typography>
        </View>
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>Store Details</Typography>
        </View>
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>{store.name}</Typography>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.storeImageContainer}>
          {store.mainImage ? (
            <Image
              source={{ uri: store.mainImage }}
              style={styles.storeImage}
            />
          ) : store.logo ? (
            <Image source={{ uri: store.logo }} style={styles.storeImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="store" size={48} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.storeInfo}>
          <H1 style={styles.storeName}>{store.name}</H1>
          {store.tagline && (
            <Typography style={styles.storeTagline}>{store.tagline}</Typography>
          )}
          <Typography style={styles.storeCategory}>
            {store.category?.name || ""}
          </Typography>

          {store.averageRating > 0 && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Typography style={styles.rating}>
                {store.averageRating.toFixed(1)}
              </Typography>
              {store.reviewCount > 0 && (
                <Typography style={styles.reviewCount}>
                  ({store.reviewCount} reviews)
                </Typography>
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>About</Typography>
            <Body1 style={styles.sectionContent}>
              {store.description ||
                `This is a placeholder description for ${store.name}. In a real app, this would contain detailed information about the store, its products, and services.`}
            </Body1>
          </View>

          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>Location</Typography>
            <Body1 style={styles.sectionContent}>
              {store.full_address || store.city
                ? `${store.full_address || ""}, ${store.city || ""}, ${
                    store.state || ""
                  }, ${store.country || ""}`
                : "123 Main Street, City, Country"}
            </Body1>
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
              Phone: {store.business_phone_number || "+1 (123) 456-7890"}
              {"\n"}
              Email:{" "}
              {store.business_email ||
                `info@${store.name.toLowerCase().replace(/\s+/g, "")}.com`}
            </Body1>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  storeImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#F5F5F5",
  },
  storeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  storeInfo: {
    padding: 16,
  },
  storeName: {
    fontSize: 24,
    fontFamily: "Jost-Bold",
    color: "#000",
    marginBottom: 4,
  },
  storeTagline: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 8,
  },
  storeCategory: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
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
});
