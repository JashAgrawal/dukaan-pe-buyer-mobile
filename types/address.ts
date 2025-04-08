import { ApiResponse } from './api';

/**
 * Address related types
 */

// GeoLocation type
export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Address type
export interface Address {
  _id: string;
  user: string;
  location: GeoLocation;
  country: string;
  state: string;
  city: string;
  pincode: string;
  houseDetails: string;
  streetAddress: string;
  directionToReach?: string;
  googleFetchedAddress?: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Address creation request
export interface AddressCreateRequest {
  location: GeoLocation;
  country: string;
  state: string;
  city: string;
  pincode: string;
  houseDetails: string;
  streetAddress: string;
  directionToReach?: string;
  googleFetchedAddress?: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

// Address update request
export interface AddressUpdateRequest extends Partial<AddressCreateRequest> {}

// Address response
export interface AddressResponse extends ApiResponse<{ address: Address }> {}

// Addresses list response
export interface AddressesListResponse extends ApiResponse<{ addresses: Address[] }> {}
