# Contract: entries.json Manifest

**Location**: `/entries.json` (project root)
**Consumers**: `/latest/index.html`, `/archive/index.html`, every deck page (for prev/next week navigation)

## Schema

```json
{
  "entries": [
    {
      "slug": "20260227-20260305",
      "title": "Week of Feb 27 – Mar 5, 2026",
      "start": "20260227",
      "end": "20260305"
    },
    {
      "slug": "20260220-20260226",
      "title": "Week of Feb 20–26, 2026",
      "start": "20260220",
      "end": "20260226"
    }
  ]
}
```

## Field Definitions

| Field             | Type     | Required | Constraints                                  |
|-------------------|----------|----------|----------------------------------------------|
| `entries`         | array    | Yes      | Must contain at least one entry              |
| `entries[].slug`  | string   | Yes      | Format: `yyyymmdd-yyyymmdd`; matches folder name |
| `entries[].title` | string   | Yes      | Human-readable; displayed in archive listing |
| `entries[].start` | string   | Yes      | Format: `yyyymmdd`; valid calendar date      |
| `entries[].end`   | string   | Yes      | Format: `yyyymmdd`; valid calendar date; `>= start` |

## Invariants

1. **Ordering**: Entries MUST be sorted by `start` descending (newest first). `entries[0]` is always the latest.
2. **Uniqueness**: No duplicate `slug` values.
3. **Folder correspondence**: Every `slug` must have a corresponding `/{slug}/index.html` file.
4. **No orphans**: Every `/{yyyymmdd-yyyymmdd}/` folder should have a corresponding entry in the manifest.

## Consumer Behavior

| Consumer               | Reads                     | Purpose                                    |
|------------------------|---------------------------|--------------------------------------------|
| `/latest/index.html`  | `entries[0].slug`         | Redirect to the newest entry               |
| `/archive/index.html` | All entries               | Render full listing with titles and links   |
| `/{slug}/index.html`  | Adjacent entries by index | Build prev/next week navigation links      |

## Prev/Next Week Logic

Given the current entry at index `i` in the `entries` array:
- **Next (newer) week**: `entries[i - 1]` (lower index = newer). If `i === 0`, no next week exists.
- **Previous (older) week**: `entries[i + 1]` (higher index = older). If `i === entries.length - 1`, no previous week exists.
