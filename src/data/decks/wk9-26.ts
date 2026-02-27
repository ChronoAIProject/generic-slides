import type { DeckData } from '@/lib/types';

const deck: DeckData = {
  slug: 'wk9-26',
  title: 'Week of Feb 27\u2013Mar 5, 2026',
  start: '20260227',
  end: '20260305',
  label: 'Weekly Update',
  date: '27 Feb, 2026',
  project: 'Frontend',
  author: 'Calvin Tan',
  weekRange: 'Feb 27\u2013Mar 5',
  slides: [
    {
      layout: 'title',
      headline: 'Week 9\nUpdates',
      highlights: [
        { label: 'Soul Garden Launch', status: '✓' },
        { label: 'CRDT Lite Sync', status: '✓' },
        { label: 'Riteset Pre-Approval', status: '✓' },
        { label: 'Flutter POC', status: '✓' },
        { label: 'In-App Tracking', status: '→' },
        { label: 'Tolt Integration', status: '→' },
      ],
    },
    {
      layout: 'full-headline',
      headline: 'Soul Garden\nLaunch',
      columns: [
        {
          title: 'Shipped',
          body: '• Fixed Soul Garden bugs and stabilised launch\n• Updated data schema to CRDT Lite structure\n• Resolved post-launch issues and hotfixes',
          download: { label: 'CRDT-lite-spec.md', href: '/assets/decks/wk9-26/CRDT-lite-7.1.md' },
        },
        {
          title: 'Pending',
          body: '• v2 updates planned for Week 10\n• Compile thorough checklist for iOS submission\n• iOS widget\n• Convert web to full RN',
        },
      ],
    },
    {
      layout: 'content-photo',
      headline: 'CRDT Lite\nState Tree',
      reverse: true,
      body: 'A reusable sync architecture for 50–100 apps. The data model evolved through three stages:\n\n1. Single KV — all state in one JSON blob. Simple, but impossible to merge or partially update.\n2. Data tree — nested structure, better organisation, but tightly coupled and hard to sync individual pieces.\n3. Nested entity map — the current design. Every piece of data is a flat entity with a generic data payload, grouped by type for O(1) access.\n\nThe sync layer stores and transmits entities without inspecting their contents. Each app defines its own data shape. Entities use refs for relationships instead of nesting, soft deletes with cascade, and a position field for ordering. One shared DB collection now, with a path to split by entity type later — same protocol, no migration.',
      image: {
        src: '/assets/decks/wk9-26/full-entity-ss.png',
        alt: 'CRDT Lite full entity state tree',
        caption: 'Fig 1. Initial state tree — entities grouped by type in a nested EntityMap',
      },
    },
    {
      layout: 'content-photo',
      headline: 'CRDT Lite\nWire Payload',
      body: 'Two tiers built on the same foundation — same entity shape, wire format, store queries, validation, and Mongo schema. Only the network layer differs.\n\nTier 1 (POC): PUT/PATCH per entity with field-level merge via MongoDB $set. Poll or SSE for multi-device. ~100 lines FE, ~80 lines BE. Ships in hours. Handles most apps permanently.\n\nTier 2 (Full Sync): Batched POST /sync with localSeq conflict detection, delta responses, dirty set management, offline queue, and beacon recovery. ~300 lines FE, ~150 lines BE. Ships in days.\n\nDecision rule: start every app on Tier 1. Graduate to Tier 2 only when the app shows real traction AND needs true offline support or batched writes. Tier 1 is not a compromise — its field-level PATCH merge is actually better than Tier 2 entity-level last-write-wins for most multi-device cases.',
      image: {
        src: '/assets/decks/wk9-26/payload-ss.png',
        alt: 'CRDT Lite wire payload',
        caption: 'Fig 2. Wire payload — sync request/response using the same EntityMap format',
      },
    },
    {
      layout: 'full-headline',
      headline: 'Riteset\nPre-Approval',
      columns: [
        {
          title: 'Completed',
          body: '• Auth integration wired up\n• RevenueCat integration on the frontend',
        },
        {
          title: 'Week 10',
          body: '• Currently FE-only\n• Add backend integration\n• Implement real AI features',
        },
      ],
    },
    {
      layout: 'full-headline',
      headline: 'Flutter\nPOC',
      columns: [
        {
          title: 'Advantages',
          body: '+ Unified, seamless integration across platforms\n+ Fast iteration — Web === iOS === Android\n+ No conversion or translation needed; fully native',
        },
        {
          title: 'Considerations',
          body: '- Limited ability to read or write Flutter code manually\n- Pure vibe code at this stage\n- Ecosystem not as mature as Swift and React Native (Expo)',
        },
      ],
    },
    {
      layout: 'full-headline',
      headline: 'In Progress',
      columns: [
        {
          title: 'n8n Integration',
          body: '• App tracking automation in progress\n• Will populate weekly app metrics once connected',
        },
        {
          title: 'PostHog',
          body: '• In-app product analytics integration\n• Tracking user behaviour and feature adoption',
        },
        {
          title: 'Tolt',
          body: '• iOS app link tracking in progress\n• Attribution and referral analytics',
        },
      ],
    },
    {
      layout: 'closing',
      headline: 'See You\nNext Week',
    },
  ],
};

export default deck;
