import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Typography, H1, Body1 } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera, CameraView, BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import { useActiveStoreStore } from "@/stores/activeStoreStore";

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    const { data } = scanningResult;
    setScanned(true);
    setScanning(false);

    try {
      // Check if the QR code contains a store ID
      if (data.includes("store/")) {
        // Extract the store ID from the QR code data
        const storeId = data.split("store/")[1];
        if (storeId) {
          // Navigate to the store profile page
          router.navigate(`/store/${storeId}`);
          return;
        }
      }

      // Check if the QR code contains a store-home ID
      if (data.includes("store-home/")) {
        // Extract the store ID from the QR code data
        const storeId = data.split("store-home/")[1];
        if (storeId) {
          // Set active store and navigate to store-home
          useActiveStoreStore.getState().visitStore(storeId);
          return;
        }
      }

      // If the QR code doesn't contain a valid store ID
      Alert.alert(
        "Invalid QR Code",
        "This QR code doesn't contain a valid store link.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert(
        "Error",
        "There was an error processing the QR code. Please try again.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ShortAppHeader title="Scanner" showBackButton={false} />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#8A3FFC" />
          <Typography style={{ marginTop: 16 }}>
            Requesting camera permission...
          </Typography>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <ShortAppHeader title="Scanner" showBackButton={false} />
        <View style={styles.content}>
          <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
          <H1 style={{ marginTop: 16 }}>No Camera Access</H1>
          <Body1 style={styles.description}>
            Please enable camera access in your device settings to scan QR
            codes.
          </Body1>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ShortAppHeader title="Scanner" showBackButton={false} />

      {scanning ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "code128",
                "code39",
                "code93",
                "ean13",
                "ean8",
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.scannerFrame} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={stopScanning}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Typography style={styles.scannerText}>
            Position the QR code within the frame
          </Typography>
        </View>
      ) : (
        <View style={styles.content}>
          <MaterialIcons name="qr-code-scanner" size={100} color="#8A3FFC" />
          <H1 style={{ marginTop: 16 }}>QR Code Scanner</H1>
          <Body1 style={styles.description}>
            Scan QR codes to quickly access store profiles or visit store apps.
          </Body1>
          <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
            <Typography style={styles.scanButtonText}>
              Start Scanning
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
    color: "#666666",
  },
  scanButton: {
    backgroundColor: "#8A3FFC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  scannerText: {
    position: "absolute",
    bottom: 100,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
