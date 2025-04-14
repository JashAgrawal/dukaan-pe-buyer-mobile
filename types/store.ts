import { ApiResponse, PaginatedResponse } from "./api";
import { User } from "./auth";

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
  mainImage?: string;
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
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  categories: string[];
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  averageRating?: number;
  reviewCount: number;
  followerCount: number;
  distance?: number; // Distance in km from user's location
  isOpen?: boolean;
  opensAt?: string;
  closesAt?: string;
  is_24_7?: boolean;
  orderCount?: number;
  wishlistCount?: number;
  inWishlist?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Store response
export interface StoreResponse extends ApiResponse<{ store: Store }> {}

// Stores list response
export interface StoresListResponse extends PaginatedResponse<Store> {}
