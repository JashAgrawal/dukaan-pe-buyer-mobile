import { ApiResponse, PaginatedResponse } from './api';
import { User } from './auth';

/**
 * Store related types
 */

// Store
export interface Store {
  _id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  owner: string | User;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  categories: string[];
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
}

// Store response
export interface StoreResponse extends ApiResponse<{ store: Store }> {}

// Stores list response
export interface StoresListResponse extends PaginatedResponse<Store> {}
