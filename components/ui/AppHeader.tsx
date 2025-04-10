import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocation } from "@/hooks/useLocation";
import { router } from "expo-router";
import SearchBar from "@/components/search/SearchBar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AppHeaderProps {
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;
}

export default function AppHeader({
  onLocationPress,
  onNotificationPress,
  onProfilePress,
  onSearchPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { city, pincode, isLocationSet } = useLocation();

  // Default handlers if not provided
  const handleLocationPress =
    onLocationPress || (() => router.push("/location/search" as any));
  const handleNotificationPress = onNotificationPress || (() => {});
  const handleProfilePress = onProfilePress || (() => router.push("/profile"));
  const handleSearchPress = onSearchPress || (() => router.push("/search"));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Location Section */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
        >
          <MaterialIcons name="location-on" size={20} color="#8A3FFC" />
          <View style={styles.locationTextContainer}>
            <Typography style={styles.locationLabel}>
              {isLocationSet ? "Delivering to" : "Set your location"}
            </Typography>
            {isLocationSet && city && (
              <Typography style={styles.locationText}>
                {city}
                {pincode ? ` - ${pincode}` : ""}
              </Typography>
            )}
          </View>
          <MaterialIcons name="change-circle" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationPress}
          >
            <MaterialIcons name="notifications-none" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleProfilePress}
          >
            <View style={styles.profileIcon}>
              <MaterialIcons name="person" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar onPress={handleSearchPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationTextContainer: {
    marginHorizontal: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    marginTop: 12,
  },
});
