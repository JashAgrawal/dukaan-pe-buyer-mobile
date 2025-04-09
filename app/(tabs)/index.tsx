import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { Typography, H1, H2, Body1 } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/IconSymbol";
import AppHeader from "@/components/ui/AppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper headerComponent={<AppHeader />}>
        {/* Hero Section */}
        <Animated.View
          style={styles.heroSection}
          entering={FadeInDown.duration(800).springify()}
        >
          <H1 style={styles.heroTitle}>Welcome to Dukaan</H1>
          <Body1 style={styles.heroSubtitle}>
            Discover amazing products at great prices
          </Body1>
        </Animated.View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>Categories</H2>
            <TouchableOpacity>
              <Body1 style={styles.seeAllText}>See All</Body1>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            {["Fashion", "Electronics", "Home", "Beauty", "Sports"].map(
              (category, index) => (
                <Animated.View
                  key={category}
                  style={styles.categoryItem}
                  entering={FadeInRight.delay(index * 100).duration(400)}
                >
                  <View style={styles.categoryIcon}>
                    <IconSymbol name="list.bullet" size={24} color="#8A3FFC" />
                  </View>
                  <Body1 style={styles.categoryText}>{category}</Body1>
                </Animated.View>
              )
            )}
          </View>
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>Featured Products</H2>
            <TouchableOpacity>
              <Body1 style={styles.seeAllText}>See All</Body1>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <Animated.View
                key={item}
                style={styles.productCard}
                entering={FadeInDown.delay(item * 100).duration(400)}
              >
                <View style={styles.productImageContainer}>
                  <View style={styles.productImage} />
                  <TouchableOpacity style={styles.wishlistButton}>
                    <IconSymbol name="heart.fill" size={16} color="#FF5757" />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Body1 style={styles.productName}>Product {item}</Body1>
                  <Body1 style={styles.productPrice}>₹999</Body1>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Spacing at the bottom for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  heroSection: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "#666666",
    marginBottom: 20,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
  },
  seeAllText: {
    color: "#8A3FFC",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  categoryItem: {
    alignItems: "center",
    width: "20%",
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    textAlign: "center",
    fontSize: 12,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  productCard: {
    width: "50%",
    padding: 10,
  },
  productImageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: "bold",
    color: "#8A3FFC",
  },
  bottomSpacing: {
    height: 100,
  },
});
