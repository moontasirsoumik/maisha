/**
 * Cuts clean display crops from the lightbox masters: the home hero and the
 * index thumbnails whose source plates carry baked-in titles or labels.
 *
 *   node scripts/make-crops.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.join(root, 'public', 'work');

const crops = [
  { from: 'cultural-roots/09-full.webp', to: 'cultural-roots/thumb.webp', left: 0, top: 534, width: 2400, height: 1032, resize: 1920, quality: 70 },
  { from: 'cultural-roots/10-full.webp', to: 'cultural-roots/hero.webp', left: 75, top: 300, width: 2250, height: 1275, resize: 1800 },
  { from: 'rajshahi/cover-full.webp', to: 'rajshahi/thumb.webp', left: 720, top: 255, width: 1170, height: 585 },
  { from: 'urban-dwelling/cover-full.webp', to: 'urban-dwelling/thumb.webp', left: 1080, top: 0, width: 840, height: 1080 },
  { from: 'urban-dwelling/cover-full.webp', to: 'urban-dwelling/banner.webp', left: 0, top: 0, width: 1920, height: 700 },
];

for (const crop of crops) {
  let image = sharp(path.join(work, crop.from)).extract({
    left: crop.left,
    top: crop.top,
    width: crop.width,
    height: crop.height,
  });
  if (crop.resize) image = image.resize({ width: crop.resize });
  const info = await image.webp({ quality: crop.quality ?? 78, effort: 5 }).toFile(path.join(work, crop.to));
  console.log(`${crop.to} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
