import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useLocation } from "@/hooks/useLocation";
import {
  useGetCurrentLocation,
  useReverseGeocode,
} from "@/lib/api/services/locationService";
import { useCheckPincodeServiceability } from "@/lib/api/services/addressService";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LocationIcon = require("@/assets/images/location.png");

type LocationBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function LocationBottomSheet({
  isVisible,
  onClose,
}: LocationBottomSheetProps) {
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const { setLocation } = useLocation();
  const getCurrentLocationMutation = useGetCurrentLocation();
  const reverseGeocodeMutation = useReverseGeocode();
  const checkPincodeServiceabilityMutation = useCheckPincodeServiceability();

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Open/close the sheet based on isVisible prop
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle manual pincode entry
  const handlePincodeSubmit = async () => {
    if (!pincode || pincode.length !== 6) {
      setPincodeError("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setPincodeError("");

      // Check if pincode is serviceable
      const serviceabilityResult =
        await checkPincodeServiceabilityMutation.mutateAsync(pincode);

      if (!serviceabilityResult.isServiceable) {
        setPincodeError("This pincode is not serviceable in your area");
        return;
      }

      // Set location with pincode
      await setLocation({
        pincode,
        city: "",
        state: "",
        country: "India",
        fullAddress: `Pincode: ${pincode}`,
        source: "manual",
      });

      // Close sheet and navigate
      onClose();
    } catch (error) {
      console.error("Error setting pincode:", error);
      setPincodeError("Failed to verify pincode. Please try again.");
    }
  };

  // Handle current location detection
  const handleDetectLocation = async () => {
    try {
      // Get current coordinates
      const coords = await getCurrentLocationMutation.mutateAsync();

      // Reverse geocode to get address
      const addressInfo = await reverseGeocodeMutation.mutateAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (!addressInfo.pincode) {
        throw new Error("Could not determine pincode from your location");
      }

      // Check if pincode is serviceable
      const serviceabilityResult =
        await checkPincodeServiceabilityMutation.mutateAsync(
          addressInfo.pincode
        );

      if (!serviceabilityResult.isServiceable) {
        setPincodeError("Your location is not serviceable in your area");
        return;
      }

      // Set location
      await setLocation({
        pincode: addressInfo.pincode,
        city: addressInfo.city,
        state: addressInfo.state,
        country: addressInfo.country,
        fullAddress: addressInfo.fullAddress,
        coordinates: [coords.longitude, coords.latitude],
        source: "current",
      });

      // Close sheet and navigate
      onClose();
    } catch (error) {
      console.error("Error detecting location:", error);
      setPincodeError(
        "Failed to detect your location. Please try again or enter pincode manually."
      );
    }
  };

  // Handle search location
  const handleSearchLocation = () => {
    onClose();
    router.navigate("/location/search" as any);
  };

  const isLoading =
    getCurrentLocationMutation.isPending ||
    reverseGeocodeMutation.isPending ||
    checkPincodeServiceabilityMutation.isPending;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Set your device location</Text>
            <Text style={styles.subtitle}>
              We need your location to provide you quality experience.
            </Text>
          </View>

          <View style={styles.iconContainer}>
            <Image source={LocationIcon} style={styles.locationIcon} />
          </View>

          {/* Search location button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchLocation}
            disabled={isLoading}
          >
            <IconSymbol name="00.circle.hi" size={20} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search your location</Text>
          </TouchableOpacity>

          {/* Manual pincode entry */}
          <View style={styles.pincodeContainer}>
            <TextInput
              style={[
                styles.pincodeInput,
                pincodeError ? styles.inputError : null,
              ]}
              placeholder="Enter pincode manually"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />
            {pincodeError ? (
              <Text style={styles.errorText}>{pincodeError}</Text>
            ) : null}
          </View>

          {/* Set location button */}
          <TouchableOpacity
            style={styles.setLocationButton}
            onPress={handleDetectLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.setLocationButtonText}>Set Location</Text>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  locationIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  searchButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  pincodeContainer: {
    marginBottom: 20,
  },
  pincodeInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  setLocationButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  setLocationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
