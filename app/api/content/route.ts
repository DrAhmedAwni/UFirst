import { NextResponse } from 'next/server';
import { getPublishedContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getPublishedContent(), {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  });
}

