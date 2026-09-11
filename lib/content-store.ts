import { defaultContent, type SiteContent } from '@/app/content';
import { MEDIA_ASSETS_SCHEMA, SITE_CONTENT_SCHEMA } from '@/db/schema';
import { getRuntimeEnv } from './runtime';

const CONTENT_ID = 'ufirst-home';

async function ensureStorage() {
  const { DB } = getRuntimeEnv();
  if (!DB) return null;

  await DB.prepare(SITE_CONTENT_SCHEMA).run();
  await DB.prepare(MEDIA_ASSETS_SCHEMA).run();
  return DB;
}

function mergeContent(value: Partial<SiteContent>): SiteContent {
  return {
    ...defaultContent,
    ...value,
    brand: { ...defaultContent.brand, ...value.brand },
    backgrounds: { ...defaultContent.backgrounds, ...value.backgrounds },
    hero: { ...defaultContent.hero, ...value.hero },
    about: { ...defaultContent.about, ...value.about },
    system: { ...defaultContent.system, ...value.system },
    services: value.services?.length ? value.services : defaultContent.services,
    industries: value.industries?.length ? value.industries : defaultContent.industries,
    process: value.process?.length ? value.process : defaultContent.process,
    projects: value.projects?.length ? value.projects : defaultContent.projects,
    contact: { ...defaultContent.contact, ...value.contact },
  };
}

function parseContent(value: string | null | undefined): SiteContent {
  if (!value) return defaultContent;
  try {
    return mergeContent(JSON.parse(value) as Partial<SiteContent>);
  } catch {
    return defaultContent;
  }
}

export async function getPublishedContent() {
  try {
    const DB = await ensureStorage();
    if (!DB) return defaultContent;
    const row = await DB.prepare('SELECT data FROM site_content WHERE id = ?1').bind(CONTENT_ID).first<{ data: string }>();
    return parseContent(row?.data);
  } catch {
    return defaultContent;
  }
}

export async function savePublishedContent(content: SiteContent, updatedBy: string) {
  const DB = await ensureStorage();
  if (!DB) throw new Error('Content storage is not configured.');
  const now = new Date().toISOString();
  await DB.prepare(
    'INSERT INTO site_content (id, data, updated_at, updated_by) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, updated_by = excluded.updated_by',
  ).bind(CONTENT_ID, JSON.stringify(content), now, updatedBy).run();
  return content;
}

export async function saveMediaRecord(record: { id: string; objectKey: string; filename: string; contentType: string; size: number; createdBy: string }) {
  const DB = await ensureStorage();
  if (!DB) return;
  await DB.prepare(
    'INSERT INTO media_assets (id, object_key, filename, content_type, size, created_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
  ).bind(record.id, record.objectKey, record.filename, record.contentType, record.size, new Date().toISOString(), record.createdBy).run();
}

export async function listMediaRecords() {
  try {
    const DB = await ensureStorage();
    if (!DB) return [];
    const result = await DB.prepare('SELECT id, object_key AS objectKey, filename, content_type AS contentType, size, created_at AS createdAt FROM media_assets ORDER BY created_at DESC').all();
    return result.results;
  } catch {
    return [];
  }
}
