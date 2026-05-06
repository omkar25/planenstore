// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  baseUrl?: string;
  userPhoneNo?: string;
  isDisabled: boolean;
  roleId: number;
}

// User details response from API
export interface UserDetails {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userPhoneNo: string;
  isDisabled: boolean;
  roleName: string;
}

// Update user payload
export interface UpdateUserPayload {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userPhoneNo: string;
}

// Auth types
export interface SignUpPayload {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  baseUrl?: string;
  userPhoneNo?: string;
  isDisabled?: boolean;
  roleId?: number;
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Backend login response format
export interface LoginResponse {
  accessToken: string;
  errorMessage: string;
  user: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userRole: string;
    email: string;
  };
  expiration: string;
}

// Session types
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  token: string;
  expiration: string;
}

// Next-Auth types
declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }
  
  interface User {
    id: number;
    username: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    token: string;
    expiration: string;
    name?: string;
    email?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    accessToken?: string;
    expiration?: string;
    exp?: number;
  }
}