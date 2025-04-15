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
        {/* Grid of smaller images */}
        <View style={styles.smallImagesContainer}>
          {displayImages.slice(0, 4).map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.smallImageContainer}
              onPress={() => handleImagePress(index + 1)}
              activeOpacity={0.9}
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
    width: "100%",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-SemiBold",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
  },
  galleryContainer: {
    flexDirection: "row",
    height: GALLERY_HEIGHT,
  },
  largeImageContainer: {
    flex: 1,
    marginRight: 8,
  },
  smallImagesContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallImageContainer: {
    width: "28%",
    height: "auto",
    margin: 2,
  },
  smallImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  seeMoreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  seeMoreText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
});

export default StoreGallery;
