import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Typography, H3 } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { useStoreImageCollections, flattenStoreImageCollections } from "@/lib/api/hooks/useStoreImages";
import { getStoreById } from "@/lib/api/services/searchService";

const { width, height } = Dimensions.get("window");

export default function GalleryScreen() {
  const { id, initialIndex = "0" } = useLocalSearchParams<{ id: string; initialIndex: string }>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [store, setStore] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [tabImages, setTabImages] = useState<{ [key: string]: string[] }>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  
  // Fetch store image collections
  const { data: imageCollectionsData, isLoading: isLoadingCollections } = useStoreImageCollections(id as string);
  
  // Refs for FlatList
  const gridRef = useRef<FlatList>(null);
  const expandedRef = useRef<FlatList>(null);

  // Fetch store details
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        const storeData = await getStoreById(id as string);
        setStore(storeData);
        
        // Initialize with store's main images
        const initialImages = [
          ...(storeData.mainImage ? [storeData.mainImage] : []),
          ...(storeData.coverImage ? [storeData.coverImage] : []),
          ...(storeData.allImages || []),
        ];
        
        setAllImages(initialImages);
        setCurrentImages(initialImages);
        
        // Set up initial tab
        const initialTabs: { [key: string]: string[] } = {
          "All": initialImages,
          "Ambience": initialImages.filter((_, i) => i % 2 === 0), // Just for demo
          "Food": initialImages.filter((_, i) => i % 2 === 1), // Just for demo
        };
        
        setTabImages(initialTabs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching store details:", err);
        setLoading(false);
      }
    };

    if (id) {
      fetchStoreDetails();
    }
  }, [id]);

  // Process image collections when data is loaded
  useEffect(() => {
    if (imageCollectionsData) {
      const collections = flattenStoreImageCollections(imageCollectionsData);
      
      // Create tabs based on collection headings
      const newTabs: { [key: string]: string[] } = { ...tabImages };
      let newAllImages = [...allImages];
      
      collections.forEach(collection => {
        if (collection.heading && collection.images && collection.images.length > 0) {
          newTabs[collection.heading] = collection.images;
          newAllImages = [...newAllImages, ...collection.images];
        }
      });
      
      // Update all images without duplicates
      const uniqueImages = Array.from(new Set(newAllImages));
      setAllImages(uniqueImages);
      newTabs["All"] = uniqueImages;
      
      setTabImages(newTabs);
      setCurrentImages(newTabs[activeTab] || uniqueImages);
    }
  }, [imageCollectionsData]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentImages(tabImages[tab] || []);
    setExpandedImageIndex(null); // Close expanded view when changing tabs
  };

  // Handle image press to expand
  const handleImagePress = (index: number) => {
    setExpandedImageIndex(index);
    // Scroll to the selected image in expanded view
    setTimeout(() => {
      expandedRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  // Handle close expanded view
  const handleCloseExpanded = () => {
    setExpandedImageIndex(null);
  };

  // Render image item in grid
  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.imageItem}
      onPress={() => handleImagePress(index)}
    >
      <Image
        source={{ uri: getImageUrl(item) }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  // Render expanded image
  const renderExpandedImage = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.expandedImageContainer}>
      <Image
        source={{ uri: getImageUrl(item) }}
        style={styles.expandedImage}
        resizeMode="contain"
      />
    </View>
  );

  // Set initial expanded image if provided in params
  useEffect(() => {
    if (initialIndex && !loading && currentImages.length > 0) {
      const index = parseInt(initialIndex);
      if (index >= 0 && index < currentImages.length) {
        handleImagePress(index);
      }
    }
  }, [initialIndex, loading, currentImages]);

  if (loading || isLoadingCollections) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#8A3FFC" />
        <Typography style={{ marginTop: 16 }}>Loading gallery...</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={expandedImageIndex !== null ? "light" : "dark"} />

      {/* Header */}
      {expandedImageIndex === null ? (
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
      ) : (
        <View style={styles.expandedHeader}>
          <TouchableOpacity
            style={styles.expandedBackButton}
            onPress={handleCloseExpanded}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Typography style={styles.expandedCounter}>
            {expandedImageIndex + 1} / {currentImages.length}
          </Typography>
        </View>
      )}

      {/* Tabs */}
      {expandedImageIndex === null && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {Object.keys(tabImages).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
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
      {expandedImageIndex === null ? (
        <FlatList
          ref={gridRef}
          data={currentImages}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `image-${index}`}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          ref={expandedRef}
          data={currentImages}
          renderItem={renderExpandedImage}
          keyExtractor={(item, index) => `expanded-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={expandedImageIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.floor(e.nativeEvent.contentOffset.x / width);
            setExpandedImageIndex(newIndex);
          }}
        />
      )}
    </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  },
  activeTabText: {
    color: "white",
    fontWeight: "500",
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
  },
  image: {
    width: "100%",
    height: "100%",
  },
  expandedImageContainer: {
    width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  expandedImage: {
    width: width,
    height: height,
  },
  expandedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
  },
  expandedBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedCounter: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
