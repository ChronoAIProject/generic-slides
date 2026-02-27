import type { ContentPhotoSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';
import { renderBody } from '@/lib/renderBody';

export function ContentPhotoSlide({ data }: { data: ContentPhotoSlideData }) {
  return (
    <div
      className={`flex items-center h-full ${data.reverse ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ gap: 'var(--slide-gutter)' }}
    >
      <div className="flex-[0_0_45%] flex flex-col gap-2">
        <div className="rounded-xl overflow-hidden">
          <img
            src={data.image.src}
            alt={data.image.alt}
            className="w-full h-full object-cover bg-deck-track min-h-[120px]"
          />
        </div>
        {data.image.caption && (
          <p className="font-body text-xs text-deck-secondary italic text-center">
            {data.image.caption}
          </p>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <h2
          className="font-headline font-bold uppercase tracking-[0.02em] leading-[0.9] text-deck-primary"
          style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
        >
          {renderHeadline(data.headline)}
        </h2>
        <p className="font-body font-normal text-base leading-[1.55] text-deck-primary max-w-[550px]">
          {renderBody(data.body)}
        </p>
      </div>
    </div>
  );
}
