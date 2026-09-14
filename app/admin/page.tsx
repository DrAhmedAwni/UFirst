import type { Metadata } from 'next';
import AdminEditor from './AdminEditor';
import { adminSetupMessage, getAdminIdentity } from '@/lib/auth';
import { getPublishedContent } from '@/lib/content-store';

/* eslint-disable @next/next/no-html-link-for-pages */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'UFirst Content Manager',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const identity = await getAdminIdentity();
  if (!identity) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-mark">UF</div>
        <p className="admin-kicker">UFirst / Private area</p>
        <h1>Content manager access required.</h1>
        <p>{process.env.NODE_ENV === 'production' ? adminSetupMessage() : 'Sign in with an authorized UFirst account to manage the public site.'}</p>
        <a className="button button-primary" href="/">Return to UFirst <span>↗</span></a>
      </main>
    );
  }

  return <AdminEditor initialContent={await getPublishedContent()} identity={identity.email} />;
}
