import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import ImageViewer from "@/components/ui/ImageViewer";

interface StoreGalleryProps {
  storeId: string;
  images: string[];
  onSeeAllPress?: () => void;
}

const StoreGallery: React.FC<StoreGalleryProps> = ({
  storeId,
  images,
  onSeeAllPress,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  // If there are no images, don't render anything
  if (!images || images.length === 0) {
    return null;
  }

  // Filter out any invalid images
  const validImages = images.filter((img) => img && typeof img === "string");
  if (validImages.length === 0) return null;

  // Limit to 6 images for the preview scroll
  const displayImages = validImages.slice(0, 6);
  const hasMoreImages = validImages.length > 6;

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedImageIndex(null);
  };

  const handleImageLoadStart = (index: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoadEnd = (index: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleSeeAllPress = () => {
    if (onSeeAllPress) {
      onSeeAllPress();
    } else {
      // Navigate to the gallery page
      router.push(`/store/${storeId}/gallery`);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Typography style={styles.title} font="jost">
            Gallery
          </Typography>
          {hasMoreImages && (
            <TouchableOpacity onPress={handleSeeAllPress}>
              <Typography style={styles.seeAllText}>See all photos</Typography>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
          contentContainerStyle={styles.galleryScrollContent}
        >
          {displayImages.map((image, index) => (
            <TouchableOpacity
              key={`gallery-image-${index}`}
              style={styles.imageContainer}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.9}
            >
              <Image
                source={{
                  uri: image.startsWith("http") ? image : getImageUrl(image),
                }}
                style={styles.image}
                onLoadStart={() => handleImageLoadStart(index)}
                onLoadEnd={() => handleImageLoadEnd(index)}
              />

              {imageLoadingStates[index] && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color="#8A3FFC" />
                </View>
              )}

              {/* Show "See more" overlay on the last image if there are more images */}
              {hasMoreImages && index === displayImages.length - 1 && (
                <View style={styles.seeMoreOverlay}>
                  <Typography style={styles.seeMoreText}>
                    +{validImages.length - displayImages.length}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <View style={styles.viewerContainer}>
          <ImageViewer
            images={validImages}
            initialIndex={selectedImageIndex}
            onClose={handleCloseViewer}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
  },
  galleryScroll: {
    width: "100%",
  },
  galleryScrollContent: {
    paddingRight: 8,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.7)",
  },
  seeMoreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  seeMoreText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Jost-Medium",
  },
  viewerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});

export default StoreGallery;
