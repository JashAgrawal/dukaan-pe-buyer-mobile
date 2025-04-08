import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "expo-status-bar";
import { IconSymbol } from "@/components/ui/IconSymbol";

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
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User info section */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.[0] || "U"}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userPhone}>{user?.mobileNumber || ""}</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="person.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Edit Profile</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="location.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Addresses</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="bag.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Orders</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="heart.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Wishlist</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="bell.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Notifications</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Account section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="lock.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Privacy & Security</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol
              name="questionmark.circle.fill"
              size={24}
              color="#8A3FFC"
            />
            <Text style={styles.optionText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <IconSymbol name="doc.text.fill" size={24} color="#8A3FFC" />
            <Text style={styles.optionText}>Terms & Policies</Text>
            <IconSymbol name="chevron.right" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#8A3FFC",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
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
