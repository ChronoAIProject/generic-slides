import type { DeckData } from '@/lib/types';

const deckModules: Record<string, () => Promise<{ default: DeckData }>> = {
  'wk7-26': () => import('./wk7-26'),
  'wk8-26': () => import('./wk8-26'),
  'wk9-26': () => import('./wk9-26'),
};

export async function getDeck(slug: string): Promise<DeckData | null> {
  const loader = deckModules[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export function getAllSlugs(): string[] {
  return Object.keys(deckModules);
}
