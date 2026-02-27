# Design Specification: Black & White Minimalist Presentation

Reference: "Black and White Minimalist Digital Marketing Portfolio Presentation" by Dstudio

---

## Canvas

| Property       | Value           |
|----------------|-----------------|
| Dimensions     | 1920 x 1080 px  |
| Aspect ratio   | 16:9            |
| Corner radius  | ~40 px (rounded rect per slide) |

---

## Color Palette

| Role           | Hex       | Usage                                      |
|----------------|-----------|---------------------------------------------|
| Background     | `#F0EDEB` | Slide background (warm off-white / light gray) |
| Primary text   | `#000000` | Headlines, body copy, labels                |
| Secondary text | `#4A4A4A` | Sub-labels, meta text (dates, footers)      |
| Accent surface | `#FFFFFF` | Card overlays, if any                       |
| Dark variant   | `#1A1A1A` | Alternate dark slides (if used)             |

> The palette is strictly monochromatic. No brand color accents. Contrast comes from scale and weight, not hue.

---

## Typography

### Display / Headlines

| Property        | Value                                              |
|-----------------|----------------------------------------------------|
| Typeface        | **Condensed grotesque sans-serif** (e.g., *Oswald*, *Bebas Neue*, *Anton*, or *Dharma Gothic*) |
| Weight          | **Black / 900**                                    |
| Case            | **ALL CAPS**                                       |
| Tracking        | **Tight** (-0.02 em to -0.04 em)                  |
| Leading         | **0.85 - 0.95** (tighter than default)             |
| Size range      | 120 - 300 px (scales to fill the compositional area) |
| Color           | `#000000`                                          |

Headlines are the primary visual device. They fill large portions of the slide, often spanning 50-80% of the vertical space.

### Section / Slide Labels

| Property        | Value                                  |
|-----------------|----------------------------------------|
| Typeface        | Same family or a clean geometric sans (e.g., *Inter*, *DM Sans*, *Poppins*) |
| Weight          | Regular 400 - Medium 500               |
| Case            | Sentence case or Title Case            |
| Size            | 16 - 20 px                             |
| Color           | `#000000` or `#4A4A4A`                 |

Used for: "Personal Presentation", date stamps, footer labels.

### Body Copy

| Property        | Value                                  |
|-----------------|----------------------------------------|
| Typeface        | Clean geometric sans-serif (e.g., *Inter*, *DM Sans*, *Poppins*) |
| Weight          | Regular 400                            |
| Size            | 14 - 18 px                             |
| Line height     | 1.5 - 1.6                              |
| Color           | `#000000` or `#4A4A4A`                 |
| Max width       | ~550 px per column                     |

---

## Layout System

### Grid

- **Margins**: ~80 px on all sides
- **Columns**: Flexible 1-column or 2-column layouts
- **Gutter**: ~40 px between columns

### Header Bar (persistent across slides)

```
|  "Personal Presentation"                        "09 May, 2026"  |
```

| Property   | Value                          |
|------------|--------------------------------|
| Position   | Top of slide, full width       |
| Padding    | 40 px top, 80 px left/right    |
| Font       | Section label style (16-18 px) |
| Alignment  | Left label, right-aligned date |

### Footer Bar (persistent across slides)

```
|  Name of Project:             Presented By:          Presented To:      [->]  |
|  Digital Marketing Portfolio  Adeline Palmerston     Brigitte Schwartz        |
```

| Property      | Value                             |
|---------------|-----------------------------------|
| Position      | Bottom of slide, full width       |
| Padding       | 40 px bottom, 80 px left/right   |
| Layout        | 3 info columns + arrow icon right |
| Label font    | 12-14 px, `#4A4A4A`, uppercase   |
| Value font    | 14-16 px, `#000000`              |
| Arrow icon    | Right-pointing arrow `->` in a circle or minimal glyph, bottom-right corner |

### Navigation Arrow

| Property       | Value                         |
|----------------|-------------------------------|
| Shape          | Right-pointing arrow `>`      |
| Position       | Bottom-right corner           |
| Size           | ~24 px icon in ~48 px target  |
| Color          | `#000000`                     |

---

## Slide Layouts

### 1. Title Slide

```
+-------------------------------------------------+
|  Personal Presentation              09 May, 2026|
|                                                  |
|                                                  |
|         D I G I T A L                            |
|         M A R K E T I N G                        |
|                                                  |
|                                                  |
|  Project:       By:           To:           [->] |
+-------------------------------------------------+
```

- Headline fills ~60-70% of slide height
- Text is left-aligned, vertically centered
- No images on title slide
- Pure typographic impact

### 2. Content + Photo (Side by Side)

```
+-------------------------------------------------+
|  Header                               Date      |
|                                                  |
|  [PHOTO - 45%]    |   HEADLINE TEXT              |
|                    |   Body paragraph text        |
|                    |   here in the right column.  |
|                                                  |
|  Footer                                    [->] |
+-------------------------------------------------+
```

- Photo takes ~45% width, content takes ~50%
- Photo has **no border**, slight rounded corners (~12 px) or squared
- Photos are desaturated / natural tones (not heavily filtered)

### 3. Full-Width Headline + Subtext

```
+-------------------------------------------------+
|  Header                               Date      |
|                                                  |
|      MY                                          |
|      EXPERIENCE                                  |
|                                                  |
|  Col 1 text       Col 2 text       Col 3 text   |
|                                                  |
|  Footer                                    [->] |
+-------------------------------------------------+
```

- Headline spans full width, left-aligned
- Supporting content in 2-3 columns below
- Bullet points use minimal markers or none

### 4. Photo + Full-Width Headline

```
+-------------------------------------------------+
|  Header                               Date      |
|                                                  |
|  [PHOTO - 40%]     WHY DIGITAL                   |
|                     MARKETING?                    |
|                                                  |
|  Body text columns spanning below                |
|                                                  |
|  Footer                                    [->] |
+-------------------------------------------------+
```

- Photo floats left or right
- Headline wraps beside photo
- Body text flows below in multi-column

### 5. Profile / About Slide

```
+-------------------------------------------------+
|  Header                               Date      |
|                                                  |
|      ADELINE                                     |
|      PALMERSTON     [PORTRAIT PHOTO]             |
|                                                  |
|  Bio text / role description                     |
|                                                  |
|  Footer                                    [->] |
+-------------------------------------------------+
```

- Name as large display text
- Portrait photo (natural, not heavily styled)
- Minimal bio text

### 6. Closing / CTA Slide

```
+-------------------------------------------------+
|                                                  |
|                                                  |
|      LET'S WORK                                  |
|      TOGETHER!                                   |
|                                                  |
|                                                  |
|                                            [->] |
+-------------------------------------------------+
```

- Largest type size of any slide
- Text fills nearly the entire canvas
- No images, no footer detail - pure statement
- May omit header/footer for maximum visual impact

---

## Photography Style

| Property         | Value                                         |
|------------------|-----------------------------------------------|
| Tone             | Natural, warm, candid                         |
| Color treatment  | Desaturated / muted tones (not black & white) |
| Subject          | Professional setting, approachable poses      |
| Crop             | Tight to medium framing                       |
| Corners          | Slight rounding (~8-12 px) or square          |
| Shadow           | None                                          |
| Border           | None                                          |

---

## Spacing & Rhythm

| Element                     | Spacing         |
|-----------------------------|-----------------|
| Slide margin (all sides)    | 80 px           |
| Header to content           | 60 - 80 px      |
| Content to footer           | 40 - 60 px      |
| Between headline lines      | Tight (0.85-0.95 leading) |
| Between body paragraphs     | 24 px           |
| Column gutter               | 40 px           |
| Photo to adjacent text      | 40 px           |

---

## Elements Library

Reusable interactive and visual components that appear across slides.

### Navigation Button (Next / Previous)

```
  ┌───────┐
  │   →   │
  └───────┘
```

| Property         | Value                                    |
|------------------|------------------------------------------|
| Shape            | Circle or rounded square                 |
| Size             | 48 x 48 px hit area, 24 px icon          |
| Corner radius    | 50% (circle) or 12 px (rounded square)   |
| Background       | `transparent` (default), `#000000` (hover) |
| Icon color       | `#000000` (default), `#FFFFFF` (hover)   |
| Icon             | Right arrow `→` for next, Left arrow `←` for previous |
| Position         | Bottom-right corner of slide, within footer zone |
| Cursor           | `pointer`                                |
| Transition       | Background + icon color, 200ms ease      |

**States:**

| State    | Background  | Icon color | Border           |
|----------|-------------|------------|------------------|
| Default  | transparent | `#000000`  | 1px `#000000`    |
| Hover    | `#000000`   | `#FFFFFF`  | 1px `#000000`    |
| Active   | `#1A1A1A`   | `#FFFFFF`  | 1px `#1A1A1A`    |
| Disabled | transparent | `#C0C0C0`  | 1px `#C0C0C0`    |

### Progress Bar

```
  ┌──────────────────────────────────────────────────┐
  │████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
  └──────────────────────────────────────────────────┘
         ▲ filled                ▲ unfilled
       (current / total)
```

| Property            | Value                                      |
|---------------------|--------------------------------------------|
| Position            | Bottom edge of slide, full width            |
| Height              | 3 px (default), 5 px (hover)               |
| Track color         | `#D9D5D2` (light gray, blends with bg)     |
| Fill color          | `#000000`                                  |
| Corner radius       | 0 (flush to slide edges) or 1.5 px         |
| Fill width          | `(currentSlide / totalSlides) * 100%`      |
| Transition          | Width 300ms ease-out, height 150ms ease    |
| Z-index             | Above slide content, below nav controls    |

**Segmented variant** (optional — one segment per slide):

```
  ┌─── ─── ─── ─── ─── ─── ─── ─── ─── ───┐
  │ ██  ██  ██  ██  ░░  ░░  ░░  ░░  ░░  ░░ │
  └─── ─── ─── ─── ─── ─── ─── ─── ─── ───┘
```

| Property            | Value                                    |
|---------------------|------------------------------------------|
| Segment count       | Equal to total slide count               |
| Segment gap         | 2 - 4 px                                 |
| Active segment      | `#000000`                                |
| Inactive segment    | `#D9D5D2`                                |
| Segment height      | 3 px                                     |
| Corner radius       | 1.5 px per segment                       |

### Restart Button (Go to Start)

```
  ┌───────┐
  │  |◄◄  │
  └───────┘
```

| Property         | Value                                    |
|------------------|------------------------------------------|
| Shape            | Circle or rounded square (matches nav)   |
| Size             | 40 x 40 px hit area, 20 px icon          |
| Corner radius    | 50% (circle) or 10 px                    |
| Background       | `transparent`                            |
| Icon             | Skip-back `|◄◄` or double left arrow     |
| Icon color       | `#4A4A4A` (default), `#000000` (hover)   |
| Position         | Bottom-left corner, within footer zone   |
| Cursor           | `pointer`                                |
| Transition       | Color 200ms ease                         |
| Tooltip          | "Go to first slide"                      |

**States:**

| State    | Icon color | Background  |
|----------|------------|-------------|
| Default  | `#4A4A4A`  | transparent |
| Hover    | `#000000`  | `#E8E5E3`  |
| Active   | `#000000`  | `#D9D5D2`  |
| Disabled | `#C0C0C0`  | transparent |

### Go to End Button (Skip to Last)

```
  ┌───────┐
  │  ►►|  │
  └───────┘
```

| Property         | Value                                    |
|------------------|------------------------------------------|
| Shape            | Circle or rounded square (matches nav)   |
| Size             | 40 x 40 px hit area, 20 px icon          |
| Corner radius    | 50% (circle) or 10 px                    |
| Background       | `transparent`                            |
| Icon             | Skip-forward `►►|` or double right arrow |
| Icon color       | `#4A4A4A` (default), `#000000` (hover)   |
| Position         | Bottom-left, right of Restart button     |
| Cursor           | `pointer`                                |
| Transition       | Color 200ms ease                         |
| Tooltip          | "Go to last slide"                       |

**States:** Same as Restart button.

### Controls Layout (Bottom Bar)

How all interactive elements sit together:

```
+---------------------------------------------------------------------------+
|                                                                           |
|  [|◄◄] [►►|]          ████████░░░░░░░░░░░░░░░░░░░░        [←]    [→]    |
|  restart  end              progress bar                   prev   next    |
|                                                                           |
+---------------------------------------------------------------------------+
```

| Property            | Value                                    |
|---------------------|------------------------------------------|
| Bar height          | 64 px                                    |
| Background          | transparent (overlays slide)             |
| Padding             | 0 80 px (matches slide margins)          |
| Alignment           | Restart + End left, Progress center, Nav right |
| Gap (left group)    | 8 px between restart and end buttons     |
| Gap (right group)   | 12 px between prev and next buttons      |
| Vertical alignment  | All controls centered within bar         |

### Slide Counter (Optional)

```
  4 / 12
```

| Property         | Value                                    |
|------------------|------------------------------------------|
| Font             | Body copy style, 14 px                   |
| Color            | `#4A4A4A`                                |
| Format           | `{current} / {total}`                    |
| Position         | Centered above progress bar, or inline beside it |
| Visibility       | Visible on hover, or always visible      |

---

## Design Principles

1. **Typography IS the design** - Headlines do the visual heavy lifting. Scale, weight, and compression create hierarchy without decorative elements.
2. **Monochrome discipline** - Zero color. Contrast comes from size, weight, and whitespace.
3. **Generous whitespace** - Slides breathe. Content occupies 50-70% of the canvas, the rest is intentional negative space.
4. **Consistent chrome** - Header (label + date) and footer (project info + arrow) repeat on every slide to anchor the layout.
5. **Photos as texture, not focus** - Images complement the typography, never compete with it. They fill compositional gaps and add warmth.
6. **Tight leading on headlines** - Lines of display text nearly touch, creating a dense, poster-like block.
7. **Left-aligned everything** - No centered text. Consistent left alignment creates a strong vertical axis.
