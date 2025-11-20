import { NextRequest, NextResponse } from 'next/server';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path?.join('/') || '';
  const searchParams = request.nextUrl.searchParams.toString();

  const targetUrl = process.env.FILESTORE_SERVICE_URL;
  if (!targetUrl)
    return NextResponse.json({ error: 'Target URL missing' }, { status: 500 });

  const url = `${targetUrl}/files${subPath ? `/${subPath}` : ''}${
    searchParams ? `?${searchParams}` : ''
  }`;

  const apiKey = process.env.FILESTORE_SERVICE_API_KEY;
  if (!apiKey)
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

  try {
    const headers = new Headers(request.headers);
    headers.set('x-api-key', apiKey);
    headers.delete('host');
    headers.delete('connection');

    const shouldHaveBody = !['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(
      request.method,
    );
    const body = shouldHaveBody ? request.body : undefined;

    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
      // @ts-expect-error required for nextjs
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
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
