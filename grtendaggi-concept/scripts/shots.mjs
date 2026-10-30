// Screenshot di verifica: node scripts/shots.mjs <url-path> <outdir> [desktop|mobile] [scrollStops...]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [, , path = '/', out = 'shots', mode = 'desktop', ...stops] = process.argv;
const base = process.env.BASE ?? 'http://localhost:4173';
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base + path, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '[role=region][aria-label="Informativa cookie"]{display:none!important}' }).catch(() => {});
const fs = await import('node:fs');
fs.mkdirSync(out, { recursive: true });
const list = stops.length ? stops.map(Number) : [0];
for (const s of list) {
  await page.evaluate((y) => window.scrollTo(0, y * window.innerHeight), s);
  await page.waitForTimeout(900);
  const f = `${out}/${mode}-${String(s).replace('.', '_')}.png`;
  await page.screenshot({ path: f });
  console.log(f);
}
const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log('overflow-x:', ow, 'height(vh):', await page.evaluate(() => (document.documentElement.scrollHeight / innerHeight).toFixed(1)));
console.log('errors:', errors);
await browser.close();
