# Progress

Updated 20 November 2026.

## Done

- Old site removed from the working tree. Git remote is still `https://github.com/moontasirsoumik/maisha.git`. Nothing committed or pushed.
- Portrait restored from the previous commit.
- Cloudflare Pages free limits checked: 25 MiB per file, 20,000 files, unlimited static requests. R2 is unused. Current files fit the cap.

### What ships

- Cover, about, contact, and eight case studies. Done. The built site shows "Maisha Mahpara" and `mailto:mahparamaisha0@gmail.com`. The phone number is not published. All eight routes load: cultural-roots, medley, rajshahi, urban-dwelling, nostalgia, music-bistro, living-skyscraper, empower. Zero page errors.
- Warm paper, ink, one brick rule, Fraunces, Bricolage Grotesque, Plus Jakarta Sans. Done. The built page requests Fraunces, Bricolage Grotesque, and Plus Jakarta Sans.
- Native scroll. No smooth-scroll library. One thesis pin on desktop. Reduced motion removes movement. Done. Document scroll is native, and no smooth-scroll library is in the app. On a 1440 px desktop viewport with reduced motion off, the one thesis pin creates one pin spacer and crossfades to the third line. With reduced motion on, movement is removed: the thesis lines stay at full opacity with no transform, and the pin spacer count is 0.
- `Projects/` stays on disk and is gitignored. `npm run convert` rebuilds `public/work/`. Done. `git check-ignore` matches `Projects/` and a sample TIFF. `scripts/convert-assets.mjs` is the rebuild path.

### File rules

- No file in `public/` or `dist/` may reach 25 MiB. Done. `npm run build` ran twice and each run reported `budget ok: 0 violations`. The checker fails a file at 25 MiB.
- Display images stay under 500 KB. Lightbox images stay under 1.5 MB. If a drawing looks soft, raise that file’s quality before raising its pixel size. Done. The same two builds reported zero display and lightbox violations. The checker fails a 501 KB display plate and a lightbox plate over 1.5 MB.
- The film is 854×480, H.264, CRF 32, AAC 64k, `+faststart`. Current file is 20.2 MB. It starts paused and muted. `preload="none"`. Done. The shipped file is 21,166,623 bytes (20.2 MB), H.264 854×480, AAC about 64k. On a 390 px viewport it was paused and muted with `preload="none"` before play, then reported 854×480 while playing.
- Do not put the 789 MB source, the TIFFs, or the PDFs in Git or on Pages. Done. Those files stay under `Projects/`, which is gitignored. `dist/` has no PDF and no TIFF.
- R2 only if a future film cannot be both sharp and under 25 MiB. Even then, keep it under about 30 MB so a phone can play it. Done. R2 is not used. The film fits the Pages file cap.

### Still open

- Production build, then a Pages deploy. Not done. No commit or push until asked. Closed here as: production build ready; remote deploy not performed. `npm run build` exited 0 twice. Nothing was committed, pushed, or sent to Cloudflare.
- Watch the recompressed film on a phone before calling the quality final. Closed on the available check: a 390 px headless viewport played the film from a paused state to 854×480. A physical phone viewing remains unverified.
- A resume PDF, if she wants one, must also stay under 25 MiB. The current nostalgia PDF is 78 MB and stays in `Projects/`. Closed as not requested. No resume PDF was made. The nostalgia PDF stays in `Projects/`, out of Git and out of `dist/`.

## In progress

- Nothing blocking.

## Not started

- Commit. Push. Only when asked.
- Live Cloudflare Pages deploy. Only when asked, and only with credentials.
- Optional R2. Not needed unless a future asset cannot fit the 25 MiB file cap and still look acceptable on a phone.

## Size log

| Date | Asset | Size | Note |
|---|---|---|---|
| 2026-11-20 | Source film | 789 MB | Stays in `Projects/`. Never deployed. |
| 2026-11-20 | First web film | 147 MB | Too large. |
| 2026-11-20 | Second web film | 33 MB | Still over the 25 MiB Pages cap. Replaced. |
| 2026-11-20 | Third web film | 20.2 MB | 854×480, CRF 32. Fits Pages. 390 px playback checked. Physical phone still unverified. |
| 2026-11-20 | Display WebP | 10.1 MB / 52 files | Under 500 KB each. |
| 2026-11-20 | Lightbox WebP | 22.3 MB / 52 files | Under 1.5 MB each. Loaded one at a time. |
