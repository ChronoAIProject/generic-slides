import type { DeckData } from '@/lib/types';

const deckModules: Record<string, () => Promise<{ default: DeckData }>> = {
  'sample': () => import('./sample'),
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
