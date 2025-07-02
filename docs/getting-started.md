# Getting Started with WorkOS MCP Authentication

This comprehensive guide will help you get the **AuthKit MCP Template** up and running, from initial setup to testing with real MCP clients.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** and npm/pnpm installed
- A **[WorkOS account](https://dashboard.workos.com)** (free tier available)
- Basic familiarity with TypeScript and Next.js
- An MCP client for testing (Claude Desktop, Cursor, etc.)

## Part 1: Environment Setup

### 1. **Clone and Install**

```bash
git clone https://github.com/workos/vercel-mcp-example.git
cd vercel-mcp-example
npm install
```

### 2. **Create Environment Configuration**

Copy the environment template:
```bash
cp .env.example .env.local
```

Your `.env.local` file should look like this:
```env
# Required: Get these from WorkOS Dashboard
WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here

# Required: Generate a secure cookie password
WORKOS_COOKIE_PASSWORD=your_32_character_secure_random_string

# Auto-configured for local development
WORKOS_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL=http://localhost:3000
```

### 3. **Generate Secure Cookie Password**

Create a secure cookie password for session encryption:
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as your `WORKOS_COOKIE_PASSWORD` value.

## Part 2: WorkOS Configuration

### 1. **Create WorkOS Account**

1. Visit [dashboard.workos.com](https://dashboard.workos.com) and sign up
2. Create a new project (give it a meaningful name like "MCP Authentication Demo")
3. You'll be taken to your project dashboard

### 2. **Get Your API Credentials**

1. Navigate to **"API Keys"** in the sidebar
2. Copy your **API Key** (starts with `sk_test_`) 
3. Copy your **Client ID** (starts with `client_`)
4. Add these to your `.env.local` file

### 3. **Configure AuthKit**

1. Navigate to **"AuthKit"** in the sidebar
2. Click **"Configure"** or **"Set up AuthKit"**
3. Add your redirect URI: `http://localhost:3000/callback`
4. Configure your preferred authentication methods:
   - **Email + Password**: For simple testing
   - **Google OAuth**: For SSO testing  
   - **GitHub OAuth**: For developer authentication
   - **Magic Link**: For passwordless authentication

### 4. **Verify Configuration**

Your final `.env.local` should look like this (with your actual values):
```env
WORKOS_API_KEY=sk_test_1234567890abcdef...
WORKOS_CLIENT_ID=client_1234567890abcdef...
WORKOS_COOKIE_PASSWORD=abc123XYZ789randomSecureString...
WORKOS_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL=http://localhost:3000
```

## Part 3: Local Testing

### 1. **Start the Development Server**

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.1s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.x:3000
```

### 2. **Test the Application**

1. **Open your browser** to [http://localhost:3000](http://localhost:3000)
2. **Test public endpoint**: Click "Test Public Tool" (should work immediately)
3. **Test authentication**: Click "Sign In with WorkOS" 
4. **Complete login**: Use any of your configured authentication methods
5. **Test authenticated endpoint**: Click "Test Authenticated Tool" (should now show your profile)

### 3. **Verify MCP Server**

Test your MCP server directly:

```bash
# Test public endpoint (no auth required)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "ping",
      "arguments": {}
    }
  }'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\n  \"result\": \"pong\",\n  \"timestamp\": \"2024-01-...\",\n  \"authenticated\": false,\n  \"message\": \"MCP server is healthy (public endpoint)\"\n}"
    }]
  }
}
```

## Part 4: MCP Client Integration

### Getting Your Access Token

After signing in to the web interface:

1. Visit [http://localhost:3000/debug](http://localhost:3000/debug)
2. Copy the `accessToken` value
3. Use this token for authenticated MCP calls

### Testing with curl

```bash
# Set your access token
export WORKOS_TOKEN="your_actual_token_from_debug_page"

# Test authenticated endpoint
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WORKOS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "getUserProfile",
      "arguments": {}
    }
  }'
```

### Claude Desktop Configuration

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "workos-auth-demo": {
      "command": "node",
      "args": ["-e", "require('http').request('http://localhost:3000/mcp', {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN_HERE'}}, (res) => { let data = ''; res.on('data', (chunk) => data += chunk); res.on('end', () => console.log(data)); }).end(JSON.stringify(process.argv[1] ? JSON.parse(process.argv[1]) : {}));"]
    }
  }
}
```

**Note**: Replace `YOUR_TOKEN_HERE` with your actual access token from the debug page.

## Part 5: Understanding the Code

### Key Files to Explore

1. **`app/mcp/route.ts`** - The main MCP server with authHandler pattern
2. **`app/components/TestingSection.tsx`** - Built-in testing interface
3. **`lib/business/examples.ts`** - Your business logic (replace this with your own)
4. **`lib/with-authkit.ts`** - Authentication utilities

### The AuthHandler Pattern

The core pattern is in `app/mcp/route.ts`:

```typescript
// 1. Build your MCP server
const handler = createMcpHandler((server) => {
  server.tool('getUserProfile', {}, async (args, { authInfo }) => {
    const user = getUserFromAuthInfo(authInfo); // Gets authenticated user
    return { content: [{ type: 'text', text: JSON.stringify(user) }] };
  });
});

// 2. Wrap with authentication
const authHandler = experimental_withMcpAuth(
  handler,
  async (request, token) => {
    const { payload } = await jwtVerify(token, JWKS); // Verify JWT
    const user = await workos.userManagement.getUser(payload.sub); // Get user
    return { token, clientId, scopes: [], extra: { user, claims: payload } };
  },
  { required: false } // Allow public tools
);

// 3. Export for deployment
export { authHandler as GET, authHandler as POST };
```

## Troubleshooting

### Common Issues

**1. "WORKOS_CLIENT_ID environment variable not set"**
- Ensure your `.env.local` file exists and has the correct values
- Restart your development server after changing environment variables

**2. "Invalid token signature"**
- Your access token may have expired - get a fresh one from `/debug`
- Check that your `WORKOS_CLIENT_ID` matches your WorkOS project

**3. "Redirect URI mismatch"**
- Ensure `http://localhost:3000/callback` is added to your WorkOS AuthKit configuration
- Check that your `WORKOS_REDIRECT_URI` environment variable is correct

**4. "Cannot find module" errors**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**5. Authentication flow redirects to wrong URL**
- Check your `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` environment variable
- Ensure it matches your actual local development URL

### Getting Help

- **Documentation**: Check the `/docs` folder for additional guides
- **Testing**: Use the built-in testing interface at [http://localhost:3000](http://localhost:3000)
- **Debug**: Visit [http://localhost:3000/debug](http://localhost:3000/debug) for token information
- **WorkOS Support**: Visit [WorkOS Documentation](https://workos.com/docs) for platform-specific help

## Next Steps

Once you have the basic setup working:

1. **[Customize for your use case](customization.md)** - Replace the example API with your business logic
2. **[Deploy to production](deployment.md)** - Deploy your authenticated MCP server to Vercel
3. **[Test with real MCP clients](TESTING.md)** - Connect Claude Desktop, Cursor, or other MCP clients
4. **Explore scenarios** - Visit [http://localhost:3000/scenarios](http://localhost:3000/scenarios) for guided testing

**Congratulations!** You now have a working authenticated MCP server using the authHandler pattern. The combination of Vercel AI SDK and WorkOS AuthKit gives you enterprise-grade security with developer-friendly implementation.
