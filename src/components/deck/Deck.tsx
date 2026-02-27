'use client';

import type { DeckData } from '@/lib/types';
import type { DeckLocale } from '@/lib/lang';
import { LangProvider, useLang, localizeDeck } from '@/lib/lang';
import { SlideCarousel } from './SlideCarousel';
import { SlideRenderer } from '@/components/slides/SlideRenderer';

interface DeckProps {
  deck: DeckData;
  locale?: DeckLocale | null;
}

function DeckInner({ deck, locale }: DeckProps) {
  const { lang } = useLang();
  const localizedDeck = localizeDeck(deck, locale ?? null, lang);

  const deckMeta = {
    label: localizedDeck.label,
    date: localizedDeck.date,
    project: localizedDeck.project,
    author: localizedDeck.author,
    weekRange: localizedDeck.weekRange,
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-deck-dark">
      <SlideCarousel
        deck={deckMeta}
        chromeHidden={localizedDeck.slides.map(s => s.layout === 'closing')}
      >
        {localizedDeck.slides.map((slide, i) => (
          <SlideRenderer key={i} slide={slide} />
        ))}
      </SlideCarousel>

      {/* Logo — bottom-left of page */}
      <img
        src="/assets/decks/chrono-ai-logo.png"
        alt="Chrono AI"
        className="absolute bottom-4 left-5 h-6 w-auto opacity-60"
      />
    </div>
  );
}

export function Deck({ deck, locale }: DeckProps) {
  return (
    <LangProvider>
      <DeckInner deck={deck} locale={locale} />
    </LangProvider>
  );
}
