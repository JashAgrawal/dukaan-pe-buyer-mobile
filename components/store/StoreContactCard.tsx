import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Body1 } from "@/components/ui/Typography";
import { Store } from "@/types";

const StoreContactCard = ({ store }: { store: Store }) => {
  const phoneNumber =
    store.business_phone_number || store.contactPhone || "+1 (123) 456-7890";
  const email =
    store.business_email ||
    store.contactEmail ||
    `info@${store.name.toLowerCase().replace(/\s+/g, "")}.com`;

  return (
    <View style={styles.card}>
      <View style={styles.cardSection}>
        <Typography style={styles.cardTitle}>Contact</Typography>

        <View style={styles.contactRow}>
          <Ionicons
            name="call-outline"
            size={16}
            color="#555"
            style={styles.contactIcon}
          />
          <Body1 style={styles.cardContent}>
            <Typography style={styles.contactLabel}>Phone: </Typography>
            {phoneNumber}
          </Body1>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
          >
            <Ionicons name="call" size={16} color="#8A3FFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.contactRow}>
          <Ionicons
            name="mail-outline"
            size={16}
            color="#555"
            style={styles.contactIcon}
          />
          <Body1 style={styles.cardContent}>
            <Typography style={styles.contactLabel}>Email: </Typography>
            {email}
          </Body1>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          >
            <Ionicons name="mail" size={16} color="#8A3FFC" />
          </TouchableOpacity>
        </View>

        {(store.address || store.full_address) && (
          <View style={[styles.contactRow, styles.lastRow]}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#555"
              style={styles.contactIcon}
            />
            <Body1 style={styles.cardContent}>
              <Typography style={styles.contactLabel}>Address: </Typography>
              {store.full_address ||
                (store.address
                  ? `${store.address.street || ""}, ${
                      store.address.city || ""
                    }, ${store.address.state || ""} ${
                      store.address.pincode || ""
                    }`
                  : store.city
                  ? `${store.city}, ${store.state || ""}`
                  : "")}
            </Body1>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => {
                const address =
                  store.full_address ||
                  (store.address
                    ? `${store.address.street || ""}, ${
                        store.address.city || ""
                      }, ${store.address.state || ""} ${
                        store.address.pincode || ""
                      }`
                    : store.city
                    ? `${store.city}, ${store.state || ""}`
                    : "");
                const encodedAddress = encodeURIComponent(address);
                Linking.openURL(
                  `https://maps.google.com/maps?q=${encodedAddress}`
                );
              }}
            >
              <Ionicons name="location" size={16} color="#8A3FFC" />
            </TouchableOpacity>
          </View>
        )}
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
    // fontFamily: "Jost-SemiBold",
    color: "#000",
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 20,
    flex: 1,
  },
  contactLabel: {
    fontFamily: "Jost-Medium",
    color: "#555",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lastRow: {
    marginBottom: 0,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default StoreContactCard;
