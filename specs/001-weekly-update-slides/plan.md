# Implementation Plan: Weekly Update Slides

**Branch**: `001-weekly-update-slides` | **Date**: 2026-02-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-weekly-update-slides/spec.md`

## Summary

Build a static website that presents weekly work updates as navigable slide decks. Each weekly entry is a self-contained HTML page rendered in a black-and-white minimalist design (per design-guide.md). The site uses folder-based routing with a JSON manifest for entry discovery. Routes: `/` redirects to `/latest`, which resolves to the newest entry; past entries are accessible at `/{yyyymmdd-yyyymmdd}`; a dedicated `/archive` page lists all entries. Slide navigation, progress tracking, and prev/next week links are handled by shared vanilla JavaScript.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)
**Primary Dependencies**: Google Fonts (Oswald 900, Inter 400/500) — no frameworks, no build tools
**Storage**: Static files on disk; `entries.json` manifest at project root
**Testing**: Manual browser testing across Chrome, Firefox, Safari, Edge; optional local HTTP server for development
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) on desktop; static hosting (GitHub Pages or equivalent)
**Project Type**: Static website
**Performance Goals**: Page load + full slide navigation ready within 5 seconds (SC-001)
**Constraints**: No build tools, no server-side rendering, no frameworks; pure HTML/CSS/vanilla JS (FR-011)
**Scale/Scope**: Single author; ~52 entries/year; personal consolidation tool

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution file exists for this project. Gate passes by default — no constraints to evaluate.

**Post-Phase 1 re-check**: The design uses zero frameworks, zero build tools, a single flat file structure, and no abstractions beyond shared CSS/JS files. Complexity is minimal. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-weekly-update-slides/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: routing, fonts, navigation research
├── data-model.md        # Phase 1: entities and manifest schema
├── quickstart.md        # Phase 1: local dev and authoring guide
├── contracts/
│   ├── entries-manifest.md   # entries.json schema and consumer behavior
│   └── slide-deck-html.md   # HTML structure contract for deck pages
├── checklists/
│   └── requirements.md      # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
/
├── index.html                          # Root redirect → /latest/
├── latest/
│   └── index.html                      # Manifest lookup → redirect to newest entry
├── archive/
│   └── index.html                      # Archive listing page
├── {yyyymmdd-yyyymmdd}/                # One folder per weekly entry
│   └── index.html                      # Self-contained slide deck
├── entries.json                        # Manifest: ordered list of all entries
├── shared/
│   ├── styles.css                      # Design system (layout, typography, colors, all 6 slide layouts)
│   ├── slides.js                       # Slide navigation, progress bar, keyboard support, prev/next week
│   └── archive.js                      # Archive listing rendering logic
├── docs/
│   └── design-guide.md                 # Design specification reference
└── package.json
```

**Structure Decision**: Flat file-based structure at the repository root. No `src/` directory — the site IS the repository root. Each weekly entry is a folder containing a single `index.html`. Shared assets live in `/shared/`. This matches the static-site-on-GitHub-Pages deployment model where the repo root is the web root.

## Key Technical Decisions

### 1. Folder-Based Routing (R-001)

Every route maps to a real folder with an `index.html`:
- `/index.html` → `<meta refresh>` + JS redirect to `/latest/`
- `/latest/index.html` → fetches `entries.json`, redirects to `entries[0].slug`
- `/archive/index.html` → fetches `entries.json`, renders listing
- `/{slug}/index.html` → self-contained slide deck

This guarantees HTTP 200 for every valid URL on any static host. No 404 hacks, no history API workarounds.

### 2. Manifest-Driven Discovery (R-002)

`entries.json` at the project root is the single source of truth:
- `/latest/` reads `entries[0]` to find the newest entry
- `/archive/` reads all entries to render the listing
- Each deck page reads the manifest to build prev/next week links

Authoring workflow: create a folder, update `entries.json`. Two steps, no build.

### 3. Shared CSS Design System (R-003, R-005)

`/shared/styles.css` implements the full design guide:
- 1920x1080 slide canvas with 40px corner radius
- Monochromatic palette (#F0EDEB, #000000, #4A4A4A, #FFFFFF)
- Oswald 900 for headlines (ALL CAPS, tight tracking/leading)
- Inter 400/500 for body/labels
- All 6 slide layout types as CSS classes
- Header bar, footer bar, controls bar per design guide specs
- Interactive element states (hover, active, disabled) per Elements Library

### 4. Vanilla JS Slide Engine (R-004)

`/shared/slides.js` handles:
- Current slide tracking (index-based)
- Slide transitions (show/hide via CSS class toggling)
- Progress bar fill calculation (`currentSlide / totalSlides`)
- Keyboard navigation (left/right arrow keys)
- Button states (disable prev on first slide, next on last)
- Prev/next week links (fetched from `entries.json` at load)

### 5. Typography via Google Fonts (R-003)

- **Headlines**: Oswald, weight 900 — condensed grotesque, matches design guide requirement
- **Body/Labels**: Inter, weight 400/500 — clean geometric, excellent readability at small sizes
- Loaded via Google Fonts CDN `<link>` tag with `display=swap` for performance
