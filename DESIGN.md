# Design

## Direction

Art-book catalogue: a recruiter or collaborator moves through Maisha's work as a quiet architecture portfolio on a bright studio desk. The interface takes its restraint from the PDF cover and its visual rhythm from the actual work: drawing sheets, plans, site analysis, material details, and renderings. The landing page behaves like a cover and archive; About / 01 is a separate identity sheet.

Avoid projection-room templates, giant name heroes, random symbols, decorative line fragments, grain, reading rails, ornamental circles, and any motion that does not explain a project transition.

## Typography

- Display: existing editorial serif stack for the cover, name, and major statements.
- Supporting display: Bricolage Grotesque variable for structural labels and project metadata.
- Body: Plus Jakarta Sans variable, clear and contemporary.
- Use fluid display scale, balanced headings, 65ch maximum body measure, and short tracked labels only for metadata.

## Color tokens

- Paper: `oklch(95% 0.022 88)`
- Paper deep: `oklch(89% 0.035 86)`
- Paper bright: `oklch(98% 0.012 90)`
- Ink: `oklch(25% 0.026 255)`
- Ink soft: `oklch(43% 0.03 255)`
- Brick: `oklch(55% 0.13 35)`
- Moss: `oklch(49% 0.055 116)`
- River: `oklch(57% 0.075 235)`
- Clay: `oklch(78% 0.08 67)`
- Rule: `oklch(25% 0.026 255 / 0.2)`

## Layout and motion

Use a 12-column editorial grid, varied vertical rhythm, serif-led display moments, full-bleed image plates, and project-specific compositions. The homepage is a short cover, archive mosaic, and contact close. About / 01 carries profile, practice, selected references, tools, and contact. Case studies use non-pinned folio chapters with inline chapter navigation.

GSAP ScrollTrigger is limited to scoped image-sheet reveals, bounded parallax, and slow crop transitions. Animate transforms, opacity, and clip paths only. Never hijack scroll or animate layout dimensions. All contexts are destroyed on route changes. Reduced motion removes spatial movement and preserves content visibility with short fades.
