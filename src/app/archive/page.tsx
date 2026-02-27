import type { Metadata } from 'next';
import { entries } from '@/data/entries';
import { ArchiveList } from '@/components/archive/ArchiveList';

export const metadata: Metadata = {
  title: 'Archive | Weekly Decks',
};

export default function ArchivePage() {
  return <ArchiveList entries={entries} />;
}
