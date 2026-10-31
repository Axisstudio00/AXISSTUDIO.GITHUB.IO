// Generates responsive AVIF/WebP variants from assets/originals into public/images
// and writes src/data/images.generated.json (dimensions, widths, blur placeholder).
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDirs = [path.join(root, "assets/originals"), path.join(root, "assets/derived")];
const outDir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/data/images.generated.json");
const TARGET_WIDTHS = [480, 768, 1080, 1440, 1920];

await mkdir(outDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

const files = [];
for (const dir of srcDirs) {
  const names = await readdir(dir).catch(() => []);
  for (const f of names.filter((n) => /\.(jpe?g|png)$/i.test(n)).sort()) files.push(path.join(dir, f));
}
const manifest = {};

for (const input of files) {
  const slug = path.basename(input).replace(/^\d+-/, "").replace(/\.(jpe?g|png)$/i, "");
  const meta = await sharp(input).metadata();
  const widths = [...new Set([...TARGET_WIDTHS.filter((w) => w < meta.width), meta.width])];

  for (const w of widths) {
    const base = path.join(outDir, `${slug}-${w}`);
    const exists = await stat(`${base}.avif`).then(() => true, () => false);
    if (exists && !process.env.FORCE) continue;
    const resized = sharp(input).resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 5 }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 74, effort: 5 }).toFile(`${base}.webp`);
  }

  const blur = await sharp(input).resize(24).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(input).stats();
  manifest[slug] = {
    width: meta.width,
    height: meta.height,
    widths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
    color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
  };
  console.log(`✓ ${slug} (${meta.width}×${meta.height}) → ${widths.join(", ")}`);
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Manifest: ${path.relative(root, manifestPath)}`);
