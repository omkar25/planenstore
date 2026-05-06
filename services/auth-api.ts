/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { apiClient } from "./api-config";


// Response types
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    name?: string;
    role: string;
  };
}

interface SignupResponse {
  success: boolean;
  message: string;
  userId?: string;
}

interface UserDetails {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userPhoneNo: string;
  isDisabled: boolean;
  roleName: string;
}

interface UpdateUserPayload {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userPhoneNo: string;
}

// API Methods
export const authApiService = {
  /**
   * Login with username and password
   */
  login: (username: string, password: string) => 
    apiClient.post<LoginResponse>("/auth/login", { username, password }),

  /**
   * Register a new user
   */
  signup: (data: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }) => apiClient.post<SignupResponse>("/users", data),
  
  /**
   * Logout the current user
   */
  logout: () => apiClient.post("/auth/logout"),
  
  /**
   * Get current user profile
   */
  getProfile: () => apiClient.get("/users/profile"),
  
  /**
   * Update user profile
   */
  updateProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => apiClient.put("/users/profile", data),
  
  /**
   * Get single user details by ID
   */
  getUserById: (userId: number) => 
    apiClient.get<UserDetails>(`/users/${userId}`),
  
  /**
   * Update user details by ID
   */
  updateUser: (userId: number, data: UpdateUserPayload) => 
    apiClient.put<UserDetails>(`/users/update/${userId}`, data),
};

export default authApiService;
