import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import {
  Address,
  AddressCreateRequest,
  AddressResponse,
  AddressUpdateRequest,
  AddressesListResponse,
} from "@/types/address";

// Get all user addresses
export const getUserAddresses = async (): Promise<Address[]> => {
  const response = await apiClient.get<AddressesListResponse>("/addresses");
  return response.data.data?.addresses || [];
};

// Get single address
export const getAddress = async (id: string): Promise<Address> => {
  const response = await apiClient.get<AddressResponse>(`/addresses/${id}`);
  if (!response.data.data?.address) {
    throw new Error("Address not found");
  }
  return response.data.data.address;
};

// Create new address
export const createAddress = async (
  data: AddressCreateRequest
): Promise<Address> => {
  const response = await apiClient.post<AddressResponse>("/addresses", data);
  if (!response.data.data?.address) {
    throw new Error("Failed to create address");
  }
  return response.data.data.address;
};

// Update address
export const updateAddress = async ({
  id,
  data,
}: {
  id: string;
  data: AddressUpdateRequest;
}): Promise<Address> => {
  const response = await apiClient.patch<AddressResponse>(
    `/addresses/${id}`,
    data
  );
  if (!response.data.data?.address) {
    throw new Error("Failed to update address");
  }
  return response.data.data.address;
};

// Delete address
export const deleteAddress = async (id: string): Promise<void> => {
  await apiClient.delete(`/addresses/${id}`);
};

// Set address as default
export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await apiClient.patch<AddressResponse>(
    `/addresses/${id}/set-default`
  );
  if (!response.data.data?.address) {
    throw new Error("Failed to set default address");
  }
  return response.data.data.address;
};

// Check if pincode is serviceable
export const checkPincodeServiceability = async (
  pincode: string
): Promise<{
  pincode: string;
  isServiceable: boolean;
  storeCount: number;
  message: string;
}> => {
  const response = await apiClient.get(
    `/pincode/is-serviceable?pincode=${pincode}`
  );
  return response.data.data;
};

// React Query hooks
export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAddresses,
  });
};

export const useGetAddress = (id: string) => {
  return useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddress(id),
    enabled: !!id,
  });
};

export const useCreateAddress = () => {
  return useMutation({
    mutationFn: createAddress,
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: updateAddress,
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: deleteAddress,
  });
};

export const useSetDefaultAddress = () => {
  return useMutation({
    mutationFn: setDefaultAddress,
  });
};

export const useCheckPincodeServiceability = () => {
  return useMutation({
    mutationFn: checkPincodeServiceability,
  });
};
