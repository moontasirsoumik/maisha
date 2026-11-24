# Design: Maisha Mahpara

North star: **The Gallery Hang.** Her renders and drawings hung on limewash paper in warm daylight, with wall labels in a quiet grotesque and headings in a light serif. The work is the colour; the page is the wall.

Theme: Hallmark Atelier. Tokens live in `src/tokens.css`; floor rules in `src/base.css`; the page in `src/styles.css`.

## Colour

| Token | Role |
|---|---|
| `--color-paper` | The wall. Every page ground. |
| `--color-paper-2` | The close band and empty picture frames. |
| `--color-ink` | Headings, names, links. |
| `--color-ink-2` | Body copy. |
| `--color-muted` | Wall labels, dates, captions. |
| `--color-rule` | Hairlines between rows. |
| `--color-accent` | Slate. Link underlines and focus only, under 4% of any screen. |
| `--color-card` | The mat behind drawings on white sheets. |

No second accent. No colour-filled buttons.

## Type

- Display: Sentient 300 for `h1`, `h2`, the statement, the email close. Sentient 400 for `h3` and the wordmark.
- Text: Hanken Grotesk 400, 16px or more, line-height 1.6.
- Labels are sentence case, untracked, a step smaller. No eyebrows, no tracked capitals.

## Pictures

- Renders sit edge to edge in their frame and drift slightly against the scroll.
- Sheets (boards on white) sit on a card mat with the Atelier shadow and are never zoomed, so their labels are never cropped.
- Index pictures drawn on white (Rajshahi, the skyscraper) print onto the paper with `mix-blend-mode: multiply`.
- Crops that remove baked-in titles come from `scripts/make-crops.mjs`. Never show a plate with a slide title baked in as an index picture.
- Layers come from `scripts/make-layers.mjs`. Every project has an `ink.webp`: line-work cut from its plan or section, keyed to umber ink on transparency, with no text labels. Its uses:
  - A ghost behind the hero name (the thesis masterplan) and behind each case header, at 10–12% opacity with a feathered radial mask.
  - The index lens: on hover with a fine pointer, a feathered circle follows the cursor and shows the drawing under the render.
- Cut-outs come from `scripts/make-cutouts.mjs`, which lifts objects off their white sheets. Their uses:
  - The skyscraper tower rises out of a paper tile, on the index and in its case header.
  - The Nostalgia plaza floats on the index with a soft ground shadow.
  - The thesis hut's structure is split into three layers (roof, truss on deck, frame) beside the home statement. The layers part as you scroll.
- `horizon.webp` is the thesis terraces with the sky keyed out. It rises out of the paper at the top of every page's close band. `section-ink.webp` is the thesis hill section and sits as a ground line on About.

## Layout

12 columns, 1440px container, 64px gutter (24px and 16px on smaller screens). An ink rule opens every section; hairlines separate rows. The home index is an asymmetric hang: each project has its own column span, set in `.entry-1` to `.entry-8`.

## Motion

GSAP ScrollTrigger on native scroll, all of it inside `prefers-reduced-motion: no-preference`.

- The signature: on desktop, the hero print opens from its column to the full viewport under a 1.3-viewport pin.
- `[data-picture]` frames wipe open from below once. `[data-drift]` images move ±3.5% against the scroll. `[data-rise]` blocks lift once.
- The home statement fills word by word under the scroll.
- `[data-float]` cut-outs rise against their tile. The hut's `[data-lift]` layers move apart by their lift as the statement passes.
- `[data-ghost]` drawings travel slower than the page. `[data-emerge]` (the horizon) lifts and settles as the close band arrives. `[data-slide]` (the About section strip) drifts sideways.
- Transitions use `transform`, `opacity`, `clip-path` only.

## Do

- Let the drawing lead every section it is in.
- Keep the one action, writing to her, on every page as the display-scale address.
- Keep chapter text sticky beside its plates on desktop.

## Don't

- Don't bring back title blocks, plotter-roll chrome, playheads, section counters, or near-black film.
- Don't add a second accent, gradient text, glows, or rounded cards.
- Don't animate width, height, top, or left. Don't use `transition: all`.
- Don't invent numbers, clients, or quotes.
