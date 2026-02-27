import type { DeckData } from '@/lib/types';

const deckModules: Record<string, () => Promise<{ default: DeckData }>> = {
  '20260213-20260219': () => import('./20260213-20260219'),
  '20260220-20260226': () => import('./20260220-20260226'),
  '20260227-20260305': () => import('./20260227-20260305'),
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
