import React from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import StoreCard from "../components/store/StoreCard";

const StoreCardDemoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store Card Examples</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Restaurant Card</Text>
        <StoreCard
          id="1"
          imageUrl="https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
          name="Akkad Bakkad Bombay Boom"
          type="Restaurant"
          location="Mulund West"
          distance="3 km"
          rating={7.5}
          loyaltyBenefit="Loyalty Benefit 10% Off"
          onPress={() => console.log("Restaurant card pressed")}
        />

        <View style={styles.spacer} />

        <Text style={styles.sectionTitle}>Salon Card</Text>
        <StoreCard
          id="2"
          imageUrl="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
          name="Bhavya S Wadhwa Salon"
          type="Salon"
          location="Andheri West"
          distance="1.5km"
          loyaltyBenefit="Loyalty Benefits"
          rewardText="Get 💰 20 for every recommendation"
          onPress={() => console.log("Salon card pressed")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Jost-SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  spacer: {
    height: 24,
  },
});

export default StoreCardDemoScreen;
