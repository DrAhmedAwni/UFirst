export const SITE_CONTENT_SCHEMA = `
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
)
`;

export const MEDIA_ASSETS_SCHEMA = `
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT
)
`;

