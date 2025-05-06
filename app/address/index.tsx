import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Typography } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import { useGetUserAddresses, useSetDefaultAddress, useDeleteAddress } from "@/lib/api/services/addressService";
import { Address } from "@/types/address";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";

export default function ManageAddressScreen() {
  const { data: addresses, isLoading, refetch } = useGetUserAddresses();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const deleteAddressMutation = useDeleteAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Handle address selection
  const handleAddressSelection = (address: Address) => {
    setSelectedAddressId(address._id);
    // If coming from another screen that needs an address, we would navigate back with the selected address
    // For now, we'll just set it as default
    handleSetAsDefault(address._id);
  };

  // Handle set as default
  const handleSetAsDefault = async (addressId: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(addressId);
      refetch();
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddressMutation.mutateAsync(addressId);
      refetch();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    router.push({
      pathname: "/address/edit",
      params: { addressId: address._id }
    });
  };

  // Handle add new address
  const handleAddAddress = () => {
    router.push("/location/search");
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
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <Typography style={styles.deliverToText}>Deliver to</Typography>
        </View>
        
        <View style={styles.addressRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={addressIcon} size={24} color="#8A3FFC" />
          </View>
          
          <View style={styles.addressDetails}>
            <View style={styles.addressTypeRow}>
              <Typography style={styles.addressType}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Typography>
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Typography style={styles.defaultText}>Default</Typography>
                </View>
              )}
            </View>
            
            <Typography style={styles.addressText} numberOfLines={3}>
              {item.houseDetails}, {item.streetAddress}, {item.city}, {item.state}, {item.pincode}
            </Typography>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => handleEditAddress(item)}
          >
            <MaterialIcons name="edit" size={20} color="#8A3FFC" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ShortAppHeader 
        title="Select an address" 
        onBackPress={() => router.back()}
      />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Typography style={styles.sectionTitle}>Saved Addresses</Typography>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddAddress}
          >
            <Typography style={styles.addButtonText}>+ Add Address</Typography>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
        ) : addresses && addresses.length > 0 ? (
          <FlatList
            data={addresses}
            renderItem={renderAddressItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={48} color={COLORS.GRAY_MEDIUM} />
            <Typography style={styles.emptyText}>No saved addresses</Typography>
            <TouchableOpacity 
              style={styles.addAddressButton} 
              onPress={handleAddAddress}
            >
              <Typography style={styles.addAddressButtonText}>Add New Address</Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  addButton: {
    padding: SPACING.SM,
  },
  addButtonText: {
    color: COLORS.PRIMARY,
    fontWeight: "500",
  },
  addressList: {
    paddingBottom: SPACING.XL,
  },
  addressCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHTER,
    overflow: "hidden",
  },
  addressHeader: {
    padding: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  deliverToText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  addressRow: {
    flexDirection: "row",
    padding: SPACING.MD,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  addressDetails: {
    flex: 1,
  },
  addressTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  addressType: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: SPACING.SM,
  },
  defaultBadge: {
    backgroundColor: "#E6F7E6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  editButton: {
    padding: SPACING.SM,
    marginLeft: SPACING.SM,
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  addAddressButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
  },
  addAddressButtonText: {
    color: COLORS.WHITE,
    fontWeight: "500",
  },
});
