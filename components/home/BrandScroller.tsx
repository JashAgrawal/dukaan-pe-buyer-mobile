import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Store } from "@/types/store";
import { getImageUrl } from "@/lib/helpers";

interface BrandScrollerProps {
  title: string;
  subtitle: string;
  brands?: Store[];
  isLoading?: boolean;
  error?: string | null;
  onSeeAllPress?: () => void;
}

const BrandScroller: React.FC<BrandScrollerProps> = ({
  title,
  subtitle,
  brands = [],
  isLoading = false,
  error = null,
  onSeeAllPress,
}) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const brandItemWidth = Math.min(140, screenWidth * 0.3);

  const handleBrandPress = (brandId: string) => {
    // Navigate to brand detail screen
    console.log(`Brand pressed: ${brandId}`);
    // navigation.navigate('BrandDetail', { brandId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A3FFC" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : brands.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No brands available</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand._id}
              style={[
                styles.brandItem,
                { width: brandItemWidth, height: brandItemWidth },
              ]}
              onPress={() => handleBrandPress(brand._id)}
            >
              <Image
                source={{ uri: getImageUrl(brand.logo || brand.coverImage) }}
                style={styles.brandLogo}
                // resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  brandItem: {
    backgroundColor: "#EEEEEE",
    borderRadius: 16,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  brandLogo: {
    width: "80%",
    height: "80%",
    objectFit: "cover",
    resizeMode: "cover",
  },
  loadingContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#E53935",
    textAlign: "center",
  },
  emptyContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#666",
  },
});

export default BrandScroller;
