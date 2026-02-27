export type SlideLayout =
  | 'title'
  | 'content-photo'
  | 'full-headline'
  | 'photo-headline'
  | 'profile'
  | 'closing';

export interface SlideColumn {
  title?: string;
  body: string;
  download?: { label: string; href: string };
}

export interface SlideHighlight {
  label: string;
  status?: string;
}

export interface TitleSlideData {
  layout: 'title';
  headline: string;
  highlights?: SlideHighlight[];
}

export interface ContentPhotoSlideData {
  layout: 'content-photo';
  headline: string;
  body: string;
  image: { src: string; alt: string; caption?: string };
  reverse?: boolean;
}

export interface FullHeadlineSlideData {
  layout: 'full-headline';
  headline: string;
  columns: SlideColumn[];
}

export interface PhotoHeadlineSlideData {
  layout: 'photo-headline';
  headline: string;
  image: { src: string; alt: string };
  columns: SlideColumn[];
}

export interface ProfileSlideData {
  layout: 'profile';
  headline: string;
  body: string;
  image: { src: string; alt: string };
}

export interface ClosingSlideData {
  layout: 'closing';
  headline: string;
}

export type SlideData =
  | TitleSlideData
  | ContentPhotoSlideData
  | FullHeadlineSlideData
  | PhotoHeadlineSlideData
  | ProfileSlideData
  | ClosingSlideData;

export interface DeckEntry {
  slug: string;
  title: string;
  start: string;
  end: string;
}

export interface DeckData extends DeckEntry {
  label: string;
  date: string;
  project: string;
  author: string;
  weekRange: string;
  slides: SlideData[];
}
