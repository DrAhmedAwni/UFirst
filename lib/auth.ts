import { headers } from 'next/headers';

export type AdminIdentity = {
  id: string;
  email: string;
};

function configuredAdminEmails() {
  return (process.env.UFIRST_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const requestHeaders = await headers();
  const id = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email')?.toLowerCase();
  const allowedEmails = configuredAdminEmails();

  if (process.env.NODE_ENV !== 'production' && !allowedEmails.length) {
    return { id: id ?? 'local-editor', email: email ?? 'local-editor@ufirst.agency' };
  }

  if (!id || !email || !allowedEmails.includes(email)) return null;
  return { id, email };
}

export function adminSetupMessage() {
  return 'Admin access is not configured yet. Add the U FIRST administrator email to UFIRST_ADMIN_EMAILS before publishing.';
}

