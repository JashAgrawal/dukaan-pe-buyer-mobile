import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";

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
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
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
    setCurrentIndex(index);
    setShowImageViewer(true);
  };

  const handleCloseViewer = () => {
    setShowImageViewer(false);
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

  const { width, height } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Render each image item in the modal
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    // Process the image URL - handle both full URLs and relative paths
    let imageUrl = item;

    // If it's not already a full URL, use the helper to get the full URL
    if (!item.startsWith("http")) {
      imageUrl = getImageUrl(item);
    }

    return (
      <View style={{ width, height: height * 0.8, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width, height: height * 0.7 }}
          resizeMode="contain"
          onLoadStart={() => handleImageLoadStart(index)}
          onLoadEnd={() => handleImageLoadEnd(index)}
        />
        {imageLoadingStates[index] && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>
    );
  };

  // Handle scroll end to update current index
  const handleScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex >= 0 && newIndex < validImages.length) {
      setCurrentIndex(newIndex);
    }
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
      setCurrentIndex(newIndex);
    }
  };

  // Navigate to next image
  const goToNext = () => {
    if (currentIndex < validImages.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
      setCurrentIndex(newIndex);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageViewer}
        onRequestClose={handleCloseViewer}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />

          {/* Header */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12
          }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(50, 50, 50, 0.5)",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={handleCloseViewer}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Typography style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Jost-Medium" }}>
              {currentIndex + 1} / {validImages.length}
            </Typography>
            <View style={{ width: 40 }} />
          </View>

          {/* Image Gallery */}
          <FlatList
            ref={flatListRef}
            data={validImages}
            renderItem={renderItem}
            keyExtractor={(_, index) => `image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex !== null ? selectedImageIndex : 0}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollToIndexFailed={(info) => {
              // Handle scroll to index failure
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              });
            }}
          />

          {/* Navigation Buttons */}
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            pointerEvents: "box-none"
          }}>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 16,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(50, 50, 50, 0.5)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onPress={goToPrevious}
              >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {currentIndex < validImages.length - 1 && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 16,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(50, 50, 50, 0.5)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onPress={goToNext}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
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

});

export default StoreGallery;
