import type { PhotoHeadlineSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';

export function PhotoHeadlineSlide({ data }: { data: PhotoHeadlineSlideData }) {
  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex items-center"
        style={{ gap: 'var(--slide-gutter)' }}
      >
        <div className="flex-[0_0_40%] rounded-xl overflow-hidden">
          <img
            src={data.image.src}
            alt={data.image.alt}
            className="w-full h-full object-cover bg-deck-track min-h-[120px]"
          />
        </div>
        <h2
          className="flex-1 font-headline font-bold uppercase tracking-[-0.03em] leading-[0.9] text-deck-primary"
          style={{ fontSize: 'clamp(50px, 7vw, 120px)' }}
        >
          {renderHeadline(data.headline)}
        </h2>
      </div>
      <div className="flex" style={{ gap: 'var(--slide-gutter)' }}>
        {data.columns.map((col, i) => (
          <div key={i} className="flex-1 max-w-[550px]">
            <p className="font-body font-normal text-base leading-[1.55] text-deck-primary">
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
