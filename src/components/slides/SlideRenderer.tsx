import type { SlideData } from '@/lib/types';
import { TitleSlide } from './TitleSlide';
import { ContentPhotoSlide } from './ContentPhotoSlide';
import { FullHeadlineSlide } from './FullHeadlineSlide';
import { PhotoHeadlineSlide } from './PhotoHeadlineSlide';
import { ProfileSlide } from './ProfileSlide';
import { ClosingSlide } from './ClosingSlide';

export function SlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.layout) {
    case 'title':
      return <TitleSlide data={slide} />;
    case 'content-photo':
      return <ContentPhotoSlide data={slide} />;
    case 'full-headline':
      return <FullHeadlineSlide data={slide} />;
    case 'photo-headline':
      return <PhotoHeadlineSlide data={slide} />;
    case 'profile':
      return <ProfileSlide data={slide} />;
    case 'closing':
      return <ClosingSlide data={slide} />;
  }
}
