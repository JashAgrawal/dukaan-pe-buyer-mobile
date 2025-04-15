import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useVerifyOtp, useResendOtp } from "@/lib/api/services/authService";
import { StatusBar } from "expo-status-bar";
import useAuth from "@/hooks/useAuth";
const CoinLeft = require("@/assets/images/coin-left.png");
const CoinRight = require("@/assets/images/coin-right.png");

// Number of OTP digits
const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { phoneNumber, requestId } = useLocalSearchParams<{
    phoneNumber: string;
    requestId: string;
  }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [name, setName] = useState(""); // For new users
  const inputRefs = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null)
  );
  const { login, user } = useAuth();

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  // Format phone number for display
  const displayPhone = phoneNumber || "";

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste of full OTP
      const pastedOtp = text.slice(0, OTP_LENGTH).split("");
      const newOtp = [...otp];

      pastedOtp.forEach((digit, i) => {
        if (i + index < OTP_LENGTH) {
          newOtp[i + index] = digit;
        }
      });

      setOtp(newOtp);

      // Focus last input or dismiss keyboard
      if (index + pastedOtp.length < OTP_LENGTH) {
        inputRefs.current[index + pastedOtp.length]?.focus();
      } else {
        Keyboard.dismiss();
      }
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (timeLeft > 0 || !phoneNumber || !requestId) return;

    try {
      const response = await resendOtpMutation.mutateAsync({
        mobileNumber: phoneNumber,
        requestId: requestId,
      });

      // Reset timer and update requestId
      setTimeLeft(60);
      router.setParams({ requestId: response.requestId });
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== OTP_LENGTH) {
      alert("Please enter the complete OTP");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        mobileNumber: phoneNumber || "",
        otp: otpString,
        requestId: requestId || "",
        name: name || "User", // Include name for new users
      });

      // Navigate to home screen on successful verification
      if (response.token) {
        login(response.token, response.data.user);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
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
        <Text style={styles.welcomeTitle}>Welcome Roshan</Text>
        <Text style={styles.welcomeSubtitle}>
          We are thrilled to have you here :)
        </Text>
      </View>

      {/* OTP section */}
      <View style={styles.otpContainer}>
        <Text style={styles.otpTitle}>ENTER OTP</Text>
        <Text style={styles.otpSubtitle}>
          We have sent an OTP on your number{" "}
          <Text style={styles.phoneText}>{displayPhone}</Text>{" "}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </Text>

        {/* OTP input fields */}
        <View style={styles.otpInputContainer}>
          {Array(OTP_LENGTH)
            .fill(0)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                selectTextOnFocus
              />
            ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={timeLeft > 0 || resendOtpMutation.isPending}
          >
            <Text
              style={[
                styles.resendText,
                (timeLeft > 0 || resendOtpMutation.isPending) &&
                  styles.resendDisabled,
              ]}
            >
              Didn't receive OTP? Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleVerifyOtp}
        disabled={verifyOtpMutation.isPending}
      >
        <Text style={styles.submitButtonText}>
          {verifyOtpMutation.isPending ? "Verifying..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Default font style to apply to all text components
const fontFamily = "Jost-Regular";
const fontFamilyMedium = "Jost-Medium";

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
    fontFamily: fontFamilyMedium,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  taglineContainer: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 24,
    fontFamily: fontFamilyMedium,
    color: "#EEFF41",
    lineHeight: 32,
  },
  coinLeft: {
    position: "absolute",
    left: 0,
    top: 340,
    width: 60,
    height: 60,
  },
  coinRight: {
    position: "absolute",
    right: 0,
    top: 340,
    width: 60,
    height: 60,
  },
  welcomeContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: fontFamilyMedium,
    color: "#000000",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666666",
    fontFamily,
  },
  otpContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  otpTitle: {
    fontSize: 16,
    fontFamily: fontFamilyMedium,
    color: "#000000",
    marginBottom: 5,
  },
  otpSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontFamily,
  },
  phoneText: {
    color: "#8A3FFC",
    fontFamily: fontFamilyMedium,
  },
  editButton: {
    fontSize: 14,
    fontFamily,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#8A3FFC",
    textAlign: "center",
    fontSize: 24,
    fontFamily: fontFamilyMedium,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  timer: {
    fontSize: 24,
    fontFamily: fontFamilyMedium,
    color: "#000000",
    marginBottom: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#8A3FFC",
    fontFamily: fontFamilyMedium,
  },
  resendDisabled: {
    color: "#BBBBBB",
  },
  submitButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 40,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: fontFamilyMedium,
    color: "#FFFFFF",
  },
});
