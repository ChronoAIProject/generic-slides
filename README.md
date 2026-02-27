# Weekly Decks

A data-driven presentation system for weekly update slides. Built with Next.js, React, Tailwind CSS, and TypeScript. No PowerPoint — just write a TypeScript object and get a responsive, shareable deck.

## Quick Start

```bash
nvm use          # Node 22 (see .nvmrc)
npm install
npm run dev      # http://localhost:3000
```

Visit `/sample` to see the template deck with all available slide layouts.

## Creating a Deck

### 1. Add a deck data file

Create `src/data/decks/<slug>.ts`. Copy `sample.ts` as a starting point.

```ts
import type { DeckData } from '@/lib/types';

const deck: DeckData = {
  slug: 'wk10-26',
  title: 'Week of Mar 6–12, 2026',
  start: '20260306',
  end: '20260312',
  label: 'Weekly Update',
  date: '6 Mar, 2026',
  project: 'Frontend',
  author: 'Your Name',
  weekRange: 'Mar 6–12',
  slides: [
    { layout: 'title', headline: 'Week 10\nUpdates' },
    // ... more slides
    { layout: 'closing', headline: 'See You\nNext Week' },
  ],
};

export default deck;
```

### 2. Register the deck

Add the entry to `src/data/entries.ts` (newest first):

```ts
{ slug: 'wk10-26', title: 'Week of Mar 6–12, 2026', start: '20260306', end: '20260312' },
```

Add the import to `src/data/decks/index.ts`:

```ts
'wk10-26': () => import('./wk10-26'),
```

### 3. Add images (optional)

Put images in `public/assets/decks/<slug>/` and reference them in your slide data:

```ts
image: { src: '/assets/decks/wk10-26/diagram.png', alt: 'Architecture diagram' }
```

## Slide Layouts

Six layouts are available. Use `\n` in `headline` and `body` strings for line breaks.

### `title`

Opening slide with a large headline and optional status badges.

```ts
{
  layout: 'title',
  headline: 'Week 10\nUpdates',
  highlights: [
    { label: 'Feature A', status: '✓' },   // done
    { label: 'Feature B', status: '→' },   // in progress
    { label: 'Feature C', status: '✗' },   // blocked
    { label: 'Feature D' },                 // no status
  ],
}
```

### `full-headline`

Headline with 2–3 text columns below. Columns support an optional `title`, bullet-list `body`, and `download` link.

```ts
{
  layout: 'full-headline',
  headline: 'Project\nStatus',
  columns: [
    { title: 'Done', body: '• Task one\n• Task two' },
    { title: 'Next', body: '• Task three\n• Task four' },
  ],
}
```

### `content-photo`

Long-form text alongside an image. Set `reverse: true` to put the image on the left.

```ts
{
  layout: 'content-photo',
  headline: 'Deep Dive',
  body: 'Explanation text here...',
  image: { src: '/assets/decks/wk10-26/photo.png', alt: 'Description', caption: 'Fig 1.' },
  reverse: false,  // true = image left, text right
}
```

### `photo-headline`

Small image next to the headline, with columns below.

```ts
{
  layout: 'photo-headline',
  headline: 'Feature\nOverview',
  image: { src: '/assets/decks/wk10-26/icon.png', alt: 'Icon' },
  columns: [
    { title: 'Details', body: '• Point one\n• Point two' },
    { title: 'Notes', body: '• Point one\n• Point two' },
  ],
}
```

### `profile`

Portrait card for team introductions.

```ts
{
  layout: 'profile',
  headline: 'Jane\nDoe',
  body: 'Bio text here...',
  image: { src: '/assets/decks/wk10-26/headshot.png', alt: 'Jane Doe' },
}
```

### `closing`

Full-screen headline. No other fields.

```ts
{
  layout: 'closing',
  headline: 'Thanks!\nSee You\nNext Week',
}
```

## Styling & Customization

All styling is driven by Tailwind CSS with custom design tokens. No component-level CSS files — everything is configured through `src/app/globals.css` and Tailwind classes in the components.

### Design Tokens

Edit `src/app/globals.css` to change the deck's visual identity:

```css
@theme {
  /* ── Colors ── */
  --color-deck-bg: #F0EDEB;          /* Slide background */
  --color-deck-primary: #000000;     /* Headlines, body text, active dots */
  --color-deck-secondary: #4A4A4A;   /* Captions, status icons, date */
  --color-deck-accent: #FFFFFF;      /* Button hover text */
  --color-deck-dark: #1A1A1A;        /* Page background (behind slide) */
  --color-deck-track: #D9D5D2;       /* Progress bar track, inactive dots, dividers */
  --color-deck-disabled: #C0C0C0;    /* Disabled nav arrows, inactive lang toggle */
  --color-deck-hover-bg: #E8E5E3;    /* Hover states */

  /* ── Fonts ── */
  --font-headline: var(--font-bebas-neue), sans-serif;
  --font-body: var(--font-inter), sans-serif;
}
```

These tokens are used as Tailwind utilities throughout the components (e.g. `text-deck-primary`, `bg-deck-bg`, `font-headline`).

### Spacing Variables

Responsive spacing scales down at breakpoints. Edit in `globals.css`:

```css
:root {
  --slide-margin: 80px;     /* Padding inside slide edges */
  --slide-gutter: 40px;     /* Gap between columns */
  --slide-radius: 40px;     /* Slide border radius */
}

/* Tablet (≤1200px): 48px / 24px / 24px */
/* Mobile (≤768px):  24px / 16px / 16px */
```

### Fonts

Fonts are loaded in `src/app/layout.tsx` via `next/font/google`:

| Role | Font | Weights | Used for |
|------|------|---------|----------|
| `font-headline` | Bebas Neue | 400 | All headlines (uppercase, tight tracking) |
| `font-body` | Inter | 400, 500 | Body text, labels, badges, UI chrome |

To swap fonts, edit `layout.tsx` and update the `@theme` font variables in `globals.css`.

### UI Component Map

```
┌─────────────────────────────────────────────────────────┐
│ ProgressBar ← gradient bar, 3px, top edge               │
├─────────────────────────────────────────────────────────┤
│ Header                                                   │
│   ├── label (left)           ── deck.label               │
│   └── LanguageSwitcher + date (right)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   SlideRenderer → picks one of:                          │
│     ┌─ TitleSlide                                        │
│     ├─ FullHeadlineSlide                                 │
│     ├─ ContentPhotoSlide                                 │
│     ├─ PhotoHeadlineSlide                                │
│     ├─ ProfileSlide                                      │
│     └─ ClosingSlide (hides header, footer, nav arrows)   │
│                                                          │
│ ◄ NavArrow (left)                    NavArrow (right) ►  │
├─────────────────────────────────────────────────────────┤
│ Footer                                                   │
│   ├── Project    ├── Author    └── Week                  │
├─────────────────────────────────────────────────────────┤
│ DotIndicators ← centered, bottom bar                     │
└─────────────────────────────────────────────────────────┘
  Logo (absolute, bottom-left of page, outside slide)
```

### What's Stylable Per Component

| Component | File | What to customize |
|-----------|------|-------------------|
| **Slide canvas** | `SlideCarousel.tsx` | Aspect ratio (`16/9`), border radius, chrome padding |
| **Progress bar** | `ProgressBar.tsx` | Height (`3px`), gradient colors, shimmer animation speed |
| **Nav arrows** | `SlideCarousel.tsx` | Size (`w-10 h-10`), border radius, hover/active states |
| **Dot indicators** | `DotIndicators.tsx` | Size (`w-2 h-2`), gap, active scale (`scale-125`) |
| **Header** | `SlideCarousel.tsx` | Font size (`17px`), padding, label content |
| **Footer** | `SlideCarousel.tsx` | Column labels ("Project", "Author", "Week"), font sizes |
| **Language switcher** | `LanguageSwitcher.tsx` | Languages offered, toggle style |
| **Logo** | `Deck.tsx` | Image source, size (`h-6`), opacity (`opacity-60`), position |

### Headline Font Sizes (per layout)

Each slide type uses `clamp()` for fluid, viewport-responsive sizing:

| Layout | Font size | Clamp range |
|--------|-----------|-------------|
| `title` | Largest | `clamp(100px, 14vw, 260px)` |
| `closing` | Extra large | `clamp(120px, 16vw, 300px)` |
| `full-headline` | Large | `clamp(80px, 11vw, 200px)` |
| `profile` | Medium-large | `clamp(70px, 9vw, 160px)` |
| `photo-headline` | Medium | `clamp(50px, 7vw, 120px)` |
| `content-photo` | Small | `clamp(40px, 5vw, 80px)` |

To adjust, edit the `style={{ fontSize: 'clamp(...)' }}` in each slide component under `src/components/slides/`.

### Progress Bar Gradient

The animated gradient in `ProgressBar.tsx`:

```ts
backgroundImage: 'linear-gradient(90deg, #E8A87C, #D4798A, #A578C2, #85C1E9, #82E0AA, #E8A87C)'
```

Edit these hex values to change the progress bar color scheme. The `shimmer` animation (defined in `globals.css`) scrolls the gradient continuously.

### Closing Slide Behavior

When a slide has `layout: 'closing'`, the carousel hides the header, footer, and nav arrows (via `chromeHidden`). The slide fills the full canvas with just the headline. This is controlled in `Deck.tsx`:

```ts
chromeHidden={localizedDeck.slides.map(s => s.layout === 'closing')}
```

## Localization (Optional)

Add a Chinese translation file at `src/data/locales/<slug>.zh.json`. It mirrors the deck structure — any field you include overrides the English default.

```json
{
  "slides": [
    { "headline": "第10周\n汇报" },
    { "headline": "项目\n状态", "columns": [{ "title": "完成", "body": "• 任务一" }] }
  ]
}
```

A language switcher (EN / 中文) appears in the header automatically when a locale file exists.

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/latest` |
| `/latest` | Redirects to the newest deck (first entry in `entries.ts`) |
| `/<slug>` | Renders a specific deck |
| `/archive` | Lists all decks |

## Navigation

- Arrow keys (Left / Right) — previous / next slide
- Home / End — first / last slide
- Click dot indicators to jump to a slide
- Arrow buttons on either side of the slide

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build static HTML to `out/` |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build + deploy to Surge |

## Deployment

The project exports as static HTML (`next.config.ts` → `output: 'export'`). The `out/` directory can be deployed to any static host.

### Option A: Surge.sh (Recommended)

The fastest way to deploy — one command, no CI setup needed. See the full [Surge docs](https://surge.sh/help) for more details.

#### 1. Install Surge

```bash
npm install -g surge
surge login               # create a free account or log in
```

#### 2. Pick your subdomain

You can deploy to **any name** you want on `.surge.sh` — it's first-come, first-served. Choose a subdomain that makes sense for your team:

```
my-team-updates.surge.sh
frontend-weekly.surge.sh
acme-eng-decks.surge.sh
```

Update the deploy script in `package.json` with your chosen name:

```json
"deploy": "next build && surge ./out my-team-updates.surge.sh"
```

#### 3. Deploy

```bash
npm run deploy
```

That's it. Your deck is live at `https://my-team-updates.surge.sh`.

Each team member can deploy to their own subdomain, or the team can share one. Re-running `npm run deploy` updates the same URL in place.

#### 4. (Optional) Custom domain

To use a custom domain (e.g. `decks.yourcompany.com`) instead of a `.surge.sh` subdomain:

1. Add a `public/CNAME` file:
   ```
   decks.yourcompany.com
   ```
2. Add a CNAME DNS record: `decks.yourcompany.com` → `na-west1.surge.sh`
3. Update the deploy script:
   ```json
   "deploy": "next build && surge ./out decks.yourcompany.com"
   ```

Custom domains require a [Surge Plus](https://surge.sh/help/adding-a-custom-domain) plan. Free accounts can use any `.surge.sh` subdomain.

#### Useful Surge commands

| Command | Description |
|---------|-------------|
| `surge list` | List your deployed projects |
| `surge teardown my-team-updates.surge.sh` | Remove a deployment |
| `surge whoami` | Check logged-in account |

Full reference: [surge.sh/help](https://surge.sh/help)

---

### Option B: GitHub Pages

Better for automated deploys on every push. Requires a GitHub repo and Actions setup.

#### 1. Set the base path

If deploying to `https://<user>.github.io/<repo>/` (not a custom domain), set the base path in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/your-repo-name',   // ← add this
  images: { unoptimized: true },
};
```

Skip this if using a custom domain (e.g. `decks.yourcompany.com`).

#### 2. Add the GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

#### 3. Enable GitHub Pages

Go to **Settings → Pages → Source** and select **GitHub Actions**.

#### 4. (Optional) Custom domain

To use a custom domain instead of `basePath`:

1. Remove `basePath` from `next.config.ts`
2. Add a `public/CNAME` file with your domain:
   ```
   decks.yourcompany.com
   ```
3. Configure your DNS to point to GitHub Pages ([docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))

#### Deploy script (manual alternative)

Add to `package.json`:

```json
"deploy:gh": "npm run build && npx gh-pages -d out"
```

Install `gh-pages` as a dev dependency:

```bash
npm install -D gh-pages
```

Run `npm run deploy:gh` to push `out/` to the `gh-pages` branch. Then set **Settings → Pages → Source** to **Deploy from a branch** → `gh-pages`.

## Project Structure

```
src/
├── app/                      # Next.js routes
│   ├── [slug]/page.tsx       # Deck viewer
│   ├── archive/page.tsx      # Archive listing
│   ├── latest/page.tsx       # Redirect to newest
│   ├── layout.tsx            # Root layout + fonts
│   └── globals.css           # Tailwind + design tokens
├── components/
│   ├── deck/                 # Carousel, nav, progress bar
│   └── slides/               # One component per layout
├── data/
│   ├── entries.ts            # Deck registry
│   ├── decks/                # Deck data files + loader
│   └── locales/              # Translation JSON files
├── hooks/
│   └── useSlideNavigation.ts # Keyboard + state logic
└── lib/
    ├── types.ts              # TypeScript interfaces
    ├── lang.tsx              # i18n context + helpers
    ├── renderHeadline.tsx    # \n → <br /> for headlines
    └── renderBody.tsx        # \n → <br /> for body text

public/assets/decks/          # Images & downloads per deck
```
