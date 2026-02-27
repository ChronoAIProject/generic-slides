import type { ContentPhotoSlideData } from '@/lib/types';
import { renderHeadline } from '@/lib/renderHeadline';

export function ContentPhotoSlide({ data }: { data: ContentPhotoSlideData }) {
  return (
    <div
      className="flex flex-row items-center h-full"
      style={{ gap: 'var(--slide-gutter)' }}
    >
      <div className="flex-[0_0_45%] rounded-xl overflow-hidden">
        <img
          src={data.image.src}
          alt={data.image.alt}
          className="w-full h-full object-cover bg-deck-track min-h-[120px]"
        />
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <h2
          className="font-headline font-bold uppercase tracking-[-0.03em] leading-[0.9] text-deck-primary"
          style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
        >
          {renderHeadline(data.headline)}
        </h2>
        <p className="font-body font-normal text-base leading-[1.55] text-deck-primary max-w-[550px]">
          {data.body}
        </p>
      </div>
    </div>
  );
}
