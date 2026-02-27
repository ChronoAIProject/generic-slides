import type { DeckData } from '@/lib/types';

const deck: DeckData = {
  slug: '20260213-20260219',
  title: 'Week of Feb 13\u201319, 2026',
  start: '20260213',
  end: '20260219',
  label: 'Weekly Update',
  date: '13 Feb, 2026',
  project: 'aelf Frontend',
  author: 'Chrono AI',
  weekRange: 'Feb 13\u201319',
  slides: [
    {
      layout: 'title',
      headline: 'Project\nKickoff',
      highlights: [
        { label: 'Repository Setup', status: '✓' },
        { label: 'Design Guide', status: '✓' },
        { label: 'Research Phase', status: '✓' },
        { label: 'Routing Strategy', status: '✓' },
      ],
    },
    {
      layout: 'full-headline',
      headline: 'Week\nHighlights',
      columns: [
        {
          title: 'Repository Setup',
          body: 'Initialized the project repository with folder structure, package.json, and design guide documentation. Established the monochromatic design direction.',
        },
        {
          title: 'Research Phase',
          body: 'Evaluated routing strategies for static hosting. Chose folder-based routing with JSON manifest for maximum compatibility with GitHub Pages.',
        },
      ],
    },
    {
      layout: 'content-photo',
      headline: 'Design\nGuide',
      body: 'Completed the full design specification document. Defined the canvas dimensions, monochromatic palette, typography hierarchy, and all six slide layout types. The guide serves as the single source of truth for visual decisions.',
      image: {
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
        alt: 'Code on screen',
      },
    },
    {
      layout: 'closing',
      headline: 'Onward',
    },
  ],
};

export default deck;
