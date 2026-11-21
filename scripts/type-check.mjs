import { chromium } from 'playwright-core';
import fs from 'node:fs';

const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
fs.mkdirSync('lab/type', { recursive: true });

async function shot(name, width, height, route, fraction) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
  await page.evaluate((f) => window.scrollTo(0, document.documentElement.scrollHeight * f), fraction);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `lab/type/${name}.png` });
  await page.close();
}

await shot('about-open', 1440, 900, '/about', 0);
await shot('about-practice', 1440, 900, '/about', 0.16);
await shot('about-training', 1440, 900, '/about', 0.3);
await shot('about-work', 1440, 900, '/about', 0.48);
await shot('about-tools', 1440, 900, '/about', 0.68);
await shot('about-roles', 1440, 900, '/about', 0.86);
await shot('about-phone', 390, 844, '/about', 0.42);
await shot('home-open', 1440, 900, '/', 0.02);
await shot('work-open', 1440, 900, '/work/medley', 0.02);
console.log('type frames written');
await browser.close();
