import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from './services/api-config';
import { AuthTokenService } from './services/api-config';
import { SignInPayload, LoginResponse } from './types';

/**
 * NextAuth configuration with custom credentials provider
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Call the API to authenticate
          const payload: SignInPayload = {
            username: credentials.username as string,
            password: credentials.password as string
          };
          
          const response = await apiClient.post<LoginResponse>('/auth/login', payload);
          const data = response.data;

          if (!data || !data.accessToken || !data.user) {
            return null;
          }

          // Store the token in localStorage (client-side only)
          if (typeof window !== 'undefined') {
            AuthTokenService.setToken(data.accessToken);
          }

          // Extract user data from the backend response
          const { user, expiration } = data;
          
          return {
            id: user.id, // Using userName as unique identifier
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            username: user.userName,
            role: user.userRole,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            token: data.accessToken,
            expiration, // ⏱ backend expiration ISO string at top level
          };
        } catch (error) {
          console.error('Authentication error:', error);
          
          // Extract the error message from ApiError and throw it in a way NextAuth can handle
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = (error as { message: string }).message;
            // Throw a CredentialsSignin error with the specific message
            throw new Error(errorMessage);
          }
          
          // For other errors, return null
          return null;
        }
      }
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      // Initial sign in
      if (user) {
        token.id = String(user.id);
        token.username = String(user.username);
        token.role = String(user.role);
        token.firstName = String(user.firstName || '');
        token.lastName = String(user.lastName || '');
        token.phoneNumber = String(user.phoneNumber || '');
        token.accessToken = String(user.token || '');
        token.expiration = String(user.expiration || '');
        
        // Calculate expiration timestamp from backend ISO string
        if (user.expiration) {
          const expirationDate = new Date(user.expiration);
          token.exp = Math.floor(expirationDate.getTime() / 1000); // Convert to Unix timestamp (seconds)
        }
      }
      
      // Check if token has expired
      if (token.exp && Date.now() >= token.exp * 1000) {
        // Token has expired - return empty token to force re-authentication
        return {};
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Extend the session user with our custom properties
        // Using Object.assign to bypass TypeScript's strict checking
        
        // Add our custom properties to the session user
        Object.assign(session.user || {}, {
          id: token.id,
          username: token.username,
          role: token.role,
          firstName: token.firstName,
          lastName: token.lastName,
          phoneNumber: token.phoneNumber,
          token: token.accessToken,
          expiration: token.expiration
        });
        
        // Set session expiration to match backend token expiration
        if (token.exp) {
          // Override the default session expiration with backend JWT expiration
          Object.assign(session, {
            expires: new Date(token.exp * 1000).toISOString()
          });
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    // maxAge is now dynamically set based on backend JWT expiration
    // The actual expiration is controlled by token.exp in the jwt callback
  },
  events: {
    async signOut() {
      // Clear localStorage token when user signs out
      if (typeof window !== 'undefined') {
        const { AuthTokenService } = await import('./services/api-config');
        AuthTokenService.removeToken();
      }
    },
  },
};

export default NextAuth(authOptions);
