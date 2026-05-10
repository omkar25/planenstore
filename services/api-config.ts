/**
 * API configuration and base utilities
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Handle session expiry by cleaning up tokens and cookies
 */
async function handleSessionExpiry(): Promise<void> {
  if (typeof window !== 'undefined') {
    const { SessionManager } = await import('@/utils/session-manager');
    await SessionManager.handleExpiredSession();
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Create axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout (increased for better reliability)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for API calls
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    let token;
    
    if (typeof window !== 'undefined') {
      token = AuthTokenService.getToken();
    } else {
      token = process.env.API_TOKEN;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response } = error;
    
    if (response) {
      if (response.status === 401) {
        const errorData = response.data as Record<string, unknown>;
        const errorMessage = (errorData?.message as string) || (errorData?.error as string) || '';
        
        if (errorMessage.includes('JWT expired') || errorMessage.includes('token expired')) {
          await handleSessionExpiry();
        }
      }
      
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      // Try to get a more specific error message from the response data
      if (typeof response.data === 'object' && response.data !== null) {
        // Check common error message patterns in APIs
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (typeof data.errorMessage === 'string') {
          errorMessage = data.errorMessage;
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = String(data.errors[0]);
        }
      }
      
      // Convert to our ApiError format
      throw new ApiError(
        response.status,
        errorMessage,
        response.data
      );
    }
    
    // Network errors or other issues
    throw new ApiError(
      0,
      error.message || 'Network error',
      null
    );
  }
);

/**
 * Base API function using axios
 */
export async function fetchApi<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const response = await apiClient({
    url: endpoint,
    ...options,
  });
  return response.data;
}

/**
 * API function specifically for multipart/form-data requests
 * Used for file uploads
 */
export async function fetchFormDataApi<T>(
  endpoint: string,
  formData: FormData,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const response = await apiClient({
    url: endpoint,
    method: options.method || 'POST',
    data: formData,
    timeout: 60000, // 60 seconds for file uploads (longer than default)
    headers: {
      // Let axios set the content type with boundary
      'Content-Type': 'multipart/form-data',
      ...options.headers,
    },
    ...options,
  });
  
  return response.data;
}

/**
 * Auth token management utilities
 */
export const AuthTokenService = {
  /**
   * Set the authentication token
   * @param token JWT token to store
   */
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  
  /**
   * Get the current authentication token
   * @returns The stored JWT token or null if not found
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  /**
   * Remove the authentication token (for logout)
   */
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns boolean indicating if a token exists
   */
  isAuthenticated: (): boolean => {
    return !!AuthTokenService.getToken();
  }
}
