import { NextRequest, NextResponse } from 'next/server';

const FILESTORE_SERVICE_URL = process.env.FILESTORE_SERVICE_URL;
const FILESTORE_SERVICE_API_KEY = process.env.FILESTORE_SERVICE_API_KEY;

// Validate environment variables at startup
if (!FILESTORE_SERVICE_URL || !FILESTORE_SERVICE_API_KEY) {
  console.error(
    'Missing required environment variables: FILESTORE_SERVICE_URL and/or FILESTORE_SERVICE_API_KEY',
  );
}

/**
 * Headers that should not be forwarded to the target API
 */
const HEADERS_TO_REMOVE = ['host', 'connection'] as const;

/**
 * HTTP methods that should not include a request body
 */
const METHODS_WITHOUT_BODY = ['GET', 'HEAD', 'DELETE', 'OPTIONS'] as const;

/**
 * Proxy handler for file API requests
 * Forwards requests to the filestore service with proper authentication
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path?.join('/') || '';
  const searchParams = request.nextUrl.searchParams.toString();

  // Get API Key from cookies
  const apiKey = request.cookies.get('filestore_api_key')?.value || process.env.FILESTORE_SERVICE_API_KEY;

  if (!FILESTORE_SERVICE_URL) {
    return NextResponse.json(
      { error: 'Service configuration error: Target URL missing' },
      { status: 500 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Authentication required: API Key missing' },
      { status: 401 },
    );
  }

  const url = `${FILESTORE_SERVICE_URL}/files${subPath ? `/${subPath}` : ''}${
    searchParams ? `?${searchParams}` : ''
  }`;

  try {
    const headers = new Headers(request.headers);
    headers.set('x-api-key', apiKey);

    // Remove headers that shouldn't be forwarded
    HEADERS_TO_REMOVE.forEach((header) => headers.delete(header));

    const shouldHaveBody = !METHODS_WITHOUT_BODY.includes(
      request.method as (typeof METHODS_WITHOUT_BODY)[number],
    );
    const body = shouldHaveBody ? request.body : undefined;

    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
      // @ts-expect-error - Required for Next.js streaming support
      duplex: 'half',
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('content-encoding');

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to connect to filestore service',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
