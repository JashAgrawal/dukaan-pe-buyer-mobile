import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Typography } from "@/components/ui/Typography";

interface StoreRecommendationsProps {
  tags: string[];
}

const StoreRecommendations: React.FC<StoreRecommendationsProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Map of tag names to emoji icons
  const tagIcons: Record<string, string> = {
    "Healthy": "🥗",
    "Good Music": "🎵",
    "Pocket Friendly": "😊",
    "Trending": "🔥",
    "Popular": "👍",
    "New Arrival": "🆕",
    "Best Seller": "🏆",
    "Top Rated": "⭐",
    "Featured": "✨",
    "Fast Delivery": "🚚",
    "Premium": "💎",
    "Verified": "✅",
    "Family Friendly": "👨‍👩‍👧‍👦",
    "Date Night": "💑",
    "Group Dining": "👥",
    "Late Night": "🌙",
    "Breakfast": "🍳",
    "Lunch": "🍽️",
    "Dinner": "🍴",
    "Dessert": "🍰",
  };

  // Get icon for a tag, default to "✨" if not found
  const getIconForTag = (tag: string) => {
    return tagIcons[tag] || "✨";
  };

  return (
    <View style={styles.container}>
      <Typography style={styles.title}>Recommended For</Typography>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
      >
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagItem}>
            <Typography style={styles.tagIcon}>{getIconForTag(tag)}</Typography>
            <Typography style={styles.tagText}>{tag}</Typography>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    fontFamily: "Jost-SemiBold",
  },
  tagsContainer: {
    paddingRight: 16,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
  },
});

export default StoreRecommendations;
