# Implementation Progress

This checklist tracks `plan.md` against the current worktree. A checked item has source or runtime evidence recorded beside it.

## Foundation and context

- [x] Supplied PDF remains available as the content source: `Maisha Mahpara_PORTFOLIO.pdf`.
- [x] Product context exists in [`PRODUCT.md`](PRODUCT.md) for the recruiter-facing architecture portfolio.
- [x] Design context exists in [`DESIGN.md`](DESIGN.md) for the paper, ink, brick, typography, grid, and motion direction.
- [x] The plan is recorded in [`plan.md`](plan.md).
- [x] Refinement decisions from the visual review are recorded: first-person voice, restrained annotations, one paper base, clearer case-study topbar, slower hover motion, and cinematic motion variety.

## Technical foundation

- [x] React 19, TypeScript, and Vite are configured in `package.json`, `tsconfig*.json`, and `vite.config.ts`.
- [x] Astryx core, neutral theme, StyleX, and project-local CLI are installed with aligned versions: core/theme/CLI `0.7.7`, StyleX `0.19.1`.
- [x] Astryx reset and base CSS are imported in `src/main.tsx`.
- [x] CLI-generated `src/astryx-themes.ts` registers the neutral theme and its production stylesheet.
- [x] `Theme` wraps the app using the generated Astryx theme registry in `src/main.tsx`.
- [x] Real Astryx primitives are used in `src/App.tsx`: `Button`, `Heading`, `Text`, `Stack`, and `Link`.
- [x] Warm portfolio tokens override Astryx semantic color and font variables in `src/styles.css`.
- [x] `npm run astryx -- --help` runs successfully from the project-local script.

## Routing and typed content

- [x] Hash routing supports home plus all five required project slugs in `src/App.tsx`.
- [x] Content is typed with `Project`, `ProjectSection`, `ProjectImage`, and `ContactInfo` in `src/content/projects.ts`.
- [x] All five PDF categories and project names are represented in the content model.
- [x] Project sections include premise, research/process, plans, sections, diagrams, details, and visualizations where available in the PDF.
- [x] Case-study navigation provides back-to-portfolio plus previous and next project links with wraparound.

## Assets and content quality

- [x] Selected PDF imagery is curated into `public/assets/portfolio/` as WebP files rather than shipping all embedded PDF images.
- [x] Content audit extracted and compared the 25-page PDF text against the site content.
- [x] Profile and contact copy now follows the PDF's first-person voice and stated experience, tools, and contact details.
- [x] Project narratives were tightened to the PDF's actual vocabulary: ethnographic research, masterplan, settlement analysis, learn/foster/exhibit, live music events, climate/pollution/wind, diagrid/mega columns, workshops, labs, and accommodation.
- [x] Unsupported or overly interpretive additions were removed, including the unsourced Interior location and Highrise claims about air purification, green systems, and energy-conscious organization.
- [x] Generic phrase sweep across rendered routes found no remaining flagged filler phrases, and every project route rendered with no console errors.
- [x] About section was revised after visual review: the lead now explains Maisha's method, examples come before the RUET credential, and the headline no longer presents an unexplained question.
- [x] Hero, profile, plans, sections, process, detail, structure, drawing, and visualization assets are referenced by the typed content model.
- [x] `ImageFrame` supplies meaningful alt text and optional captions for content images.
- [x] Decorative project-row previews use empty alt text and `aria-hidden` because the project link title is the accessible meaning.
- [x] Images use eager loading only for above-the-fold hero imagery and lazy loading elsewhere.

## Homepage and case-study experience

- [x] Homepage contains animated name/architecture hero.
- [x] Homepage contains profile and contact sections.
- [x] Homepage contains project index and selected-work transitions.
- [x] Homepage contains skills/software list.
- [x] Homepage contains contact close and footer.
- [x] Case studies use a shared template for metadata, premise, process narrative, media, sticky chapters, progress rail, and project navigation.
- [x] Previous/next navigation is available on every project route.

## Visual and motion system

- [x] Warm paper, charcoal, brick, lichen, rule, display, body, and Astryx semantic tokens are defined in `src/styles.css`.
- [x] Bricolage Grotesque and Source Sans 3 are loaded locally through Fontsource and applied to the portfolio.
- [x] Editorial rules, captions, and asymmetric compositions are implemented without free-floating decorative marks.
- [x] Hero typography and image crop reveal use Intersection Observer and CSS transitions.
- [x] Case-study image masks use clip-path reveal transitions.
- [x] Project index rows use staggered, pointer-safe transform/opacity reveals and focus-visible previews.
- [x] Case-study section headings are sticky on larger screens and static on mobile.
- [x] Image captions reveal after entering the viewport.
- [x] Hero and case-study images use bounded scroll parallax with transform-only updates.
- [x] Reading progress rail updates with scroll position.
- [x] Reduced motion removes parallax, spatial transforms, clip-path movement, and decorative motion.
- [x] Removed the circular logo glyph, hero SVG fragments, image corner brackets, grid-number rail, contact ornament, and grain overlay; retained only the progress rail and content captions because they communicate state or context.

## Responsive and accessibility requirements

- [x] Skip link targets `#main-content` from `index.html`.
- [x] Main content, navigation, sections, figures, captions, headings, and footer use semantic HTML.
- [x] Visible `:focus-visible` styles are defined for links and buttons.
- [x] Mobile layout stacks case-study sections and hides decorative hover-preview imagery.
- [x] Header, navigation, back, contact, and button interactions use at least 44px vertical targets; project rows are larger.
- [x] No essential interaction depends on hover; project row previews also respond to keyboard focus.
- [x] Responsive checks cover approximately 390px, 768px, and 1440px widths.

## Verification evidence

- [x] `npm run typecheck` passes after the final implementation changes.
- [x] `npm run build` passes after the final implementation changes.
- [x] Astryx doctor reports no failures; the remaining warnings are the bundled external Figtree font proof and unrelated global CLI path detection.
- [x] Browser smoke test confirms `data-astryx-theme="neutral"`, Astryx-rendered nodes, zero horizontal overflow, a project route title, and no console errors.
- [x] Browser smoke test confirms home navigation to `#work` and a project route loads.
- [x] Project-row click regression check opens `#/projects/thesis` and renders `Rejuvenating Cultural Roots`; the reveal no longer uses a hit-area-blocking clip path.
- [x] Final route sweep confirms all five titles load: Thesis, Cultural Hub, Interior, Highrise, and Youth Center; each route renders two project-navigation links.
- [x] Final route sweep checks lazy images after incremental scrolling with zero broken paths on all five routes.
- [x] Reduced-motion behavior reports button transform `none`; final CSS explicitly disables parallax, clip paths, decorative motion, and caption transforms.
- [x] Browser history behavior was verified for hash routes in the browser smoke checks; the final navigation code still uses the same hashchange listener and browser-native anchors.
- [x] Lazy-image layout stability check reports `layout_shift_max=0.0` after scrolling through the cultural-hub case study.
- [x] Browser-based equivalent checks were used in place of Lighthouse because no deployment URL is available.

## Final verification record

- Date: 2026-11-04.
- Build result: passing.
- Typecheck result: passing.
- Runtime result: passing. Home, all five case-study routes, hash navigation, mobile checks, reduced motion, contact contrast, parallax, and layout stability were verified.
