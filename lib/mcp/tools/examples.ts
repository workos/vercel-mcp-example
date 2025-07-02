import { z } from 'zod';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { ServerRequest, ServerNotification } from '@modelcontextprotocol/sdk/types.js';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { ensureUserAuthenticated } from '../../auth/helpers';
import { 
  getExampleData, 
  createExampleData, 
  updateExampleData 
} from '../../business/examples';

// Infer the exact server type from createMcpHandler to avoid CommonJS/ESM conflicts
type MCPServer = Parameters<Parameters<typeof createMcpHandler>[0]>[0];

// Authenticated tools for example data management
export function registerExampleTools(server: MCPServer) {
  // Tool 2: List user's data - Authentication required
  server.tool(
    'listExampleData',
    "Retrieves a list of the authenticated user's example data items. Demonstrates user-specific data access with WorkOS authentication.",
    {},
    async (_args, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      const data = await getExampleData(user);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                userId: user.id,
                userEmail: user.email,
                data: data,
                message: 'Successfully retrieved user-specific data',
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // Tool 3: Create new data - Authentication required
  server.tool(
    'createExampleData',
    'Creates a new example data item for the authenticated user. Demonstrates authenticated CRUD operations with input validation.',
    {
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
      description: z
        .string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters'),
    },
    async (args: unknown, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      const typedArgs = args as { name: string; description: string };
      const newItem = await createExampleData(typedArgs, user);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                created: newItem,
                message: `Successfully created new item "${newItem.name}" for user ${user.email}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // Tool 4: Update existing data - Authentication required
  server.tool(
    'updateExampleData',
    'Updates an existing example data item owned by the authenticated user. Demonstrates ownership validation and partial updates.',
    {
      id: z.string().min(1, 'Item ID is required'),
      name: z.string().min(1).max(100).optional(),
      description: z.string().min(1).max(500).optional(),
    },
    async (args: unknown, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      const typedArgs = args as { id: string; name?: string; description?: string };
      const { id, ...updateData } = typedArgs;
      
      // Verify user owns the item before updating
      const updatedItem = await updateExampleData(id, updateData, user);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                updated: updatedItem,
                message: `Successfully updated item "${updatedItem.name}" for user ${user.email}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // Tool 5: Get user profile - Authentication required
  server.tool(
    'getUserProfile',
    "Returns the authenticated user's profile information from WorkOS. Demonstrates access to user identity and enterprise attributes.",
    {},
    async (_args, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                profile: user,
                source: 'WorkOS User Management API',
                message: 'Successfully retrieved authenticated user profile',
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
} 