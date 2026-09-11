import { NextResponse } from 'next/server';
import { getAdminIdentity } from '@/lib/auth';
import { listMediaRecords, saveMediaRecord } from '@/lib/content-store';
import { getRuntimeEnv } from '@/lib/runtime';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getAdminIdentity())) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  return NextResponse.json({ configured: Boolean(getRuntimeEnv().MEDIA), assets: await listMediaRecords() });
}

export async function POST(request: Request) {
  const identity = await getAdminIdentity();
  if (!identity) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const { MEDIA } = getRuntimeEnv();
  if (!MEDIA) return NextResponse.json({ error: 'Image storage is not configured yet.' }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image file first.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are supported.' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Images must be 10 MB or smaller.' }, { status: 413 });

  const safeFilename = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
  const objectKey = `ufirst/${Date.now()}-${crypto.randomUUID()}-${safeFilename || 'image'}`;
  await MEDIA.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  });

  const id = crypto.randomUUID();
  await saveMediaRecord({ id, objectKey, filename: file.name, contentType: file.type, size: file.size, createdBy: identity.email });

  return NextResponse.json({
    asset: { id, objectKey, filename: file.name, contentType: file.type, size: file.size },
    src: `/api/media/${objectKey}`,
  }, { status: 201 });
}
