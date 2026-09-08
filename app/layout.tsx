import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UFirst Agency — Make your next bold move',
  description: 'UFirst is a Cairo-based marketing and media production agency helping ambitious brands find their voice, tell better stories, and create growth that can be felt.',
  openGraph: {
    title: 'UFirst Agency — Make your next bold move',
    description: 'Strategy, story, and production for brands ready to move.',
    images: ['/assets/hero-camera.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UFirst Agency — Make your next bold move',
    description: 'Strategy, story, and production for brands ready to move.',
    images: ['/assets/hero-camera.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
