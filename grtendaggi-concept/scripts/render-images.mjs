// Genera le illustrazioni segnaposto (scripts/scenes.js) come WebP responsive.
// Uso: npm run images  — richiede Playwright con Chromium installato.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public/images/placeholder');
const widths = [640, 1024, 1600, 2400];
const W = 2400, H = 1600;

await mkdir(out, { recursive: true });
const sceneSrc = await readFile(path.join(root, 'scripts/scenes.js'), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ content: sceneSrc });

const names = await page.evaluate(() => Object.keys(window.SCENES));
const only = process.argv.slice(2);
for (const name of names) {
  if (only.length && !only.includes(name)) continue;
  const dataUrl = await page.evaluate(({ name, W, H }) => {
    const c = document.getElementById('c');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, W, H);
    window.SCENES[name](ctx, W, H);
    return c.toDataURL('image/png');
  }, { name, W, H });
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  for (const w of widths) {
    await sharp(png).resize(w).webp({ quality: 78 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  if (name === 'hero') {
    await sharp(png).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(path.join(root, 'public/og-image.jpg'));
  }
  console.log('✓', name);
}
await browser.close();
await writeFile(path.join(out, 'README.txt'),
  'Illustrazioni SEGNAPOSTO generate da scripts/scenes.js.\nNon sono fotografie di lavori reali: sostituirle con le foto originali del cliente.\n');
