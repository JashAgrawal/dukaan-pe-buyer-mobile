import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const { width, height } = Dimensions.get("window");

interface BottomSheetImageViewerProps {
  images: string[];
  initialIndex?: number;
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetImageViewer: React.FC<BottomSheetImageViewerProps> = ({
  images,
  initialIndex = 0,
  isVisible,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Define snap points
  const snapPoints = useMemo(() => ["85%"], []);

  // Ensure images array is valid
  const validImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["https://picsum.photos/800/1200"]; // Fallback image

  // Open/close the sheet based on isVisible prop
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  // Handle image load start
  const handleLoadStart = (index: number) => {
    setLoading((prev) => ({ ...prev, [index]: true }));
  };

  // Handle image load end
  const handleLoadEnd = (index: number) => {
    setLoading((prev) => ({ ...prev, [index]: false }));
  };

  // Render each image item
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    // Process the image URL - handle both full URLs and relative paths
    let imageUrl = item;

    // If it's not already a full URL, use the helper to get the full URL
    if (!item.startsWith("http")) {
      imageUrl = getImageUrl(item);
    }

    return (
      <View style={styles.slide}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => handleLoadStart(index)}
          onLoadEnd={() => handleLoadEnd(index)}
        />
        {loading[index] && (
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
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Typography style={styles.counter}>
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
            initialScrollIndex={initialIndex}
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
          <View style={styles.navigationContainer}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {currentIndex < validImages.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={goToNext}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  sheetBackground: {
    backgroundColor: "#000000",
  },
  handleIndicator: {
    backgroundColor: "#FFFFFF",
    width: 40,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(50, 50, 50, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Jost-Medium",
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height * 0.6,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  navButton: {
    position: "absolute",
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(50, 50, 50, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonRight: {
    left: undefined,
    right: 16,
  },
});

export default BottomSheetImageViewer;
