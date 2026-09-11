import { env as cloudflareEnv } from 'cloudflare:workers';

export type UFirstRuntimeEnv = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
};

export function getRuntimeEnv() {
  return cloudflareEnv as unknown as UFirstRuntimeEnv;
}

