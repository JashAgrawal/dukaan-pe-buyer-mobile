import { ApiResponse, PaginatedResponse } from "./api";
import { User } from "./auth";

/**
 * Store related types
 */

// Store Category
export interface StoreCategory {
  _id: string;
  name: string;
  parentId?: string | null;
  image?: string;
  popularityIndex?: number;
  noOfStores?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Product Category
export interface ProductCategory {
  _id: string;
  name: string;
}

// Store Images Collection
export interface StoreImagesCollection {
  _id: string;
  store: string;
  heading: string;
  images: string[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Store
export interface Store {
  _id: string;
  name: string;
  tagline?: string;
  description: string;
  owner_id?: string;
  owner?: string | User;
  business_phone_number?: string;
  business_email?: string;
  contactEmail?: string;
  contactPhone?: string;
  full_address?: string;
  city?: string;
  state?: string;
  country?: string;
  serviceable_pincodes?: string[];
  isPanIndia?: boolean;
  type?: string;
  address?: {
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
  category?: StoreCategory;
  productCategories?: ProductCategory[];
  categories?: string[];
  logo: string;
  coverImage: string;
  mainImage?: string;
  allImages?: string[];
  facilities?: string[];
  termsAndConditions?: string;
  returnPolicy?: string;
  displayTags?: string[];
  sysTags?: string[];
  popularity_index?: number;
  isBrand?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  isOpen?: boolean;
  opensAt?: string;
  closesAt?: string;
  is_24_7?: boolean;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  followerCount?: number;
  distance?: number; // Distance in km from user's location
  orderCount?: number;
  wishlistCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Store response
export interface StoreResponse extends ApiResponse<{ store: Store }> {}

// Stores list response
export interface StoresListResponse extends PaginatedResponse<Store> {}

// Store Category response
export interface StoreCategoryResponse
  extends ApiResponse<{ category: StoreCategory }> {}

// Store Categories list response
export interface StoreCategoriesListResponse
  extends ApiResponse<{
    categories: StoreCategory[];
    pagination?: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }> {}

// Store Subcategories list response
export interface StoreSubcategoriesListResponse
  extends ApiResponse<{
    subcategories: StoreCategory[];
    pagination?: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }> {}

// Store Images Collection response
export interface StoreImagesCollectionResponse
  extends ApiResponse<{ storeImagesCollection: StoreImagesCollection }> {}

// Store Images Collections list response
export interface StoreImagesCollectionsListResponse
  extends ApiResponse<{
    storeImagesCollections: StoreImagesCollection[];
    pagination?: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }> {}
