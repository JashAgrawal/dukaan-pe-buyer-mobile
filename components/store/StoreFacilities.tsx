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

  // Map of facility names to icons
  const facilityIcons: Record<string, string> = {
    "Takeaway available": "takeout-dining",
    "Indoor seating": "chair",
    "LGBTQIA Friendly": "diversity-3",
    "Smoking area": "smoking-rooms",
    "Wifi": "wifi",
    "Romantic Dining": "favorite",
    "Parking": "local-parking",
    "Air Conditioning": "ac-unit",
    "Home Delivery": "delivery-dining",
    "Outdoor seating": "deck",
    "Wheelchair accessible": "accessible",
    "Pet friendly": "pets",
    "Restroom": "wc",
    "Vegan options": "eco",
    "Vegetarian friendly": "grass",
    "Live music": "music-note",
    "Happy hour": "local-bar",
    "Family friendly": "family-restroom",
    "Contactless payment": "contactless",
    "Reservations": "event-available",
  };

  // Get icon for a facility, default to "check-circle" if not found
  const getIconForFacility = (facility: string) => {
    return facilityIcons[facility] || "check-circle";
  };

  return (
    <View style={styles.container}>
      <Typography style={styles.title}>Facilities</Typography>
      
      <View style={styles.facilitiesGrid}>
        {displayedFacilities.map((facility, index) => (
          <View key={index} style={styles.facilityItem}>
            <MaterialIcons 
              name={getIconForFacility(facility)} 
              size={20} 
              color="#4CD964" 
              style={styles.facilityIcon} 
            />
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
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    fontFamily: "Jost-SemiBold",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  facilityIcon: {
    marginRight: 8,
  },
  facilityText: {
    fontSize: 14,
    color: "#333",
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
  },
});

export default StoreFacilities;
