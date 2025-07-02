import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { User, WorkOSAuthInfo } from './types';

// Ensures user is authenticated and extracts user from authInfo.extra
// Throws an error if user is not authenticated - use for tools that require auth
export const ensureUserAuthenticated = (authInfo: AuthInfo | undefined): User => {
  if (!authInfo?.extra) {
    throw new Error('Authentication required for this tool');
  }
  
  const workosAuth = authInfo.extra as WorkOSAuthInfo;
  if (!workosAuth || !workosAuth.user) {
    throw new Error('Authentication required for this tool');
  }
  return workosAuth.user;
};

// Helper to check if request is authenticated (for optional auth tools)
export const isAuthenticated = (authInfo: AuthInfo | undefined): boolean => {
  if (!authInfo?.extra) {
    return false;
  }
  
  const workosAuth = authInfo.extra as WorkOSAuthInfo;
  return !!(workosAuth && workosAuth.user);
}; 