import type { DeckData } from '@/lib/types';

const deck: DeckData = {
  slug: 'wk8-26',
  title: 'Week of Feb 20\u201326, 2026',
  start: '20260220',
  end: '20260226',
  label: 'Weekly Update',
  date: '20 Feb, 2026',
  project: 'aelf Frontend',
  author: 'Chrono AI',
  weekRange: 'Feb 20\u201326',
  slides: [
    {
      layout: 'title',
      headline: 'Frontend\nProgress',
      highlights: [
        { label: 'Component Library', status: '✓' },
        { label: 'Design System', status: '✓' },
        { label: 'Navigation', status: '✓' },
        { label: 'Data Fetching', status: '✓' },
      ],
    },
    {
      layout: 'content-photo',
      headline: 'Component\nLibrary',
      body: 'Built out the core component library this week. Focused on reusable button variants, input fields, and card layouts. All components follow the design system tokens for consistent spacing and typography.',
      image: {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
        alt: 'Developer workspace',
      },
    },
    {
      layout: 'full-headline',
      headline: 'Key\nDeliverables',
      columns: [
        {
          title: 'Design System',
          body: 'Finalized color palette, typography scale, and spacing tokens. All values documented in the design guide for team reference.',
        },
        {
          title: 'Navigation',
          body: 'Implemented responsive top nav with mobile hamburger menu. Supports nested dropdowns and keyboard accessibility.',
        },
        {
          title: 'Data Fetching',
          body: 'Set up API integration layer with caching. Handles loading states, error boundaries, and automatic retries on failure.',
        },
      ],
    },
    {
      layout: 'photo-headline',
      headline: 'Why\nStatic\nFirst?',
      image: {
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
        alt: 'Team collaboration',
      },
      columns: [
        {
          body: 'Static-first approach eliminates build complexity. Every page is a real file, every URL returns a 200. No server required.',
        },
        {
          body: 'Deployable to GitHub Pages, Netlify, or any CDN. Zero configuration needed. Ship by pushing to main.',
        },
      ],
    },
    {
      layout: 'profile',
      headline: 'Chrono\nAI',
      body: 'Frontend engineer focused on building clean, performant interfaces. This week\u2019s work centered on laying the foundation for the weekly deck presentation system \u2014 a tool for consolidating and sharing progress updates.',
      image: {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        alt: 'Profile portrait',
      },
    },
    {
      layout: 'closing',
      headline: 'See You\nNext Week',
    },
  ],
};

export default deck;
