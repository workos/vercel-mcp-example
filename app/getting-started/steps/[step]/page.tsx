'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useTheme } from 'next-themes';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import Navigation from '../../../components/Navigation';
import MermaidDiagram from '../../../components/MermaidDiagram';

// Register languages
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);

interface Step {
  slug: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  content: StepContent[];
}

interface StepContent {
  type:
    | 'text'
    | 'code'
    | 'warning'
    | 'tip'
    | 'prerequisites'
    | 'interactive'
    | 'diagram';
  content: string;
  language?: string;
  title?: string;
}

type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

const steps: Step[] = [
  {
    slug: 'clone-and-run',
    title: 'Clone & Run',
    description:
      'Get the template running locally and understand the basic setup',
    duration: '3 min',
    category: 'setup',
    content: [
      {
        type: 'prerequisites',
        content:
          'Node.js 18+, Git, and a WorkOS account (free tier available).',
      },
      {
        type: 'text',
        content:
          "Let's get this MCP authentication template running so you can use it as a foundation for your own authenticated MCP server.",
      },
      {
        type: 'text',
        content: '**Step 1: Clone and Install**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `git clone https://github.com/workos/vercel-mcp-example.git
cd vercel-mcp-example
npm install`,
      },
      {
        type: 'text',
        content: '**Step 2: Set Up WorkOS**',
      },
      {
        type: 'text',
        content:
          '1. Create a [WorkOS account](https://dashboard.workos.com) (free)\n2. Create a new project\n3. Go to **API Keys** → copy your `API Key` and `Client ID`\n4. Go to **AuthKit** → add `http://localhost:3000/callback` as a redirect URI',
      },
      {
        type: 'text',
        content: '**Step 3: Configure Environment**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `cp .env.example .env.local`,
      },
      {
        type: 'text',
        content: 'Fill in your `.env.local` file:',
      },
      {
        type: 'code',
        language: 'bash',
        title: '.env.local',
        content: `WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here
WORKOS_COOKIE_PASSWORD=your_32_character_secure_random_string
WORKOS_REDIRECT_URI=http://localhost:3000/callback`,
      },
      {
        type: 'text',
        content: '**Step 4: Start the Server**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `npm run dev`,
      },
      {
        type: 'text',
        content: '**Step 5: Verify Setup**',
      },
      {
        type: 'text',
        content:
          'Visit [http://localhost:3000](http://localhost:3000). You should see the demo with testing sections. This confirms your MCP server is running with authentication.',
      },
      {
        type: 'tip',
        content:
          '💡 **You now have a working authenticated MCP server!** The next steps will teach you how to replace the example tools with your own business logic.',
      },
    ],
  },
  {
    slug: 'understand-the-pattern',
    title: 'Understand the AuthHandler Pattern',
    description:
      'Learn how the authHandler wrapper transforms any MCP server into an authenticated service',
    duration: '3 min',
    category: 'concepts',
    content: [
      {
        type: 'text',
        content:
          'The authHandler pattern is the key to this template. It allows you to build MCP servers with mixed authentication requirements - some tools public, others requiring user authentication.',
      },
      {
        type: 'text',
        content: '**🔄 Complete Authentication Flow**',
      },
      {
        type: 'text',
        content:
          "Here's how the entire authentication process works from an incoming MCP request to a resolved user profile:",
      },
      {
        type: 'diagram',
        title: 'AuthHandler Pattern: Complete Authentication Flow',
        content: `flowchart TD
    A["🤖 MCP Client Request"] --> B{Token Provided?}
    
    B -->|No| C["🔓 Public Tool Access"]
    C --> D["Call ensureUserAuthenticated()"]
    D --> E{Auth Required?}
    E -->|No| F["✅ Execute Tool (ping)"]
    E -->|Yes| G["❌ Throw Auth Error"]
    
    B -->|Yes| H["🔐 withMcpAuth"]
    H --> I["📋 Extract Bearer Token"]
    I --> J["🔍 Verify JWT with WorkOS JWKS"]
    J --> K{Valid JWT?}
    
    K -->|No| L["❌ Invalid Token Error"]
    K -->|Yes| M["📄 Extract payload.sub (User ID)"]
    M --> N["🌐 workos.userManagement.getUser()"]
    N --> O{User Found?}
    
    O -->|No| P["❌ User Not Found Error"]
    O -->|Yes| Q["✅ Create AuthInfo Object"]
    Q --> R["🎯 Route to Tool Handler"]
    R --> S["🔧 Tool Calls ensureUserAuthenticated()"]
    S --> T["👤 Extract User from authInfo.extra"]
    T --> U["🎉 Execute Authenticated Tool"]
    
    F --> V["📤 Return Response"]
    G --> V
    L --> V  
    P --> V
    U --> V`,
      },
      {
        type: 'text',
        content: '**📁 Where to Find the AuthHandler Pattern**',
      },
      {
        type: 'text',
        content:
          "Open `app/mcp/route.ts` - this is the **main MCP server file** where the authHandler pattern is implemented. You'll see the complete flow from building tools to adding authentication.",
      },
      {
        type: 'text',
        content: '**The Core Pattern (in `app/mcp/route.ts`)**',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'app/mcp/route.ts - The 3-step authHandler pattern',
        content: `// 1. Build your MCP server (business logic)
const handler = createMcpHandler((server) => {
  // Register tool modules (line ~32-34 in app/mcp/route.ts)
  registerPublicTools(server);    // From lib/mcp/tools/public.ts
  registerExampleTools(server);   // From lib/mcp/tools/examples.ts
});

// 2. Add authentication wrapper (line ~37-80 in app/mcp/route.ts)
const authHandler = withMcpAuth(
  handler,
  async (request, token) => {
    // Verify JWT and get user from WorkOS
    const { payload } = await jwtVerify(token, JWKS);
    const user = await workos.userManagement.getUser(payload.sub);
    return { token, clientId, scopes: [], extra: { user, claims: payload } };
  }
);

// 3. Export for deployment (line ~101 in app/mcp/route.ts)
export { authHandler as GET, authHandler as POST };`,
      },
      {
        type: 'text',
        content: '**📁 Key Helper Functions (in `lib/auth/helpers.ts`)**',
      },
      {
        type: 'text',
        content:
          'Open `lib/auth/helpers.ts` to see the authentication helpers used throughout the tools:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/auth/helpers.ts - Authentication helpers',
        content: `// This helper ensures user is authenticated and extracts user data
// Throws an error if user is not authenticated
export const ensureUserAuthenticated = (authInfo: any): User => {
  const workosAuth = authInfo?.extra as WorkOSAuthInfo;
  if (!workosAuth || !workosAuth.user) {
    throw new Error('Authentication required for this tool');
  }
  return workosAuth.user;
};

// Helper to check if request is authenticated (for optional auth tools)
export const isAuthenticated = (authInfo: any): boolean => {
  const workosAuth = authInfo?.extra as WorkOSAuthInfo;
  return !!(workosAuth && workosAuth.user);
};

// Use these in your tools like this:
server.tool('protectedTool', {}, async (args, { authInfo }) => {
  const user = ensureUserAuthenticated(authInfo); // User object or throws
  // Now you can safely use user.id, user.email, etc.
});`,
      },
      {
        type: 'text',
        content: '**📁 See It In Action (in `lib/mcp/tools/public.ts`)**',
      },
      {
        type: 'text',
        content:
          'Open `lib/mcp/tools/public.ts` to see how the `ping` tool uses optional authentication:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/mcp/tools/public.ts - Mixed authentication example',
        content: `// Public tool with optional authentication awareness
server.tool('ping', 'Health check endpoint', {}, async (args, { authInfo }) => {
  const isAuth = isAuthenticated(authInfo); // Uses helper from lib/auth/helpers.ts
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        result: 'pong',
        timestamp: new Date().toISOString(),
        authenticated: isAuth,
        message: isAuth 
          ? 'MCP server is healthy and user is authenticated'
          : 'MCP server is healthy (public endpoint)'
      }, null, 2)
    }]
  };
});`,
      },
      {
        type: 'tip',
        content:
          '💡 **Key insight:** The authHandler lets you mix public and private tools in the same server. Private tools use `ensureUserAuthenticated()`, public tools can use `isAuthenticated()` for optional auth awareness.',
      },
    ],
  },
  {
    slug: 'implement-your-tools',
    title: 'Implement Your Own Tools',
    description: 'Replace the example tools with your own business logic',
    duration: '10 min',
    category: 'implementation',
    content: [
      {
        type: 'text',
        content:
          "Now let's replace the example tools with your own business logic. We'll modify the existing example data tools to demonstrate the patterns.",
      },
      {
        type: 'text',
        content: '**📁 Step 1: Explore the Current Structure**',
      },
      {
        type: 'text',
        content:
          'Open these files to understand the current setup:\n- **`app/mcp/route.ts`** - Main MCP server (lines 32-34 register the tools)\n- **`lib/mcp/tools/public.ts`** - Public tools (ping)\n- **`lib/mcp/tools/examples.ts`** - Authenticated tools (listExampleData, createExampleData, etc.)\n- **`lib/business/examples.ts`** - Business logic functions',
      },
      {
        type: 'text',
        content:
          "The current tools in `lib/mcp/tools/examples.ts` are:\n- `listExampleData` - Get user's example data\n- `createExampleData` - Create new example data\n- `updateExampleData` - Update existing data\n- `getUserProfile` - Get WorkOS user profile",
      },
      {
        type: 'text',
        content:
          '**📁 Step 2: Modify Business Logic in `lib/business/examples.ts`**',
      },
      {
        type: 'text',
        content:
          '**Open `lib/business/examples.ts`** and replace the mock functions with your own logic:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/business/examples.ts - Replace with your business logic',
        content: `import { User } from "../auth/types";

// Define your data model
export interface TaskData {
  id: string;
  title: string;
  description: string;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

// Replace getExampleData with your own function
export const getExampleData = async (user: User): Promise<TaskData[]> => {
  // Replace with your database/API calls
  // For now, returning mock data
  return [
    {
      id: "1",
      title: "Complete MCP server setup",
      description: "Set up authentication with WorkOS",
      userId: user.id,
      priority: 'high',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];
};

// Replace createExampleData with your own function  
export const createExampleData = async (
  data: { name: string; description: string },
  user: User,
): Promise<TaskData> => {
  // Replace with your database/API calls
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: data.name, // name becomes title
    description: data.description,
    userId: user.id,
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
};

// Replace updateExampleData with your own function
export const updateExampleData = async (
  id: string,
  data: { name?: string; description?: string },
  user: User,
): Promise<TaskData> => {
  // Replace with your database/API calls
  const existing = await getExampleData(user);
  const item = existing.find((item) => item.id === id);

  if (!item) {
    throw new Error("Task not found or access denied");
  }

  return {
    ...item,
    title: data.name || item.title,
    description: data.description || item.description,
    updatedAt: new Date().toISOString(),
  };
};`,
      },
      {
        type: 'text',
        content: '**📁 Step 3: Customize Tool Descriptions (Optional)**',
      },
      {
        type: 'text',
        content:
          '**Open `lib/mcp/tools/examples.ts`** and update the tool descriptions to match your domain (around lines 17, 42, 68, and 114):',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/mcp/tools/examples.ts - Update descriptions',
        content: `  // Update the tool descriptions to match your domain
  server.tool(
    'listExampleData',
    "Retrieves a list of the authenticated user's tasks. Demonstrates user-specific data access.",
    {},
    async (_args, extra) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      const data = await getExampleData(user);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            tasks: data, // Changed from 'data' to 'tasks'
            message: 'Successfully retrieved user tasks',
          }, null, 2),
        }],
      };
    },
  );

  server.tool(
    'createExampleData',
    'Creates a new task for the authenticated user. Demonstrates authenticated CRUD operations.',
    {
      name: z.string().min(1, 'Task title is required').max(100),
      description: z.string().min(1, 'Task description is required').max(500),
    },
    async (args, extra) => {
      const { authInfo } = extra;
      const user = ensureUserAuthenticated(authInfo);
      const typedArgs = args as { name: string; description: string };
      const newTask = await createExampleData(typedArgs, user);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            created: newTask,
            message: \`Successfully created task "\${newTask.title}" for user \${user.email}\`,
          }, null, 2),
        }],
      };
    },
  );`,
      },
      {
        type: 'text',
        content: '**📁 Step 4: Test Your New Tools**',
      },
      {
        type: 'text',
        content:
          '1. **Save all your changes** in `lib/business/examples.ts` and `lib/mcp/tools/examples.ts`\n2. **Restart the dev server**: `npm run dev`\n3. **Visit [http://localhost:3000](http://localhost:3000)** and sign in with WorkOS\n4. **Test your tools** using the interactive testing section on the homepage\n5. **Watch the terminal** output to see your tools being called with authentication',
      },
      {
        type: 'tip',
        content:
          "💡 **Pro tip:** Use the interactive testing section on the homepage to quickly test your tools. The **'Test Authenticated Route'** button calls `getUserProfile`, and you can see the live MCP requests in your terminal logs.",
      },
    ],
  },
  {
    slug: 'organize-your-code',
    title: 'Organize Your Code',
    description:
      'Learn where to put utilities, business logic, and how to structure larger MCP servers',
    duration: '5 min',
    category: 'best-practices',
    content: [
      {
        type: 'text',
        content:
          "As your MCP server grows, you'll want to organize your code properly. Here's how this template is already structured:",
      },
      {
        type: 'text',
        content: '**Current File Structure**',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Current organization (already implemented)',
        content: `lib/
├── auth/
│   ├── helpers.ts        # ensureUserAuthenticated, isAuthenticated
│   └── types.ts          # User, WorkOSAuthInfo types
├── business/
│   └── examples.ts       # Example business logic (replace with yours)
├── mcp/
│   └── tools/
│       ├── public.ts     # Public tools (ping, status)
│       └── examples.ts   # Example authenticated tools
└── with-authkit.ts       # WorkOS AuthKit utilities

app/
└── mcp/
    └── route.ts          # Main MCP server with authHandler pattern`,
      },
      {
        type: 'text',
        content: '**Already Implemented: Auth Helpers**',
      },
      {
        type: 'text',
        content: 'The auth helpers are already in `lib/auth/helpers.ts`:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/auth/helpers.ts (already exists)',
        content: `import { User, WorkOSAuthInfo } from './types';

// Ensures user is authenticated and extracts user from authInfo
// Throws an error if user is not authenticated - use for tools that require auth
export const ensureUserAuthenticated = (authInfo: any): User => {
  const workosAuth = authInfo?.extra as WorkOSAuthInfo;
  if (!workosAuth || !workosAuth.user) {
    throw new Error('Authentication required for this tool');
  }
  return workosAuth.user;
};

// Helper to check if request is authenticated (for optional auth tools)
export const isAuthenticated = (authInfo: any): boolean => {
  const workosAuth = authInfo?.extra as WorkOSAuthInfo;
  return !!(workosAuth && workosAuth.user);
};`,
      },
      {
        type: 'text',
        content: '**Already Implemented: Modular Tools**',
      },
      {
        type: 'text',
        content: 'Tools are already organized in `lib/mcp/tools/`:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/mcp/tools/public.ts (already exists)',
        content: `// Public tools that work without authentication
export function registerPublicTools(server: MCPServer) {
  server.tool('ping', 'Health check endpoint', {}, async (args, { authInfo }) => {
    const isAuth = isAuthenticated(authInfo);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          result: 'pong',
          timestamp: new Date().toISOString(),
          authenticated: isAuth,
          message: isAuth 
            ? 'MCP server is healthy and user is authenticated'
            : 'MCP server is healthy (public endpoint)'
        }, null, 2)
      }]
    };
  });
}`,
      },
      {
        type: 'text',
        content: '**📁 How to Extend the Structure**',
      },
      {
        type: 'text',
        content:
          'To add your own domain-specific tools, **create new files** and update the main server:',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Create new tool modules (example commands)',
        content: `# Create domain-specific tool files
touch lib/mcp/tools/tasks.ts      # Your task management tools
touch lib/mcp/tools/users.ts      # Your user management tools

# Create corresponding business logic
touch lib/business/tasks.ts       # Task-related business logic
touch lib/business/users.ts       # User-related business logic`,
      },
      {
        type: 'text',
        content: '**📁 Register New Tools in `app/mcp/route.ts`**',
      },
      {
        type: 'text',
        content:
          '**Edit lines 20-21 and 32-34** in `app/mcp/route.ts` to import and register your new tool modules:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'app/mcp/route.ts - Add your new imports and registrations',
        content: `// Add these imports around line 20-21
import { registerPublicTools } from '@/lib/mcp/tools/public';
import { registerExampleTools } from '@/lib/mcp/tools/examples';
import { registerTaskTools } from '@/lib/mcp/tools/tasks';      // Your new import
import { registerUserTools } from '@/lib/mcp/tools/users';      // Your new import

// Update the handler around line 32-34
const handler = createMcpHandler((server) => {
  registerPublicTools(server);      // Keep existing
  registerExampleTools(server);     // Keep existing  
  registerTaskTools(server);        // Your new registration
  registerUserTools(server);        // Your new registration
});`,
      },
      {
        type: 'tip',
        content:
          '💡 **Benefits:** This structure makes your code easier to test, maintain, and scale. Each module has a single responsibility, and you can easily add new tool categories.',
      },
    ],
  },
  {
    slug: 'connect-mcp-clients',
    title: 'Connect MCP Clients',
    description:
      'Configure Claude, Cursor, and other MCP clients to use your server',
    duration: '8 min',
    category: 'integration',
    content: [
      {
        type: 'prerequisites',
        content:
          'Your MCP server running locally, WorkOS authentication set up, and Claude Desktop or Cursor installed.',
      },
      {
        type: 'text',
        content:
          'Now connect real AI clients to your authenticated MCP server.',
      },
      {
        type: 'text',
        content: '**Step 1: Get Your Authentication Token**',
      },
      {
        type: 'text',
        content:
          '1. Go to [http://localhost:3000](http://localhost:3000) and sign in\n2. Open browser dev tools (F12)\n3. Go to **Application** → **Storage** → **Cookies** → **localhost:3000**\n4. Copy the value of the `workos-session` cookie',
      },
      {
        type: 'text',
        content: '**Step 2: Configure Claude Desktop**',
      },
      {
        type: 'text',
        content: 'Edit your Claude Desktop MCP configuration file:',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Find Claude config file',
        content: `# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Windows  
%APPDATA%/Claude/claude_desktop_config.json`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Claude Desktop configuration',
        content: `{
  "mcpServers": {
    "vercel-mcp-example": {
      "command": "node",
      "args": [
        "/path/to/vercel-mcp-example/dist/mcp-client.js"
      ],
      "env": {
        "MCP_SERVER_URL": "http://localhost:3000/mcp",
        "MCP_AUTH_TOKEN": "your_workos_session_cookie_value_here"
      }
    }
  }
}`,
      },
      {
        type: 'text',
        content: '**Step 3: Configure Cursor**',
      },
      {
        type: 'text',
        content:
          'In Cursor, go to **Settings** → **Features** → **MCP** and add:',
      },
      {
        type: 'code',
        language: 'json',
        title: 'Cursor MCP configuration',
        content: `{
  "servers": {
    "vercel-mcp-example": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer your_workos_session_cookie_value_here"
      }
    }
  }
}`,
      },
      {
        type: 'text',
        content: '**Step 4: Test the Connection**',
      },
      {
        type: 'text',
        content: 'In your MCP client, try these commands:',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Test commands for your MCP client',
        content: `# Test public tool (should work without authentication)
"Can you ping the server?"

# Test authenticated tools (should work with valid token)
"Get my user profile"
"List my example data"  
"Create a new example data item called 'Test MCP integration' with description 'Testing the connection'"

# Without authentication (should fail gracefully)
# Remove the auth token and try the authenticated commands`,
      },
      {
        type: 'text',
        content: '**Step 5: Handle Token Refresh**',
      },
      {
        type: 'text',
        content:
          'WorkOS tokens expire. For production, implement automatic token refresh:',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Token refresh strategy',
        content: `// Option 1: Long-lived API tokens (recommended for development)
// Create API tokens in WorkOS dashboard that don't expire

// Option 2: Implement refresh flow (recommended for production)
// Add a refresh endpoint to your MCP server that clients can call

// Option 3: Machine-to-machine authentication
// Use WorkOS API keys for server-to-server MCP connections`,
      },
      {
        type: 'tip',
        content:
          '💡 **Pro tip:** For development, use the session cookie method. For production deployment, implement proper machine-to-machine authentication or long-lived API tokens.',
      },
    ],
  },
  {
    slug: 'deploy-to-production',
    title: 'Deploy to Production',
    description:
      'Deploy your authenticated MCP server to Vercel with proper environment configuration',
    duration: '5 min',
    category: 'deployment',
    content: [
      {
        type: 'text',
        content:
          'Deploy your authenticated MCP server to production with Vercel Edge.',
      },
      {
        type: 'text',
        content: '**Step 1: Install Vercel CLI**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `npm install -g vercel`,
      },
      {
        type: 'text',
        content: '**Step 2: Set Production Environment Variables**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `vercel env add WORKOS_API_KEY
vercel env add WORKOS_CLIENT_ID  
vercel env add WORKOS_COOKIE_PASSWORD
vercel env add WORKOS_REDIRECT_URI`,
      },
      {
        type: 'text',
        content: 'Use these values for production:',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Production environment values',
        content: `WORKOS_API_KEY=sk_live_your_production_api_key
WORKOS_CLIENT_ID=client_your_production_client_id
WORKOS_COOKIE_PASSWORD=your_secure_random_32_char_string
WORKOS_REDIRECT_URI=https://your-domain.vercel.app/callback`,
      },
      {
        type: 'text',
        content: '**Step 3: Update WorkOS Redirect URIs**',
      },
      {
        type: 'text',
        content:
          'In your WorkOS dashboard:\n1. Go to **AuthKit** → **Redirect URIs**\n2. Add your production URL: `https://your-domain.vercel.app/callback`',
      },
      {
        type: 'text',
        content: '**Step 4: Deploy**',
      },
      {
        type: 'code',
        language: 'bash',
        content: `vercel deploy --prod`,
      },
      {
        type: 'text',
        content: '**Step 5: Update MCP Client Configurations**',
      },
      {
        type: 'text',
        content: 'Update your MCP clients to use the production URL:',
      },
      {
        type: 'code',
        language: 'json',
        title: 'Production MCP client config',
        content: `{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": ["/path/to/mcp-client.js"],
      "env": {
        "MCP_SERVER_URL": "https://your-domain.vercel.app/mcp",
        "MCP_AUTH_TOKEN": "your_production_auth_token"
      }
    }
  }
}`,
      },
      {
        type: 'text',
        content: '**Step 6: Monitor and Scale**',
      },
      {
        type: 'text',
        content:
          'Vercel automatically handles:\n- **Global CDN distribution**\n- **Automatic scaling**\n- **SSL certificates**\n- **Performance monitoring**',
      },
      {
        type: 'tip',
        content:
          '🎉 **Congratulations!** Your authenticated MCP server is now running in production with enterprise-grade security, global performance, and automatic scaling.',
      },
    ],
  },
  {
    slug: 'verify-your-server',
    title: 'Verify Your Server',
    description:
      'Test your deployed MCP server using the official Model Context Protocol Inspector',
    duration: '5 min',
    category: 'testing',
    content: [
      {
        type: 'text',
        content:
          'The official MCP Inspector is a powerful tool for testing and debugging your deployed MCP server. It provides both command-line and web interfaces for comprehensive testing.',
      },
      {
        type: 'text',
        content: '**Step 1: Install and Test with CLI**',
      },
      {
        type: 'text',
        content:
          "Test your deployed server's basic connectivity and list available tools:",
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Test server connectivity and list tools',
        content: `# Test your current server:
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/list --transport http

# Example with deployed URL:
npx @modelcontextprotocol/inspector --cli https://vercel-mcp-example.vercel.app/mcp --method tools/list --transport http`,
      },
      {
        type: 'text',
        content: '**Step 2: Test Individual Tools**',
      },
      {
        type: 'text',
        content: "Test specific tools to verify they're working correctly:",
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Test individual tools',
        content: `# Test the public ping tool (no auth required)
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/call --tool-name ping --transport http

# Test authenticated tools (requires token)
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/call --tool-name getUserProfile --transport http --header "Authorization=Bearer your_token_here"

# List available resources
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method resources/list --transport http

# List available prompts
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method prompts/list --transport http`,
      },
      {
        type: 'text',
        content: '**Step 3: Use the Web Interface**',
      },
      {
        type: 'text',
        content: 'For more interactive testing, launch the web interface:',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Launch web interface',
        content: `# Start the web inspector (opens browser automatically)
npx @modelcontextprotocol/inspector {{MCP_URL}} --transport http

# The web interface will start on http://localhost:6274`,
      },
      {
        type: 'text',
        content:
          '**Web Interface Features:**\n- **Server connection pane** - Configure transport settings and connection parameters\n- **Resources tab** - Browse and inspect available resources with metadata\n- **Tools tab** - Test tools with custom inputs and view execution results\n- **Prompts tab** - Test prompt templates with custom arguments\n- **Notifications tab** - Monitor real-time server updates',
      },
      {
        type: 'text',
        content: '**Step 4: Test Authentication Flow**',
      },
      {
        type: 'text',
        content: 'Test both public and authenticated endpoints:',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Complete testing workflow',
        content: `# 1. Test public endpoint (should work)
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/call --tool-name ping --transport http

# 2. Test authenticated endpoint without token (should fail gracefully)
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/call --tool-name getUserProfile --transport http

# 3. Get auth token from your app
# Visit {{WEB_URL}}, sign in, copy session cookie

# 4. Test authenticated endpoint with token (should work)
npx @modelcontextprotocol/inspector --cli {{MCP_URL}} --method tools/call --tool-name getUserProfile --transport http --header "Authorization=Bearer your_session_cookie"`,
      },
      {
        type: 'warning',
        content:
          "**CORS Configuration:** If you encounter 'Bad Request: No valid session ID provided' errors, ensure your server allows the `mcp-session-id` header in CORS configuration. This template handles this automatically.",
      },

      {
        type: 'tip',
        content:
          '💡 **Pro tip:** The Inspector automatically falls back between transport types. It tries Streamable HTTP first (recommended for remote servers) and falls back to SSE if needed. This makes it reliable for testing various MCP server configurations.',
      },
    ],
  },
];

export default function StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mcpUrl, setMcpUrl] = useState('http://localhost:3000/mcp');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user-profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch {
        // User not authenticated, which is fine
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // Set dynamic MCP URL
    if (typeof window !== 'undefined') {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      setMcpUrl(
        isLocalhost
          ? 'http://localhost:3000/mcp'
          : `https://${window.location.host}/mcp`
      );
    }
  }, []);

  const currentStep = steps.find((s) => s.slug === step);
  if (!currentStep) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  const replaceUrlPlaceholders = (text: string) => {
    const webUrl =
      typeof window !== 'undefined'
        ? window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : `https://${window.location.host}`
        : 'http://localhost:3000';

    return text
      .replace(/\{\{MCP_URL\}\}/g, mcpUrl)
      .replace(/\{\{WEB_URL\}\}/g, webUrl);
  };

  const renderContent = (content: StepContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div
            key={index}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <div
              className="text-gray-700 dark:text-neutral-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: content.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br>')
                  .replace(
                    /\[(.*?)\]\((.*?)\)/g,
                    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
                  ),
              }}
            />
          </div>
        );

      case 'code':
        return (
          <div
            key={index}
            className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800"
          >
            {content.title && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {content.title}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-300 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  {content.language}
                </span>
              </div>
            )}
            <pre className="p-6 overflow-x-auto">
              <SyntaxHighlighter
                language={content.language || 'text'}
                style={theme === 'dark' ? oneDark : oneLight}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                }}
              >
                {replaceUrlPlaceholders(content.content)}
              </SyntaxHighlighter>
            </pre>
          </div>
        );

      case 'warning':
        return (
          <div
            key={index}
            className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-6 rounded-r-lg"
          >
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div
                className="text-red-800 dark:text-red-200"
                dangerouslySetInnerHTML={{
                  __html: content.content.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>'
                  ),
                }}
              />
            </div>
          </div>
        );

      case 'tip':
        return (
          <div
            key={index}
            className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-6 rounded-r-lg"
          >
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div
                className="text-amber-800 dark:text-amber-200"
                dangerouslySetInnerHTML={{
                  __html: content.content.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>'
                  ),
                }}
              />
            </div>
          </div>
        );

      case 'prerequisites':
        return (
          <div
            key={index}
            className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-400 p-6 rounded-r-lg"
          >
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
                  Prerequisites
                </h4>
                <p className="text-blue-800 dark:text-blue-200">
                  {content.content}
                </p>
              </div>
            </div>
          </div>
        );

      case 'interactive':
        if (content.content === 'ping') {
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🧪 Try It Now: Ping Tool
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Test the public ping tool directly from this page:
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/ping-mcp');
                    const data = await response.json();
                    alert(
                      `Success! Response: ${JSON.stringify(data, null, 2)}`
                    );
                  } catch (error) {
                    alert(
                      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                    );
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Test Ping Tool
              </button>
            </div>
          );
        }

        if (content.content === 'getUserProfile' && user) {
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔐 Try It Now: Get User Profile
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Test the authenticated getUserProfile tool with your current
                session:
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/user-profile', {
                      credentials: 'include',
                    });
                    const data = await response.json();
                    alert(
                      `Success! Your profile: ${JSON.stringify(data, null, 2)}`
                    );
                  } catch (error) {
                    alert(
                      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                    );
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Test Get Profile Tool
              </button>
            </div>
          );
        }

        return null;

      case 'diagram':
        return (
          <div key={index} className="my-8">
            {content.title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {content.title}
              </h3>
            )}
            <MermaidDiagram id={`diagram-${index}`} chart={content.content} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation user={user} />

      <div className="max-w-4xl mx-auto pt-24 px-4 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/getting-started"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Getting Started Guide
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Estimated time: {currentStep.duration}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentStep.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-400">
            {currentStep.description}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentStep.content.map((content, index) =>
            renderContent(content, index)
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
          <div>
            {steps.findIndex((s) => s.slug === step) > 0 && (
              <Link
                href={`/getting-started/steps/${steps[steps.findIndex((s) => s.slug === step) - 1].slug}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous Step
              </Link>
            )}
          </div>
          <div>
            {steps.findIndex((s) => s.slug === step) < steps.length - 1 && (
              <Link
                href={`/getting-started/steps/${steps[steps.findIndex((s) => s.slug === step) + 1].slug}`}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Next Step
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
