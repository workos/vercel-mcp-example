import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
  ServerRequest,
  ServerNotification,
} from '@modelcontextprotocol/sdk/types.js';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { isAuthenticated } from '../../auth/helpers';

// Infer the exact server type from createMcpHandler to avoid CommonJS/ESM conflicts
type MCPServer = Parameters<Parameters<typeof createMcpHandler>[0]>[0];

// Public tools that work without authentication
export function registerPublicTools(server: MCPServer) {
  // Tool 1: Public Health Check - No authentication required
  server.tool(
    'ping',
    'Health check endpoint that works without authentication. Useful for testing MCP server connectivity.',
    {},
    async (
      _args,
      extra: RequestHandlerExtra<ServerRequest, ServerNotification>
    ) => {
      const { authInfo } = extra;
      const isAuth = isAuthenticated(authInfo);
      const result = {
        result: 'pong',
        timestamp: new Date().toISOString(),
        authenticated: isAuth,
        message: isAuth
          ? 'MCP server is healthy and user is authenticated'
          : 'MCP server is healthy (public endpoint)',
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
