import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

export default function SearchBar({
  placeholder = "Search for stores, products & more",
  onPress,
}: SearchBarProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/search");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="search" size={18} color="#999" style={styles.icon} />
      <Text style={styles.placeholder}>{placeholder}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Jost-Regular",
  },
});
