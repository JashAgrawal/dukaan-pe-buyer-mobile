import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { Typography, Body1 } from "@/components/ui/Typography";
import { useCreateStoreReview } from "@/lib/api/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/lib/constants/Colors";
import { getStoreById } from "@/lib/api/services/searchService";
import { useImageUpload } from "@/lib/api/hooks/useImageUpload";

// Define tag options with emojis
interface TagOption {
  id: string;
  emoji: string;
  label: string;
}

const tagOptions: TagOption[] = [
  { id: "ambience", emoji: "✨", label: "Good ambience" },
  { id: "cocktails", emoji: "🍹", label: "Great cocktails" },
  { id: "pocket_friendly", emoji: "😊", label: "Pocket friendly" },
  { id: "staff", emoji: "👋", label: "Friendly staff" },
  { id: "food", emoji: "🍔", label: "Delicious food" },
  { id: "service", emoji: "⭐", label: "Excellent service" },
  { id: "value", emoji: "💰", label: "Great value" },
  { id: "cleanliness", emoji: "✨", label: "Very clean" },
];

export default function AddReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [storeName, setStoreName] = useState("Store");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5); // Default to 5 out of 10
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const createReview = useCreateStoreReview(id as string);
  const {
    selectedImages,
    pickImage,
    removeImage,
    clearImages,
    uploadMultipleImages,
    isUploading,
  } = useImageUpload();

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

    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to leave a review",
        [
          { text: "Cancel", style: "cancel", onPress: () => router.back() },
          { text: "Sign In", onPress: () => router.push("/auth/phone") },
        ]
      );
    }
  }, [id, isAuthenticated]);

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Handle image selection
  const handleAddPhoto = async () => {
    await pickImage();
  };

  const handleSubmitReview = async () => {
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

    try {
      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        // Show loading indicator
        // Upload images and get URLs
        await new Promise<void>((resolve, reject) => {
          uploadMultipleImages(
            { imageUris: selectedImages, type: "review" },
            {
              onSuccess: (urls) => {
                imageUrls = urls;
                resolve();
              },
              onError: (error) => {
                console.error("Error uploading images:", error);
                reject(error);
              },
            }
          );
        });
      }

      // Get selected tag labels
      const tagLabels = selectedTags
        .map((tagId) => {
          const tag = tagOptions.find((t) => t.id === tagId);
          return tag ? tag.label : "";
        })
        .filter(Boolean);

      // Submit review with images and tags
      createReview.mutate(
        {
          rating,
          review: reviewText,
          images: imageUrls,
          tags: tagLabels,
        },
        {
          onSuccess: () => {
            Alert.alert("Success", "Your review has been submitted", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
          onError: (error) => {
            Alert.alert("Error", "Failed to submit review. Please try again.");
            console.error("Error submitting review:", error);
          },
        }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to upload images. Please try again.");
      console.error("Error in review submission process:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>{storeName}</Typography>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Selector */}
        <View style={styles.ratingContainer}>
          <Typography style={styles.ratingLabel}>
            Rate Your Overall Experience
          </Typography>
          <View style={styles.ratingLabels}>
            <Typography style={styles.ratingMinLabel}>0</Typography>
            <Typography style={styles.ratingMaxLabel}>10</Typography>
          </View>
          <View style={styles.ratingSlider}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingButton,
                  rating === value && styles.selectedRating,
                  { backgroundColor: getRatingColor(value) },
                ]}
                onPress={() => setRating(value)}
              />
            ))}
          </View>
        </View>

        {/* Tags Selection */}
        <View style={styles.tagsContainer}>
          <Typography style={styles.tagsLabel}>
            Tell us what you like
          </Typography>
          <View style={styles.tagsList}>
            {tagOptions.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag.id) && styles.selectedTagButton,
                ]}
                onPress={() => toggleTag(tag.id)}
              >
                <Typography style={styles.tagEmoji}>{tag.emoji}</Typography>
                <Typography
                  style={[
                    styles.tagLabel,
                    selectedTags.includes(tag.id) && styles.selectedTagLabel,
                  ]}
                >
                  {tag.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comment Input */}
        <View style={styles.commentContainer}>
          <Typography style={styles.commentLabel}>Add comment</Typography>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us more about your overall experience"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        {/* Photo Upload */}
        <View style={styles.photoContainer}>
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleAddPhoto}
          >
            <Feather name="camera" size={20} color="#8A3FFC" />
            <Typography style={styles.addPhotoText}>Add Photo</Typography>
          </TouchableOpacity>

          {selectedImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosList}
            >
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri }} style={styles.photoImage} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReview}
          disabled={createReview.isPending || isUploading}
        >
          {createReview.isPending || isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Typography style={styles.submitButtonText}>Submit</Typography>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Helper function to get color based on rating
function getRatingColor(rating: number): string {
  // Create a gradient from red to green
  const colors = [
    "#F08080", // Light red
    "#F5A791", // Light salmon
    "#F9C49A", // Light peach
    "#FDDF9A", // Light yellow
    "#FDFD96", // Light yellow
    "#FDFD96", // Light yellow
    "#C1E1C1", // Light mint
    "#A7D7A7", // Light green
    "#8FD28F", // Medium green
    "#77DD77", // Pastel green
    "#4CD964", // Bright green
  ];

  return colors[rating];
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
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40, // To balance the header
  },
  content: {
    flex: 1,
    padding: 16,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    marginBottom: 12,
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratingMinLabel: {
    fontSize: 14,
    color: "#666",
  },
  ratingMaxLabel: {
    fontSize: 14,
    color: "#666",
  },
  ratingSlider: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratingButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  selectedRating: {
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: "#FFF",
  },
  tagsContainer: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tagsLabel: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  selectedTagButton: {
    backgroundColor: "#F0E6FF",
    borderColor: "#8A3FFC",
  },
  tagEmoji: {
    marginRight: 6,
    fontSize: 16,
  },
  tagLabel: {
    fontSize: 14,
    color: "#666",
  },
  selectedTagLabel: {
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    marginBottom: 12,
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Jost-Regular",
    fontSize: 16,
    textAlignVertical: "top",
  },
  photoContainer: {
    marginBottom: 24,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addPhotoText: {
    color: "#8A3FFC",
    marginLeft: 8,
    fontFamily: "Jost-Medium",
  },
  photosList: {
    flexDirection: "row",
    marginBottom: 8,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    position: "relative",
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "Jost-Medium",
    fontSize: 16,
  },
});
