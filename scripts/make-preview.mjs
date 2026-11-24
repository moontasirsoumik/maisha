/**
 * Builds the link-preview card from the thesis hero, and the raster favicons
 * from the M mark.
 *
 *   node scripts/make-preview.mjs
 *
 * The card is PNG, 1200×630. WhatsApp, LinkedIn, Slack, and iMessage refuse
 * WebP and relative image URLs, so the page points at this file.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const hero = path.join(publicDir, 'work', 'cultural-roots', 'hero.webp');

const cardInfo = await sharp(hero)
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 })
  .toFile(path.join(publicDir, 'og.png'));
console.log(`og.png ${cardInfo.width}x${cardInfo.height} ${(cardInfo.size / 1024).toFixed(0)} KB`);

function mark(size) {
  const edge = Math.max(1, Math.round(size / 32));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#efeae3"/>
  <rect x="${edge / 2}" y="${edge / 2}" width="${32 - edge}" height="${32 - edge}" fill="none" stroke="#2b221c" stroke-width="${edge}" stroke-opacity="0.28"/>
  <path fill="#2b221c" fill-rule="evenodd" d="M7 8h3.4l5.6 9.6L21.6 8H25v16h-3.2v-9.4L16.6 24h-1.2l-5.2-9.4V24H7V8z"/>
</svg>`);
}

async function icon(size, file) {
  const info = await sharp(mark(size)).png({ compressionLevel: 9 }).toFile(path.join(publicDir, file));
  console.log(`${file} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}

await icon(32, 'favicon-32.png');
await icon(180, 'apple-touch-icon.png');
