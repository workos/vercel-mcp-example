/**
 * AuthHandler Pattern Demo: Vercel MCP Adapter + WorkOS AuthKit
 *
 * This file demonstrates the powerful authHandler wrapper pattern that
 * transforms any MCP server built with the Vercel MCP Adapter into an
 * enterprise-ready, authenticated service with just a few lines of code.
 *
 * Key components:
 * 1. createMcpHandler() - builds the MCP server with type-safe tools
 * 2. withMcpAuth() - wraps with WorkOS authentication
 * 3. Zero-config deployment to Vercel Edge
 */

import {
  createMcpHandler,
  withMcpAuth,
} from '@vercel/mcp-adapter';
import { getWorkOS } from '@workos-inc/authkit-nextjs';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { User, WorkOSAuthInfo } from '@/lib/auth/types';
import { registerPublicTools } from '@/lib/mcp/tools/public';
import { registerExampleTools } from '@/lib/mcp/tools/examples';

const workos = getWorkOS();
const clientId = process.env.WORKOS_CLIENT_ID;

if (!clientId) {
  throw new Error('WORKOS_CLIENT_ID environment variable not set');
}

// Fetch the JWKS from WorkOS
const jwksUrl = new URL(`https://api.workos.com/sso/jwks/${clientId}`);
const JWKS = createRemoteJWKSet(jwksUrl);

const handler = createMcpHandler((server) => {
  // Register tool modules
  registerPublicTools(server);
  registerExampleTools(server);
});

// 🔐 THE AUTHHANDLER PATTERN 🔐
// This is the magic: wrap any MCP server with enterprise authentication
// in just a few lines using withMcpAuth + WorkOS
const authHandler = withMcpAuth(
  handler,
  async (request, token) => {
    // If no token is provided, allow through for public tools (like ping)
    // Individual tools decide if they require authentication
    if (!token) {
      return undefined; // No auth context - tools can check isAuthenticated()
    }

    try {
      // Verify the JWT using WorkOS JWKS
      const { payload } = await jwtVerify(token, JWKS);

      if (!payload.sub) {
        throw new Error('Invalid token: missing sub claim');
      }

      // Fetch user profile from WorkOS
      const userProfile = await workos.userManagement.getUser(payload.sub);

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        profilePictureUrl: userProfile.profilePictureUrl,
      };

      const workosAuthInfo: WorkOSAuthInfo = {
        user,
        claims: payload,
      };

      // Return MCP AuthInfo with our data in extra
      return {
        token,
        clientId: clientId!,
        scopes: [],
        extra: workosAuthInfo,
      };
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorObj = error as { code?: string; message?: string };
      const errorMessage =
        errorObj.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'
          ? 'Invalid token signature. Please sign in again.'
          : errorObj.message || 'Authentication failed. Please sign in again.';

      throw new Error(errorMessage);
    }
  },
  {
    // Allow unauthenticated requests through - individual tools decide auth requirements
    // This enables a mix of public tools (ping) and private tools (getUserProfile)
    required: false,
  }
);

export { authHandler as GET, authHandler as POST };
