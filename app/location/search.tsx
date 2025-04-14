import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useLocation } from "@/hooks/useLocation";
import { useGetUserAddresses } from "@/lib/api/services/addressService";
import {
  useGetCurrentLocation,
  useReverseGeocode,
  useSearchPlaces,
  useGetPlaceDetails,
} from "@/lib/api/services/locationService";
// import { IconSymbol } from '@/components/ui/IconSymbol';
import { Address } from "@/types/address";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ShortAppHeader from "@/components/ui/ShortAppHeader";

export default function LocationSearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      placeId: string;
      description: string;
      mainText: string;
      secondaryText: string;
    }>
  >([]);

  const { setLocation } = useLocation();
  const { data: addresses, isLoading: isLoadingAddresses } =
    useGetUserAddresses();

  const getCurrentLocationMutation = useGetCurrentLocation();
  const reverseGeocodeMutation = useReverseGeocode();
  const searchPlacesMutation = useSearchPlaces();
  const getPlaceDetailsMutation = useGetPlaceDetails();

  // Search for places when query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const results = await searchPlacesMutation.mutateAsync(searchQuery);
          console.log(results);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching places:", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle current location selection
  const handleCurrentLocation = async () => {
    try {
      // Get current coordinates
      const coords = await getCurrentLocationMutation.mutateAsync();

      // Reverse geocode to get address
      const addressInfo = await reverseGeocodeMutation.mutateAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      // Navigate to confirmation screen
      router.push({
        pathname: "/location/confirm",
        params: {
          pincode: addressInfo.pincode,
          city: addressInfo.city,
          state: addressInfo.state,
          country: addressInfo.country,
          fullAddress: addressInfo.fullAddress,
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
          source: "current",
        },
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      alert("Failed to get your current location. Please try again.");
    }
  };

  // Handle place selection
  const handlePlaceSelection = async (placeId: string) => {
    try {
      const placeDetails = await getPlaceDetailsMutation.mutateAsync(placeId);

      // Navigate to confirmation screen
      router.push({
        pathname: "/location/confirm",
        params: {
          pincode: placeDetails.pincode,
          city: placeDetails.city,
          state: placeDetails.state,
          country: placeDetails.country,
          fullAddress: placeDetails.fullAddress,
          latitude: placeDetails.latitude.toString(),
          longitude: placeDetails.longitude.toString(),
          source: "search",
        },
      });
    } catch (error) {
      console.error("Error getting place details:", error);
      alert(
        "Failed to get details for the selected location. Please try again."
      );
    }
  };

  // Handle saved address selection
  const handleAddressSelection = (address: Address) => {
    // Navigate to confirmation screen
    router.push({
      pathname: "/location/confirm",
      params: {
        pincode: address.pincode,
        city: address.city,
        state: address.state,
        country: address.country,
        fullAddress: `${address.houseDetails}, ${address.streetAddress}, ${address.city}, ${address.state}, ${address.pincode}`,
        latitude: address.location.coordinates[1].toString(),
        longitude: address.location.coordinates[0].toString(),
        source: "saved",
        addressId: address._id,
      },
    });
  };

  // Render address item
  const renderAddressItem = ({ item }: { item: Address }) => {
    const addressIcon =
      item.type === "home"
        ? "home"
        : item.type === "work"
        ? "work"
        : "location-on";

    return (
      <TouchableOpacity
        style={styles.addressItem}
        onPress={() => handleAddressSelection(item)}
      >
        <View style={styles.addressIconContainer}>
          <MaterialIcons name={addressIcon} size={24} color="#8A3FFC" />
        </View>
        <View style={styles.addressDetails}>
          <Text style={styles.addressType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {item.houseDetails}, {item.streetAddress}, {item.city}, {item.state}
            , {item.pincode}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render search result item
  const renderSearchResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handlePlaceSelection(item.placeId)}
    >
      <MaterialIcons name="location-on" size={24} color="#8A3FFC" />
      <View style={styles.searchResultTextContainer}>
        <Text style={styles.searchResultMainText}>{item.mainText}</Text>
        <Text style={styles.searchResultSecondaryText}>
          {item.secondaryText}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const isLoading =
    getCurrentLocationMutation.isPending ||
    reverseGeocodeMutation.isPending ||
    getPlaceDetailsMutation.isPending;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ShortAppHeader
        title="Enter your area"
        onBackPress={() => router.back()}
      />

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for area, street name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        <MaterialIcons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
      </View>

      {/* Current location option */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocation}
        disabled={isLoading}
      >
        <MaterialIcons name="my-location" size={24} color="#8A3FFC" />
        <Text style={styles.currentLocationText}>
          Use your current location
        </Text>
        {getCurrentLocationMutation.isPending && (
          <ActivityIndicator
            size="small"
            color="#8A3FFC"
            style={styles.loader}
          />
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Saved addresses section */}
      {addresses && addresses.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Saved addresses</Text>
          {isLoadingAddresses ? (
            <ActivityIndicator
              size="small"
              color="#8A3FFC"
              style={styles.addressesLoader}
            />
          ) : (
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item._id}
              style={styles.addressesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {/* Search results */}
      {searchQuery.length > 2 && (
        <View>
          {searchPlacesMutation.isPending ? (
            <ActivityIndicator
              size="small"
              color="#8A3FFC"
              style={styles.resultsLoader}
            />
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResultItem}
              keyExtractor={(item) => item.placeId}
              style={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>
                  {searchPlacesMutation.isPending
                    ? "Searching..."
                    : `No results found for "${searchQuery}"`}
                </Text>
              }
            />
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    marginTop: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingLeft: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginTop: 2,
  },
  currentLocationText: {
    fontSize: 16,
    color: "#8A3FFC",
    marginLeft: 12,
    fontWeight: "500",
  },
  loader: {
    marginLeft: "auto",
  },
  divider: {
    height: 8,
    backgroundColor: "#F5F5F5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  addressesLoader: {
    marginTop: 20,
  },
  addressesList: {
    flex: 1,
  },
  addressItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addressDetails: {
    flex: 1,
    marginLeft: 12,
  },
  addressType: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  resultsLoader: {
    marginTop: 20,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchResultTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultMainText: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchResultSecondaryText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
