import { getPublishedContent } from '@/lib/content-store';
import HomeExperience from './components/HomeExperience';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <HomeExperience content={await getPublishedContent()} />;
}

