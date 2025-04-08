/**
 * Common API response types
 */

// Base API response type
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  stack?: string; // Only in development mode
}

// Paginated response type
export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  results: number;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  data: {
    [key: string]: T[];
  };
}

// Error response type
export interface ErrorResponse {
  status: 'error';
  message: string;
  stack?: string; // Only in development mode
}
