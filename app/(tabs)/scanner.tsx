import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper
        headerComponent={
          <ShortAppHeader title="Scanner" showBackButton={false} />
        }
        isShortHeader={true}
      >
        <View style={styles.content}>
          <H1>Scanner</H1>
          <Body1 style={styles.description}>
            Scan QR codes to quickly find products.
          </Body1>
        </View>
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingTop: 32,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    color: "#666666",
  },
});
