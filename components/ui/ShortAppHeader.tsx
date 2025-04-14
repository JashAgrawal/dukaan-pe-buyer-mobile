import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "@/components/ui/Typography";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ShortAppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export default function ShortAppHeader({
  title,
  showBackButton = true,
  onBackPress,
  onSearchPress,
  onProfilePress,
}: ShortAppHeaderProps) {
  const insets = useSafeAreaInsets();

  // Default handlers if not provided
  const handleBackPress = onBackPress || (() => router.back());
  const handleSearchPress = onSearchPress || (() => router.push("/search"));
  const handleProfilePress = onProfilePress || (() => router.push("/profile"));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <MaterialIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        ) : null}

        {title && (
          <View
            style={
              showBackButton
                ? styles.titleContainer
                : styles.noBacktitleContainer
            }
          >
            <Typography style={styles.title}>{title}</Typography>
          </View>
        )}

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
          >
            <MaterialIcons name="search" size={24} color="#000" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  noBacktitleContainer: {
    flex: 1,
    marginLeft: 16,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
});
