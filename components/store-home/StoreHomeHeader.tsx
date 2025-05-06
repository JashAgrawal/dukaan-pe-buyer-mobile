import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import SearchBar from "@/components/search/SearchBar";

interface StoreHomeHeaderProps {
  storeName: string;
  storeLocation: string;
  logoUrl?: string;
  tableNumber?: number | null;
  storeId: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onHomePress?: () => void;
}

export default function StoreHomeHeader({
  storeName,
  storeLocation,
  logoUrl,
  tableNumber,
  storeId,
  onBackPress,
  onSearchPress,
  onHomePress,
}: StoreHomeHeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleSearchPress = () => {
    router.push(`/store-home/${storeId}/search`);
  };

  return (
    <View style={styles.container}>
      {/* Top row with back button, store info and table number */}
      <View style={styles.headerContent}>
        <View style={styles.storeInfo}>
          {logoUrl ? (
            <Image
              source={{
                uri: logoUrl.startsWith("http")
                  ? logoUrl
                  : getImageUrl(logoUrl),
              }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.placeholderLogo}>
              <Typography style={styles.placeholderText}>
                {storeName.charAt(0)}
              </Typography>
            </View>
          )}

          <View style={styles.textContainer}>
            <Typography style={styles.storeLocation} numberOfLines={1}>
              You are Visiting
            </Typography>
            <Typography style={styles.storeName} numberOfLines={1}>
              {storeName}
            </Typography>
            <Typography style={styles.storeLocation} numberOfLines={1}>
              {storeLocation}
            </Typography>
          </View>
        </View>

        <View style={styles.rightContainer}>
          {tableNumber !== undefined && tableNumber !== null && (
            <View style={styles.tableContainer}>
              <Typography style={styles.tableLabel}>Table</Typography>
              <Typography style={styles.tableNumber}>{tableNumber}</Typography>
            </View>
          )}

          <TouchableOpacity
            style={styles.homeButton}
            onPress={onHomePress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="home" size={20} color="#8A3FFC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={`Search in ${storeName}...`}
          onPress={handleSearchPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    marginTop: 4,
    marginBottom: 4,
    height : 40,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  storeName: {
    maxWidth: "80%",
    fontSize: 14,
    // fontWeight: "bold",
    fontFamily: "Jost-Medium",
    lineHeight: 20,
  },
  storeLocation: {
    fontSize: 11,
    lineHeight: 12,
    color: "#8E8E93",
    // marginTop: 2,
  },
  tableContainer: {
    width: "auto",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 12,
  },
  tableLabel: {
    fontSize: 16,
    color: "#8E8E93",
  },
  tableNumber: {
    fontSize: 16,
    marginLeft: 6,
    fontFamily: "Jost-Medium",
    color: "#000000",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
