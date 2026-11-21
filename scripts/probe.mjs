import { chromium } from 'playwright-core';
import fs from 'node:fs';

const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const data = await page.evaluate(async () => {
  const stage = document.querySelector('.cut-stage');
  const act = stage?.closest('[data-sc-act]');
  const cut = document.querySelector('.cut');
  const before = {
    actTop: act?.getBoundingClientRect().top,
    stageTop: stage?.getBoundingClientRect().top,
    actH: act?.offsetHeight,
    stageH: stage?.offsetHeight,
    cut: getComputedStyle(cut).getPropertyValue('--cut'),
    transform: getComputedStyle(cut).transform,
  };
  act.scrollIntoView();
  await new Promise((r) => setTimeout(r, 300));
  window.scrollBy(0, 900);
  await new Promise((r) => setTimeout(r, 300));
  const after = {
    scrollY: window.scrollY,
    actTop: act.getBoundingClientRect().top,
    stageTop: stage.getBoundingClientRect().top,
    cut: getComputedStyle(cut).getPropertyValue('--cut'),
    transform: getComputedStyle(cut).transform,
    dash: getComputedStyle(cut.querySelector('.cut-path')).strokeDashoffset,
  };
  const rail = document.querySelector('.index-rail');
  return { before, after, railOverflow: rail.scrollWidth - innerWidth, pinned: !!document.querySelector('.sc-act--pinned') };
});
console.log(JSON.stringify(data, null, 2));
await page.screenshot({ path: 'lab/probe-cut.png' });
await browser.close();
if (!fs.existsSync(chrome)) process.exit(1);
