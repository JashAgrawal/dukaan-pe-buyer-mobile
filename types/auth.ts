import { ApiResponse } from './api';

/**
 * Authentication related types
 */

// User type
export interface User {
  id: string;
  name: string;
  mobileNumber: string;
  phone?: string; // Added for Razorpay integration
  email?: string;
  role: 'user' | 'admin' | 'seller';
}

// OTP Request
export interface OtpRequest {
  mobileNumber: string;
}

// OTP Request Response
export interface OtpRequestResponse {
  requestId: string;
  expiresIn: number;
}

// OTP Verification Request
export interface OtpVerificationRequest {
  mobileNumber: string;
  otp: string;
  requestId: string;
  name?: string; // Optional, required only for new users
}

// OTP Verification Response
export interface OtpVerificationResponse {
  token: string;
  isNewUser: boolean;
  data: {
    user: User;
  };
}

// Resend OTP Request
export interface ResendOtpRequest {
  mobileNumber: string;
  requestId: string;
}

// User Profile Response
export interface UserProfileResponse extends ApiResponse<{ user: User }> {}
