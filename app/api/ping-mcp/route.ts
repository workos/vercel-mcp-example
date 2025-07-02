import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the host from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const mcpUrl = `${protocol}://${host}/mcp`;
    
    const mcpRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'ping',
        arguments: {}
      }
    };

    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        // No Authorization header for public endpoint
      },
      body: JSON.stringify(mcpRequest),
    });

    if (!response.ok) {
      console.error('MCP response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: `MCP server error: ${response.statusText}` }, { status: response.status });
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

    // Extract the ping data from the MCP response
    const pingData = mcpResponse.result?.content?.[0]?.text;
    if (pingData) {
      try {
        const parsed = JSON.parse(pingData);
        return NextResponse.json({ ...parsed, source: 'MCP ping tool' });
      } catch {
        return NextResponse.json({ data: pingData, source: 'MCP ping tool' });
      }
    }

    return NextResponse.json({ result: mcpResponse.result, source: 'MCP ping tool' });
  } catch (error) {
    console.error('Error calling MCP ping:', error);
    return NextResponse.json(
      { error: 'Failed to call MCP ping tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 