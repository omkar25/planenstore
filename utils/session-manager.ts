/**
 * Session management utilities for handling NextAuth session expiry
 */
import { signOut } from 'next-auth/react';
import { AuthTokenService } from '@/services/api-config';

export class SessionManager {
  /**
   * Clear all authentication data and cookies
   */
  static async clearSession(): Promise<void> {
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing expired session data...');
      
      // Clear localStorage token
      AuthTokenService.removeToken();
      
      // Clear all NextAuth cookies manually
      const cookies = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.session-token',
        '__Host-next-auth.csrf-token',
        '__Secure-next-auth.callback-url',
        'authjs.session-token',
        'authjs.csrf-token',
        'authjs.callback-url',
        '__Secure-authjs.session-token',
        '__Host-authjs.csrf-token'
      ];
      
      // Get all cookies to see what's actually there
      const allCookies = document.cookie.split(';');
      console.log('Current cookies before clearing:', allCookies);
      
      cookies.forEach(cookieName => {
        // Multiple clearing attempts with different configurations
        const clearingMethods = [
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax;`,
          `${cookieName}=; max-age=0; path=/;`,
          `${cookieName}=; max-age=0; path=/; domain=${window.location.hostname};`
        ];
        
        clearingMethods.forEach(method => {
          document.cookie = method;
        });
      });
      
      // Also try to clear any cookies that start with next-auth or authjs
      allCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        if (cookieName.includes('next-auth') || cookieName.includes('authjs')) {
          console.log(`Attempting to clear detected cookie: ${cookieName}`);
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; max-age=0; path=/;`;
        }
      });
      
      console.log('✅ Session data cleared');
    }
  }

  /**
   * Handle session expiry with proper cleanup and redirect
   */
  static async handleExpiredSession(): Promise<void> {
    console.log('⏰ Session expired - initiating cleanup');
    
    try {
      // Clear session data first
      await SessionManager.clearSession();
      
      // Use NextAuth signOut to properly clear server-side session
      await signOut({ 
        redirect: false,
        callbackUrl: '/sign-in?expired=true'
      });
      
      // Force redirect after cleanup
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/sign-in?expired=true';
        }, 100);
      }
    } catch (error) {
      console.error('Error during session cleanup:', error);
      // Fallback - direct redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in?expired=true';
      }
    }
  }

  /**
   * Check if current session is expired based on JWT token
   */
  static isSessionExpired(token?: string): boolean {
    if (!token) return true;
    
    try {
      // Decode JWT token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if we can't parse
    }
  }

  /**
   * Get time until session expires (in seconds)
   */
  static getTimeUntilExpiry(token?: string): number {
    if (!token) return 0;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      console.error('Error calculating time until expiry:', error);
      return 0;
    }
  }
}
