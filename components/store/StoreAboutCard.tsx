import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Body1 } from "@/components/ui/Typography";
import { Store } from "@/types";

const StoreAboutCard = ({ store }: { store: Store }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardSection}>
        <Typography style={styles.cardTitle}>About this store</Typography>
        <Body1 style={styles.cardContent}>
          {store.description ||
            `${store.name} is one of the leading businesses in the Fast Food Delivery Services lorem ipsum`}
        </Body1>
      </View>

      <View style={styles.dividerLine} />

      <View style={styles.cardSection}>
        <Typography style={styles.cardTitle}>Address</Typography>
        <Body1 style={styles.cardContent}>
          {store.full_address
            ? store.full_address
            : store.address?.street
            ? `${store.address.street || ""}, ${store.address.city || ""}, ${
                store.address.state || ""
              } ${store.address.pincode || ""}`
            : store.city
            ? `${store.city}, ${store.state || ""} ${store.country || ""}`
            : "2 Floor, Khan House, Hill Rd, above McDonald's, Bandra West, Mumbai, Maharashtra 400050"}
        </Body1>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Get the address for directions
              const address =
                store.full_address ||
                (store.address?.street
                  ? `${store.address.street || ""}, ${
                      store.address.city || ""
                    }, ${store.address.state || ""} ${
                      store.address.pincode || ""
                    }`
                  : store.city
                  ? `${store.city}, ${store.state || ""} ${store.country || ""}`
                  : "2 Floor, Khan House, Hill Rd, above McDonald's, Bandra West, Mumbai, Maharashtra 400050");

              // Open in maps app
              const encodedAddress = encodeURIComponent(address);
              const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
              Linking.openURL(mapsUrl);
            }}
          >
            <Ionicons name="location-outline" size={16} color="#8A3FFC" />
            <Typography style={styles.actionButtonText}>
              Get directions
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Get the phone number
              const phoneNumber =
                store.business_phone_number ||
                store.contactPhone ||
                "+1 (123) 456-7890";

              // Open phone app
              Linking.openURL(`tel:${phoneNumber}`);
            }}
          >
            <Ionicons name="call-outline" size={16} color="#8A3FFC" />
            <Typography style={styles.actionButtonText}>Call us</Typography>
          </TouchableOpacity>
        </View>
      </View>
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
  cardSection: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Jost-SemiBold",
    color: "#000",
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 20,
    marginBottom: 6,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#FFFFFF",
  },
  actionButtonText: {
    marginLeft: 6,
    color: "#8A3FFC",
    fontFamily: "Jost-Medium",
    fontSize: 13,
  },
});

export default StoreAboutCard;
