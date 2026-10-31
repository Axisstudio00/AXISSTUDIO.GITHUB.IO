// Builds assets derived from the originals (which stay untouched) into assets/derived:
// - curtain textures for the homepage intro, cropped from real sheer curtains in the photos;
// - two extra states of the bedroom (image 10) for the "Quanta luce?" simulator. Same photo, same
//   geometry: only the window area and the light it lets in change. The fabrics are taken from the
//   same room (its opaque drape and its sheer), so colour and lighting stay consistent.
// Run `npm run images` afterwards to produce the responsive AVIF/WebP files.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const orig = (f) => path.join(root, "assets/originals", f);
const out = (f) => path.join(root, "assets/derived", f);
await mkdir(path.join(root, "assets/derived"), { recursive: true });

// ---------------------------------------------------------------- curtain textures
await sharp(orig("11-living-velo-colline.jpg"))
  .extract({ left: 560, top: 60, width: 470, height: 740 })
  .jpeg({ quality: 88 })
  .toFile(out("tenda-intro-velo.jpg"));
await sharp(orig("01-living-velo-controluce.jpg"))
  .extract({ left: 792, top: 0, width: 330, height: 1120 })
  .jpeg({ quality: 88 })
  .toFile(out("tenda-intro-velo-stretto.jpg"));

// ---------------------------------------------------------------- bedroom states
const SRC = orig("10-camera-velo-oscurante.jpg");
const W = 1122;
const H = 1402;
// The glazed opening: from the sheer's left edge to the frame's right edge, down to the sill.
const WIN = { x: 392, y: 0, w: W - 392, h: 1005 };
// Visible part of the opening, traced so the bed, the throw and the plant in front of it are never covered.
const OPENING = [
  [392, -40], [1162, -40], [1162, 765], [1030, 772], [1012, 820], [1040, 885], [1162, 885],
  [1162, 928], [1076, 930], [1072, 958], [996, 962], [992, 1003],
  [700, 1003], [695, 870], [610, 858], [500, 850], [392, 846],
];

const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);

/** Soft-edged window mask with the given opacity (edges blurred so light seeps round the fabric). */
const windowMask = (opacity, blur = 6) =>
  svg(
    `<defs><filter id="b" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
      `<polygon points="${OPENING.map((p) => p.join(",")).join(" ")}" fill="#fff" fill-opacity="${opacity}" filter="url(#b)"/>`,
  );

/** Fabric cut from the same photo, laid across the window opening (tiled and alternately mirrored, or stretched as one panel). */
async function fabricOverWindow(crop, { brightness = 1, saturation = 1, stretch = false } = {}) {
  const tileH = WIN.h;
  const tileW = stretch ? WIN.w : Math.round((crop.width * tileH) / crop.height);
  const tile = await sharp(SRC).extract(crop).resize(tileW, tileH, { fit: "fill" }).modulate({ brightness, saturation }).png().toBuffer();
  const flopped = await sharp(tile).flop().png().toBuffer();
  const tiles = [];
  for (let x = WIN.x, i = 0; x < W; x += tileW, i++) tiles.push({ input: i % 2 ? flopped : tile, left: x, top: WIN.y });
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(tiles)
    .png()
    .toBuffer();
}

const masked = async (layer, opacity, blur) =>
  sharp(layer).composite([{ input: windowMask(opacity, blur), blend: "dest-in" }]).png().toBuffer();

// FILTRANTE — a second, denser sheer over the whole opening: the view is softened, the room stays bright.
{
  const sheer = await fabricOverWindow({ left: 405, top: 0, width: 380, height: 835 }, { brightness: 1.02, saturation: 0.9 });
  const fabric = await masked(sheer, 0.72, 10);
  const haze = svg(
    `<defs><filter id="b"><feGaussianBlur stdDeviation="30"/></filter></defs>` +
      `<polygon points="${OPENING.map((p) => p.join(",")).join(" ")}" fill="#f6e9d6" fill-opacity="0.16" filter="url(#b)"/>`,
  );
  // Direct sun is diffused rather than removed: highlights on floor and bed soften a little.
  const falloff = svg(
    `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#f4f0ea"/><stop offset="1" stop-color="#e2dbd0"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>`,
  );
  await sharp(SRC)
    .composite([
      { input: falloff, blend: "multiply" },
      { input: fabric, blend: "over" },
      { input: haze, blend: "screen" },
    ])
    .jpeg({ quality: 90 })
    .toFile(out("camera-filtrante.jpg"));
}

// OSCURANTE — the room's own opaque drape drawn across the opening: the view disappears, the light
// that came through the window drops sharply, but the room keeps its lamp and some ambient light.
{
  const drape = await fabricOverWindow(
    { left: 200, top: 90, width: 192, height: 460 },
    { brightness: 0.8, saturation: 0.95, stretch: true },
  );
  const fabric = await masked(drape, 0.95, 5);
  const roomDim = svg(
    `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#a59d91"/><stop offset="0.55" stop-color="#8d8478"/><stop offset="1" stop-color="#7b7266"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>`,
  );
  // A little light still seeps in at the top and along the edges of the fabric.
  const seep = svg(
    `<defs><filter id="b"><feGaussianBlur stdDeviation="14"/></filter></defs>` +
      `<rect x="${WIN.x}" y="0" width="${WIN.w}" height="18" fill="#ffe7c4" fill-opacity="0.55" filter="url(#b)"/>` +
      `<rect x="${WIN.x - 6}" y="0" width="12" height="${WIN.h}" fill="#ffe7c4" fill-opacity="0.35" filter="url(#b)"/>`,
  );
  // The pendant lamp keeps burning and warms the wall around it.
  const lampMask = svg(
    `<defs><radialGradient id="r" cx="90" cy="440" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.45" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#r)"/>`,
  );
  const lamp = await sharp(SRC).composite([{ input: lampMask, blend: "dest-in" }]).png().toBuffer();
  const glow = svg(
    `<defs><radialGradient id="r" cx="95" cy="470" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.32"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#r)"/>`,
  );
  // Without direct sun the bright patches on the floor in front of the window fade out.
  const floorShade = svg(
    `<defs><filter id="b"><feGaussianBlur stdDeviation="40"/></filter></defs>` +
      `<polygon points="560,1000 1122,990 1122,1402 380,1402" fill="#9d9488" filter="url(#b)"/>`,
  );
  await sharp(SRC)
    .composite([
      { input: roomDim, blend: "multiply" },
      { input: floorShade, blend: "multiply" },
      { input: fabric, blend: "over" },
      { input: seep, blend: "screen" },
      { input: lamp, blend: "over" },
      { input: glow, blend: "screen" },
    ])
    .jpeg({ quality: 90 })
    .toFile(out("camera-oscurante.jpg"));
}

console.log("Derived assets written to assets/derived");
