import { chromium } from 'playwright-core';
import fs from 'node:fs';

const chrome = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

const routes = ['/', '/work/cultural-roots', '/work/rajshahi', '/about'];
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function walk(width, height, reduced, label) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const notes = [];
  for (const route of routes) {
    const errors = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
    const h1 = await page.locator('h1').innerText();
    const write = await page.getByRole('link', { name: 'Write' }).count();
    const heightPx = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55));
    await page.waitForTimeout(400);
    const cut = await page.evaluate(() => {
      const node = document.querySelector('.cut');
      if (!node) return null;
      return getComputedStyle(node).getPropertyValue('--cut');
    });
    const shot = `lab/${label}-${route.replaceAll('/', '_') || 'home'}.png`;
    await page.screenshot({ path: shot, fullPage: false });
    notes.push({ route, h1: h1.replace(/\s+/g, ' '), write, heightPx, cut, errors });
  }
  await page.close();
  return notes;
}

fs.mkdirSync('lab', { recursive: true });
const desktop = await walk(1440, 900, false, 'desk');
const mobile = await walk(390, 844, false, 'phone');
const reduced = await walk(1440, 900, true, 'still');
console.log(JSON.stringify({ desktop, mobile, reduced }, null, 2));
await browser.close();
