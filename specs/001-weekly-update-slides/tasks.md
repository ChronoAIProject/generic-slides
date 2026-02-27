# Tasks: Weekly Update Slides

**Input**: Design documents from `/specs/001-weekly-update-slides/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Verification is manual browser testing per spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Static website at repo root**: All paths are relative to the repository root `/`
- Shared assets: `/shared/`
- Weekly entries: `/{yyyymmdd-yyyymmdd}/`
- Route pages: `/latest/`, `/archive/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project folder structure and foundational files

- [x] T001 Create project directory structure — `shared/`, `latest/`, `archive/` folders at repository root
- [x] T002 Create `entries.json` at project root with initial manifest structure containing one sample entry (`20260220-20260226`) per the contract schema in `contracts/entries-manifest.md`
- [x] T003 [P] Create root `index.html` at project root with `<meta http-equiv="refresh" content="0;url=/latest/">` and JS fallback `window.location.replace('/latest/')` for redirect to `/latest/`

---

## Phase 2: Foundational (Design System CSS)

**Purpose**: Implement the full design system in shared CSS. MUST be complete before ANY user story can render correctly.

**Reference**: `docs/design-guide.md` (all values), `contracts/slide-deck-html.md` (BEM class names)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement base design system in `shared/styles.css` — CSS custom properties for colors (`#F0EDEB` background, `#000000` primary, `#4A4A4A` secondary, `#FFFFFF` accent, `#1A1A1A` dark variant, `#D9D5D2` track), Google Fonts import (Oswald wght 900, Inter wght 400;500), base reset, body background, and typography rules (Oswald ALL CAPS headlines with tight tracking -0.02em to -0.04em and tight leading 0.85-0.95, Inter 400 body at 14-18px with line-height 1.5-1.6, Inter 400-500 labels at 16-20px)
- [x] T005 Add slide canvas and structural layout to `shared/styles.css` — `.deck` container, `.slide` base (1920x1080 logical size, 16:9 aspect ratio via aspect-ratio or padding-trick, `~40px` corner radius, `#F0EDEB` background, 80px margins all sides), `.slide__header` bar (full width, 40px top padding, 80px left/right, left-aligned `.slide__label` 16-18px + right-aligned `.slide__date`), `.slide__footer` bar (full width, 40px bottom padding, 80px left/right, 3 info columns with 12-14px uppercase labels in `#4A4A4A` and 14-16px values in `#000000`), `.slide__content` area between header and footer with 60-80px top spacing and 40-60px bottom spacing
- [x] T006 Add all 6 slide layout type styles to `shared/styles.css` — `.slide--title` (headline fills 60-70% height, left-aligned vertically centered, no image), `.slide--content-photo` (photo 45% width + content 50% width side-by-side, photo ~12px rounded corners, 40px gap), `.slide--full-headline` (headline spans full width left-aligned, 2-3 columns below with 40px gutter, ~550px max column width), `.slide--photo-headline` (photo floats 40% width, headline wraps beside, body in multi-column below), `.slide--profile` (name as large display text, portrait photo, minimal bio text), `.slide--closing` (largest type size, text fills nearly entire canvas, optional header/footer omit)
- [x] T007 Add interactive controls styles to `shared/styles.css` — `.controls` bar (64px height, transparent background, 0 80px padding, flex layout), `.controls__prev` and `.controls__next` buttons (48x48px hit area, 24px icon, 50% or 12px corner radius, transparent default bg, `#000000` hover bg, `#1A1A1A` active bg, `#C0C0C0` disabled, 1px border, 200ms transitions per Elements Library states), `.controls__restart` and `.controls__end` buttons (40x40px, 20px icon, `#4A4A4A` default icon, `#000000` hover with `#E8E5E3` bg, disabled `#C0C0C0`), `.controls__progress` bar (full width, 3px height, `#D9D5D2` track, `#000000` fill, 5px on hover, 300ms width transition, 150ms height transition), `.controls__progress-fill` (width driven by CSS custom property `--progress`), segmented variant styles, slide counter (14px `#4A4A4A`), `.controls__left`/`.controls__center`/`.controls__right` flex alignment (left group 8px gap, right group 12px gap)

**Checkpoint**: Design system CSS complete — all slide layouts and controls render correctly when applied to static HTML

---

## Phase 3: User Story 1 - View Current Week's Update as Slides (Priority: P1) 🎯 MVP

**Goal**: A visitor navigates to `/latest` and sees the most recent weekly update as a navigable slide deck with full design-guide styling and interactive controls

**Independent Test**: Open `http://localhost:{port}/` in a browser — verify redirect chain `/` → `/latest/` → `/20260220-20260226/`, all slides render at 16:9 with correct typography/colors/spacing, and forward/backward slide navigation works via buttons and keyboard arrows

### Implementation for User Story 1

- [x] T008 [P] [US1] Create sample weekly deck at `20260220-20260226/index.html` per the HTML structure contract in `contracts/slide-deck-html.md` — include one of each slide layout type (title, content-photo, full-headline, photo-headline, profile, closing) with realistic sample content, Google Fonts link, link to `/shared/styles.css`, script tag for `/shared/slides.js`, `.deck` wrapper with `data-slug="20260220-20260226"` and `data-total`, `.controls` nav bar with all buttons (restart, end, progress bar, prev, next), `.week-nav` placeholder
- [x] T009 [P] [US1] Implement core slide navigation engine in `shared/slides.js` — on DOMContentLoaded: query all `.slide` elements, set initial state (show slide 0, hide others via `.slide--active` class), track `currentIndex` and `totalSlides` from `.deck[data-total]`, implement `goToSlide(index)` function that toggles `.slide--active` class and updates progress bar `--progress` custom property to `((index + 1) / total) * 100%`, update `aria-valuenow` on `.controls__progress`
- [x] T010 [US1] Add button click handlers to `shared/slides.js` — `.controls__next` calls `goToSlide(currentIndex + 1)`, `.controls__prev` calls `goToSlide(currentIndex - 1)`, `.controls__restart` calls `goToSlide(0)`, `.controls__end` calls `goToSlide(totalSlides - 1)`, disable `.controls__prev` on first slide (add `aria-disabled="true"` + disabled modifier class), disable `.controls__next` on last slide, update button states after each navigation
- [x] T011 [US1] Add keyboard navigation to `shared/slides.js` — listen for `keydown` events: `ArrowRight` triggers next slide, `ArrowLeft` triggers previous slide, `Home` triggers restart, `End` triggers skip-to-end, prevent default scroll behavior for these keys
- [x] T012 [US1] Create `latest/index.html` — minimal HTML page that fetches `/entries.json`, reads `entries[0].slug`, and calls `window.location.replace('/' + slug + '/')` to redirect to the newest entry. Include a `<noscript>` fallback message.
- [x] T013 [US1] Verify redirect chain — open browser at root `/`, confirm redirect to `/latest/`, confirm redirect to `/20260220-20260226/`, confirm all 6 slides render with correct design-guide styling, confirm next/prev slide buttons work, confirm keyboard arrows work, confirm progress bar updates, confirm restart/skip-to-end buttons work

**Checkpoint**: User Story 1 complete — a single weekly deck is viewable with full slide navigation. This is the MVP.

---

## Phase 4: User Story 2 - Browse and Revisit Past Weekly Updates (Priority: P2)

**Goal**: A visitor can access a dedicated archive page listing all weekly updates, select any past entry to view it, and navigate between adjacent weeks using prev/next controls on each deck

**Independent Test**: Create multiple entries, open `/archive/` to see reverse-chronological listing, click any entry to load it, verify prev/next week links on each deck navigate to adjacent entries, verify boundary cases (newest deck hides "next week", oldest hides "previous week")

### Implementation for User Story 2

- [x] T014 [P] [US2] Create second sample deck at `20260213-20260219/index.html` — same HTML structure as first deck with different sample content (at least 3 slides using varied layout types), `data-slug="20260213-20260219"`
- [x] T015 [US2] Update `entries.json` to include both entries in newest-first order — `20260220-20260226` at index 0, `20260213-20260219` at index 1
- [x] T016 [US2] Implement archive page at `archive/index.html` with inline or linked JS — fetch `/entries.json`, render a reverse-chronological list of all entries, each item shows the entry title and date range, each links to `/{slug}/`. Style the archive page using the design-guide aesthetic (same background `#F0EDEB`, Oswald headlines, Inter body, 80px margins, left-aligned, monochromatic)
- [x] T017 [US2] Add archive page styles to `shared/styles.css` — `.archive` container, `.archive__list` layout, `.archive__entry` items with title and date range, hover state (consistent with button hover pattern from Elements Library), link styling (no text decoration, `#000000` text)
- [x] T018 [US2] Add prev/next week navigation to `shared/slides.js` — on page load, fetch `/entries.json`, find current entry by matching `data-slug` against entries array, determine adjacent entries using index math (prev = `entries[i+1]`, next = `entries[i-1]` per manifest contract), populate `.week-nav__prev` and `.week-nav__next` href attributes, hide/disable link if no adjacent entry exists (first entry = no next week, last entry = no previous week)
- [x] T019 [US2] Add week-nav component styles to `shared/styles.css` — `.week-nav` positioning (above or beside controls bar), `.week-nav__prev` and `.week-nav__next` link styling (label text like "← Previous Week" / "Next Week →"), hidden/disabled state when no adjacent entry, hover transitions consistent with design guide
- [x] T020 [US2] Verify archive and week navigation — open `/archive/`, confirm both entries listed newest-first, click older entry to load it, confirm prev/next week links navigate correctly between the two decks, confirm newest deck shows no "next week" link, confirm oldest deck shows no "previous week" link

**Checkpoint**: User Stories 1 AND 2 complete — archive page works, week-to-week navigation works, all entries accessible via URL

---

## Phase 5: User Story 3 - Add a New Weekly Update (Priority: P3)

**Goal**: The author can add a new weekly update by creating a folder with an HTML file and updating the manifest, and it becomes the latest entry automatically

**Independent Test**: Create a third entry folder, add it to entries.json, verify `/latest/` redirects to the new entry, verify it appears at top of archive, verify prev/next links update correctly on all three decks

### Implementation for User Story 3

- [x] T021 [US3] Create deck template at `shared/deck-template.html` — a blank slide deck HTML file following the contract in `contracts/slide-deck-html.md`, with placeholder content for each of the 6 layout types marked with HTML comments explaining what to replace, Google Fonts link, shared CSS/JS links, all controls and week-nav markup ready to use
- [x] T022 [US3] Create third sample deck at `20260227-20260305/index.html` using the template — copy `shared/deck-template.html`, update `data-slug="20260227-20260305"`, fill in sample content for 4-5 slides
- [x] T023 [US3] Update `entries.json` with third entry at index 0 — new entry `20260227-20260305` becomes first, bump previous entries down, verify manifest ordering is newest-first
- [x] T024 [US3] Verify authoring workflow — confirm `/latest/` redirects to the new entry `/20260227-20260305/`, confirm archive lists all 3 entries in correct order, confirm prev/next week links work across all 3 decks in both directions

**Checkpoint**: All user stories complete — full authoring workflow validated with 3 entries

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge case handling, accessibility, and cross-browser verification

- [x] T025 Handle edge cases in `shared/slides.js` — single entry (hide week-nav entirely), headline-only slides (no body content renders cleanly), last slide reached (next button disabled with `aria-disabled`), missing images (add CSS fallback for broken `<img>` in `shared/styles.css`)
- [x] T026 [P] Add responsive scaling to `shared/styles.css` — ensure slide canvas scales down proportionally when viewport is smaller than 1920x1080 (use CSS `scale()` transform or viewport-relative units), maintain 16:9 aspect ratio at all viewport sizes, ensure controls remain accessible
- [x] T027 [P] Accessibility audit — verify all buttons have `aria-label`, progress bar has `role="progressbar"` with updated `aria-valuenow`, keyboard navigation works (Tab between controls, arrows for slides), disabled buttons have `aria-disabled="true"`, archive links are keyboard-accessible
- [x] T028 Cross-browser verification — test full user journey (root redirect → latest → slide nav → archive → past entry → week nav) in Chrome, Firefox, Safari, and Edge, verify design-guide compliance (colors, fonts, spacing, transitions) across all browsers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories (CSS must exist before any HTML page renders correctly)
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (reuses slides.js, needs first sample deck)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (validates workflow across 3 entries, needs archive and week-nav)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). Delivers MVP independently.
- **User Story 2 (P2)**: Builds on US1 (extends slides.js with week-nav, adds archive page). Can be tested independently with 2 entries.
- **User Story 3 (P3)**: Builds on US2 (needs archive and week-nav to validate full workflow). Independently testable by adding a 3rd entry.

### Within Each Phase

- Tasks without `[P]` must execute sequentially in listed order
- Tasks marked `[P]` within the same phase can run in parallel
- Complete each checkpoint before advancing to the next phase

### Parallel Opportunities

**Phase 1** (Setup):
- T002 and T003 can run in parallel (different files)

**Phase 3** (User Story 1):
- T008 and T009 can run in parallel (HTML content vs JS logic, different files)

**Phase 4** (User Story 2):
- T014 can run in parallel with T016 (sample deck vs archive page, different files)

**Phase 6** (Polish):
- T026 and T027 can run in parallel (CSS work vs accessibility audit)

---

## Parallel Example: User Story 1

```bash
# Launch these in parallel (different files):
Task: "Create sample weekly deck at 20260220-20260226/index.html"
Task: "Implement core slide navigation engine in shared/slides.js"

# Then sequentially:
Task: "Add button click handlers to shared/slides.js"
Task: "Add keyboard navigation to shared/slides.js"
Task: "Create latest/index.html"
Task: "Verify redirect chain"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational CSS (T004-T007)
3. Complete Phase 3: User Story 1 (T008-T013)
4. **STOP and VALIDATE**: Open browser, verify slide deck renders and navigates
5. Deploy to GitHub Pages if ready — site works with a single entry

### Incremental Delivery

1. Setup + Foundational → Design system ready
2. Add User Story 1 → Single deck viewable with navigation (MVP!)
3. Add User Story 2 → Archive page + week-to-week navigation with 2 entries
4. Add User Story 3 → Template + validated 3-entry workflow
5. Polish → Edge cases, responsive scaling, accessibility, cross-browser

### Key Files

| File | Created In | Modified In |
|------|-----------|-------------|
| `shared/styles.css` | Phase 2 (T004) | Phase 2 (T005-T007), Phase 4 (T017, T019), Phase 6 (T025, T026) |
| `shared/slides.js` | Phase 3 (T009) | Phase 3 (T010-T011), Phase 4 (T018), Phase 6 (T025) |
| `entries.json` | Phase 1 (T002) | Phase 4 (T015), Phase 5 (T023) |
| `index.html` | Phase 1 (T003) | — |
| `latest/index.html` | Phase 3 (T012) | — |
| `archive/index.html` | Phase 4 (T016) | — |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- No build tools — all files are hand-authored HTML/CSS/JS
- Verify with a local HTTP server (`npx serve .` or `python3 -m http.server`)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Design guide reference: `docs/design-guide.md` (all visual specs, Elements Library)
