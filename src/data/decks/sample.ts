import type { DeckData } from '@/lib/types';

/**
 * SAMPLE TEMPLATE — showcases every available slide layout.
 * Copy this file, rename it (e.g. wk10-26.ts), and replace the
 * placeholder content with your own.
 *
 * Available layouts:
 *   title          — Opening slide with headline + status badges
 *   full-headline  — Headline + 2-3 text columns
 *   content-photo  — Text + image side-by-side (reversible)
 *   photo-headline — Small image + headline + columns
 *   profile        — Portrait card with headline + bio
 *   closing        — Full-screen closing headline
 */

const deck: DeckData = {
  slug: 'sample',
  title: 'Sample Template Deck',
  start: '20260101',
  end: '20260107',
  label: 'Template',
  date: '1 Jan, 2026',
  project: 'Your Project',
  author: 'Your Name',
  weekRange: 'Jan 1–7',
  slides: [
    // ── 1. TITLE SLIDE ──────────────────────────────────────
    // Large headline with optional status badges.
    // status: '✓' = done, '→' = in progress, '✗' = blocked
    {
      layout: 'title',
      headline: 'Week N\nUpdates',
      highlights: [
        { label: 'Completed Task', status: '✓' },
        { label: 'In Progress Task', status: '→' },
        { label: 'Blocked Task', status: '✗' },
        { label: 'Label Only' },
      ],
    },

    // ── 2. FULL-HEADLINE (2 columns) ────────────────────────
    // Headline on top, two text columns below.
    // Columns support bullet lists and optional download links.
    {
      layout: 'full-headline',
      headline: 'Two Column\nLayout',
      columns: [
        {
          title: 'Left Column',
          body: '• First bullet point\n• Second bullet point\n• Third bullet point',
        },
        {
          title: 'Right Column',
          body: '• Another item here\n• And another one\n• One more for good measure',
        },
      ],
    },

    // ── 3. FULL-HEADLINE (3 columns) ────────────────────────
    // Same layout, but with three columns for broader topics.
    {
      layout: 'full-headline',
      headline: 'Three Column\nLayout',
      columns: [
        {
          title: 'Column A',
          body: '• Point one\n• Point two',
        },
        {
          title: 'Column B',
          body: '• Point one\n• Point two',
        },
        {
          title: 'Column C',
          body: '• Point one\n• Point two',
        },
      ],
    },

    // ── 4. CONTENT-PHOTO (image right) ──────────────────────
    // Long-form text on the left, image on the right.
    // Great for explaining a concept with a diagram.
    {
      layout: 'content-photo',
      headline: 'Content With\nPhoto',
      body: 'This layout places body text on the left and an image on the right. It works well for explaining a concept alongside a diagram, screenshot, or illustration.\n\nYou can write multiple paragraphs separated by double newlines. Bullet points also work:\n\n• First point\n• Second point\n• Third point',
      image: {
        src: '/assets/decks/chrono-ai-logo.png',
        alt: 'Placeholder image',
        caption: 'Fig 1. Replace this with your own image and caption',
      },
    },

    // ── 5. CONTENT-PHOTO (image left, reversed) ─────────────
    // Same layout but with reverse: true to flip the image side.
    {
      layout: 'content-photo',
      headline: 'Reversed\nPhoto Layout',
      reverse: true,
      body: 'Setting reverse: true flips the layout so the image appears on the left and text on the right.\n\nUse this to alternate visual rhythm across slides and keep the presentation from feeling repetitive.',
      image: {
        src: '/assets/decks/chrono-ai-logo.png',
        alt: 'Placeholder image',
        caption: 'Fig 2. Image on the left side with reverse: true',
      },
    },

    // ── 6. PHOTO-HEADLINE ───────────────────────────────────
    // Small image in the headline area + columns below.
    // Good for feature overviews with an icon or logo.
    {
      layout: 'photo-headline',
      headline: 'Photo\nHeadline',
      image: {
        src: '/assets/decks/chrono-ai-logo.png',
        alt: 'Placeholder image',
      },
      columns: [
        {
          title: 'Details',
          body: '• Combines a small image with a headline\n• Columns appear below the headline area\n• Good for feature overviews',
        },
        {
          title: 'Notes',
          body: '• The image appears next to the headline\n• Keep images small for this layout\n• Works best with icons or logos',
        },
      ],
    },

    // ── 7. PROFILE SLIDE ────────────────────────────────────
    // Portrait card layout with headline + bio text.
    // Use for team introductions or personal updates.
    {
      layout: 'profile',
      headline: 'Team\nMember',
      body: 'A profile slide for introducing a team member, speaker, or contributor. The image appears as a portrait alongside the headline and body text.\n\nReplace the image with a headshot or avatar.',
      image: {
        src: '/assets/decks/chrono-ai-logo.png',
        alt: 'Profile photo placeholder',
      },
    },

    // ── 8. CLOSING SLIDE ────────────────────────────────────
    // Full-screen headline. No columns, no body, no image.
    // Clean ending for the presentation.
    {
      layout: 'closing',
      headline: 'Thanks!\nSee You\nNext Week',
    },
  ],
};

export default deck;
