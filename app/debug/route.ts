import { NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET() {
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  return NextResponse.json({
    accessToken,
    instructions:
      'Use this token as Authorization: Bearer <token> for MCP calls',
  });
}
