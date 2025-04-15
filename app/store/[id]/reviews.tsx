import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Typography, Body1, Body2 } from "@/components/ui/Typography";
import {
  useStoreReviews,
  useCreateStoreReview,
} from "@/lib/api/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/lib/constants/Colors";
import { getStoreById } from "@/lib/api/services/searchService";
import { getImageUrl } from "@/lib/helpers";

export default function StoreReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useStoreReviews(id as string);
  const { isAuthenticated } = useAuth();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const createReview = useCreateStoreReview(id as string);
  const [storeName, setStoreName] = useState("Store");

  // Fetch store name
  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const storeData = await getStoreById(id as string);
        setStoreName(storeData.name);
      } catch (err) {
        console.error("Error fetching store details:", err);
      }
    };

    if (id) {
      fetchStoreName();
    }
  }, [id]);

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to leave a review",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign In",
            onPress: () => router.push("/auth/phone"),
          },
        ]
      );
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert("Error", "Please enter a review");
      return;
    }

    createReview.mutate(
      { rating, review: reviewText },
      {
        onSuccess: () => {
          Alert.alert("Success", "Your review has been submitted");
          setReviewText("");
          setRating(5);
          refetch();
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to submit review. Please try again.");
          console.error("Error submitting review:", error);
        },
      }
    );
  };

  const renderReviewItem = ({ item }: any) => {
    // Format date as MM/DD/YYYY HH:MM PM
    const date = new Date(item.createdAt);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${
      date.getHours() % 12 || 12
    }:${date.getMinutes().toString().padStart(2, "0")} ${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;

    // Get first letter of user name for avatar
    const firstLetter = item.user.name.charAt(0).toUpperCase();

    // Get background color for rating pill based on rating
    const getRatingColor = (rating: number) => {
      if (rating >= 7) return "#4CD964"; // Green for high ratings
      if (rating >= 4) return "#FFCC00"; // Yellow for medium ratings
      return "#FF3B30"; // Red for low ratings
    };

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <View style={styles.avatarContainer}>
            <Typography style={styles.avatarText}>{firstLetter}</Typography>
          </View>
          <View style={styles.reviewHeaderText}>
            <Typography style={styles.userName}>{item.user.name}</Typography>
            <View
              style={[
                styles.ratingPill,
                { backgroundColor: getRatingColor(item.rating) },
              ]}
            >
              <Typography style={styles.ratingText}>{item.rating}</Typography>
            </View>
          </View>
        </View>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string, tagIndex: number) => {
              // Get emoji based on tag text
              let emoji = "✨";
              if (tag.toLowerCase().includes("healthy")) emoji = "🥗";
              if (tag.toLowerCase().includes("music")) emoji = "🎵";
              if (
                tag.toLowerCase().includes("pocket") ||
                tag.toLowerCase().includes("value")
              )
                emoji = "😊";
              if (
                tag.toLowerCase().includes("cocktail") ||
                tag.toLowerCase().includes("drink")
              )
                emoji = "🍹";
              if (
                tag.toLowerCase().includes("staff") ||
                tag.toLowerCase().includes("service")
              )
                emoji = "👋";
              if (tag.toLowerCase().includes("food")) emoji = "🍔";
              if (tag.toLowerCase().includes("clean")) emoji = "✨";

              return (
                <View key={tagIndex} style={styles.tag}>
                  <Typography style={styles.tagIcon}>{emoji}</Typography>
                  <Typography style={styles.tagText}>{tag}</Typography>
                </View>
              );
            })}
          </View>
        )}

        {/* Review text */}
        <Body1 style={styles.reviewText}>{item.review}</Body1>

        {/* Review images if any */}
        {item.images && item.images.length > 0 && (
          <View style={styles.reviewImagesContainer}>
            {item.images.map((image: string, index: number) => (
              <Image
                key={index}
                source={{ uri: getImageUrl(image) }}
                style={styles.reviewImage}
              />
            ))}
          </View>
        )}

        <Typography style={styles.reviewDate}>{formattedDate}</Typography>
      </View>
    );
  };

  // Custom header with store name and add review button
  const ReviewsHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Typography style={styles.headerTitle}>{storeName}</Typography>
      <TouchableOpacity
        style={styles.addReviewButton}
        onPress={() => {
          if (!isAuthenticated) {
            Alert.alert(
              "Authentication Required",
              "Please sign in to leave a review",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Sign In", onPress: () => router.push("/auth/phone") },
              ]
            );
            return;
          }
          // Navigate to add review page
          router.push(`/store/${id}/add-review`);
        }}
      >
        <Typography style={styles.addReviewText}>Add review</Typography>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ReviewsHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={{ marginTop: 16 }}>Loading reviews...</Typography>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ReviewsHeader />
        <View style={styles.loadingContainer}>
          <MaterialIcons name="error-outline" size={32} color="#FF3B30" />
          <Typography style={{ marginTop: 16 }}>
            Failed to load reviews
          </Typography>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Typography style={styles.retryButtonText}>Retry</Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const reviews = data?.data.reviews || [];
  const totalReviews = data?.pagination.total || 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ReviewsHeader />

      <View style={styles.ratingContainer}>
        <View style={styles.ratingPill}>
          <Typography style={styles.overallRating}>
            {data?.data.reviews && data?.data.reviews.length > 0
              ? (
                  reviews.reduce((acc, review) => acc + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : "0.0"}
          </Typography>
        </View>
        <Typography style={styles.ratedCount}>{totalReviews} Rated</Typography>
        <TouchableOpacity style={styles.howRatedButton}>
          <Typography style={styles.howRatedText}>
            How are dynamic ratings calculated?
          </Typography>
          <MaterialIcons name="chevron-right" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="rate-review" size={64} color="#E0E0E0" />
            <Typography style={styles.emptyText}>No reviews yet</Typography>
            <Body1 style={styles.emptySubtext}>
              Be the first to review this store!
            </Body1>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Jost-SemiBold",
    flex: 1,
    textAlign: "center",
  },
  addReviewButton: {
    padding: 8,
  },
  addReviewText: {
    color: Colors.light.tint,
    fontFamily: "Jost-Medium",
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
  ratingContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
  },
  ratingPill: {
    backgroundColor: "#4CD964", // Green for high rating
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  overallRating: {
    color: "#FFFFFF",
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
  },
  ratedCount: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  howRatedButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  howRatedText: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 0,
  },
  reviewItem: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
  },
  reviewHeaderText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
  reviewText: {
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewImagesContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
    color: "#666",
  },
});
