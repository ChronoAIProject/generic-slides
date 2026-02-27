import type { DeckData } from '@/lib/types';
import { SlideCarousel } from './SlideCarousel';
import { SlideRenderer } from '@/components/slides/SlideRenderer';

interface DeckProps {
  deck: DeckData;
}

export function Deck({ deck }: DeckProps) {
  const deckMeta = {
    label: deck.label,
    date: deck.date,
    project: deck.project,
    author: deck.author,
    weekRange: deck.weekRange,
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-deck-dark">
      <SlideCarousel
        deck={deckMeta}
        chromeHidden={deck.slides.map(s => s.layout === 'closing')}
      >
        {deck.slides.map((slide, i) => (
          <SlideRenderer key={i} slide={slide} />
        ))}
      </SlideCarousel>
    </div>
  );
}
