import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Typography, H3 } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import {
  useStoreImageCollections,
  flattenStoreImageCollections,
} from "@/lib/api/hooks/useStoreImages";
import { getStoreById } from "@/lib/api/services/searchService";
import BottomSheetImageViewer from "@/components/ui/BottomSheetImageViewer";

export default function GalleryScreen() {
  const { id, initialIndex = "0" } = useLocalSearchParams<{
    id: string;
    initialIndex: string;
  }>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [storeName, setStoreName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [tabImages, setTabImages] = useState<{ [key: string]: string[] }>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Fetch store image collections
  const { data: imageCollectionsData, isLoading: isLoadingCollections } =
    useStoreImageCollections(id as string);

  // Fetch store details
  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const storeData = await getStoreById(id as string);
        setStoreName(storeData?.name || "Store");

        // Initialize with store's main images
        const initialImages = [
          ...(storeData.mainImage ? [storeData.mainImage] : []),
          ...(storeData.coverImage ? [storeData.coverImage] : []),
          ...(storeData.allImages || []),
        ].filter((img) => img && typeof img === "string"); // Filter out invalid images

        if (initialImages.length === 0) {
          setError("No images available for this store");
        }

        setAllImages(initialImages);
        setCurrentImages(initialImages);

        // Set up initial tab
        const initialTabs: { [key: string]: string[] } = {
          All: initialImages,
        };

        setTabImages(initialTabs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching store details:", err);
        setError("Failed to load store details");
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  // Process image collections when data is loaded
  useEffect(() => {
    if (!imageCollectionsData) return;

    try {
      const collections = flattenStoreImageCollections(imageCollectionsData);
      if (!collections || collections.length === 0) return;

      // Create tabs based on collection headings
      const newTabs: { [key: string]: string[] } = { All: [...allImages] };
      let newAllImages = [...allImages];

      collections.forEach((collection) => {
        if (
          collection.heading &&
          collection.images &&
          collection.images.length > 0
        ) {
          // Filter out invalid images
          const validImages = collection.images.filter(
            (img) => img && typeof img === "string"
          );
          if (validImages.length > 0) {
            newTabs[collection.heading] = validImages;
            newAllImages = [...newAllImages, ...validImages];
          }
        }
      });

      // Update all images without duplicates
      const uniqueImages = Array.from(new Set(newAllImages));
      setAllImages(uniqueImages);
      newTabs["All"] = uniqueImages;

      setTabImages(newTabs);
      setCurrentImages(newTabs[activeTab] || uniqueImages);
    } catch (err) {
      console.error("Error processing image collections:", err);
    }
  }, [imageCollectionsData, allImages, activeTab]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentImages(tabImages[tab] || []);
  };

  // Handle image press to view in full screen
  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  // Handle close image viewer
  const handleCloseViewer = () => {
    setShowImageViewer(false);
  };

  // Handle image load states
  const handleImageLoadStart = (index: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoadEnd = (index: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  // Set initial selected image if provided in params
  useEffect(() => {
    if (initialIndex && !loading && currentImages.length > 0) {
      const index = parseInt(initialIndex);
      if (index >= 0 && index < currentImages.length) {
        setSelectedImageIndex(index);
        setShowImageViewer(true);
      }
    }
  }, [initialIndex, loading, currentImages]);

  // Render image item in grid
  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.imageItem}
      onPress={() => handleImagePress(index)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getImageUrl(item) }}
        style={styles.image}
        resizeMode="cover"
        onLoadStart={() => handleImageLoadStart(index)}
        onLoadEnd={() => handleImageLoadEnd(index)}
      />
      {imageLoadingStates[index] && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#8A3FFC" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Loading state
  if (loading || isLoadingCollections) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#8A3FFC" />
        <Typography style={{ marginTop: 16 }}>Loading gallery...</Typography>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || currentImages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <H3>Gallery</H3>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="images-outline" size={64} color="#CCCCCC" />
          <Typography style={styles.errorText}>
            {error || "No images available"}
          </Typography>
          <TouchableOpacity
            style={styles.backToStoreButton}
            onPress={() => router.back()}
          >
            <Typography style={styles.backToStoreText}>
              Back to {storeName}
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <H3>Gallery</H3>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      {Object.keys(tabImages).length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {Object.keys(tabImages).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabChange(tab)}
            >
              <Typography
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Image Grid */}
      <FlatList
        data={currentImages}
        renderItem={renderImageItem}
        keyExtractor={(_, index) => `image-${index}`}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Sheet Image Viewer */}
      <BottomSheetImageViewer
        images={currentImages}
        initialIndex={selectedImageIndex}
        isVisible={showImageViewer}
        onClose={handleCloseViewer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontFamily: "Jost-Medium",
  },
  backToStoreButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
  },
  backToStoreText: {
    color: "white",
    fontFamily: "Jost-Medium",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    backgroundColor: "white",
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: "#8A3FFC",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Jost-Medium",
  },
  activeTabText: {
    color: "white",
  },
  gridContainer: {
    padding: 4,
  },
  imageItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.7)",
  },
});
