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
    // Add JWT token if available
    let token;
    
    if (typeof window !== 'undefined') {
      // For client-side requests, try to get token from stored value first
      token = AuthTokenService.getToken();
      console.log('🔑 Token from storage:', token ? `***TOKEN_START: ${token.substring(0, 50)}...` : 'NO_TOKEN');
      
      // If no token in storage, skip session retrieval for now to avoid timeout issues
      if (!token) {
        console.warn('⚠️ No token found in storage and session retrieval disabled to avoid timeout issues');
        console.log('💡 Please ensure you are logged in and try refreshing the page');
        token = null;
      }
    } else {
      // For server-side requests
      console.log('🖥️ Server-side request, using env token');
      token = process.env.API_TOKEN;
    }
    
    console.log('📡 Making request to:', config.url);
    console.log('🔐 Will include auth header:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ No authorization header - request will be unauthenticated');
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
      // Handle specific error codes if needed
      if (response.status === 401) {
        // Handle unauthorized error - JWT expired or invalid
        console.error('Unauthorized access - JWT may be expired');
        
        // Check if the error is specifically about JWT expiration
        const errorData = response.data as Record<string, unknown>;
        const errorMessage = (errorData?.message as string) || (errorData?.error as string) || '';
        
        if (errorMessage.includes('JWT expired') || errorMessage.includes('token expired')) {
          console.log('🔄 JWT expired - cleaning up session and cookies');
          await handleSessionExpiry();
        }
      }
      
      // Extract the specific error message from the API response
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      console.error('🚨 API Error Details:');
      console.error('📊 Status:', response.status);
      console.error('📝 Status Text:', response.statusText);
      console.error('📦 Response Data:', response.data);
      console.error('🔗 Request URL:', response.config?.url);
      console.error('🔐 Request Headers:', response.config?.headers);
      
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
  console.log('🔄 fetchApi: Making request', { endpoint, method: options.method || 'GET', baseURL: API_BASE_URL });
  try {
    const response = await apiClient({
      url: endpoint,
      ...options,
    });
    console.log('✅ fetchApi: Success', { endpoint, status: response.status, dataType: typeof response.data });
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: unknown; status?: number; headers?: unknown } };
    
    // Enhanced debugging for delete API issues
    console.error('❌ fetchApi: Error Details', {
      endpoint,
      method: options?.method || 'GET',
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      hasResponse: !!axiosError?.response,
      responseStatus: axiosError?.response?.status,
      responseData: axiosError?.response?.data,
      responseHeaders: axiosError?.response?.headers,
      fullError: error
    });
    
    // Log specific error details for debugging
    if (axiosError?.response?.status === 401) {
      console.error('🔐 Authentication Error: Token may be invalid or expired');
    } else if (axiosError?.response?.status === 403) {
      console.error('🚫 Authorization Error: User may not have permission for this action');
    } else if (axiosError?.response?.status === 404) {
      console.error('🔍 Not Found Error: Resource may not exist');
    }
    throw error;
  }
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
