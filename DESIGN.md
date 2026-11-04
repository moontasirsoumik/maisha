# Design

## Direction

Warm paper, charcoal ink, brick-red annotation, and restrained lichen accents. The physical scene is a recruiter reviewing a tactile architecture folio at a bright studio desk.

## Typography

- Display: Bricolage Grotesque variable, expressive and structural.
- Body: Source Sans 3 variable, readable and neutral.
- Use fluid display scale, balanced headings, 65ch maximum body measure, and short tracked labels only for metadata.

## Color tokens

- Paper: `oklch(96% 0.018 82)`
- Paper deep: `oklch(91% 0.024 78)`
- Ink: `oklch(24% 0.018 50)`
- Ink soft: `oklch(42% 0.018 55)`
- Brick: `oklch(52% 0.135 38)`
- Brick pale: `oklch(76% 0.075 52)`
- Lichen: `oklch(57% 0.055 112)`
- Rule: `oklch(24% 0.018 50 / 0.18)`

## Layout and motion

Use a 4pt spacing base, visible grids, varied vertical rhythm, and asymmetric image compositions. Animate transforms, opacity, clip paths, and bounded filters with exponential ease-out curves. Use Intersection Observer for reveal states and respect `prefers-reduced-motion`.
