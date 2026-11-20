/**
 * Fails if a shipped file would be rejected by Cloudflare Pages free,
 * or if a plate is heavier than the phone budget in plan.md.
 *
 *   node scripts/check-budget.mjs
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MiB = 1024 * 1024;
const PAGE_CAP = 25 * MiB;
const DISPLAY_CAP = 500 * 1024;
const LIGHTBOX_CAP = Math.round(1.5 * 1024 * 1024);

const violations = [];

for (const folder of ['public', 'dist']) {
  const dir = path.join(root, folder);
  let info;
  try {
    info = await stat(dir);
  } catch {
    violations.push(`${folder}/ is missing`);
    continue;
  }
  if (!info.isDirectory()) {
    violations.push(`${folder}/ is not a directory`);
    continue;
  }
  await walk(dir, folder);
}

if (violations.length) {
  for (const item of violations) console.error(`FAIL ${item}`);
  console.error(`${violations.length} budget violation(s)`);
  process.exit(1);
}

console.log('budget ok: 0 violations');

async function walk(dir, label) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      await walk(full, label);
      continue;
    }
    if (!entry.isFile()) continue;
    const { size } = await stat(full);
    if (size >= PAGE_CAP) {
      violations.push(`${rel} is ${(size / MiB).toFixed(2)} MiB, at or over 25 MiB`);
    }
    if (!rel.includes('/work/')) continue;
    if (entry.name.endsWith('-full.webp') && size > LIGHTBOX_CAP) {
      violations.push(`${rel} lightbox is ${(size / 1024).toFixed(0)} KB, over 1.5 MB`);
    } else if (entry.name.endsWith('.webp') && !entry.name.endsWith('-full.webp') && size > DISPLAY_CAP) {
      violations.push(`${rel} display image is ${(size / 1024).toFixed(0)} KB, over 500 KB`);
    }
  }
}
