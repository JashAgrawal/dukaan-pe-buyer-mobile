import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import { useActiveStoreStore } from "@/stores/activeStoreStore";
import storeService from "@/lib/api/services/storeService";
import { Store } from "@/types/store";

export default function StoreHomePage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get active store from store
  const { activeStore, setActiveStore } = useActiveStoreStore();

  // Use a ref to track if we've already loaded this store
  const loadedStoreIdRef = useRef<string | null>(null);

  // Fetch store data if not already in active store
  useEffect(() => {
    const fetchStoreData = async () => {
      console.log("Store home page - ID from params:", id);
      console.log("Current active store:", JSON.stringify(activeStore, null, 2));

      if (!id) {
        console.error("Store ID is missing in params");
        setError("Store ID is missing");
        setLoading(false);
        return;
      }

      // Skip if we've already loaded this store ID
      if (loadedStoreIdRef.current === id) {
        console.log("Already loaded this store ID, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        // If active store is already set and matches the ID, use it
        if (activeStore && activeStore._id === id) {
          console.log("Using existing active store:", activeStore.name);
          setLoading(false);
          loadedStoreIdRef.current = id as string;
          return;
        }

        // Otherwise fetch the store data
        console.log("Fetching store data for ID:", id);
        const storeData = await storeService.getStoreById(id as string);
        console.log("Fetched store data:", JSON.stringify(storeData, null, 2));

        // Ensure we have a valid store object with required fields
        const validStore = {
          _id: storeData._id || id as string,
          name: storeData.name || "Unknown Store",
          description: storeData.description || "",
          logo: storeData.logo || "",
          coverImage: storeData.coverImage || "",
          createdAt: storeData.createdAt || new Date().toISOString(),
          updatedAt: storeData.updatedAt || new Date().toISOString(),
          ...storeData // Include all other fields from the API response
        };

        console.log("Setting active store with valid data:", validStore.name);
        setActiveStore(validStore);
        loadedStoreIdRef.current = id as string;
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Failed to load store data");
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id, setActiveStore]);

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={styles.loadingText}>Loading store...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !activeStore) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
          <H1 style={styles.errorTitle}>Error</H1>
          <Body1 style={styles.errorMessage}>
            {error || "Store not found"}
          </Body1>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Typography style={styles.backButtonText}>Go Back</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ensure we have all the store data we need
  const storeName = activeStore?.name || "Store";
  const storeId = activeStore?._id || id as string;
  const storeType = activeStore?.type ||
    (activeStore?.categories && activeStore.categories.length > 0 ? activeStore.categories[0] : "Store");

  // Get additional store details with fallbacks
  const storeDescription = activeStore?.description || "No description available";
  const storeAddress = activeStore?.full_address ||
    (activeStore?.address ? `${activeStore.address.street}, ${activeStore.address.city}` : "Address not available");
  const storePhone = activeStore?.contactPhone || activeStore?.business_phone_number || "Phone not available";
  const storeEmail = activeStore?.contactEmail || activeStore?.business_email || "Email not available";

  console.log("Rendering store home with data:", {
    id: storeId,
    name: storeName,
    type: storeType,
    description: storeDescription,
    address: storeAddress,
    phone: storePhone,
    email: storeEmail
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Store header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>{storeName}</Typography>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <H1 style={styles.title}>Store Home</H1>

        {/* Store Information */}
        <View style={styles.infoCard}>
          <Typography style={styles.infoCardTitle}>Store Information</Typography>
          <Body1 style={styles.storeInfo}>Store ID: {storeId}</Body1>
          <Body1 style={styles.storeInfo}>Store Name: {storeName}</Body1>
          <Body1 style={styles.storeInfo}>Store Type: {storeType}</Body1>
          <Body1 style={styles.storeInfo}>Address: {storeAddress}</Body1>
          <Body1 style={styles.storeInfo}>Phone: {storePhone}</Body1>
          <Body1 style={styles.storeInfo}>Email: {storeEmail}</Body1>

          {storeDescription !== "No description available" && (
            <View style={styles.descriptionContainer}>
              <Typography style={styles.descriptionTitle}>Description</Typography>
              <Body1 style={styles.description}>{storeDescription}</Body1>
            </View>
          )}
        </View>

        <View style={styles.messageContainer}>
          <MaterialIcons name="info-outline" size={24} color="#8A3FFC" />
          <Typography style={styles.message}>
            This is a placeholder for the store home page. The actual UI will be
            customized based on the store type.
          </Typography>
        </View>

        {/* Debug Information */}
        <View style={styles.debugCard}>
          <Typography style={styles.debugTitle}>Debug Information</Typography>
          <Body1 style={styles.debugText}>
            Active Store Set: {activeStore ? "Yes" : "No"}
          </Body1>
          <Body1 style={styles.debugText}>
            Store ID from Params: {id as string}
          </Body1>
          <Body1 style={styles.debugText}>
            Store ID from Context: {activeStore?._id || "Not set"}
          </Body1>
        </View>
      </View>
    </SafeAreaView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
  },
  headerRight: {
    width: 24, // For balance with back button
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: "Jost-Bold",
    fontSize: 24,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  infoCardTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    marginBottom: 12,
    color: "#333",
  },
  storeInfo: {
    fontFamily: "Jost-Regular",
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 16,
  },
  descriptionTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F0FF",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  message: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#333333",
    marginLeft: 10,
    flex: 1,
  },
  debugCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  debugTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    marginBottom: 12,
    color: "#F57C00",
  },
  debugText: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Jost-Regular",
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontFamily: "Jost-Bold",
    fontSize: 24,
    marginTop: 16,
  },
  errorMessage: {
    fontFamily: "Jost-Regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  backButton: {
    backgroundColor: "#8A3FFC",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  backButtonText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  backButtonSmall: {
    padding: 4,
  },
});
