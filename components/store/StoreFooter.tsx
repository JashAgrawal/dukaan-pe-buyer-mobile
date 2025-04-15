import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";

interface StoreFooterProps {
  storeId: string;
  storeName: string;
  termsAndConditions?: string;
  returnPolicy?: string;
}

const StoreFooter: React.FC<StoreFooterProps> = ({
  storeId,
  storeName,
  termsAndConditions,
  returnPolicy,
}) => {
  const handleTermsPress = () => {
    if (termsAndConditions) {
      Alert.alert(
        "Terms & Conditions",
        termsAndConditions,
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert(
        "Terms & Conditions",
        `Standard terms and conditions apply for ${storeName}.`,
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleReturnPolicyPress = () => {
    if (returnPolicy) {
      Alert.alert(
        "Return & Refund Policy",
        returnPolicy,
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert(
        "Return & Refund Policy",
        `Standard return and refund policies apply for ${storeName}.`,
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleReportPress = () => {
    Alert.alert(
      "Report this Business",
      "Are you sure you want to report this business?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Report Submitted",
              "Our customer support agent will resolve your concern as soon as possible",
              [{ text: "OK", style: "default" }]
            );
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.footerItem} onPress={handleTermsPress}>
        <Typography style={styles.footerItemText}>Terms & conditions</Typography>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
      
      <View style={styles.divider} />
      
      <TouchableOpacity style={styles.footerItem} onPress={handleReturnPolicyPress}>
        <Typography style={styles.footerItemText}>Return & Refund Policy</Typography>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
      
      <View style={styles.divider} />
      
      <TouchableOpacity style={styles.footerItem} onPress={handleReportPress}>
        <View>
          <Typography style={styles.footerItemText}>Report this Business</Typography>
          <Typography style={styles.footerItemSubtext}>
            Our customer support agent will resolve your concern as soon as possible
          </Typography>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  footerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  footerItemText: {
    fontSize: 16,
    color: "#333",
  },
  footerItemSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
});

export default StoreFooter;
