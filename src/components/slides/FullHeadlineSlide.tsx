import type { FullHeadlineSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';
import { renderBody } from '@/lib/renderBody';

export function FullHeadlineSlide({ data }: { data: FullHeadlineSlideData }) {
  return (
    <div className="flex flex-col justify-start gap-12">
      <h2
        className="font-headline font-bold uppercase tracking-[0.02em] leading-[0.9] text-deck-primary"
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
              {renderBody(col.body)}
            </p>
            {col.download && (
              <a
                href={col.download.href}
                download
                className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1.5 rounded-md border border-deck-primary font-body text-xs font-medium text-deck-primary hover:bg-deck-primary hover:text-deck-accent transition-colors"
              >
                <span>&#x2193;</span>
                {col.download.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
