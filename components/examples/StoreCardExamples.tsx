import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import StoreCard from "../store/StoreCard";

const StoreCardExamples = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Restaurant Card Example - Akkad Bakkad */}
      <StoreCard
        id="1"
        imageUrl="https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80"
        name="Akkad Bakkad Bombay Boom"
        type="Restaurant"
        location="Mulund West"
        distance="3 km"
        rating={7.5}
        loyaltyBenefit="Loyalty Benefit 10% Off"
      />

      {/* Salon Card Example - Bhavya S Wadhwa Salon */}
      <StoreCard
        id="2"
        imageUrl="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        name="Bhavya S Wadhwa Salon"
        type="Restaurant"
        location="Andheri West"
        distance="1.5km"
        loyaltyBenefit="Loyalty Benefits"
        rewardText="Get 20 for every recommendation"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 16,
  },
});

export default StoreCardExamples;
