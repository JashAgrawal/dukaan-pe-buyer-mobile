import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import {
  OtpRequest,
  OtpRequestResponse,
  OtpVerificationRequest,
  OtpVerificationResponse,
  ResendOtpRequest,
} from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/hooks/useAuth";

// Constants for secure storage
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Request OTP
export const requestOtp = async (
  data: OtpRequest
): Promise<OtpRequestResponse> => {
  const response = await apiClient.post<{ data: OtpRequestResponse }>(
    "/auth/request-otp",
    data
  );
  console.log(response.data);
  return response.data.data;
};

// Verify OTP
export const verifyOtp = async (
  data: OtpVerificationRequest
): Promise<OtpVerificationResponse> => {
  const response = await apiClient.post<OtpVerificationResponse>(
    "/auth/verify-otp",
    data
  );
  // Use auth store for login instead of directly storing in SecureStore
  if (response.data.token) {
    // Get the login function from the auth store
    const login = useAuth.getState().login;
    // Call login with token and user data
    await login(response.data.token, response.data.data.user);
  }

  return response.data;
};

// Resend OTP
export const resendOtp = async (
  data: ResendOtpRequest
): Promise<OtpRequestResponse> => {
  const response = await apiClient.post<OtpRequestResponse>(
    "/auth/resend-otp",
    data
  );
  return response.data;
};

// Get stored token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Get stored user data
export const getUserData = async () => {
  const userData = await SecureStore.getItemAsync(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Logout - clear stored data
export const logout = async (): Promise<void> => {};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// React Query hooks
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: requestOtp,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};
