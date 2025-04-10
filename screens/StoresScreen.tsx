import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import StoreCard from "../components/store/StoreCard";
import { Store } from "../types/store";
import { StoreCardData } from "../types/storeCard";
import { storeToCardData } from "../utils/storeUtils";

// Sample data for demonstration
const mockStoreData: StoreCardData[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
    name: "Akkad Bakkad Bombay Boom",
    type: "Restaurant",
    location: "Mulund West",
    distance: "3 km",
    rating: 7.5,
    loyaltyBenefit: "Loyalty Benefit 10% Off",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    name: "Bhavya S Wadhwa Salon",
    type: "Restaurant",
    location: "Andheri West",
    distance: "1.5km",
    loyaltyBenefit: "Loyalty Benefits",
    rewardText: "Get 💰 20 for every recommendation",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    name: "Spice Garden",
    type: "Restaurant",
    location: "Bandra East",
    distance: "4.2 km",
    rating: 8.2,
    loyaltyBenefit: "Loyalty Benefit 15% Off",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    name: "Glow Beauty Parlour",
    type: "Salon",
    location: "Juhu",
    distance: "2.8 km",
    loyaltyBenefit: "Loyalty Benefits",
    rewardText: "Get 💰 30 for every recommendation",
  },
];

const StoresScreen = () => {
  const [storeCards, setStoreCards] = useState<StoreCardData[]>(mockStoreData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch stores from an API
  // useEffect(() => {
  //   const fetchStores = async () => {
  //     setLoading(true);
  //     try {
  //       // const response = await fetchNearbyStores();
  //       // const storeCards = response.data.map(store =>
  //       //   storeToCardData(store, calculateDistance(userLat, userLng, store.lat, store.lng))
  //       // );
  //       // setStoreCards(storeCards);
  //       setStoreCards(mockStoreData); // Using mock data for now
  //     } catch (err) {
  //       setError('Failed to load stores');
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchStores();
  // }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8A3FFC" />
        <Text style={styles.loadingText}>Loading stores...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Stores</Text>
      </View>

      <FlatList
        data={storeCards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <StoreCard
            imageUrl={item.imageUrl}
            name={item.name}
            type={item.type}
            location={item.location}
            distance={item.distance}
            rating={item.rating}
            loyaltyBenefit={item.loyaltyBenefit}
            rewardText={item.rewardText}
            onPress={() => console.log(`Store ${item.name} pressed`)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  listContent: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#E53935",
    textAlign: "center",
    padding: 16,
  },
});

export default StoresScreen;
