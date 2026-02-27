import type { DeckLocale, Lang } from '@/lib/lang';

const localeModules: Record<string, Record<string, () => Promise<DeckLocale>>> = {
};

export async function getLocale(
  slug: string,
  lang: Lang,
): Promise<DeckLocale | null> {
  const slugLocales = localeModules[slug];
  if (!slugLocales?.[lang]) return null;
  return slugLocales[lang]();
}

export function hasLocale(slug: string, lang: Lang): boolean {
  return !!localeModules[slug]?.[lang];
}
