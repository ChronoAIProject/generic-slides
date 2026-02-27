import type { TitleSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';

export function TitleSlide({ data }: { data: TitleSlideData }) {
  return (
    <div className="flex flex-col justify-center py-10">
      <h1
        className="font-headline font-bold uppercase tracking-[0.02em] leading-[1.05] text-deck-primary"
        style={{ fontSize: 'clamp(100px, 14vw, 260px)' }}
      >
        {renderHeadline(data.headline)}
      </h1>

      {data.highlights && data.highlights.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-10">
          {data.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-deck-primary font-body text-sm text-deck-primary"
            >
              {h.status && (
                <span className="text-deck-secondary text-xs">
                  {h.status}
                </span>
              )}
              <span className="font-medium">{h.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
