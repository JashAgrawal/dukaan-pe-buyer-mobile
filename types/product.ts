import { PaginatedResponse } from './api';

/**
 * Product related types
 */

// Variant option
export interface VariantOption {
  name: string;
  options: string[];
}

// Product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  mainImage: string;
  allImages: string[];
  type: 'physical' | 'digital';
  price: number;
  sellingPrice: number;
  sizeVariants: string[];
  variants: VariantOption[];
  category: string;
  store_id: string;
  store: string;
  popularityIndex: number;
  orderCount: number;
  reviewCount: number;
  averageRating: number;
  wishlistCount: number;
  inventory: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Product creation request
export interface ProductCreateRequest {
  name: string;
  description: string;
  mainImage: string;
  allImages: string[];
  type: 'physical' | 'digital';
  price: number;
  sellingPrice: number;
  sizeVariants?: string[];
  variants?: VariantOption[];
  category: string;
  store: string;
  inventory: number;
  tags?: string[];
}

// Product update request
export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

// Product response
export interface ProductResponse {
  status: 'success';
  data: {
    product: Product;
  };
}

// Products list response
export interface ProductsListResponse extends PaginatedResponse<Product> {}
