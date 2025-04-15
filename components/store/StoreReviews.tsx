import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, Body1, Body2 } from "@/components/ui/Typography";
import { Colors } from "@/lib/constants/Colors";
import { useStoreReviews } from "@/lib/api/hooks/useReviews";
import { Review } from "@/lib/api/services/reviewService";

interface StoreReviewsProps {
  storeId: string;
}

const StoreReviews: React.FC<StoreReviewsProps> = ({ storeId }) => {
  const { data, isLoading, error } = useStoreReviews(storeId, 1, 2); // Only fetch 2 reviews for preview

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Typography style={styles.title}>Customer Reviews</Typography>
        <Body1>Loading reviews...</Body1>
      </View>
    );
  }

  if (error || !data || !data.data.reviews.length) {
    return null;
  }

  const reviews = data.data.reviews;
  const totalReviews = data.pagination.total;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography style={styles.title}>Customer Reviews</Typography>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => router.push(`/store/${storeId}/reviews`)}
        >
          <Typography style={styles.seeAllText}>See all reviews</Typography>
        </TouchableOpacity>
      </View>

      {reviews.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}

      {totalReviews > 2 && (
        <TouchableOpacity
          style={styles.moreReviewsButton}
          onPress={() => router.push(`/store/${storeId}/reviews`)}
        >
          <Typography style={styles.moreReviewsText}>
            View all {totalReviews} reviews
          </Typography>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image
          source={{
            uri: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${review.user.name}`,
          }}
          style={styles.userImage}
        />
        <View style={styles.reviewHeaderText}>
          <Typography style={styles.userName}>{review.user.name}</Typography>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Typography style={styles.rating}>{review.rating}</Typography>
          </View>
        </View>
      </View>
      <Body2 style={styles.reviewText}>{review.review}</Body2>
      <Body2 style={styles.reviewDate}>
        {new Date(review.createdAt).toLocaleDateString()}
      </Body2>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-SemiBold",
    color: "#000",
  },
  seeAllButton: {
    padding: 4,
  },
  seeAllText: {
    color: Colors.light.tint,
    fontSize: 14,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    marginBottom: 8,
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  moreReviewsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  moreReviewsText: {
    color: Colors.light.tint,
    marginRight: 4,
  },
});

export default StoreReviews;
