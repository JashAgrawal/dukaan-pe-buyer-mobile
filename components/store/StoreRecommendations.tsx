import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Typography } from "@/components/ui/Typography";

interface StoreRecommendationsProps {
  tags: string[];
}

const StoreRecommendations: React.FC<StoreRecommendationsProps> = ({
  tags,
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Map of tag names to emoji icons
  const tagIcons: Record<string, string> = {
    Healthy: "🥗",
    "Good Music": "🎵",
    "Pocket Friendly": "😊",
    Trending: "🔥",
    Popular: "👍",
    "New Arrival": "🆕",
    "Best Seller": "🏆",
    "Top Rated": "⭐",
    Featured: "✨",
    "Fast Delivery": "🚚",
    Premium: "💎",
    Verified: "✅",
    "Family Friendly": "👨‍👩‍👧‍👦",
    "Date Night": "💑",
    "Group Dining": "👥",
    "Late Night": "🌙",
    Breakfast: "🍳",
    Lunch: "🍽️",
    Dinner: "🍴",
    Dessert: "🍰",
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
    width: "100%",
    // borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "medium",
    marginBottom: 12,
    color: "#000",
  },
  tagsContainer: {
    paddingRight: 16,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0E6FF", // Light purple background
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E6D9FF",
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Jost-Medium",
  },
});

export default StoreRecommendations;
