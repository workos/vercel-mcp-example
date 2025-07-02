import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET(req: NextRequest) {
  try {
    const { user, accessToken } = await withAuth();

    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        message: 'Please sign in to test this authenticated tool'
      }, { status: 401 });
    }

    // Make a request to our MCP server with the session token
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const mcpUrl = `${protocol}://${host}/mcp`;
    
    const mcpRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'getUserProfile',
        arguments: {}
      }
    };

    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(mcpRequest),
    });

    if (!response.ok) {
      console.error('MCP response not ok:', response.status, response.statusText);
      
      // Handle authentication-related errors from MCP server
      if (response.status === 500) {
        return NextResponse.json({ 
          error: 'Authentication failed', 
          message: 'Your session is invalid or expired. Please sign in again.'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: `MCP server error: ${response.statusText}`,
        message: 'There was an issue communicating with the MCP server'
      }, { status: response.status });
    }

    // Handle server-sent events
    const responseText = await response.text();
    console.log('Raw MCP response:', responseText);
    
    // Parse the SSE response
    const lines = responseText.split('\n');
    let mcpResponse = null;
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          mcpResponse = JSON.parse(line.substring(6));
          break;
        } catch (e) {
          console.error('Failed to parse SSE data:', e);
        }
      }
    }
    
    if (!mcpResponse) {
      return NextResponse.json({ error: 'No valid response from MCP server' }, { status: 500 });
    }
    
    if (mcpResponse.error) {
      return NextResponse.json({ error: mcpResponse.error }, { status: 400 });
    }

    // Extract the user data from the MCP response
    const userData = mcpResponse.result?.content?.[0]?.text;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return NextResponse.json({ user, source: 'MCP getUserProfile tool' });
      } catch {
        return NextResponse.json({ userData, source: 'MCP getUserProfile tool' });
      }
    }

    return NextResponse.json({ result: mcpResponse.result, source: 'MCP getUserProfile tool' });
  } catch (error) {
    console.error('Error calling getUserProfile:', error);
    return NextResponse.json({
      error: 'Failed to get user profile',
      message: 'An unexpected error occurred while fetching your profile. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 