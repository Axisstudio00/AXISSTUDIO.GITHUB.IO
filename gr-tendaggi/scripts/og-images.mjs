// 1200×630 Open Graph crops from the originals.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = path.join(root, "assets/originals");
const out = path.join(root, "public/og");
await mkdir(out, { recursive: true });
for (const f of (await readdir(src)).filter((f) => f.endsWith(".jpg"))) {
  const slug = f.replace(/^\d+-/, "").replace(/\.jpg$/, "");
  await sharp(path.join(src, f)).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(out, `${slug}.jpg`));
}
console.log("OG images written to public/og");
