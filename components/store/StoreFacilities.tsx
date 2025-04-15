import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, Body1 } from "@/components/ui/Typography";
import { Colors } from "@/lib/constants/Colors";

interface StoreFacilitiesProps {
  facilities: string[];
}

const StoreFacilities: React.FC<StoreFacilitiesProps> = ({ facilities }) => {
  const [expanded, setExpanded] = useState(false);

  // If no facilities, don't render anything
  if (!facilities || facilities.length === 0) {
    return null;
  }

  // Display only 6 facilities when collapsed
  const displayedFacilities = expanded ? facilities : facilities.slice(0, 6);
  const hasMoreFacilities = facilities.length > 6;

  // Get icon for a facility, default to "check-circle" if not found
  const getIconForFacility = (facility: string) => {
    return "check-circle";
  };

  return (
    <View style={styles.container}>
      <Typography style={styles.title}>Facilities</Typography>

      <View style={styles.facilitiesGrid}>
        {displayedFacilities.map((facility, index) => (
          <View key={index} style={styles.facilityItem}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={"check-circle"} size={20} color="#FFFFFF" />
            </View>
            <Body1 style={styles.facilityText}>{facility}</Body1>
          </View>
        ))}
      </View>

      {hasMoreFacilities && (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Typography style={styles.seeMoreText}>
            {expanded ? "See less" : "See more"}
          </Typography>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 0.5,
  },
  title: {
    fontSize: 18,
    // fontFamily: "Jost-SemiBold",
    marginBottom: 12,
    color: "#000",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4, // Compensate for item margin
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: "#4CD964",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  facilityText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Jost-Regular",
    flex: 1,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 8,
  },
  seeMoreText: {
    color: Colors.light.tint,
    marginRight: 4,
    fontFamily: "Jost-Medium",
  },
});

export default StoreFacilities;
