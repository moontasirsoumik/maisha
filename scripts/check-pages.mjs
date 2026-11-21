import { chromium } from 'playwright-core';

const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
const routes = [
  '/',
  '/about',
  '/work/cultural-roots',
  '/work/medley',
  '/work/rajshahi',
  '/work/urban-dwelling',
  '/work/nostalgia',
  '/work/music-bistro',
  '/work/living-skyscraper',
  '/work/empower',
];

const notes = [];
for (const route of routes) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
  const h1 = (await page.locator('h1').innerText()).replace(/\s+/g, ' ');
  const plates = await page.locator('img').count();
  const broken = await page.evaluate(() =>
    [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
  );
  const film = await page.locator('video').count();
  notes.push({ route, h1, plates, broken, film, errors });
}

await phone.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await phone.getByRole('button', { name: 'Open index' }).click();
const menu = await phone.locator('#folio-panel a').count();
const write = await phone.getByRole('link', { name: 'Write' }).count();
await phone.screenshot({ path: 'lab/frames/phone-menu.png' });

await page.goto('http://localhost:5173/work/cultural-roots', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'lab/frames/work-title-fixed.png' });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const cutTop = await page.evaluate(() => {
  const act = document.querySelector('.cut-act');
  act.scrollIntoView();
  return true;
});
await page.evaluate(() => window.scrollBy(0, 1100));
await page.waitForTimeout(250);
await page.screenshot({ path: 'lab/frames/home-cut-mid.png' });

console.log(JSON.stringify({ notes, menu, write, cutTop }, null, 2));
await browser.close();
