import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'public/work/manifest.json'), 'utf8'));
const file = path.join(root, 'src/content/projects.ts');
let source = await readFile(file, 'utf8');

for (const item of manifest) {
  if (item.kind === 'video') continue;
  const key = `${item.slug}/${item.id}`;
  const pattern = new RegExp(`'${key}': \\{ width: \\d+, height: \\d+, fullWidth: \\d+, fullHeight: \\d+ \\}`);
  const next = `'${key}': { width: ${item.width}, height: ${item.height}, fullWidth: ${item.fullWidth}, fullHeight: ${item.fullHeight} }`;
  if (!pattern.test(source)) {
    console.warn('missing', key);
    continue;
  }
  source = source.replace(pattern, next);
}

await writeFile(file, source);
console.log('sizes synced');
