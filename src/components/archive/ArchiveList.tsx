import Link from 'next/link';
import type { DeckEntry } from '@/lib/types';

interface ArchiveListProps {
  entries: DeckEntry[];
}

export function ArchiveList({ entries }: ArchiveListProps) {
  return (
    <div className="bg-deck-bg min-h-screen">
      <div
        className="max-w-[960px] mx-auto"
        style={{ padding: 'var(--slide-margin)' }}
      >
        <header className="flex justify-between items-baseline mb-16 max-md:flex-col max-md:gap-4 max-md:mb-10">
          <h1
            className="font-headline font-bold uppercase tracking-[-0.03em] leading-[0.9] text-deck-primary"
            style={{ fontSize: 'clamp(60px, 8vw, 120px)' }}
          >
            Archive
          </h1>
          <Link
            href="/latest"
            className="font-body font-medium text-base text-deck-secondary hover:text-deck-primary transition-colors duration-200"
          >
            View Latest &rarr;
          </Link>
        </header>

        <ul className="list-none">
          {entries.map((entry, i) => (
            <li
              key={entry.slug}
              className={`border-t border-deck-track ${
                i === entries.length - 1 ? 'border-b' : ''
              }`}
            >
              <Link
                href={`/${entry.slug}`}
                className="flex justify-between items-baseline py-6 transition-[padding-left] duration-200 hover:pl-3 focus-visible:outline-2 focus-visible:outline-deck-primary focus-visible:outline-offset-4"
              >
                <span className="font-headline font-bold text-2xl uppercase tracking-[-0.02em] text-deck-primary">
                  {entry.title}
                </span>
                <span className="font-body font-normal text-sm text-deck-secondary">
                  {entry.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
