# Feature Specification: Weekly Update Slides

**Feature Branch**: `001-weekly-update-slides`
**Created**: 2026-02-26
**Status**: Draft
**Input**: User description: "I am building a site which should record my weekly updates. Weekly updates will be served by HTML and CSS and rendered as a single page. They will be shown in a slide format. The platform should have ways to ensure that I can revisit past entries. Design should be based on design-guide.md."

## Clarifications

### Session 2026-02-26

- Q: Does the site need a dedicated archive/index page, prev/next week navigation on each deck, or both? → A: Both — a dedicated archive page listing all entries plus prev/next week navigation on each slide deck.
- Q: What should the root URL `/` display? → A: `/` redirects to `/latest` (visitors land on the newest slide deck).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Current Week's Update as Slides (Priority: P1)

As a visitor, I navigate to `/latest` and see the most recent weekly update presented as a series of slides on a single page. Each slide follows the black-and-white minimalist design system (per design-guide.md) with large typographic headlines, consistent header/footer bars, and generous whitespace. I can navigate forward and backward through the slides using the design guide's navigation controls (prev/next arrows, progress bar, restart/skip buttons). I can also navigate to the previous or next week's deck directly from the current deck.

**Why this priority**: This is the core experience — without the ability to view a weekly update in slide format, the product has no value. Everything else builds on this.

**Independent Test**: Can be fully tested by loading a single weekly update file at `/latest` and verifying it renders as navigable slides styled per the design guide.

**Acceptance Scenarios**:

1. **Given** a weekly update exists, **When** a visitor navigates to `/`, **Then** they are redirected to `/latest` and the most recent weekly update is displayed as a sequence of slides in 16:9 aspect ratio with the minimalist design system applied.
2. **Given** a weekly update exists for a specific date range, **When** a visitor navigates to `/{yyyymmdd-yyyymmdd}` (e.g., `/20260220-20260226`), **Then** that specific week's update is displayed as slides.
3. **Given** the slide deck is displayed, **When** the visitor clicks the forward navigation arrow, **Then** the next slide is shown with a smooth transition.
4. **Given** the visitor is on any slide beyond the first, **When** the visitor clicks the back navigation arrow, **Then** the previous slide is shown.
5. **Given** the slide deck is displayed, **When** the visitor views any slide, **Then** the persistent header (title + date) and footer (project info + navigation controls) are visible per the design guide.
6. **Given** the visitor is viewing a deck and a previous/next week exists, **When** the visitor uses the prev/next week navigation, **Then** they are taken to the adjacent week's slide deck.

---

### User Story 2 - Browse and Revisit Past Weekly Updates (Priority: P2)

As a visitor, I want to access a dedicated archive page listing all past weekly updates so I can discover and revisit any previous entry. Each entry in the archive links to its slide deck. I can also navigate between adjacent weeks using prev/next controls on each individual deck.

**Why this priority**: The user explicitly requires the ability to revisit past entries. The archive provides discoverability, while prev/next week navigation enables sequential browsing.

**Independent Test**: Can be tested by creating multiple weekly update entries and verifying the archive lists all of them, and that selecting any entry loads and displays it as slides.

**Acceptance Scenarios**:

1. **Given** multiple weekly updates exist, **When** a visitor navigates to the archive page, **Then** all entries are listed in reverse chronological order (newest first) with their date ranges visible.
2. **Given** the archive is displayed, **When** the visitor selects a past entry, **Then** that entry loads at its `/{yyyymmdd-yyyymmdd}` URL and displays in the same slide format.
3. **Given** a visitor is viewing any deck, **When** a newer week's deck exists, **Then** a "next week" navigation element is available to move forward chronologically.
4. **Given** a visitor is viewing any deck, **When** an older week's deck exists, **Then** a "previous week" navigation element is available to move backward chronologically.
5. **Given** a visitor is viewing the oldest deck, **Then** the "previous week" navigation is disabled or hidden.
6. **Given** a visitor is viewing the newest deck, **Then** the "next week" navigation is disabled or hidden.

---

### User Story 3 - Add a New Weekly Update (Priority: P3)

As the site author, I add a new weekly update by creating a new HTML file named with the week's date range (e.g., `20260220-20260226.html`). The site is not a CMS — it is purely a presentation layer to consolidate work that has been done. No authoring UI is needed; the author works directly with files.

**Why this priority**: Content creation is essential for the site to have ongoing value, but the viewing experience must work first. The authoring workflow is deliberately simple — add a file, and it becomes accessible.

**Independent Test**: Can be tested by adding a new weekly update file and verifying it appears as the latest entry on the site, is accessible at its URL, and appears in the archive.

**Acceptance Scenarios**:

1. **Given** I am the site author, **When** I add a new weekly update file with the correct date-range naming convention, **Then** it becomes the latest entry accessible at `/latest`.
2. **Given** a new update file is added, **When** a visitor navigates to the archive, **Then** the new entry appears at the top of the list and the previous latest entry moves down.
3. **Given** a new update file is added, **When** a visitor navigates to its specific date-range URL, **Then** the deck renders correctly.

---

### Edge Cases

- What happens when there is only one weekly update (no archive to browse, no prev/next week navigation)?
- What happens when a slide contains no body text — only a headline?
- What happens when the visitor reaches the last slide in the deck?
- What happens when the browser window is resized or viewed on a smaller screen?
- What happens when an image referenced in a slide is missing or fails to load?
- What happens when a visitor navigates to a date-range URL that has no corresponding entry?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST render each weekly update as a sequence of slides on a single HTML page, styled per the design guide (16:9 aspect ratio, ~40px corner radius, #F0EDEB background).
- **FR-002**: Each slide MUST display a persistent header bar (left-aligned title, right-aligned date) and a persistent footer bar (project info columns + navigation controls) as defined in the design guide.
- **FR-003**: The site MUST support forward and backward navigation between slides within a single update, using the design guide's controls layout (prev/next arrows, progress bar, restart/skip-to-end buttons).
- **FR-004**: Navigating to `/latest` MUST display the most recent weekly update.
- **FR-005**: Each weekly update MUST be accessible at a URL path matching its date range in `/{yyyymmdd-yyyymmdd}` format (e.g., `/20260220-20260226`).
- **FR-006**: The site MUST provide a dedicated archive page listing all weekly updates in reverse chronological order, with each entry linking to its date-range URL.
- **FR-007**: Each slide deck MUST include prev/next week navigation controls allowing visitors to move to the chronologically adjacent weekly update.
- **FR-008**: The site MUST follow the design guide typography system: condensed grotesque sans-serif headlines (all caps, black/900 weight), clean geometric sans-serif for body and labels.
- **FR-009**: The site MUST use only the monochromatic color palette defined in the design guide (#F0EDEB background, #000000 primary, #4A4A4A secondary, #FFFFFF accent).
- **FR-010**: The site MUST support multiple slide layout types as defined in the design guide: title slide, content + photo, full-width headline + subtext, photo + headline, profile/about, and closing/CTA.
- **FR-011**: The site MUST be built with only HTML and CSS (with minimal vanilla JavaScript for slide navigation), requiring no build tools or server-side rendering.
- **FR-012**: Each weekly update MUST be identified by a date range (start date to end date of the week) in `yyyymmdd-yyyymmdd` ISO format, displayed in the header bar and used for URL routing and archive ordering.
- **FR-013**: The site is a presentation/consolidation tool only — no content management UI, editor, or authoring interface is required. New entries are added by the author as files.
- **FR-014**: Navigating to `/` (root URL) MUST redirect to `/latest`.

### Key Entities

- **Weekly Update**: A single entry representing one week's content. Identified by a date range in `yyyymmdd-yyyymmdd` format (e.g., `20260220-20260226`). Contains a title and an ordered collection of slides. Each update is self-contained, accessible at its own URL, and viewable independently.
- **Slide**: An individual screen within a weekly update. Has a layout type (title, content+photo, full-width headline, etc.), headline text, optional body text, and optional image. Follows the design guide's layout and spacing rules.
- **Archive**: A dedicated page providing a chronologically ordered index of all weekly updates, enabling visitors to discover and select past entries by date range.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can view the latest weekly update as slides and navigate through all slides within 5 seconds of page load.
- **SC-002**: A visitor can access any past weekly update from the archive in 2 clicks or fewer (one to open archive, one to select entry).
- **SC-003**: All slides render correctly at 16:9 aspect ratio and follow the design guide's typography, color, and spacing rules with zero visual deviations.
- **SC-004**: The site works in all modern browsers (Chrome, Firefox, Safari, Edge) without requiring any server-side processing or build step.
- **SC-005**: A new weekly update can be authored and published by adding a single file with the correct date-range naming convention, requiring no changes to the site's core structure.
- **SC-006**: The archive correctly lists 100% of all published weekly updates in reverse chronological order.
- **SC-007**: A visitor can move between chronologically adjacent weekly updates using prev/next week navigation without returning to the archive.

## Assumptions

- The site is a personal/portfolio tool for a single author — there is no multi-user authentication or access control required.
- "Slide format" means one slide is displayed at a time, filling the viewport, with navigation to move between slides (not a scrollable list of all slides).
- The site is static (HTML/CSS/minimal JS) and does not require a backend server or database — content is stored as files.
- Navigation between slides uses the design guide's controls layout: prev/next arrows, progress bar, restart and skip-to-end buttons.
- The design guide's photography style guidelines apply when images are included in slides, but images are optional per slide.
- The archive view is a simple list/index page, not a separate slide deck itself.
- The site will be hosted as static files (e.g., GitHub Pages or similar) — no server-side logic required.
- The site is not a CMS — it is purely a presentation layer to consolidate work that has been done. Content authoring happens outside the site (directly editing files).
- The root URL `/` redirects to `/latest`, getting visitors to the newest content immediately.
