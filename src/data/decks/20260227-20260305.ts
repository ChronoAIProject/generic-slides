import type { DeckData } from '@/lib/types';

const deck: DeckData = {
  slug: '20260227-20260305',
  title: 'Week of Feb 27\u2013Mar 5, 2026',
  start: '20260227',
  end: '20260305',
  label: 'Weekly Update',
  date: '27 Feb, 2026',
  project: 'aelf Frontend',
  author: 'Chrono AI',
  weekRange: 'Feb 27\u2013Mar 5',
  slides: [
    {
      layout: 'title',
      headline: 'Testing &\nIteration',
      highlights: [
        { label: 'Cross-Browser Testing', status: '✓' },
        { label: 'Archive System', status: '✓' },
        { label: 'Accessibility Audit', status: 'In Progress' },
        { label: 'Responsive Scaling', status: 'Next' },
      ],
    },
    {
      layout: 'full-headline',
      headline: 'Cross-Browser\nTesting',
      columns: [
        {
          title: 'Chrome & Edge',
          body: 'All layouts render correctly at target resolution. Progress bar transitions are smooth. Keyboard navigation passes full audit.',
        },
        {
          title: 'Firefox',
          body: 'Minor gap rendering difference in the footer columns. Fixed with explicit gap property fallback. All controls functional.',
        },
        {
          title: 'Safari',
          body: 'Tested on macOS and iOS. Aspect-ratio property supported since Safari 15. Font rendering slightly different \u2014 acceptable within design tolerance.',
        },
      ],
    },
    {
      layout: 'content-photo',
      headline: 'Archive\nSystem',
      body: 'Completed the archive page and week-to-week navigation. Visitors can browse all past entries in reverse chronological order. Each deck includes prev/next links populated dynamically from the manifest.',
      image: {
        src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        alt: 'Code on screen',
      },
    },
    {
      layout: 'photo-headline',
      headline: 'Next\nSteps',
      image: {
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
        alt: 'Laptop with code',
      },
      columns: [
        {
          body: 'Responsive scaling for smaller viewports. The slide canvas needs to maintain 16:9 while fitting any screen size gracefully.',
        },
        {
          body: 'Accessibility audit covering screen readers, focus management, and contrast ratios. Ensure all interactive elements meet WCAG AA standards.',
        },
      ],
    },
    {
      layout: 'closing',
      headline: 'Onwards',
    },
  ],
};

export default deck;
