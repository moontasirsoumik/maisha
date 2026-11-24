/**
 * Cuts design layers from the lightbox masters:
 *  ink plates  a plan or section as ink line-work on a transparent ground
 *  horizon     a render with its white sky flood-filled away, so the land rises out of the paper
 *
 * Crop boxes are fractions of the source, so they hold if a master is re-exported at another size.
 *
 *   node scripts/make-layers.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.join(root, 'public', 'work');
const INK = [31, 24, 18];

const inkPlates = [
  { from: 'cultural-roots/06-full.webp', to: 'cultural-roots/ink.webp', box: [0, 0, 0.84, 1], white: 196 },
  { from: 'cultural-roots/08-full.webp', to: 'cultural-roots/section-ink.webp', box: [0.03, 0.295, 0.475, 0.405], width: 2000, white: 205 },
  { from: 'medley/plan-full.webp', to: 'medley/ink.webp', box: [0.15, 0.15, 0.82, 0.74] },
  { from: 'rajshahi/board-04-full.webp', to: 'rajshahi/ink.webp', box: [0.31, 0.752, 0.725, 0.925] },
  { from: 'urban-dwelling/board-02-full.webp', to: 'urban-dwelling/ink.webp', box: [0.32, 0.12, 0.6, 0.66] },
  { from: 'nostalgia/axonometric-full.webp', to: 'nostalgia/ink.webp', box: [0, 0.36, 1, 0.76], white: 215 },
  { from: 'music-bistro/board-01-full.webp', to: 'music-bistro/ink.webp', box: [0.08, 0.455, 0.42, 0.92] },
  { from: 'living-skyscraper/board-02-full.webp', to: 'living-skyscraper/ink.webp', box: [0.575, 0.385, 0.935, 0.578] },
  { from: 'empower/board-full.webp', to: 'empower/ink.webp', box: [0, 0.05, 0.5, 0.76] },
];

const horizons = [
  { from: 'cultural-roots/10-full.webp', to: 'cultural-roots/horizon.webp', box: [0.031, 0.17, 0.969, 0.9], fade: 0.74 },
];

async function extract(file, box) {
  const image = sharp(path.join(work, file));
  const { width, height } = await image.metadata();
  const left = Math.round(box[0] * width);
  const top = Math.round(box[1] * height);
  return image.extract({
    left,
    top,
    width: Math.round(box[2] * width) - left,
    height: Math.round(box[3] * height) - top,
  });
}

async function report(file) {
  const meta = await sharp(path.join(work, file)).metadata();
  const { size } = await import('node:fs/promises').then((fs) => fs.stat(path.join(work, file)));
  console.log(`${file} ${meta.width}x${meta.height} ${(size / 1024).toFixed(0)} KB`);
}

for (const plate of inkPlates) {
  const cut = await extract(plate.from, plate.box);
  const { data, info } = await cut
    .resize({ width: plate.width ?? 1800, withoutEnlargement: true })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const white = plate.white ?? 238;
  for (let i = 0; i < info.width * info.height; i++) {
    const t = Math.min(1, Math.max(0, (white - data[i]) / (white - 58)));
    out[i * 4] = INK[0];
    out[i * 4 + 1] = INK[1];
    out[i * 4 + 2] = INK[2];
    out[i * 4 + 3] = Math.round(Math.pow(t, 0.85) * 255);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 72, alphaQuality: 70, effort: 5 })
    .toFile(path.join(work, plate.to));
  await report(plate.to);
}

for (const layer of horizons) {
  const cut = await extract(layer.from, layer.box);
  const { data, info } = await cut
    .resize({ width: 2000, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const sky = new Uint8Array(w * h);
  const whiteish = (p) => {
    const r = data[p * 4];
    const g = data[p * 4 + 1];
    const b = data[p * 4 + 2];
    const lo = Math.min(r, g, b);
    return lo >= 238 && Math.max(r, g, b) - lo <= 12;
  };
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;
  for (let x = 0; x < w; x++) {
    if (whiteish(x)) {
      sky[x] = 1;
      queue[tail++] = x;
    }
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % w;
    const y = (p - x) / w;
    const next = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
    for (const n of next) {
      if (n < 0 || sky[n] || !whiteish(n)) continue;
      sky[n] = 1;
      queue[tail++] = n;
    }
  }
  const mask = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = sky[i] ? 0 : 255;
  const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).blur(1.4).extractChannel(0).raw().toBuffer();
  const start = h * layer.fade;
  for (let y = 0; y < h; y++) {
    const k = y < start ? 1 : 1 - Math.min(1, (y - start) / (h - start));
    const ease = k * k * (3 - 2 * k);
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      data[p * 4 + 3] = Math.round(soft[p] * ease);
    }
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 74, alphaQuality: 80, effort: 5 })
    .toFile(path.join(work, layer.to));
  await report(layer.to);
}
