import type { ClosingSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';

export function ClosingSlide({ data }: { data: ClosingSlideData }) {
  return (
    <div
      className="flex flex-col justify-center"
      style={{ padding: 'var(--slide-margin)' }}
    >
      <h2
        className="font-headline font-bold uppercase tracking-[-0.03em] leading-[0.9] text-deck-primary"
        style={{ fontSize: 'clamp(120px, 16vw, 300px)' }}
      >
        {renderHeadline(data.headline)}
      </h2>
    </div>
  );
}
