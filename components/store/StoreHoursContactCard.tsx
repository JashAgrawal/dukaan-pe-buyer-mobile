import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography, Body1 } from "@/components/ui/Typography";
import { Store } from "@/types";

const StoreHoursContactCard = ({ store }: { store: Store }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardSection}>
        <View style={styles.cardTitleContainer}>
          <Typography style={styles.cardTitle}>Hours</Typography>
          {store.isOpen !== undefined && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: store.isOpen ? "#4CD964" : "#FF3B30" },
              ]}
            >
              <Typography style={styles.statusText}>
                {store.isOpen ? "Open Now" : "Closed"}
              </Typography>
            </View>
          )}
        </View>
        <Body1 style={styles.cardContent}>
          {store.is_24_7
            ? "Open 24/7"
            : store.opensAt && store.closesAt
            ? `Open: ${store.opensAt} - ${store.closesAt}`
            : `Monday - Friday: 9:00 AM - 9:00 PM\nSaturday - Sunday: 10:00 AM - 8:00 PM`}
        </Body1>
      </View>

      <View style={styles.dividerLine} />

      <View style={styles.cardSection}>
        <Typography style={styles.cardTitle}>Contact</Typography>
        <Body1 style={styles.cardContent}>
          <Typography style={styles.contactLabel}>Phone: </Typography>
          {store.business_phone_number ||
            store.contactPhone ||
            "+1 (123) 456-7890"}
        </Body1>
        <Body1 style={styles.cardContent}>
          <Typography style={styles.contactLabel}>Email: </Typography>
          {store.business_email ||
            store.contactEmail ||
            `info@${store.name.toLowerCase().replace(/\\s+/g, "")}.com`}
        </Body1>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
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
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
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
  contactLabel: {
    fontFamily: "Jost-Medium",
    color: "#555",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Jost-Medium",
    color: "#FFFFFF",
  },
});

export default StoreHoursContactCard;
