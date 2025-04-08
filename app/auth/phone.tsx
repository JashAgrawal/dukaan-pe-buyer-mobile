import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { useRequestOtp } from "@/lib/api/services/authService";
import { StatusBar } from "expo-status-bar";
const CoinLeft = require("@/assets/images/coin-left.png");
const CoinRight = require("@/assets/images/coin-right.png");

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const requestOtpMutation = useRequestOtp();

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      // Show error for invalid phone number
      alert("Please enter a valid phone number");
      return;
    }

    try {
      // Format phone number with country code if not already present
      const formattedNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      // Request OTP
      const response = await requestOtpMutation.mutateAsync({
        mobileNumber: formattedNumber,
      });

      // Navigate to OTP screen with necessary data
      router.push({
        pathname: "/auth/otp",
        params: {
          phoneNumber: formattedNumber,
          requestId: response.requestId,
        },
      });
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header with gradient background */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DukaanPe</Text>
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>PEOPLE</Text>
          <Text style={styles.tagline}>POWERED</Text>
          <Text style={styles.tagline}>EXPERIENCES</Text>
        </View>
      </View>

      {/* Coin decorations */}
      <Image source={CoinLeft} style={styles.coinLeft} />
      <Image source={CoinRight} style={styles.coinRight} />

      {/* Welcome section */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome To DukaanPe</Text>
        <Text style={styles.welcomeSubtitle}>
          where Discovery meets friends
        </Text>
      </View>

      {/* Phone input section */}
      <View style={styles.inputContainer}>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter Phone number"
            placeholderTextColor="#BBBBBB"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
        </View>
        <Text style={styles.infoText}>
          We'll send you a text verification code
        </Text>
      </View>

      {/* Continue button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        disabled={requestOtpMutation.isPending}
      >
        <Text style={styles.continueButtonText}>
          {requestOtpMutation.isPending ? "Sending..." : "Continue"}
        </Text>
      </TouchableOpacity>

      {/* Terms and conditions */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing you agree to our{" "}
          <Text
            style={styles.termsLink}
            onPress={() => Linking.openURL("https://example.com/terms")}
          >
            Terms of services
          </Text>
          {" & "}
          <Text
            style={styles.termsLink}
            onPress={() => Linking.openURL("https://example.com/privacy")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

// Default font style to apply to all text components
const fontFamily = "Jost";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 300,
    backgroundColor: "#C8A2FF",
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  taglineContainer: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EEFF41",
    lineHeight: 32,
  },
  coinLeft: {
    position: "absolute",
    left: 0,
    top: 350,
    width: 40,
    height: 60,
  },
  coinRight: {
    position: "absolute",
    right: 0,
    top: 320,
    width: 40,
    height: 60,
  },
  welcomeContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666666",
    fontFamily,
  },
  inputContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 56,
  },
  countryCode: {
    fontSize: 16,
    color: "#000000",
    marginRight: 10,
    fontFamily,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontFamily,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 10,
    fontFamily,
  },
  continueButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 40,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily,
  },
  termsContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  termsText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  termsLink: {
    color: "#8A3FFC",
    textDecorationLine: "underline",
  },
});
