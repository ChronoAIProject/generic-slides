# Data Model: Weekly Update Slides

**Branch**: `001-weekly-update-slides` | **Date**: 2026-02-26

## Entities

### Entry (Weekly Update)

Represents a single week's slide deck. Each entry is a self-contained HTML page in its own folder.

| Attribute     | Type            | Required | Description                                           |
|---------------|-----------------|----------|-------------------------------------------------------|
| slug          | string          | Yes      | Date range identifier in `yyyymmdd-yyyymmdd` format   |
| title         | string          | Yes      | Human-readable title (e.g., "Week of Feb 20–26, 2026") |
| start         | string (date)   | Yes      | Start date of the week in `yyyymmdd` format           |
| end           | string (date)   | Yes      | End date of the week in `yyyymmdd` format             |
| slides        | Slide[]         | Yes      | Ordered collection of slides within the deck          |

**Identity**: Uniquely identified by `slug`. The slug is also the folder name and URL path segment.

**Ordering**: Entries are ordered newest-first in `entries.json`. The `start` date determines chronological ordering.

**Filesystem representation**:
```
/{slug}/index.html    →  e.g., /20260220-20260226/index.html
```

### Slide

An individual screen within a weekly update deck. Defined as HTML sections within the entry's `index.html`.

| Attribute     | Type            | Required | Description                                           |
|---------------|-----------------|----------|-------------------------------------------------------|
| layout        | enum            | Yes      | One of: title, content-photo, full-headline, photo-headline, profile, closing |
| headline      | string          | Yes      | Main headline text (rendered ALL CAPS per design guide) |
| body          | string          | No       | Body text content (one or more paragraphs)            |
| image         | string (path)   | No       | Path to image file (relative or absolute)             |
| columns       | string[]        | No       | Column content for multi-column layouts               |

**Layout types** (from design guide):

| Layout          | Headline | Body | Image | Columns | Header/Footer |
|-----------------|----------|------|-------|---------|---------------|
| title           | Yes      | No   | No    | No      | Yes           |
| content-photo   | Yes      | Yes  | Yes   | No      | Yes           |
| full-headline   | Yes      | No   | No    | Yes     | Yes           |
| photo-headline  | Yes      | Yes  | Yes   | Yes     | Yes           |
| profile         | Yes      | Yes  | Yes   | No      | Yes           |
| closing         | Yes      | No   | No    | No      | Optional      |

### Manifest (entries.json)

The global registry of all weekly updates. Lives at the project root.

| Attribute     | Type            | Required | Description                                     |
|---------------|-----------------|----------|-------------------------------------------------|
| entries       | Entry[]         | Yes      | Array of entry metadata, ordered newest-first   |

Each entry object in the manifest contains:

| Attribute     | Type            | Required | Description                                     |
|---------------|-----------------|----------|-------------------------------------------------|
| slug          | string          | Yes      | Date range identifier matching the folder name  |
| title         | string          | Yes      | Display title for archive listing               |
| start         | string          | Yes      | Start date in `yyyymmdd` format                 |
| end           | string          | Yes      | End date in `yyyymmdd` format                   |

## Relationships

```
Manifest (entries.json)
  └── 1:N → Entry (one manifest contains many entries)
                └── 1:N → Slide (one entry contains many slides)
```

## Validation Rules

- **Slug format**: Must match regex `^\d{8}-\d{8}$` (e.g., `20260220-20260226`)
- **Date validity**: `start` must be a valid date; `end` must be a valid date; `end >= start`
- **Uniqueness**: No two entries may share the same slug
- **Ordering**: Entries in manifest must be sorted by `start` descending (newest first)
- **Slide minimum**: Each entry must contain at least one slide
- **Layout constraints**: Title slide must have no image; Closing slide header/footer are optional

## State Transitions

Entries have no lifecycle states — they are static files that either exist or don't. The only "transition" is:

```
[Does not exist] → Author creates folder + updates manifest → [Published]
```

There is no draft, archived, or deleted state. Removal means deleting the folder and removing the entry from `entries.json`.
