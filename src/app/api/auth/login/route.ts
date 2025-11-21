import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      );
    }

    const FILESTORE_SERVICE_URL = process.env.FILESTORE_SERVICE_URL;
    if (!FILESTORE_SERVICE_URL) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate API Key by fetching 1 file
    try {
      const validationResponse = await fetch(`${FILESTORE_SERVICE_URL}/files?limit=1`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (!validationResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid API Key' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { error: 'Failed to validate API Key' },
        { status: 502 }
      );
    }

    // Create the response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'filestore_api_key',
      value: apiKey,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // Set a reasonable expiration, e.g., 30 days
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
