// Cuts objects out of their white sheets. The background is every neutral near-white pixel, with a
// soft ramp so line-work keeps its anti-aliasing; colour is un-multiplied from white at the edges.
// `parts` splits a cut into its separate pieces (connected shapes), one file each, and prints where
// each piece sits so the page can reassemble them. Run after `convert`.
// `node scripts/make-cutouts.mjs medley` rebuilds only the cuts whose output name contains "medley".
import sharp from 'sharp';

const root = 'public/work';
const only = process.argv[2];
const wanted = (cut) => !only || cut.to.includes(only);

const cuts = [
  {
    from: 'living-skyscraper/cover-full.webp',
    to: 'living-skyscraper/tower-cut',
    box: [0, 0.12, 1, 1],
    width: 1100,
    protect: [0.6, 0.03, 0.88, 0.62],
  },
  {
    from: 'nostalgia/axonometric-full.webp',
    to: 'nostalgia/island-cut',
    box: [0, 0.3, 1, 0.76],
    width: 1600,
    leaders: [0.315, 0.466, 0.56, 0.765],
  },
  {
    from: 'cultural-roots/08-full.webp',
    to: 'cultural-roots/hut',
    box: [0.6, 0.44, 0.818, 0.975],
    parts: 3,
    clear: [[0.36, 0.43, 0.445, 0.473]],
  },
];

// Index objects. Outlines are traced by hand in percent of the full master: `shape` is the object's
// outline (feathered), `drop` erases labels and leaders, `sky` keys light sky and cloud out of a band,
// `lines` fades the grey site line-work in a band, `fade` dissolves a drawing's sliced ends into the paper.
// `key` is 'white', a ground colour, or false for renders.
// On renders `shape` is the crisp building silhouette and `ground` its plot, blurred so it fades out.
const objects = [
  {
    from: 'living-skyscraper/cover-full.webp',
    to: 'living-skyscraper/object',
    width: 1000,
    feather: 3,
    shape: [
      [60, 14], [85.2, 14], [85.2, 62], [86.6, 64.6], [89, 64.2], [93, 64.6], [97, 66.4], [99.5, 70.5], [97.5, 76.5],
      [93, 81.5], [86, 86.5], [79, 90.5], [72, 94], [66, 93.5], [60, 90], [55, 86.5], [47, 84], [38, 81], [29, 78],
      [21, 76.5], [14, 75.5], [12, 72], [16, 68.5],
      [24, 64.5], [33, 61.5], [44, 58.5], [58, 57],
    ],
    lines: [[0, 50], [100, 50], [100, 100], [0, 100]],
    solid: [
      [65.2, 18.8], [70, 17.8], [75, 17.5], [80, 17.7], [84.6, 18.4], [85, 20], [84.8, 25], [84.5, 30], [84, 40],
      [83.4, 45], [83.4, 55], [83.5, 60], [84.2, 63], [83.8, 66], [63.2, 66], [63.7, 60], [63.5, 55], [64, 45],
      [63.7, 35], [63.5, 30], [63.6, 25], [64.1, 20],
    ],
  },
  {
    from: 'rajshahi/cover-full.webp',
    to: 'rajshahi/object',
    width: 1400,
    key: [248, 242, 237],
    range: [5, 16],
    shape: [[37, 34], [99.5, 34], [99.5, 78], [37, 78]],
    fade: [[44.5, 25], [93.5, 25], [95.5, 48], [94, 64], [95.5, 90], [44, 90], [42.5, 72], [45.5, 60], [43, 46]],
    fadeFeather: 45,
    lines: [[45, 25], [100, 25], [100, 64], [86, 64], [86, 54], [45, 54]],
    drop: [
      [[42.5, 26], [45.6, 26], [45.6, 38], [42.5, 38]],
      [[45.6, 26], [47.5, 26], [47.5, 35.5], [45.6, 35.5]],
      [[61.4, 26], [64.4, 26], [64.4, 38.5], [61.4, 38.5]],
      [[65.6, 26], [67.3, 26], [67.3, 34], [65.6, 34]],
      [[68.6, 26], [70.6, 26], [70.6, 38.5], [68.6, 38.5]],
      [[79.8, 26], [81.4, 26], [81.4, 44.6], [79.8, 44.6]],
      [[81.6, 26], [84, 26], [84, 42], [81.6, 42]],
      [[85.5, 26], [87.6, 26], [87.6, 39], [85.5, 39]],
      [[90.7, 26], [93.1, 26], [93.1, 52.5], [90.7, 52.5]],
      [[93.6, 26], [96.6, 26], [96.6, 47], [93.6, 47]],
    ],
  },
  {
    from: 'empower/cover-full.webp',
    to: 'empower/object',
    width: 1300,
    key: false,
    feather: 1.5,
    shape: [
      [13, 62], [13, 58], [13.3, 55], [13.8, 53.6], [16, 51.6], [20, 48.6], [24, 46.1], [27, 44.4], [29.5, 43.4],
      [31.5, 43.1], [33.2, 43.5], [33.8, 43.8], [33.8, 39], [34.3, 37.6], [36, 36.3], [38, 35.3], [40, 34.2],
      [42, 33.2], [44, 32.4], [46, 31.7], [47.5, 31.2], [49, 31.4], [50.2, 32.2], [51, 33.5], [51.3, 35.5],
      [51.4, 37.6], [51.6, 39], [51.6, 41], [51.1, 42.3], [53, 42.5], [55.5, 42.7], [59.2, 42.4], [59.3, 36],
      [59.6, 35], [60, 34.9], [63, 35.2], [67, 36], [71, 37], [74.5, 37.9],
      [76.2, 38.5], [76.9, 39.6], [76.7, 44], [76.3, 49], [75.6, 52], [73.8, 55.5], [72.5, 57.5], [72, 66], [40, 70],
      [14, 66],
    ],
    ground: [
      [12.8, 60], [10.5, 66], [11, 73], [15, 79], [22, 83], [32, 85.5], [44, 86.5], [56, 86], [66, 84], [74, 80],
      [78.5, 73], [80, 64], [79.5, 56], [77.5, 54], [73, 57], [60, 62], [30, 62], [14, 58],
    ],
  },
  {
    from: 'medley/amphitheatre-full.webp',
    to: 'medley/object',
    width: 1400,
    key: false,
    feather: 1.5,
    groundFeather: 22,
    shape: [
      [31.8, 48], [32.6, 43.6], [31.6, 27.8], [30.2, 26.3], [43.9, 24.3], [46.2, 22.9], [55.9, 17.2], [61.9, 21],
      [61.4, 25], [61.4, 32.9], [63.75, 31.8], [63.85, 29.7], [65.9, 28.5], [68.5, 29.8], [70.95, 28.3], [73.3, 29.3],
      [72.9, 34.4], [82.8, 40], [83.3, 39.5], [85.1, 39.3], [89.8, 41.9], [89.7, 48.2], [89.3, 54], [60, 56], [36, 52],
    ],
    ground: [
      [21.5, 48], [20, 53], [20.5, 58], [23, 63], [27, 68], [31, 73], [37, 77], [43, 81], [50, 85], [57, 88],
      [64, 86.5], [71, 81], [78, 75], [84, 68], [89, 61], [90.5, 54], [89.5, 47], [85, 45], [60, 45], [35, 45], [26, 46.5],
    ],
  },
  {
    from: 'urban-dwelling/board-02-full.webp',
    to: 'urban-dwelling/object',
    width: 1100,
    feather: 9,
    shape: [
      [66, 47.4], [67.2, 44.2], [68, 41.6], [71.3, 39.6], [72.2, 39.2], [72, 35.4], [80.4, 35.4], [83.2, 33.6],
      [89, 33.8], [90, 36.4], [91.4, 39.8], [91.6, 42.6], [93, 42.8], [93.4, 47], [92.6, 51.2], [89.4, 52.3],
      [89.4, 53.2], [86.5, 53.6], [84.6, 53.4], [82, 55.6], [81.2, 57.2], [94.4, 58.4], [96.3, 58.6], [96.2, 60],
      [92.8, 62.2], [90.2, 64.2], [87, 65.2], [85.2, 66.2], [84.2, 68.5], [81.2, 69.1], [78.2, 68], [77.2, 66.6],
      [74, 66.4], [74, 65.4], [76.4, 64.1], [77.2, 61.4], [78.6, 59.3], [79.9, 57.5], [80.8, 55.6], [79.6, 55],
      [76, 53.8], [74.2, 52.4], [74.2, 49.6], [72, 49.6], [68, 48.8],
    ],
    drop: [
      [[66.3, 36.6], [71.5, 36.6], [71.5, 38.5], [66.3, 38.5]],
      [[85.9, 36.7], [90.4, 36.7], [90.4, 38.3], [85.9, 38.3]],
      [[88.9, 52.7], [95.4, 52], [95.4, 53.4], [88.9, 53.4]],
      [[84.1, 56.9], [96.2, 56.9], [96.2, 58.35], [84.1, 58.35]],
      [[66.2, 40.6], [67.2, 40.6], [67.2, 41.8], [66.2, 41.8]],
    ],
  },
  {
    from: 'cultural-roots/08-full.webp',
    to: 'cultural-roots/object',
    feather: 1.5,
    shape: [
      [62.2, 13.6], [64.6, 8.4], [77.2, 10.2], [79.6, 13.2], [78.6, 16.6], [79.8, 18.8], [79.7, 22.5], [78.2, 26],
      [81.5, 31.2], [79.6, 38.3], [74.4, 35.6], [72.6, 34.8], [72.3, 32.8], [67.4, 28.4], [65.4, 27.6], [65.3, 23.6],
      [66.3, 23.35], [63.8, 20.6], [63.1, 19.2], [65.5, 15.4],
    ],
    drop: [
      [[76.45, 10.6], [81, 10.6], [81, 11.35], [76.45, 11.35]],
      [[79.25, 20.85], [83, 20.85], [83, 21.6], [79.0, 21.6]],
      [[80.42, 33.85], [82, 33.85], [82, 34.55], [80.3, 34.55]],
      [[57, 22.3], [67.7, 22.3], [67.7, 23.1], [57, 23.1]],
      [[63, 28.95], [67.6, 28.95], [67.6, 29.7], [63, 29.7]],
    ],
  },
  {
    from: 'music-bistro/room-2-full.webp',
    to: 'music-bistro/object',
    width: 1300,
    key: false,
    feather: 1.5,
    groundFeather: 22,
    shape: [
      [12.1, 52.4], [13.4, 48], [14.7, 46.8], [16.3, 44.3], [20.3, 42.7], [23.1, 41.1], [24.2, 40.2], [25.6, 38.9],
      [27.25, 36.8], [30.6, 35.7], [31.6, 34.6], [37.5, 33.2], [38.6, 34.4], [44.7, 34.3], [48.75, 34.3], [49, 33.5],
      [52.5, 32.4], [53.75, 33], [54, 36.6], [56.25, 36.8], [56.3, 41.7], [60, 42.3], [63, 44], [65.1, 47.5],
      [69.6, 44.5], [70.4, 42.1], [76.1, 40], [76.8, 39.5], [82.5, 41.7], [83.2, 44.3], [87.9, 45.6], [90.8, 49.1],
      [91.7, 52.3], [91.8, 57.8], [91.8, 65.6], [89.4, 74.3], [85.4, 82.1], [85.2, 84.8], [84.9, 89.5], [82, 89.5],
      [80.5, 90.4], [74.6, 93.5], [67.2, 94.3], [59.8, 94.6], [43, 96.4], [42.7, 96.4], [42.7, 77.9], [40.6, 77.4],
      [39.4, 74], [38.7, 57], [35, 57.8], [33, 59.3], [30.7, 61.3], [29.2, 64.5], [28.7, 67.8], [28.6, 76.6],
      [15.4, 77], [13.2, 71.8],
    ],
    ground: [
      [12, 58], [11, 68], [12.5, 77], [16, 80.5], [28, 80.5], [38, 80], [42, 81], [42, 97.5], [60, 97.5], [75, 96.5],
      [85, 92.5], [90.5, 86], [93, 76], [93, 66], [91, 62], [70, 62], [40, 60], [14, 56],
    ],
  },
];

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function eraseLeaders(data, w, h, xs) {
  for (const fx of xs) {
    const cx = Math.round(fx * w);
    for (let y = 0; y < h; y++) {
      for (let x = Math.max(0, cx - 10); x <= Math.min(w - 1, cx + 10); x++) {
        const p = (y * w + x) * 4;
        const hi = Math.max(data[p], data[p + 1], data[p + 2]);
        const lo = Math.min(data[p], data[p + 1], data[p + 2]);
        if (hi > 170 || hi - lo > 26) continue;
        const l = (y * w + Math.max(0, cx - 16)) * 4;
        const r = (y * w + Math.min(w - 1, cx + 16)) * 4;
        for (let c = 0; c < 3; c++) data[p + c] = (data[l + c] + data[r + c]) >> 1;
      }
    }
  }
}

function keyWhite(data, w, h, [dark, light] = [222, 247]) {
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lo = Math.min(r, g, b);
    const chroma = Math.max(r, g, b) - lo;
    const neutral = 1 - smooth(8, 20, chroma);
    const a = 1 - neutral * smooth(dark, light, lo);
    data[i + 3] = Math.round(a * 255);
    if (a > 0.02 && a < 1) {
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - 255 * (1 - a)) / a)));
    }
  }
}

/** Inside the box, keyed whites that the open background cannot reach are part of the building. */
function restoreEnclosed(data, original, w, h, [a, b, c, d]) {
  const l = Math.round(a * w), t = Math.round(b * h), r = Math.round(c * w), btm = Math.round(d * h);
  const open = (p) => data[p * 4 + 3] < 128;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const seed = (x, y) => {
    const p = y * w + x;
    if (!seen[p] && open(p)) {
      seen[p] = 1;
      stack.push(p);
    }
  };
  for (let x = l; x < r; x++) {
    seed(x, t);
    seed(x, btm - 1);
  }
  for (let y = t; y < btm; y++) {
    seed(l, y);
    seed(r - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p - x) / w;
    if (x > l) seed(x - 1, y);
    if (x < r - 1) seed(x + 1, y);
    if (y > t) seed(x, y - 1);
    if (y < btm - 1) seed(x, y + 1);
  }
  for (let y = t; y < btm; y++)
    for (let x = l; x < r; x++) {
      const p = y * w + x;
      if (seen[p] || data[p * 4 + 3] === 255) continue;
      original.copy(data, p * 4, p * 4, p * 4 + 3);
      data[p * 4 + 3] = 255;
    }
}

function label(data, w, h) {
  const labels = new Int32Array(w * h).fill(-1);
  const areas = [];
  for (let s = 0; s < w * h; s++) {
    if (labels[s] !== -1 || data[s * 4 + 3] < 60) continue;
    const id = areas.length;
    let area = 0;
    const stack = [s];
    labels[s] = id;
    while (stack.length) {
      const p = stack.pop();
      area++;
      const x = p % w, y = (p - x) / w;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const q = ny * w + nx;
          if (labels[q] === -1 && data[q * 4 + 3] >= 60) {
            labels[q] = id;
            stack.push(q);
          }
        }
    }
    areas.push(area);
  }
  // Faint edge pixels join the piece beside them.
  for (let pass = 0; pass < 3; pass++) {
    const next = labels.slice();
    for (let p = 0; p < w * h; p++) {
      if (labels[p] !== -1 || data[p * 4 + 3] === 0) continue;
      const x = p % w;
      const around = [p - 1, p + 1, p - w, p + w].filter((q) => q >= 0 && q < w * h && Math.abs((q % w) - x) <= 1);
      const hit = around.find((q) => labels[q] !== -1);
      if (hit !== undefined) next[p] = labels[hit];
    }
    labels.set(next);
  }
  return { labels, areas };
}

async function write(data, w, h, to, width) {
  const png = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const out = sharp(png);
  if (width && width < w) out.resize({ width });
  const result = await out.webp({ quality: 84, alphaQuality: 92 }).toFile(`${root}/${to}.webp`);
  console.log(`${to}.webp`, `${result.width}x${result.height}`, `${Math.round(result.size / 1024)} KB`);
}

for (const cut of cuts.filter(wanted)) {
  const src = `${root}/${cut.from}`;
  const meta = await sharp(src).metadata();
  const [x0, y0, x1, y1] = cut.box;
  const region = {
    left: Math.round(x0 * meta.width),
    top: Math.round(y0 * meta.height),
    width: Math.round((x1 - x0) * meta.width),
    height: Math.round((y1 - y0) * meta.height),
  };
  const { data, info } = await sharp(src).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  if (cut.leaders) eraseLeaders(data, w, h, cut.leaders);
  const original = Buffer.from(data);
  keyWhite(data, w, h);
  if (cut.protect) restoreEnclosed(data, original, w, h, cut.protect);
  for (const [a, b, c, d] of cut.clear ?? []) {
    for (let y = Math.round(b * h); y < Math.round(d * h); y++)
      for (let x = Math.round(a * w); x < Math.round(c * w); x++) data[(y * w + x) * 4 + 3] = 0;
  }

  if (!cut.parts) {
    await write(data, w, h, cut.to, cut.width);
    continue;
  }

  const { labels, areas } = label(data, w, h);
  const keep = areas
    .map((area, id) => ({ area, id }))
    .sort((a, b) => b.area - a.area)
    .slice(0, cut.parts)
    .map((piece) => piece.id);

  const boxes = keep.map((id) => {
    let l = w, t = h, r = 0, b = 0;
    for (let p = 0; p < w * h; p++) {
      if (labels[p] !== id) continue;
      const x = p % w, y = (p - x) / w;
      if (x < l) l = x;
      if (x > r) r = x;
      if (y < t) t = y;
      if (y > b) b = y;
    }
    return { id, l, t, r: r + 1, b: b + 1 };
  });
  boxes.sort((a, b) => a.t - b.t);

  const manifest = [];
  for (const [n, box] of boxes.entries()) {
    const pw = box.r - box.l, ph = box.b - box.t;
    const piece = Buffer.alloc(pw * ph * 4);
    for (let y = 0; y < ph; y++)
      for (let x = 0; x < pw; x++) {
        const p = (box.t + y) * w + box.l + x;
        if (labels[p] !== box.id) continue;
        data.copy(piece, (y * pw + x) * 4, p * 4, p * 4 + 4);
      }
    await write(piece, pw, ph, `${cut.to}-${n + 1}`);
    manifest.push({
      src: `/work/${cut.to}-${n + 1}.webp`,
      x: +(box.l / w).toFixed(4),
      y: +(box.t / h).toFixed(4),
      w: +(pw / w).toFixed(4),
      h: +(ph / h).toFixed(4),
    });
  }
  console.log(`${cut.to} ratio ${w}/${h}`);
  console.log(JSON.stringify(manifest, null, 2));
}

/** Rasterises polygons given in percent of the master into a feathered 0–255 mask. */
async function polygons(list, w, h, feather) {
  const shapes = list
    .map((points) => `<polygon points="${points.map(([x, y]) => `${(x / 100) * w},${(y / 100) * h}`).join(' ')}" fill="white"/>`)
    .join('');
  const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="black"/>${shapes}</svg>`);
  let mask = sharp(svg).greyscale();
  if (feather) mask = mask.blur(feather);
  return mask.extractChannel(0).raw().toBuffer();
}

/** The ground is everything close to one flat colour; colour is un-multiplied from it at the edges. */
function keyGround(data, w, h, [br, bg, bb], [near, far]) {
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    const d = Math.max(Math.abs(data[i] - br), Math.abs(data[i + 1] - bg), Math.abs(data[i + 2] - bb));
    const a = smooth(near, far, d);
    data[i + 3] = Math.round(a * data[i + 3]);
    if (a > 0.02 && a < 1) {
      const ground = [br, bg, bb];
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - ground[c] * (1 - a)) / a)));
    }
  }
}

/** Inside the band, light low-chroma pixels are sky or cloud. */
function keySky(data, band, w, h) {
  for (let p = 0; p < w * h; p++) {
    if (!band[p]) continue;
    const i = p * 4;
    const lo = Math.min(data[i], data[i + 1], data[i + 2]);
    const chroma = Math.max(data[i], data[i + 1], data[i + 2]) - lo;
    const sky = (1 - smooth(18, 40, chroma)) * smooth(168, 212, lo) * (band[p] / 255);
    data[i + 3] = Math.round(data[i + 3] * (1 - sky));
  }
}

/** Inside the band, thin neutral grey strokes on white are drawing, not render; they fade out. */
function fadeLines(data, band, w, h) {
  for (let p = 0; p < w * h; p++) {
    if (!band[p] || data[p * 4 + 3] === 0) continue;
    const i = p * 4;
    const lo = Math.min(data[i], data[i + 1], data[i + 2]);
    const chroma = Math.max(data[i], data[i + 1], data[i + 2]) - lo;
    if (chroma > 14) continue;
    const x = p % w, y = (p - x) / w;
    let white = 0;
    for (const [dx, dy] of [[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, 3], [-3, 3], [3, -3]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (data[(ny * w + nx) * 4 + 3] < 40) white++;
    }
    if (white >= 3) data[i + 3] = Math.round(data[i + 3] * (1 - (band[p] / 255) * smooth(2, 4, white)));
  }
}

for (const cut of objects.filter(wanted)) {
  const src = `${root}/${cut.from}`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const original = Buffer.from(data);
  if (cut.key === undefined || cut.key === 'white') keyWhite(data, w, h, cut.ramp);
  else if (cut.key) keyGround(data, w, h, cut.key, cut.range ?? [6, 18]);
  if (cut.sky) keySky(data, await polygons([cut.sky], w, h, 2), w, h);
  if (cut.lines) fadeLines(data, await polygons([cut.lines], w, h, 0), w, h);
  const keep = await polygons([cut.shape], w, h, cut.feather ?? 2);
  if (cut.ground) {
    const ground = await polygons([cut.ground], w, h, cut.groundFeather ?? 16);
    for (let p = 0; p < w * h; p++) keep[p] = Math.max(keep[p], ground[p]);
  }
  const drop = cut.drop ? await polygons(cut.drop, w, h, 1) : null;
  const solid = cut.solid ? await polygons([cut.solid], w, h, 1) : null;
  const fade = cut.fade ? await polygons([cut.fade], w, h, cut.fadeFeather ?? 40) : null;
  if (fade) for (let p = 0; p < w * h; p++) keep[p] = (keep[p] * fade[p]) / 255;
  let l = w, t = h, r = 0, b = 0;
  for (let p = 0; p < w * h; p++) {
    if (solid && solid[p]) {
      const s = solid[p] / 255;
      data[p * 4 + 3] = Math.round(data[p * 4 + 3] * (1 - s) + 255 * s);
      original.copy(data, p * 4, p * 4, p * 4 + 3);
    }
    let a = (data[p * 4 + 3] * keep[p]) / 255;
    if (drop) a *= 1 - drop[p] / 255;
    a = a < 6 ? 0 : a;
    data[p * 4 + 3] = Math.round(a);
    if (!a) continue;
    const x = p % w, y = (p - x) / w;
    if (x < l) l = x;
    if (x > r) r = x;
    if (y < t) t = y;
    if (y > b) b = y;
  }
  const pw = r - l + 1, ph = b - t + 1;
  const piece = Buffer.alloc(pw * ph * 4);
  for (let y = 0; y < ph; y++) data.copy(piece, y * pw * 4, ((t + y) * w + l) * 4, ((t + y) * w + r + 1) * 4);
  await write(piece, pw, ph, cut.to, cut.width);
}
