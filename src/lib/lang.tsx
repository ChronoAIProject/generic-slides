'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DeckData, SlideData } from '@/lib/types';

export type Lang = 'en' | 'zh';

export interface DeckLocale {
  slides: Record<string, unknown>[];
}

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Deep-merge a locale overlay onto a single slide. */
function mergeSlide(base: SlideData, overlay: Record<string, unknown>): SlideData {
  const merged = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(overlay)) {
    const val = overlay[key];

    if (Array.isArray(val) && Array.isArray(merged[key])) {
      // Merge arrays element-by-element (columns, highlights)
      merged[key] = (merged[key] as unknown[]).map((item, i) => {
        const overItem = (val as unknown[])[i];
        if (
          overItem &&
          typeof overItem === 'object' &&
          typeof item === 'object' &&
          item !== null
        ) {
          return { ...item, ...overItem };
        }
        return overItem !== undefined ? overItem : item;
      });
    } else if (val !== undefined) {
      merged[key] = val;
    }
  }

  return merged as unknown as SlideData;
}

/** Apply a locale overlay to a full deck, returning localized slides. */
export function localizeDeck(
  deck: DeckData,
  locale: DeckLocale | null,
  lang: Lang,
): DeckData {
  if (lang === 'en' || !locale) return deck;

  return {
    ...deck,
    slides: deck.slides.map((slide, i) =>
      locale.slides[i] ? mergeSlide(slide, locale.slides[i]) : slide,
    ),
  };
}
