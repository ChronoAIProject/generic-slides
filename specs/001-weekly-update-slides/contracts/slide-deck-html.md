# Contract: Slide Deck HTML Structure

**Location**: `/{yyyymmdd-yyyymmdd}/index.html`
**Purpose**: Defines the expected HTML structure for each weekly update slide deck page

## Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | Weekly Decks</title>
  <link rel="stylesheet" href="/shared/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <div class="deck" data-slug="{yyyymmdd-yyyymmdd}" data-total="{slideCount}">

    <!-- Slide 1: layout type specified via class -->
    <section class="slide slide--{layout}" data-index="0">
      <header class="slide__header">
        <span class="slide__label">{label text}</span>
        <span class="slide__date">{formatted date}</span>
      </header>
      <div class="slide__content">
        <!-- Layout-specific content here -->
      </div>
      <footer class="slide__footer">
        <!-- Footer info columns (optional per layout) -->
      </footer>
    </section>

    <!-- Additional slides... -->

    <!-- Controls bar (outside slides, fixed at bottom) -->
    <nav class="controls" aria-label="Slide navigation">
      <div class="controls__left">
        <button class="controls__restart" aria-label="Go to first slide">
          <!-- restart icon -->
        </button>
        <button class="controls__end" aria-label="Go to last slide">
          <!-- skip-to-end icon -->
        </button>
      </div>
      <div class="controls__center">
        <div class="controls__progress" role="progressbar"
             aria-valuenow="1" aria-valuemin="1" aria-valuemax="{slideCount}">
          <div class="controls__progress-fill"></div>
        </div>
      </div>
      <div class="controls__right">
        <button class="controls__prev" aria-label="Previous slide">
          <!-- left arrow icon -->
        </button>
        <button class="controls__next" aria-label="Next slide">
          <!-- right arrow icon -->
        </button>
      </div>
    </nav>

    <!-- Week navigation (prev/next week) -->
    <nav class="week-nav" aria-label="Week navigation">
      <a class="week-nav__prev" href="/{prev-slug}/" aria-label="Previous week">
        <!-- populated by JS from entries.json -->
      </a>
      <a class="week-nav__next" href="/{next-slug}/" aria-label="Next week">
        <!-- populated by JS from entries.json -->
      </a>
    </nav>
  </div>

  <script src="/shared/slides.js"></script>
</body>
</html>
```

## Slide Layout Classes

| Class                    | Layout Type       | Required Content                        |
|--------------------------|-------------------|-----------------------------------------|
| `slide--title`           | Title Slide       | Headline only, no image                 |
| `slide--content-photo`   | Content + Photo   | Headline, body, image (side by side)    |
| `slide--full-headline`   | Full-Width + Sub  | Headline, optional columns below        |
| `slide--photo-headline`  | Photo + Headline  | Headline, image, optional body columns  |
| `slide--profile`         | Profile / About   | Name headline, portrait, bio text       |
| `slide--closing`         | Closing / CTA     | Large headline, optional omit header/footer |

## CSS Class Naming Convention

Uses BEM (Block Element Modifier):
- Block: `slide`, `controls`, `week-nav`, `deck`
- Element: `slide__header`, `slide__content`, `controls__prev`
- Modifier: `slide--title`, `slide--active`, `controls__prev--disabled`

## Data Attributes

| Attribute               | Element         | Purpose                                    |
|-------------------------|-----------------|--------------------------------------------|
| `data-slug`             | `.deck`         | Current entry's slug for manifest lookup   |
| `data-total`            | `.deck`         | Total number of slides (for progress calc) |
| `data-index`            | `.slide`        | Zero-based slide index                     |

## Accessibility Requirements

- All interactive buttons must have `aria-label`
- Progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Slides should be navigable via keyboard (left/right arrow keys)
- Disabled navigation buttons use `aria-disabled="true"`
