import apiClient from "../apiClient";

export interface Review {
  _id: string;
  rating: number;
  review: string;
  user: {
    _id: string;
    name: string;
  };
  store?: string;
  product?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  status: string;
  results: number;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  data: {
    reviews: Review[];
  };
}

export interface ReviewResponse {
  status: string;
  data: {
    review: Review;
  };
}

/**
 * Service for interacting with review-related API endpoints
 */
export const reviewService = {
  /**
   * Get reviews for a store
   */
  getStoreReviews: async (storeId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ReviewsResponse>(`/stores/${storeId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Create a review for a store
   */
  createStoreReview: async (storeId: string, data: { rating: number; review: string }) => {
    const response = await apiClient.post<ReviewResponse>(`/stores/${storeId}/reviews`, data);
    return response.data;
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ReviewsResponse>(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Create a review for a product
   */
  createProductReview: async (productId: string, data: { rating: number; review: string }) => {
    const response = await apiClient.post<ReviewResponse>(`/products/${productId}/reviews`, data);
    return response.data;
  },

  /**
   * Get user's reviews
   */
  getUserReviews: async (page = 1, limit = 10) => {
    const response = await apiClient.get<ReviewsResponse>('/users/reviews', {
      params: { page, limit },
    });
    return response.data;
  },
};

export default reviewService;
