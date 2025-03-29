/**
 * This file contains configuration specific to different deployment environments
 */

// Check if we're in a static export build environment
export const isStaticExport = process.env.NEXT_PUBLIC_DISABLE_AUTH_FOR_STATIC_EXPORT === 'true';

// Check if we're in a production environment
export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// This can be used to conditionally render or skip certain components during static export
export const shouldSkipAuthInBuild = isStaticExport || (process.env.NODE_ENV === 'production' && typeof window === 'undefined');

// Mock user for static builds (only public fields, no password)
export const mockUser = shouldSkipAuthInBuild ? {
  id: 'static-user-id',
  name: 'Static User',
  email: 'static@example.com',
  favorites: [],
} : null;

// Session configuration
export const SESSION_CONFIG = {
  // Duration in milliseconds (7 days)
  duration: 7 * 24 * 60 * 60 * 1000,
  // Storage key in localStorage 
  storageKey: 'session',
};
