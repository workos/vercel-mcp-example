# Testing Your WorkOS AuthKit MCP Server

This guide walks you through testing the complete authentication flow from OAuth login to authenticated MCP tool usage.

## Prerequisites

1. **WorkOS Account Setup**
   - Create a WorkOS account at [dashboard.workos.com](https://dashboard.workos.com)
   - Create a new project
   - Note your `WORKOS_CLIENT_ID` and `WORKOS_API_KEY`

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your WorkOS credentials:
   ```env
   WORKOS_API_KEY="sk_test_your_api_key"
   WORKOS_CLIENT_ID="client_your_client_id"
   WORKOS_COOKIE_PASSWORD="your_cookie_password_32_chars_min"
   NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL="http://localhost:3000"
   REDIS_URL="redis://localhost:6379"
   ```

3. **Redis Setup**
   ```bash
   # Start Redis (required for session storage)
   docker run --name mcp-redis -d -p 6379:6379 redis
   ```

## Step 1: Verify Build and Server Startup

```bash
# Ensure everything compiles
npm run lint && npm run build

# Start the development server
npm run dev
```

**✅ Expected Output:**
- Lint passes with no errors
- Build completes successfully  
- Server starts on http://localhost:3000

## Step 2: Test Unauthenticated MCP Access (Should Fail)

```bash
curl -i -X POST http://localhost:3000/mcp \
-H "Content-Type: application/json" \
-d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}'
```

**✅ Expected Output:**
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "mcp_version": "1.0",
  "error": "unauthorized", 
  "error_description": "Missing or invalid authorization token."
}
```

This confirms authentication is properly enforced.

## Step 3: Test OAuth Login Flow

1. **Open your browser** and visit the login endpoint: http://localhost:3000/login
   
   This endpoint uses WorkOS SDK's `getAuthorizationUrl()` method to properly handle the OAuth flow with dynamic URLs.

2. **Complete the OAuth flow:**
   - You'll be redirected to WorkOS's login page
   - Sign in or create a test account  
   - You'll be redirected back to `http://localhost:3000/callback`
   - The callback should set a session cookie and redirect to `/`

3. **Verify the session:** Check your browser's developer tools to confirm a `workos-session` cookie was set.

## Step 4: Extract Access Token for MCP Testing

Now we need to get the access token from your authenticated session to use with MCP calls.

### 4a. Get Your Access Token

After completing OAuth login, visit: http://localhost:3000/debug

**✅ Expected Output:**
```json
{
  "accessToken": "YOUR_ACTUAL_WORKOS_ACCESS_TOKEN_WILL_APPEAR_HERE",
  "instructions": "Use this token as Authorization: Bearer <token> for MCP calls"
}
```

Copy the `accessToken` value.

## Step 5: Test Authenticated MCP Tools

Now use the real access token for MCP calls:

```bash
# Set your real access token from the debug endpoint
export WORKOS_TOKEN="PASTE_YOUR_ACTUAL_TOKEN_HERE"

# Test listing tools
curl -X POST http://localhost:3000/mcp \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $WORKOS_TOKEN" \
-d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}'
```

**✅ Expected Output:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "listExampleData",
        "description": "Retrieves a list of the user's example data items."
      },
      {
        "name": "createExampleData",
        "description": "Creates a new example data item for the authenticated user."
      },
      {
        "name": "updateExampleData", 
        "description": "Updates an existing example data item."
      },
      {
        "name": "getUserProfile",
        "description": "Returns the authenticated user's profile information."
      }
    ]
  }
}
```

## Step 6: Test Each Tool with Real User Context

**Test getUserProfile:**
```bash
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

**Test createExampleData:**
```bash
curl -X POST http://localhost:3000/mcp \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $WORKOS_TOKEN" \
-d '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "createExampleData",
    "arguments": {
      "name": "OAuth Test Item",
      "description": "Created after successful OAuth login"
    }
  }
}'
```

**Test listExampleData:**
```bash
curl -X POST http://localhost:3000/mcp \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $WORKOS_TOKEN" \
-d '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "listExampleData",
    "arguments": {}
  }
}'
```

**✅ Expected Results:**
- `getUserProfile` returns your actual WorkOS user information
- `createExampleData` successfully creates an item associated with your user ID
- `listExampleData` shows items created by your authenticated user

## Step 7: Clean Up (Optional)

```bash
# Remove debug endpoint
rm app/debug/route.ts

# Stop Redis
docker stop mcp-redis && docker rm mcp-redis
```

## Troubleshooting

### OAuth Issues
- **"Invalid redirect_uri"**: Ensure your WorkOS project has `http://localhost:3000/callback` as an allowed redirect URI
- **"Client not found"**: Verify your `WORKOS_CLIENT_ID` is correct
- **Cookie not set**: Check browser dev tools and ensure the callback route is working

### MCP Authentication Issues  
- **Still getting 401**: Verify the access token is valid and not expired
- **"Missing user"**: Ensure the token was issued by WorkOS and contains proper user claims
- **Redis errors**: Ensure Redis is running on port 6379

### General Issues
- **Build failures**: Run `npm run lint` to check for TypeScript errors
- **Server won't start**: Check that port 3000 is available
- **Tool call failures**: Verify the JSON-RPC format matches the examples exactly

This confirms the complete end-to-end authentication flow works correctly with real WorkOS OAuth tokens! 