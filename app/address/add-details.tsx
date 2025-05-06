import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { useCreateAddress } from "@/lib/api/services/addressService";
import { AddressCreateRequest } from "@/types/address";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS, SPACING, BORDER_RADIUS, INPUT_STYLES } from "@/lib/constants/Styles";

export default function AddAddressDetailsScreen() {
  const params = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    fullAddress: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }>();

  // State for form fields
  const [houseDetails, setHouseDetails] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [directionToReach, setDirectionToReach] = useState("");
  const [addressType, setAddressType] = useState<"home" | "work" | "other">("home");
  const [isDefault, setIsDefault] = useState(true);

  // Create address mutation
  const createAddressMutation = useCreateAddress();

  // Handle save address
  const handleSaveAddress = async () => {
    if (!houseDetails || !streetAddress) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const latitude = parseFloat(params.latitude || "0");
      const longitude = parseFloat(params.longitude || "0");

      const addressData: AddressCreateRequest = {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        coordinates: [longitude, latitude],
        country: params.country || "",
        state: params.state || "",
        city: params.city || "",
        pincode: params.pincode || "",
        houseDetails,
        streetAddress,
        directionToReach: directionToReach || undefined,
        googleFetchedAddress: params.fullAddress,
        type: addressType,
        isDefault,
      };

      await createAddressMutation.mutateAsync(addressData);
      
      // Navigate to addresses screen
      router.replace("/address");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="dark" />
      
      <ShortAppHeader 
        title="Add address details" 
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location preview */}
        <View style={styles.locationPreview}>
          <MaterialIcons name="location-on" size={24} color="#8A3FFC" />
          <View style={styles.locationTextContainer}>
            <Typography style={styles.locationText} numberOfLines={2}>
              {params.fullAddress}
            </Typography>
          </View>
        </View>
        
        {/* Form fields */}
        <View style={styles.formContainer}>
          {/* House/Flat/Floor No. */}
          <View style={styles.inputContainer}>
            <Typography style={styles.inputLabel}>House/ Flat/ Floor No.</Typography>
            <TextInput
              style={styles.input}
              value={houseDetails}
              onChangeText={setHouseDetails}
              placeholder="e.g. Flat 101, Building A"
              placeholderTextColor={COLORS.TEXT_LIGHTER}
            />
          </View>
          
          {/* Apartment/Road/Area */}
          <View style={styles.inputContainer}>
            <Typography style={styles.inputLabel}>Apartment/ Road/ Area</Typography>
            <TextInput
              style={styles.input}
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="e.g. Juhu Lane, Yadav Nagar"
              placeholderTextColor={COLORS.TEXT_LIGHTER}
            />
          </View>
          
          {/* Direction to reach (optional) */}
          <View style={styles.inputContainer}>
            <Typography style={styles.inputLabel}>Direction to reach (optional)</Typography>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={directionToReach}
              onChangeText={setDirectionToReach}
              placeholder="e.g. Near the park, 2nd floor"
              placeholderTextColor={COLORS.TEXT_LIGHTER}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Typography style={styles.charCount}>{directionToReach.length}/200</Typography>
          </View>
          
          {/* Save as */}
          <View style={styles.saveAsContainer}>
            <Typography style={styles.saveAsLabel}>Save as</Typography>
            <View style={styles.addressTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === "home" && styles.selectedAddressType,
                ]}
                onPress={() => setAddressType("home")}
              >
                <MaterialIcons
                  name="home"
                  size={20}
                  color={addressType === "home" ? COLORS.WHITE : COLORS.PRIMARY}
                />
                <Typography
                  style={[
                    styles.addressTypeText,
                    addressType === "home" && styles.selectedAddressTypeText,
                  ]}
                >
                  Home
                </Typography>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === "work" && styles.selectedAddressType,
                ]}
                onPress={() => setAddressType("work")}
              >
                <MaterialIcons
                  name="work"
                  size={20}
                  color={addressType === "work" ? COLORS.WHITE : COLORS.PRIMARY}
                />
                <Typography
                  style={[
                    styles.addressTypeText,
                    addressType === "work" && styles.selectedAddressTypeText,
                  ]}
                >
                  Work
                </Typography>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === "other" && styles.selectedAddressType,
                ]}
                onPress={() => setAddressType("other")}
              >
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={addressType === "other" ? COLORS.WHITE : COLORS.PRIMARY}
                />
                <Typography
                  style={[
                    styles.addressTypeText,
                    addressType === "other" && styles.selectedAddressTypeText,
                  ]}
                >
                  Other
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Default address checkbox */}
          <TouchableOpacity
            style={styles.defaultCheckbox}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={styles.checkboxContainer}>
              {isDefault ? (
                <MaterialIcons name="check-box" size={24} color={COLORS.PRIMARY} />
              ) : (
                <MaterialIcons name="check-box-outline-blank" size={24} color={COLORS.GRAY_MEDIUM} />
              )}
            </View>
            <Typography style={styles.defaultText}>
              Make this my default address
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Save button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAddress}
          disabled={createAddressMutation.isPending}
        >
          {createAddressMutation.isPending ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Typography style={styles.saveButtonText}>Save address details</Typography>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.LG,
    paddingBottom: 100,
  },
  locationPreview: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: SPACING.MD,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: SPACING.XL,
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: SPACING.XS,
  },
  input: {
    ...INPUT_STYLES.input,
    backgroundColor: COLORS.WHITE,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: SPACING.MD,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHTER,
    textAlign: "right",
    marginTop: 4,
  },
  saveAsContainer: {
    marginBottom: SPACING.LG,
  },
  saveAsLabel: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: SPACING.SM,
  },
  addressTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    width: "30%",
  },
  selectedAddressType: {
    backgroundColor: COLORS.PRIMARY,
  },
  addressTypeText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    marginLeft: SPACING.XS,
  },
  selectedAddressTypeText: {
    color: COLORS.WHITE,
  },
  defaultCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.LG,
  },
  checkboxContainer: {
    marginRight: SPACING.SM,
  },
  defaultText: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.LG,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
