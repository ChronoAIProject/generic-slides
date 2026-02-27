import { redirect } from 'next/navigation';
import { entries } from '@/data/entries';

export default function LatestPage() {
  if (entries.length > 0) {
    redirect(`/${entries[0].slug}`);
  }
  return <p>No entries found.</p>;
}
