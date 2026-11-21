import { chromium } from 'playwright-core';
import fs from 'node:fs';

const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function shot(name, width, height, route, fraction, reduced = false) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
  await page.evaluate((f) => window.scrollTo(0, document.documentElement.scrollHeight * f), fraction);
  await page.waitForTimeout(350);
  fs.mkdirSync('lab/frames', { recursive: true });
  await page.screenshot({ path: `lab/frames/${name}.png` });
  await page.close();
}

await shot('home-title', 1440, 900, '/', 0);
await shot('home-arrival', 1440, 900, '/', 0.16);
await shot('home-index', 1440, 900, '/', 0.48);
await shot('home-cut', 1440, 900, '/', 0.72);
await shot('home-close', 1440, 900, '/', 0.96);
await shot('work-open', 1440, 900, '/work/cultural-roots', 0.04);
await shot('work-chapter', 1440, 900, '/work/cultural-roots', 0.28);
await shot('work-cut', 1440, 900, '/work/cultural-roots', 0.78);
await shot('rajshahi-film', 1440, 900, '/work/rajshahi', 0.55);
await shot('about', 1440, 900, '/about', 0.08);
await shot('phone-title', 390, 844, '/', 0);
await shot('phone-index', 390, 844, '/', 0.45);
await shot('phone-cut', 390, 844, '/', 0.72);
await shot('phone-menu', 390, 844, '/', 0);
await shot('still-title', 1440, 900, '/', 0, true);
console.log('frames written');
await browser.close();
