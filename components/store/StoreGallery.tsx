import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";

const { width } = Dimensions.get("window");
const GALLERY_HEIGHT = 220;
const GALLERY_ITEM_WIDTH = width / 3 - 8;
const GALLERY_ITEM_HEIGHT = GALLERY_HEIGHT / 2 - 4;

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
  // If there are no images, don't render anything
  if (!images || images.length === 0) {
    return null;
  }

  // Limit to 5 images for the preview
  const displayImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;

  const handleImagePress = (index: number) => {
    // Navigate to the gallery page with the selected image index
    router.push({
      pathname: `/store/${storeId}/gallery`,
      params: { initialIndex: index },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Typography style={styles.title}>Gallery</Typography>
        {hasMoreImages && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Typography style={styles.seeAllText}>See all photos</Typography>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.galleryContainer}>
        {/* First large image */}
        <TouchableOpacity
          style={styles.largeImageContainer}
          onPress={() => handleImagePress(0)}
        >
          <Image
            source={{ uri: getImageUrl(displayImages[0]) }}
            style={styles.largeImage}
          />
        </TouchableOpacity>

        {/* Grid of smaller images */}
        <View style={styles.smallImagesContainer}>
          {displayImages.slice(1, 5).map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.smallImageContainer}
              onPress={() => handleImagePress(index + 1)}
            >
              <Image
                source={{ uri: getImageUrl(image) }}
                style={styles.smallImage}
              />
              {/* Show "See more" overlay on the last image if there are more images */}
              {hasMoreImages && index === 3 && (
                <View style={styles.seeMoreOverlay}>
                  <Typography style={styles.seeMoreText}>
                    +{images.length - 5}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: 14,
    color: "#8A3FFC",
  },
  galleryContainer: {
    flexDirection: "row",
    height: GALLERY_HEIGHT,
    paddingHorizontal: 16,
  },
  largeImageContainer: {
    flex: 1,
    marginRight: 4,
  },
  largeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  smallImagesContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallImageContainer: {
    width: GALLERY_ITEM_WIDTH / 2,
    height: GALLERY_ITEM_HEIGHT,
    margin: 2,
  },
  smallImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
    fontWeight: "bold",
  },
});

export default StoreGallery;
