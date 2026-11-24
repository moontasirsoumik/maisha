# Plan

A portfolio for Maisha Mahpara, deployed on Cloudflare Pages free tier. The drawings lead. The page must open quickly on a phone and a laptop. Scroll stays native.

## Deploy budget

Cloudflare Pages free, checked 20 November 2026 against [Pages limits](https://developers.cloudflare.com/pages/platform/limits/):

- 25 MiB maximum for any one file. A larger file fails the deploy.
- 20,000 files per site.
- 500 builds a month, one at a time, 20 minutes each.
- Static requests are unlimited and unmetered.

R2 free includes 10 GB-month storage, 1 million writes, 10 million reads, and free egress ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)). R2 is the fallback only if a file cannot stay under 25 MiB without looking bad. A phone still has to download that file, so R2 does not excuse a large asset.

Current web masters, after conversion:

| Set | Count | Size | Largest |
|---|---|---|---|
| Display plates | 52 | 10.1 MB | 444 KB |
| Lightbox plates | 52 | 22.3 MB | 1.1 MB |
| Rajshahi film | 1 | 20.2 MB | 854×480, under the 25 MiB cap |
| Whole `public/work` | 108 | about 53 MB | film is the only large file |

A visitor does not download the whole set. The cover loads one plate. A case study loads its own plates. The sharp copy loads only when a plate is opened. The film loads only when play is pressed.

## What ships

- Cover, about, contact, and eight case studies.
- Limewash paper, umber ink, one slate signal. Sentient over Hanken Grotesk. See `DESIGN.md`.
- Native scroll with GSAP ScrollTrigger. No smooth-scroll library. One hero pin on desktop. Reduced motion removes movement.
- `npm run crops` style step: `node scripts/make-crops.mjs` rebuilds the hero and index crops after a `convert`.
- `node scripts/make-layers.mjs` rebuilds the ink drawings, the keyed horizon and the section strip from the `-full` masters. If a crop box changes, update the sizes in `inks` in `src/content/projects.ts`.
- `node scripts/make-cutouts.mjs` rebuilds the tower, plaza and hut cut-outs. It prints the hut layer positions, which go into `hut` in `src/content/projects.ts`.
- `Projects/` stays on disk and is gitignored. `npm run convert` rebuilds `public/work/`.

## File rules

- No file in `public/` or `dist/` may reach 25 MiB.
- Display images stay under 500 KB. Lightbox images stay under 1.5 MB. If a drawing looks soft, raise that file’s quality before raising its pixel size.
- The film is 854×480, H.264, CRF 32, AAC 64k, `+faststart`. Current file is 20.2 MB. It starts paused and muted. `preload="none"`.
- Do not put the 789 MB source, the TIFFs, or the PDFs in Git or on Pages.
- R2 only if a future film cannot be both sharp and under 25 MiB. Even then, keep it under about 30 MB so a phone can play it.

## Still open

- Production build, then a Pages deploy. Not done. No commit or push until asked.
- Watch the recompressed film on a phone before calling the quality final.
- A resume PDF, if she wants one, must also stay under 25 MiB. The current nostalgia PDF is 78 MB and stays in `Projects/`.
