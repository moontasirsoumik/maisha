/**
 * Drives scripts/check-budget.mjs, the script `npm run build` runs.
 * The first call uses the real public/ and dist/ trees.
 * The second plants oversized files into those trees, confirms the same
 * script exits 1, then deletes the plants.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checker = path.join(root, 'scripts', 'check-budget.mjs');

function run() {
  return spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
}

const clean = run();
assert.equal(clean.status, 0, clean.stderr);
assert.match(clean.stdout, /0 violations/);

const plants = [
  path.join(root, 'public', 'work', 'budget-probe.webp'),
  path.join(root, 'dist', 'work', 'budget-probe-full.webp'),
  path.join(root, 'dist', 'budget-probe.mp4'),
];

await mkdir(path.dirname(plants[1]), { recursive: true });
await writeFile(plants[0], Buffer.alloc(501 * 1024));
await writeFile(plants[1], Buffer.alloc(Math.round(1.5 * 1024 * 1024) + 1));
await writeFile(plants[2], Buffer.alloc(25 * 1024 * 1024));

let planted;
try {
  planted = run();
} finally {
  await Promise.all(plants.map((file) => rm(file, { force: true })));
}

assert.equal(planted.status, 1, planted.stdout);
assert.match(planted.stderr, /budget-probe\.webp/);
assert.match(planted.stderr, /budget-probe-full\.webp/);
assert.match(planted.stderr, /budget-probe\.mp4/);
assert.match(planted.stderr, /3 budget violation/);

const restored = run();
assert.equal(restored.status, 0, restored.stderr);
console.log('budget test passed');
