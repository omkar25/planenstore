/**
 * Authentication service
 * Handles login, logout, and token management
 */

import { apiClient, AuthTokenService } from './api-config';

// Removed unused interface

interface SignupData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const AuthService = {
  /**
   * Login user with username and password
   * @param username User's username
   * @param password User's password
   * @returns Login response with token and user data
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { username, password });
    
    // Store the token
    if (response.data && response.data.token) {
      AuthTokenService.setToken(response.data.token);
    }
    
    return response.data;
  },
  
  /**
   * Register a new user
   * @param data User registration data
   * @returns Response from the signup endpoint
   */
  signup: async (data: SignupData): Promise<{ success: boolean; message: string; userId?: string }> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if your API has one
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove the token
      AuthTokenService.removeToken();
    }
  },
  
  /**
   * Check if the current user is authenticated
   */
  isAuthenticated: (): boolean => {
    return AuthTokenService.isAuthenticated();
  },
  
  /**
   * Get the current user's token
   */
  getToken: (): string | null => {
    return AuthTokenService.getToken();
  }
};

export default AuthService;
