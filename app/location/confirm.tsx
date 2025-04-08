import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import {
  useCheckPincodeServiceability,
  useGetAddress,
} from "@/lib/api/services/addressService";
import { useReverseGeocode } from "@/lib/api/services/locationService";
import { LocationSource } from "@/stores/locationStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LocationConfirmScreen() {
  const params = useLocalSearchParams<{
    pincode: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
    source: string;
    addressId?: string;
  }>();

  // State for location data
  const [isServiceable, setIsServiceable] = useState(true);
  const [serviceabilityMessage, setServiceabilityMessage] = useState("");
  const [currentLatitude, setCurrentLatitude] = useState(
    parseFloat(params.latitude || "0")
  );
  const [currentLongitude, setCurrentLongitude] = useState(
    parseFloat(params.longitude || "0")
  );
  const [currentAddress, setCurrentAddress] = useState(
    params.fullAddress || ""
  );
  const [currentPincode, setCurrentPincode] = useState(params.pincode || "");
  const [currentCity, setCurrentCity] = useState(params.city || "");
  const [currentState, setCurrentState] = useState(params.state || "");
  const [currentCountry, setCurrentCountry] = useState(params.country || "");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const mapRef = useRef<MapView>(null);

  // Hooks
  const { setLocation } = useLocation();
  const checkPincodeServiceabilityMutation = useCheckPincodeServiceability();
  const reverseGeocodeMutation = useReverseGeocode();
  const { data: savedAddress } = useGetAddress(params.addressId || "");

  const source = params.source as LocationSource;

  // Function to check pincode serviceability
  const checkServiceability = async (pincode: string) => {
    if (!pincode) return;

    try {
      setIsUpdatingLocation(true);
      const result = await checkPincodeServiceabilityMutation.mutateAsync(
        pincode
      );
      setIsServiceable(result.isServiceable);
      setServiceabilityMessage(result.message);
    } catch (error) {
      console.error("Error checking pincode serviceability:", error);
      setIsServiceable(false);
      setServiceabilityMessage(
        "Failed to check if this location is serviceable"
      );
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Check serviceability on mount and when pincode changes
  useEffect(() => {
    checkServiceability(currentPincode);
  }, [currentPincode]);

  // Initial serviceability check
  useEffect(() => {
    // This ensures we check serviceability when coming from search
    if (params.pincode) {
      checkServiceability(params.pincode);
    }
  }, []);

  // Handle marker drag end - update location details
  const handleMarkerDragEnd = async (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentLatitude(latitude);
    setCurrentLongitude(longitude);

    try {
      setIsUpdatingLocation(true);
      // Reverse geocode to get address details
      const addressInfo = await reverseGeocodeMutation.mutateAsync({
        latitude,
        longitude,
      });

      // Update state with new address details
      setCurrentAddress(addressInfo.fullAddress);
      setCurrentCity(addressInfo.city);
      setCurrentState(addressInfo.state);
      setCurrentCountry(addressInfo.country);

      // Update pincode and explicitly check serviceability
      const newPincode = addressInfo.pincode;
      setCurrentPincode(newPincode);

      // Explicitly check serviceability for the new pincode
      if (newPincode) {
        await checkServiceability(newPincode);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to get address details for the selected location.");
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Handle confirm location
  const handleConfirmLocation = async () => {
    try {
      await checkServiceability(currentPincode);

      await setLocation({
        pincode: currentPincode,
        city: currentCity,
        state: currentState,
        country: currentCountry,
        fullAddress: currentAddress,
        coordinates: [currentLongitude, currentLatitude],
        source,
        selectedAddress: savedAddress || undefined,
      });

      // Navigate back to home or previous screen
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error setting location:", error);
      alert("Failed to set location. Please try again.");
    }
  };

  const isLoading =
    checkPincodeServiceabilityMutation.isPending ||
    reverseGeocodeMutation.isPending ||
    isUpdatingLocation;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Map view */}
      {currentLatitude && currentLongitude ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLatitude,
              longitude: currentLongitude,
            }}
            pinColor="#8A3FFC"
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text>Map not available</Text>
        </View>
      )}

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Location details */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationDetailsTitle}>Select location</Text>

        <View style={styles.locationDetails}>
          <MaterialIcons name="location-on" size={24} color="#8A3FFC" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationName}>
              {currentCity || currentState || "Selected location"}
            </Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {currentAddress}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Serviceability message */}
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#8A3FFC"
            style={styles.loader}
          />
        ) : (
          <Text
            style={[
              styles.serviceabilityMessage,
              !isServiceable && styles.notServiceableMessage,
            ]}
          >
            {serviceabilityMessage}
          </Text>
        )}

        {/* Drag instruction */}
        <Text style={styles.dragInstructionText}>
          Drag the marker to adjust your exact location
        </Text>

        {/* Confirm button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isServiceable || isLoading) && styles.disabledButton,
          ]}
          onPress={handleConfirmLocation}
          disabled={!isServiceable || isLoading}
        >
          <Text style={styles.confirmButtonText}>Confirm location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  map: {
    width: "100%",
    height: "75%",
  },
  mapPlaceholder: {
    width: "100%",
    height: "75%",
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  locationDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeButtonText: {
    color: "#8A3FFC",
    fontWeight: "500",
  },
  serviceabilityMessage: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 16,
  },
  notServiceableMessage: {
    color: "#F44336",
  },
  loader: {
    marginBottom: 16,
  },
  dragInstructionText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  confirmButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
