'use client';

import React from 'react';
import type { DeckData } from '@/lib/types';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { ProgressBar } from './ProgressBar';
import { SlideCounter } from './SlideCounter';
import { DotIndicators } from './DotIndicators';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SlideCarouselProps {
  deck: Pick<DeckData, 'label' | 'date' | 'project' | 'author' | 'weekRange'>;
  chromeHidden?: boolean[];
  children: React.ReactNode;
}

const arrowBtn =
  'w-10 h-10 rounded-full border flex items-center justify-center text-lg transition-all duration-200 pointer-events-auto focus-visible:outline-2 focus-visible:outline-deck-primary focus-visible:outline-offset-2';

const arrowActive =
  'border-deck-primary bg-deck-bg text-deck-primary hover:bg-deck-primary hover:text-deck-accent active:bg-deck-dark active:text-deck-accent active:border-deck-dark';

const arrowDisabled =
  'border-deck-track bg-deck-bg text-deck-disabled opacity-30 cursor-default pointer-events-none';

export function SlideCarousel({ deck, chromeHidden, children }: SlideCarouselProps) {
  const slides = React.Children.toArray(children);
  const nav = useSlideNavigation(slides.length);
  const hideChrome = chromeHidden?.[nav.currentIndex] ?? false;

  return (
    <div
      className="overflow-hidden relative bg-deck-bg"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: 'calc(100vh * 16 / 9)',
        maxHeight: 'calc(100vw * 9 / 16)',
        aspectRatio: '16 / 9',
        borderRadius: 'var(--slide-radius)',
      }}
    >
      {/* ── Slide layers ── */}
      {slides.map((child, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex flex-col justify-center overflow-hidden ${
            i === nav.currentIndex ? '' : 'hidden'
          }`}
          style={{
            padding: hideChrome
              ? 'var(--slide-margin)'
              : `120px var(--slide-margin) 100px`,
          }}
        >
          {child}
        </div>
      ))}

      {/* ── Overlays ── */}

      {/* Progress bar — top edge */}
      <ProgressBar progress={nav.progress} />

      {/* Header — top */}
      <header
        className="absolute top-0 inset-x-0 flex justify-between items-center z-10 transition-opacity duration-300"
        style={{
          padding: `40px var(--slide-margin) 0`,
          opacity: hideChrome ? 0 : 1,
        }}
      >
        <span className="font-body font-normal text-[17px] text-deck-primary">
          {deck.label}
        </span>
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <span className="font-body font-normal text-[17px] text-deck-secondary">
            {deck.date}
          </span>
        </div>
      </header>

      {/* Prev/Next arrows — vertically centered, inside slide margins */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10"
           style={{ padding: `0 calc(var(--slide-margin) * 0.3)` }}>
        <button
          className={`${arrowBtn} ${nav.isFirst ? arrowDisabled : arrowActive}`}
          aria-label="Previous slide"
          aria-disabled={nav.isFirst}
          onClick={nav.prev}
        >
          &#x2190;
        </button>
        <button
          className={`${arrowBtn} ${nav.isLast ? arrowDisabled : arrowActive}`}
          aria-label="Next slide"
          aria-disabled={nav.isLast}
          onClick={nav.next}
        >
          &#x2192;
        </button>
      </div>

      {/* Footer — above controls bar */}
      <footer
        className="absolute inset-x-0 flex items-end z-10 transition-opacity duration-300"
        style={{
          bottom: '64px',
          gap: 'var(--slide-gutter)',
          padding: `0 var(--slide-margin) 8px`,
          opacity: hideChrome ? 0 : 1,
        }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-body font-normal text-[13px] text-deck-secondary uppercase tracking-[0.04em]">
            Project
          </span>
          <span className="font-body font-normal text-[15px] text-deck-primary">
            {deck.project}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body font-normal text-[13px] text-deck-secondary uppercase tracking-[0.04em]">
            Author
          </span>
          <span className="font-body font-normal text-[15px] text-deck-primary">
            {deck.author}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body font-normal text-[13px] text-deck-secondary uppercase tracking-[0.04em]">
            Week
          </span>
          <span className="font-body font-normal text-[15px] text-deck-primary">
            {deck.weekRange}
          </span>
        </div>
      </footer>

      {/* Controls bar — bottom */}
      <nav
        className="absolute bottom-0 inset-x-0 h-16 flex items-center z-10 max-md:h-12"
        style={{ padding: `0 var(--slide-margin)` }}
        aria-label="Slide navigation"
      >
        <div>
          <SlideCounter current={nav.currentIndex + 1} total={slides.length} />
        </div>
        <div className="flex-1 flex justify-center">
          <DotIndicators
            total={slides.length}
            current={nav.currentIndex}
            onSelect={nav.goToSlide}
          />
        </div>
        <div className="w-16" />
      </nav>
    </div>
  );
}
