import { NextResponse } from 'next/server';
import { getAdminIdentity } from '@/lib/auth';
import { getPublishedContent, savePublishedContent } from '@/lib/content-store';
import type { SiteContent } from '@/app/content';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const identity = await getAdminIdentity();
  if (!identity) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  return identity;
}

export async function GET() {
  const identity = await requireAdmin();
  if (identity instanceof NextResponse) return identity;
  return NextResponse.json({ content: await getPublishedContent(), updatedBy: identity.email });
}

export async function PUT(request: Request) {
  const identity = await requireAdmin();
  if (identity instanceof NextResponse) return identity;

  try {
    const content = (await request.json()) as SiteContent;
    if (!content || typeof content !== 'object' || !Array.isArray(content.services)) {
      return NextResponse.json({ error: 'Invalid content payload.' }, { status: 400 });
    }
    await savePublishedContent(content, identity.email);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

