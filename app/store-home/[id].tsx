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
      if (!id) {
        setError("Store ID is missing");
        setLoading(false);
        return;
      }

      // Skip if we've already loaded this store ID
      if (loadedStoreIdRef.current === id) {
        setLoading(false);
        return;
      }

      try {
        // If active store is already set and matches the ID, use it
        if (activeStore && activeStore._id === id) {
          setLoading(false);
          loadedStoreIdRef.current = id as string;
          return;
        }

        // Otherwise fetch the store data
        const storeData = await storeService.getStoreById(id as string);
        setActiveStore(storeData);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Temporary header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>{activeStore.name}</Typography>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <H1 style={styles.title}>Store Home</H1>
        <Body1 style={styles.storeInfo}>Store ID: {activeStore._id}</Body1>
        <Body1 style={styles.storeInfo}>Store Name: {activeStore.name}</Body1>
        <Body1 style={styles.storeInfo}>
          Store Type: {activeStore.type || "Not specified"}
        </Body1>

        <View style={styles.messageContainer}>
          <MaterialIcons name="info-outline" size={24} color="#8A3FFC" />
          <Typography style={styles.message}>
            This is a placeholder for the store home page. The actual UI will be
            customized based on the store type.
          </Typography>
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
  storeInfo: {
    fontFamily: "Jost-Regular",
    fontSize: 16,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F0FF",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  message: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#333333",
    marginLeft: 10,
    flex: 1,
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
