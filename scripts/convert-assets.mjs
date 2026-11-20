/**
 * Converts the print archive in Projects/ into web masters in public/work/.
 * Idempotent: overwrites the same output names. Does not touch source files.
 *
 *   node scripts/convert-assets.mjs
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = path.join(root, 'Projects');
const outRoot = path.join(root, 'public', 'work');

const jobs = [
  plate('cultural-roots', '01', 'THESIS_01.tif', 'sheet', 88),
  plate('cultural-roots', '02', 'THESIS_02.tif', 'sheet', 88),
  plate('cultural-roots', '03', 'THESIS_03.tif', 'sheet', 88),
  plate('cultural-roots', '04', 'THESIS_04.tif', 'sheet', 88),
  plate('cultural-roots', '05', 'THESIS_05.tif', 'sheet', 88),
  plate('cultural-roots', '06', 'THESIS_06.tif', 'render', 80),
  plate('cultural-roots', '07', 'THESIS_07.tif', 'sheet', 88),
  plate('cultural-roots', '08', 'THESIS_08.tif', 'sheet', 88),
  plate('cultural-roots', '09', 'THESIS_09.tif', 'render', 80),
  plate('cultural-roots', '10', 'THESIS_10.tif', 'render', 80),
  plate('cultural-roots', '11', 'THESIS_11.tif', 'render', 80),
  plate('cultural-roots', '12', 'THESIS_12.tif', 'sheet', 88),
  plate('cultural-roots', '13', 'THESIS_13.tif', 'sheet', 88),

  plate('medley', 'board-01', 'Medley_Portfolio_1.png', 'sheet', 86),
  plate('medley', 'board-02', 'Medley_Portfolio_2.png', 'sheet', 88),
  plate('medley', 'approach', 'Image ex 1.png', 'render', 80),
  plate('medley', 'courtyard', 'ex2.png', 'render', 80),
  plate('medley', 'plan', 'GROUND FLOOR RENDER redo.png', 'sheet', 88),
  plate('medley', 'section-aa', 'section aa.png', 'sheet', 88),
  plate('medley', 'section-bb', 'section bb.png', 'sheet', 88),
  plate('medley', 'elevation-1', 'ele 1.png', 'sheet', 88),
  plate('medley', 'elevation-2', 'ele2.png', 'sheet', 88),
  plate('medley', 'amphitheatre', 'Scene 23.png', 'render', 80),
  plate('medley', 'academy', 'Scene 19.png', 'render', 80),

  plate('rajshahi', 'cover', 'Urban_cover.jpg', 'render', 82),
  plate('rajshahi', 'board-01', 'Revitalizing_Rajshahi_Portfolio_1.png', 'sheet', 86),
  plate('rajshahi', 'board-02', 'Revitalizing_Rajshahi_Portfolio_2.png', 'sheet', 86),
  plate('rajshahi', 'board-03', 'Revitalizing_Rajshahi_Portfolio_3.png', 'sheet', 86),
  plate('rajshahi', 'board-04', 'Revitalizing_Rajshahi_Portfolio_4.png', 'sheet', 86),
  plate('rajshahi', 'board-05', 'Revitalizing_Rajshahi_Portfolio_5.png', 'sheet', 86),

  plate('urban-dwelling', 'cover', 'Housing_cover.jpg', 'render', 82),
  plate('urban-dwelling', 'board-01', 'Reshaping_Urban_Dwelling_Portfolio_1.png', 'sheet', 86),
  plate('urban-dwelling', 'board-02', 'Reshaping_Urban_Dwelling_Portfolio_2.png', 'sheet', 86),
  plate('urban-dwelling', 'board-03', 'Reshaping_Urban_Dwelling_Portfolio_3.png', 'sheet', 86),
  plate('urban-dwelling', 'board-04', 'Reshaping_Urban_Dwelling_Portfolio_4.png', 'sheet', 86),

  plate('nostalgia', 'cover', 'Landscape.jpg', 'render', 82),
  plate('nostalgia', 'render', 'RENDER.png', 'render', 80),
  plate('nostalgia', 'axonometric', 'AXONOMETRIC DIAGRAM.png', 'sheet', 88),

  plate('music-bistro', 'cover', 'COVER.png', 'render', 80),
  plate('music-bistro', 'board-01', 'PAGE 1.png', 'sheet', 86),
  plate('music-bistro', 'board-02', 'PAGE 2.png', 'sheet', 86),
  plate('music-bistro', 'room-1', 'Enscape_2023-08-14-23-50-23.png', 'render', 80),
  plate('music-bistro', 'room-2', 'Enscape_2023-08-14-23-51-25.png', 'render', 80),
  plate('music-bistro', 'room-3', 'Enscape_2023-08-15-13-33-06.png', 'render', 80),
  plate('music-bistro', 'room-4', 'Enscape_2023-08-15-13-33-53.png', 'render', 80),

  plate('living-skyscraper', 'cover', 'COVER.png', 'render', 82),
  plate('living-skyscraper', 'board-01', 'Maisha Mahpara_Portfolio_1.png', 'sheet', 86),
  plate('living-skyscraper', 'board-02', 'Maisha Mahpara_Portfolio_2.png', 'sheet', 86),
  plate('living-skyscraper', 'board-03', 'Maisha Mahpara_Portfolio_3.png', 'sheet', 86),

  plate('empower', 'render', 'RENDER.png', 'render', 80),
  plate('empower', 'cover', 'COVER.png', 'render', 82),
  plate('empower', 'board', 'PAGE.png', 'sheet', 86),
];

function plate(slug, name, file, kind, quality) {
  return {
    slug,
    name,
    file,
    kind,
    quality,
    displayEdge: kind === 'render' ? 1600 : 1400,
    fullEdge: kind === 'render' ? 2400 : 2200,
  };
}

const manifest = [];

for (const job of jobs) {
  const source = path.join(archive, folderFor(job.slug), job.file);
  const dir = path.join(outRoot, job.slug);
  await mkdir(dir, { recursive: true });

  const input = sharp(source, { limitInputPixels: false, unlimited: true }).rotate();
  const meta = await input.metadata();
  const display = await writeVariant(input, path.join(dir, `${job.name}.webp`), job.displayEdge, job.quality);
  const full = await writeVariant(
    sharp(source, { limitInputPixels: false, unlimited: true }).rotate(),
    path.join(dir, `${job.name}-full.webp`),
    job.fullEdge,
    Math.min(90, job.quality + 2),
  );

  manifest.push({
    slug: job.slug,
    id: job.name,
    kind: job.kind,
    source: job.file,
    width: display.width,
    height: display.height,
    fullWidth: full.width,
    fullHeight: full.height,
    src: `/work/${job.slug}/${job.name}.webp`,
    full: `/work/${job.slug}/${job.name}-full.webp`,
    bytes: display.bytes,
    fullBytes: full.bytes,
    originalWidth: meta.width,
    originalHeight: meta.height,
  });

  console.log(
    `${job.slug}/${job.name}  ${meta.width}x${meta.height} -> ${display.width}x${display.height} ${(display.bytes / 1024).toFixed(0)}kb`,
  );
}

await convertFilm();
await writeFile(path.join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`wrote ${manifest.length} plates`);

function folderFor(slug) {
  const map = {
    'cultural-roots': '1_REJUVENATING CULTURAL ROOTS',
    medley: '2_MEDLEY',
    rajshahi: '3_REVITALIZING RAJSHAHI',
    'urban-dwelling': '4_RESHAPING URBAN DWELLING',
    nostalgia: '5_PRESERVING NOSTALGIA',
    'music-bistro': '6_MUSIC BISTRO',
    'living-skyscraper': '7_HIGHRISE',
    empower: '8_YOUTH CENTER',
  };
  return map[slug];
}

async function writeVariant(pipeline, destination, edge, quality) {
  const buffer = await pipeline
    .clone()
    .resize({
      width: edge,
      height: edge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();
  await writeFile(destination, buffer);
  const meta = await sharp(buffer).metadata();
  return { width: meta.width, height: meta.height, bytes: buffer.length };
}

async function convertFilm() {
  const source = path.join(archive, '3_REVITALIZING RAJSHAHI', 'G-02 FINAL ANIMATION-.mp4');
  const dir = path.join(outRoot, 'rajshahi');
  await mkdir(dir, { recursive: true });
  const video = path.join(dir, 'animation.mp4');
  const poster = path.join(dir, 'animation-poster.webp');

  await run('ffmpeg', [
    '-y',
    '-i',
    source,
    '-ss',
    '2',
    '-frames:v',
    '1',
    '-vf',
    'scale=1280:-2',
    poster.replace('.webp', '.png'),
  ]);

  const posterPng = poster.replace('.webp', '.png');
  const posterBuf = await sharp(posterPng).webp({ quality: 80, effort: 6 }).toBuffer();
  await writeFile(poster, posterBuf);
  const posterMeta = await sharp(posterBuf).metadata();

  await run('ffmpeg', [
    '-y',
    '-i',
    source,
    '-vf',
    'scale=854:-2',
    '-c:v',
    'libx264',
    '-crf',
    '32',
    '-preset',
    'medium',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '64k',
    '-movflags',
    '+faststart',
    video,
  ]);

  manifest.push({
    slug: 'rajshahi',
    id: 'animation',
    kind: 'video',
    src: '/work/rajshahi/animation.mp4',
    poster: '/work/rajshahi/animation-poster.webp',
    width: posterMeta.width,
    height: posterMeta.height,
  });
  console.log('rajshahi/animation compressed');
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}`));
    });
  });
}
