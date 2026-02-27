import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDeck, getAllSlugs } from '@/data/decks';
import { getLocale } from '@/data/locales';
import { Deck } from '@/components/deck/Deck';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deck = await getDeck(slug);
  return {
    title: deck ? `${deck.title} | Weekly Decks` : 'Not Found',
  };
}

export default async function DeckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = await getDeck(slug);
  if (!deck) notFound();

  const zhLocale = await getLocale(slug, 'zh');

  return <Deck deck={deck} locale={zhLocale} />;
}
