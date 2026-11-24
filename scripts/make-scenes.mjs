// Builds layered banner scenes from renders. Nothing is repainted: every layer is the render's own
// pixels with an alpha channel. The sky is flood-filled from the top edge (never below `limit`) and
// becomes transparent, so the buildings rise straight out of the page. Each nearer layer is a traced
// polygon anchored to the bottom edge; on the page it only ever rises over the layers behind it, so
// it never uncovers anything the render does not hold. Run after `convert`.
//   node scripts/make-scenes.mjs [slug] [--preview]
import sharp from 'sharp';

const root = 'public/work';

/** Traced on a 1024-wide preview; stored as fractions of the source image, [x, y]. */
const traced = (h, pts) => pts.map(([x, y]) => [x / 1024, y / h]);

const scenes = [
  {
    slug: 'nostalgia',
    from: 'nostalgia/render-full.webp',
    width: 2000,
    sky: 'blue',
    limit: [[0, 0.56], [1, 0.56]],
    islands: true,
    layers: [
      // The visitor and the paved path he walks in on.
      traced(576, [
        [196, 577], [360, 463], [399, 463], [395, 405], [398, 336], [418, 318], [420, 296], [433, 286],
        [452, 290], [456, 318], [480, 330], [490, 362], [489, 425], [481, 470], [534, 486], [548, 500],
        [541, 577],
      ]),
    ],
  },
  {
    slug: 'medley',
    from: 'medley/approach-full.webp',
    width: 1800,
    sky: 'blue',
    limit: [[0, 0.8], [1, 0.8]],
    layers: [
      // Road, lawn and the planted verge with the car, up to the shrub line.
      traced(682, [
        [0, 683], [0, 600], [120, 598], [250, 612], [262, 610], [300, 594], [370, 590], [380, 566],
        [410, 556], [470, 559], [482, 571], [496, 563], [560, 563], [600, 549], [640, 543], [700, 533],
        [760, 516], [830, 510], [900, 494], [960, 478], [1000, 476], [1025, 484], [1025, 683],
      ]),
    ],
  },
  {
    slug: 'empower',
    from: 'empower/render-full.webp',
    width: 1536,
    sky: 'pale',
    limit: [[0, 0.75], [1, 0.75]],
    // Its clouds are white like its roofs, so they go by connectivity rather than colour. Medley
    // cannot: its perforated white facades would read as islands too.
    islands: true,
    layers: [
      // The street with its parked cars, below the building's footprint.
      traced(682, [
        [0, 683], [0, 634], [80, 638], [300, 672], [420, 672], [600, 632], [760, 600], [900, 628],
        [1010, 630], [1025, 628], [1025, 683],
      ]),
    ],
  },
];

const isSky = {
  blue: (r, g, b) => {
    const lo = Math.min(r, g, b), hi = Math.max(r, g, b);
    return (b - r > 22 && b > 110 && b >= g) || (lo > 196 && hi - lo < 48 && b >= r - 2);
  },
  pale: (r, g, b) => {
    const lo = Math.min(r, g, b);
    return lo > 176 && b - r > 3 && b >= g - 2;
  },
};

const limitAt = (limit, fx) => {
  for (let i = 1; i < limit.length; i++) {
    const [x0, y0] = limit[i - 1], [x1, y1] = limit[i];
    if (fx <= x1) return y0 + ((y1 - y0) * (fx - x0)) / (x1 - x0 || 1);
  }
  return limit[limit.length - 1][1];
};

function floodSky(data, w, h, scene) {
  const test = isSky[scene.sky];
  const sky = new Uint8Array(w * h);
  const floor = new Int32Array(w);
  for (let x = 0; x < w; x++) floor[x] = Math.round(limitAt(scene.limit, x / w) * h);
  const ok = (p) => {
    const x = p % w, y = (p - x) / w;
    return y < floor[x] && test(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);
  };
  const stack = [];
  for (let x = 0; x < w; x++)
    if (ok(x)) {
      sky[x] = 1;
      stack.push(x);
    }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
      if (q < 0 || q >= w * h || sky[q] || !ok(q)) continue;
      sky[q] = 1;
      stack.push(q);
    }
  }
  return sky;
}

// Clouds and birds are islands: anything that does not connect down to the ground joins the sky.
function dropIslands(sky, w, h, scene) {
  const keep = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) {
    const top = Math.round(limitAt(scene.limit, x / w) * h);
    for (let y = top; y < h; y++) {
      const p = y * w + x;
      if (!sky[p]) {
        keep[p] = 1;
        stack.push(p);
      }
    }
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
      if (q < 0 || q >= w * h || keep[q] || sky[q]) continue;
      keep[q] = 1;
      stack.push(q);
    }
  }
  for (let p = 0; p < w * h; p++) if (!keep[p]) sky[p] = 1;
}

async function polygonMask(polys, w, h, feather) {
  const shapes = polys
    .map((poly) => `<polygon points="${poly.map(([x, y]) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`).join(' ')}" fill="#fff"/>`)
    .join('');
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000"/>${shapes}</svg>`);
  let img = sharp(svg).greyscale();
  if (feather) img = img.blur(feather);
  return img.extractChannel(0).raw().toBuffer();
}

const only = process.argv.find((a) => !a.startsWith('--') && scenes.some((s) => s.slug === a));
const preview = process.argv.includes('--preview');

for (const scene of scenes.filter((s) => !only || s.slug === only)) {
  const src = `${root}/${scene.from}`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const sky = floodSky(data, w, h, scene);
  if (scene.islands) dropIslands(sky, w, h, scene);
  // Grow the sky by a pixel so no blue fringe survives, then soften the edge.
  const grown = Buffer.alloc(w * h);
  for (let p = 0; p < w * h; p++) {
    if (!sky[p]) continue;
    const x = p % w;
    grown[p] = 255;
    if (x > 0) grown[p - 1] = 255;
    if (x < w - 1) grown[p + 1] = 255;
    if (p >= w) grown[p - w] = 255;
    if (p < w * (h - 1)) grown[p + w] = 255;
  }
  const soft = await sharp(grown, { raw: { width: w, height: h, channels: 1 } }).blur(1.1).extractChannel(0).raw().toBuffer();
  const halo = await sharp(grown, { raw: { width: w, height: h, channels: 1 } }).blur(3).extractChannel(0).raw().toBuffer();
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    data[i + 3] = 255 - soft[p];
    if (halo[p] > 10 && !sky[p]) {
      const cap = Math.round((data[i] + data[i + 1]) / 2 + 10);
      if (data[i + 2] > cap) data[i + 2] = cap;
    }
  }

  const layers = [{ name: 'scene-0', mask: null }];
  for (const [n, layer] of scene.layers.entries()) {
    layers.push({ name: `scene-${n + 1}`, mask: await polygonMask([layer], w, h, 2.5) });
  }

  for (const layer of layers) {
    const out = Buffer.from(data);
    if (layer.mask) for (let p = 0; p < w * h; p++) out[p * 4 + 3] = Math.round((out[p * 4 + 3] * layer.mask[p]) / 255);
    const png = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
    const result = await sharp(png)
      .resize({ width: Math.min(scene.width, w) })
      .webp({ quality: 80, alphaQuality: 90, effort: 6 })
      .toFile(`${root}/${scene.slug}/${layer.name}.webp`);
    console.log(`${scene.slug}/${layer.name}.webp`, `${result.width}x${result.height}`, `${Math.round(result.size / 1024)} KB`);
  }

  if (preview) {
    const pw = 1400, ph = Math.round((h / w) * pw);
    const outlines = scene.layers
      .map((poly, n) => `<polygon points="${poly.map(([x, y]) => `${x * pw},${y * ph}`).join(' ')}" fill="none" stroke="${['#ff0050', '#00a0ff', '#ffb000'][n]}" stroke-width="2"/>`)
      .join('');
    const limit = `<polyline points="${scene.limit.map(([x, y]) => `${x * pw},${y * ph}`).join(' ')}" fill="none" stroke="#9000ff" stroke-dasharray="6 6" stroke-width="1.5"/>`;
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}">${outlines}${limit}</svg>`);
    const base = await sharp(`${root}/${scene.slug}/scene-0.webp`).resize({ width: pw }).png().toBuffer();
    await sharp({ create: { width: pw, height: ph, channels: 3, background: '#efeae3' } })
      .composite([{ input: base }, { input: svg }])
      .png()
      .toFile(`lab/shots/scene-${scene.slug}.png`);
  }
}
