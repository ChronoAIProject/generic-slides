import type { FullHeadlineSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';

export function FullHeadlineSlide({ data }: { data: FullHeadlineSlideData }) {
  return (
    <div className="flex flex-col justify-start gap-12">
      <h2
        className="font-headline font-bold uppercase tracking-[-0.03em] leading-[0.9] text-deck-primary"
        style={{ fontSize: 'clamp(80px, 11vw, 200px)' }}
      >
        {renderHeadline(data.headline)}
      </h2>
      <div className="flex" style={{ gap: 'var(--slide-gutter)' }}>
        {data.columns.map((col, i) => (
          <div key={i} className="flex-1 max-w-[550px]">
            <p className="font-body font-normal text-base leading-[1.55] text-deck-primary">
              {col.title && (
                <>
                  <strong>{col.title}</strong>
                  <br />
                </>
              )}
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
