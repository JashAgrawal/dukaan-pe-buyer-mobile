import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "expo-status-bar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Typography, H1 } from "@/components/ui/Typography";
import AppHeader from "@/components/ui/AppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper headerComponent={<AppHeader />}>
        {/* Header */}
        <View style={styles.header}>
          <H1 style={styles.headerTitle}>Profile</H1>
        </View>
        {/* User info section */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Typography style={styles.avatarText}>
              {user?.name?.[0] || "U"}
            </Typography>
          </View>
          <View style={styles.userDetails}>
            <Typography style={styles.userName}>
              {user?.name || "User"}
            </Typography>
            <Typography style={styles.userPhone}>
              {user?.mobileNumber || ""}
            </Typography>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="person.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Edit Profile</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="location.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Addresses</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="bag.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Orders</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="heart.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Wishlist</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="bell.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Notifications</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Account section */}
        <View style={styles.sectionContainer}>
          <Typography style={styles.sectionTitle}>Account</Typography>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="lock.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>
              Privacy & Security
            </Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol
              name="questionmark.circle.fill"
              size={24}
              color="#8A3FFC"
            />
            <Typography style={styles.optionText}>Help & Support</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="doc.text.fill" size={24} color="#8A3FFC" />
            <Typography style={styles.optionText}>Terms & Policies</Typography>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Typography style={styles.logoutButtonText}>Logout</Typography>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Typography style={styles.versionText}>Version 1.0.0</Typography>
        </View>
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 32,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#666666",
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 5,
    marginHorizontal: 15,
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 5,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: "#999999",
  },
});
