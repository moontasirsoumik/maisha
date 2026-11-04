# Maisha Mahpara Architecture Portfolio

## Objective

Build a recruiter-facing architecture portfolio website from `Maisha Mahpara_PORTFOLIO.pdf`. The site should make Maisha's range, authorship, process, and contact details easy to understand on desktop and mobile without copying the PDF layout literally.

The visual direction is a cinematic architectural folio: warm paper, charcoal ink, brick-red annotation, rich typography, editorial rules, and considered scroll motion. Astryx supplies the component, theme, and token foundation, while the portfolio keeps its authored editorial composition.

## Product and content boundaries

- Audience: architecture studios, recruiters, and collaborators.
- Success: a visitor can scan the work, open a case study, understand its premise and process, and contact Maisha without friction.
- Source of truth: the supplied portfolio PDF and its extracted, curated assets.
- Use only facts, contact details, and imagery present in the PDF. Do not invent dates, outcomes, or project claims.
- Portfolio voice: use first person for Maisha's profile, practice, contact, and project narratives; keep project titles and factual metadata unchanged.
- No CMS, database, authentication, backend, or admin editor is needed for v1.
- Original high-resolution renders can replace extracted assets later without changing the content model.

## Technical foundation

- React 19, TypeScript, and Vite static build.
- Astryx core, neutral theme, StyleX peer dependency, and project-local Astryx CLI, with core, theme, and CLI versions kept aligned.
- Astryx reset and base CSS, generated theme registry, `Theme` provider, semantic Astryx components, and CSS-variable overrides for the portfolio brand.
- Hash routing so the site works on static hosting without server rewrite rules:
  - `#/`
  - `#/projects/thesis`
  - `#/projects/cultural-hub`
  - `#/projects/interior`
  - `#/projects/highrise`
  - `#/projects/youth-center`
- Keep the content separate from page markup with typed models:
  - `Project`
  - `ProjectSection`
  - `ProjectImage`
  - `ContactInfo`

## Content set

Include these five PDF categories and project views:

1. Thesis: `Rejuvenating Cultural Roots`, Ethnic Cultural Institute, Rangamati.
2. Cultural Hub: `Medley`, A Multi-Cultural Hub, Khulshi.
3. Interior: `Music Bistro`.
4. Highrise: `Design of a Living Skyscraper`, New Delhi, India.
5. Youth Center: `Empower`, a skill development center for the youth.

Curate selected PDF imagery into optimized WebP assets, with the content model ready for future AVIF or original-render replacements. Do not ship all embedded PDF images by default. Every displayed case-study image needs meaningful alt text; captions are added where they help explain the drawing or visualization. Decorative hover previews remain empty-alt and are hidden from assistive technology because the linked project title already provides the meaning.

## Information architecture

### Homepage

- Animated name and architecture hero with a selected-work image.
- Profile section with portrait, practice statement, and contact link.
- Project index with five projects and hover/focus image previews.
- Selected-work transitions and architectural image choreography.
- Practice section with research statement and software/tools.
- Contact close with email, phone details, and availability.
- Footer with identity and back-to-top control.

### Case-study template

Every project view uses the same data-driven structure:

- Project category, title, subtitle, location, and optional client metadata.
- Design premise and research/process narrative.
- Plans, sections, diagrams, details, and visualizations selected from the PDF.
- Sticky section/chapter heading on larger screens, stacked sections on mobile.
- Reading progress rail.
- Previous and next project navigation, including wraparound between the five projects.
- Back-to-portfolio and footer navigation.

## Visual language

- Warm ivory paper surface, tinted charcoal text, brick-red accent, and restrained lichen detail.
- Display type: Bricolage Grotesque variable.
- Body type: Source Sans 3 variable.
- OKLCH color tokens and Astryx semantic token overrides.
- 4pt spacing base, measured rules that define layout or content, asymmetric image compositions, and minimal borders.
- Avoid generic SaaS cards, purple gradients, decorative glass, excessive rounding, and motion that competes with the work.
- Keep the topbar legible: the homepage exposes Work, About, and Contact; case studies expose one clear Back to portfolio action and project status.
- Use one consistent warm-paper base across routes. Use the dark contact close as a purposeful section contrast, not as an arbitrary page theme.
- Do not add free-floating drawing marks or decorative symbols; every line must define a layout boundary or communicate project/content state.

## Motion system

Use CSS transforms, opacity, clip paths, and Intersection Observer. Do not hijack scrolling or introduce an unnecessary animation library.

- Hero typography reveal and selected-image crop reveal.
- Scroll-triggered image masks.
- Staggered project-index entrances.
- Sticky case-study chapters.
- Caption reveal after the associated image enters.
- Bounded image scale and scroll parallax on hero/case-study imagery.
- Reading progress rail showing the current reading position.
- Hover effects must have focus-visible equivalents where they communicate state.
- `prefers-reduced-motion: reduce` removes spatial movement, parallax, and clip-path movement while keeping content visible and allowing only short fades.

## Responsive and accessibility requirements

- Mobile uses stacked case-study sections, simplified transitions, and no hover-only functionality.
- Interactive targets are at least 44px high where practical, including header, navigation, contact, and back links.
- Include a skip link, semantic landmarks, logical heading order, meaningful image alt text, visible keyboard focus, readable contrast, and keyboard-accessible project links.
- Test approximately at 390px, 768px, and 1440px widths.
- Prevent horizontal overflow and avoid layout shifts from image containers.

## Verification plan

- `npm run typecheck`.
- `npm run build`.
- `npm run astryx -- doctor` and the project-local Astryx CLI.
- Browser smoke test for home, all five project slugs, browser back/forward, desktop/mobile overflow, console errors, image loading, and reduced motion.
- Check heading order, skip-link focus, visible focus states, link/button target sizing, alt text, captions, and no broken image paths.
- Use browser-based equivalent checks for performance, layout stability, and responsive behavior. Run Lighthouse later if a deployment URL is available.

## Handoff

Normal use requires only `npm install` and `npm run dev`. The project-local CLI is available through `npm run astryx -- <command>`; a global Astryx installation is optional and not required for building or deploying the site.
