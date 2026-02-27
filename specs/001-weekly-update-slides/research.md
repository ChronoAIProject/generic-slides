# Research: Weekly Update Slides

**Branch**: `001-weekly-update-slides` | **Date**: 2026-02-26

## R-001: Static Site URL Routing Strategy

**Decision**: Folder-based routing with `entries.json` manifest

**Rationale**: This is the only approach that delivers the exact URL scheme from the spec (`/`, `/latest`, `/{yyyymmdd-yyyymmdd}`, `/archive`) while returning HTTP 200 for every valid route, requiring zero build tools, and working on any static host (GitHub Pages, Netlify, S3) without configuration.

**Alternatives considered**:

| Approach | Rejected Because |
|----------|------------------|
| Hash-based routing (`/#/latest`) | Violates spec URL scheme; poor link previews/SEO; ugly URLs |
| History API + 404.html redirect | Returns HTTP 404 for every route before redirect; relies on GitHub Pages 404 behavior which could change; fragile |
| Copy index.html as 404.html | Requires a build step (forbidden by FR-011); still returns HTTP 404 status |

**Implementation**:
- Each weekly update lives in its own folder: `/{yyyymmdd-yyyymmdd}/index.html`
- `/latest/index.html` fetches `entries.json` and redirects to the newest entry
- `/archive/index.html` fetches `entries.json` and renders the full listing
- `/index.html` uses `<meta http-equiv="refresh">` + JS fallback to redirect to `/latest/`
- `entries.json` is the single source of truth for entry ordering (newest-first)

## R-002: Entry Discovery via Manifest

**Decision**: Use `entries.json` at the project root as a manually maintained manifest

**Rationale**: Static sites cannot enumerate directory contents at runtime. A manifest file is the simplest, most reliable way for `/latest/`, `/archive/`, and per-deck prev/next navigation to discover available entries without any build tooling or server-side logic.

**Alternatives considered**:

| Approach | Rejected Because |
|----------|------------------|
| Hardcoded links in each HTML file | Breaks when new entries added; requires updating every file |
| GitHub API to list repo contents | Requires network call to external API; rate-limited; fragile |
| JavaScript directory listing | Not possible on static hosts |

**Implementation**:
- Author maintains `entries.json` with newest entries first
- Each deck page fetches `/entries.json` to build prev/next week links
- `/archive/index.html` fetches `/entries.json` to render the listing
- The slug format `yyyymmdd-yyyymmdd` is inherently sortable, but explicit ordering in the JSON removes ambiguity

## R-003: Typography / Font Loading

**Decision**: Use Google Fonts — Oswald (headlines) + Inter (body/labels)

**Rationale**: The design guide specifies "condensed grotesque sans-serif" for headlines (suggesting Oswald, Bebas Neue, Anton, or Dharma Gothic) and "clean geometric sans-serif" for body (suggesting Inter, DM Sans, or Poppins). Oswald and Inter are both available on Google Fonts, widely supported, and well-paired. Oswald offers the condensed, high-weight (900/Black) needed for the large typographic headlines. Inter is clean, geometric, and excellent at small sizes for body and labels.

**Alternatives considered**:

| Approach | Rejected Because |
|----------|------------------|
| Bebas Neue + DM Sans | Bebas Neue is uppercase-only (no lowercase glyphs) which limits flexibility |
| Anton + Poppins | Anton lacks weight 900; Poppins is slightly less geometric than Inter |
| Self-hosted fonts | Adds file management overhead; Google Fonts CDN is simpler for a static site |

## R-004: Slide Navigation Approach

**Decision**: Vanilla JavaScript with CSS transitions for slide movement

**Rationale**: The design guide defines specific interactive elements (nav buttons, progress bar, restart/skip buttons) with hover states and transitions. These require JavaScript for state management (current slide index, button states) and CSS transitions for smooth visual feedback. A pure CSS-only approach (using `:target` or radio buttons) cannot support the progress bar fill calculation, keyboard navigation, or the full controls layout.

**Alternatives considered**:

| Approach | Rejected Because |
|----------|------------------|
| CSS-only (`:target` selectors) | Cannot calculate progress bar width; no keyboard nav; limited state management |
| CSS-only (radio button hack) | Fragile; cannot support prev/next week navigation; poor accessibility |

**Implementation**:
- Single shared `slides.js` loaded by all deck pages
- Tracks current slide index, total slides
- Updates `transform: translateX()` or `display` to show/hide slides
- Updates progress bar width via CSS custom property
- Listens for keyboard arrow keys + click events on nav buttons
- Fetches `entries.json` to populate prev/next week links

## R-005: Shared Assets Strategy

**Decision**: Shared CSS and JS files in a `/shared/` directory, linked by absolute path from every page

**Rationale**: Every weekly deck and the archive page share identical styles (design guide) and navigation logic. Duplicating these per-folder would create maintenance burden. A shared directory with absolute path references (`/shared/slides.css`) works on any static host serving from the root.

**Implementation**:
```
/shared/
├── styles.css      # Full design system (layout, typography, colors, slide layouts)
├── slides.js       # Slide navigation, progress bar, keyboard support
└── archive.js      # Archive page listing logic (optional, could be inline)
```
