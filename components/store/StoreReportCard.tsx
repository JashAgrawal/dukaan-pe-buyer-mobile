import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import { Store } from "@/types";

const StoreReportCard = ({ store }: { store: Store }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => console.log(`Report ${store.name}`)}
      >
        <Ionicons name="flag-outline" size={16} color="#FF3B30" />
        <Typography style={styles.reportButtonText}>
          Report this business
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  reportButtonText: {
    marginLeft: 6,
    color: "#FF3B30",
    fontFamily: "Jost-Medium",
    fontSize: 13,
  },
});

export default StoreReportCard;
