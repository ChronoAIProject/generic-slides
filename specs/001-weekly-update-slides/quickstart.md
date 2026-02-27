# Quickstart: Weekly Update Slides

**Branch**: `001-weekly-update-slides` | **Date**: 2026-02-26

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A static file server for local development (e.g., `npx serve`, `python3 -m http.server`, or VS Code Live Server extension)
- A text editor for authoring HTML

## Project Structure

```
/
├── index.html                          # Redirects to /latest/
├── latest/
│   └── index.html                      # Fetches entries.json, redirects to newest
├── archive/
│   └── index.html                      # Fetches entries.json, renders listing
├── {yyyymmdd-yyyymmdd}/
│   └── index.html                      # Self-contained slide deck
├── entries.json                        # Manifest of all entries (newest-first)
├── shared/
│   ├── styles.css                      # Design system styles
│   ├── slides.js                       # Slide navigation logic
│   └── archive.js                      # Archive listing logic
├── docs/
│   └── design-guide.md                 # Design specification reference
└── package.json
```

## Local Development

Start a local static server from the project root:

```bash
# Option 1: npx (Node.js)
npx serve .

# Option 2: Python
python3 -m http.server 8080

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open `http://localhost:3000` (or the port shown) in your browser.

## Adding a New Weekly Update

1. **Create the folder and file**:
   ```bash
   mkdir 20260220-20260226
   ```
   Copy the deck template into `20260220-20260226/index.html` and add your slide content.

2. **Update the manifest**:
   Open `entries.json` and add the new entry at the **top** of the `entries` array:
   ```json
   {
     "entries": [
       {
         "slug": "20260220-20260226",
         "title": "Week of Feb 20–26, 2026",
         "start": "20260220",
         "end": "20260226"
       }
     ]
   }
   ```

3. **Verify**: Open `http://localhost:3000/latest/` — it should redirect to your new entry.

## Slide Authoring

Each slide is a `<section>` element with a layout class. Available layouts:

| Layout Class            | Use For                              |
|-------------------------|--------------------------------------|
| `slide--title`          | Opening slide (headline only)        |
| `slide--content-photo`  | Text + image side by side            |
| `slide--full-headline`  | Big headline + columns below         |
| `slide--photo-headline` | Photo beside headline + body below   |
| `slide--profile`        | Name + portrait + bio                |
| `slide--closing`        | Full-screen closing statement        |

## Deployment

Push to a GitHub repository with GitHub Pages enabled (serve from root or `main` branch). No build step required — the site is served as-is.

## Design Reference

All visual specifications (colors, typography, spacing, slide layouts, interactive elements) are documented in [docs/design-guide.md](../../../docs/design-guide.md).

| Token             | Value     |
|-------------------|-----------|
| Background        | `#F0EDEB` |
| Primary text      | `#000000` |
| Secondary text    | `#4A4A4A` |
| Headline font     | Oswald, weight 900, ALL CAPS |
| Body font         | Inter, weight 400 |
| Slide dimensions  | 1920 x 1080 px (16:9) |
| Corner radius     | ~40 px    |
| Margins           | 80 px     |
