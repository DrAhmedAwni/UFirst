import { NextResponse } from 'next/server';
import { getRuntimeEnv } from '@/lib/runtime';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { MEDIA } = getRuntimeEnv();
  if (!MEDIA) return new NextResponse('Image storage is not configured.', { status: 503 });

  const { key } = await params;
  const object = await MEDIA.get(key.join('/'));
  if (!object) return new NextResponse('Image not found.', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new NextResponse(object.body, { headers });
}

