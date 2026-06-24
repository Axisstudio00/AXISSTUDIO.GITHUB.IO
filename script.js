/* ═══════════════════════════════════════════════
   BARBER FRATELLI — script.js
   3D Scroll Journey + Booking System
═══════════════════════════════════════════════ */

/* ─── UTILS ─── */
const $ = id => document.getElementById(id);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════
   3D JOURNEY ENGINE
══════════════════════════════════════════════ */
const canvas  = $('journeyCanvas');
const ctx     = canvas.getContext('2d');
const track   = $('scrollTrack');
const overlay = $('journeyOverlay');
const introEl = $('journeyIntro');
const phaseEl = $('phaseText');
const labelEl = $('sceneLabel');

/* Journey phases:
   0 = esterno negozio (intro)
   1 = ci avviciniamo all'ingresso
   2 = entriamo dalla porta
   3 = sediamo sulla sedia del barbiere
   4 = taglio in corso → fade out → contenuto
*/
const PHASES = [
  { label: '',                    text: '',                              sub: '' },
  { label: 'Esterno',             text: 'Il nostro negozio',            sub: 'Via Montenapoleone 12, Milano' },
  { label: 'Ingresso',            text: 'Entra nel mondo<br/><em>Fratelli</em>', sub: 'Dove ogni taglio è un capolavoro' },
  { label: 'La tua postazione',   text: 'La sedia ti aspetta',          sub: 'Rilassati — sei nelle mani giuste' },
  { label: 'Il taglio inizia',    text: '<em>L\'arte</em><br/>comincia', sub: 'Il maestro al lavoro' },
];

let W, H;
let scrollProgress = 0;   // 0…1 lungo l'intero track
let currentPhase = 0;
let lastPhase = -1;

/* ─── RESIZE ─── */
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  draw(scrollProgress);
}
window.addEventListener('resize', resize);

/* ─── SCROLL ─── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const trackH = track.offsetHeight;
    const scrolled = window.scrollY;
    scrollProgress = Math.min(scrolled / trackH, 1);
    updateJourney(scrollProgress);
    updateNavbar();
    updateProgressBar(scrolled);
    updateReveal();
    ticking = false;
  });
});

/* ─── PROGRESS BAR ─── */
function updateProgressBar(scrolled) {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = docH > 0 ? (scrolled / docH) * 100 : 0;
  const bar  = $('progressBar');
  bar.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', Math.round(pct));
}

/* ─── NAVBAR ─── */
function updateNavbar() {
  $('navbar').classList.toggle('scrolled', window.scrollY > 60);
}

/* ─── JOURNEY UPDATE ─── */
function updateJourney(p) {
  /* phase thresholds */
  const phase = p < 0.05 ? 0
              : p < 0.30 ? 1
              : p < 0.55 ? 2
              : p < 0.75 ? 3
              : p < 0.92 ? 4
              : 5;         /* 5 = journey completato */

  currentPhase = phase;

  /* Canvas sempre fisso finché journey attivo */
  if (phase < 5) {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'none';
  } else {
    overlay.style.opacity = '0';
  }

  /* Intro label: visibile solo fase 0 */
  const introVisible = p < 0.08;
  introEl.style.opacity = introVisible ? '1' : '0';
  introEl.style.transform = introVisible
    ? 'translateX(-50%) translateY(0)'
    : 'translateX(-50%) translateY(-20px)';

  /* Phase text */
  if (phase >= 1 && phase <= 4) {
    const data = PHASES[phase];
    phaseEl.innerHTML = `<h2>${data.text}</h2><p>${data.sub}</p>`;
    phaseEl.style.opacity = (p > 0.06 && p < 0.90) ? '1' : '0';
  } else {
    phaseEl.style.opacity = '0';
  }

  /* Scene label */
  if (phase >= 1 && phase <= 4) {
    labelEl.textContent = PHASES[phase].label;
    labelEl.classList.add('visible');
  } else {
    labelEl.classList.remove('visible');
  }

  draw(p);
}

/* ══════════════════════════════════════════════
   CANVAS DRAWING — 3D perspective scene
══════════════════════════════════════════════ */
function draw(p) {
  if (!W) return;
  ctx.clearRect(0, 0, W, H);

  /* Which scene sub-progress (0…1 within each phase) */
  const phase = currentPhase;

  if (phase === 0) {
    drawExteriorScene(0);
  } else if (phase === 1) {
    const t = (p - 0.05) / 0.25;
    drawExteriorScene(t);
  } else if (phase === 2) {
    const t = (p - 0.30) / 0.25;
    drawEntranceScene(t);
  } else if (phase === 3) {
    const t = (p - 0.55) / 0.20;
    drawInteriorScene(t);
  } else if (phase === 4) {
    const t = (p - 0.75) / 0.17;
    drawBarberChairScene(t);
  } else {
    /* fade out */
    const t = (p - 0.92) / 0.08;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - t * 2);
    drawBarberChairScene(1);
    ctx.restore();
  }
}

/* ── SCENE 1: Esterno (via con prospettiva) ── */
function drawExteriorScene(t) {
  const ease = easeInOut(t);

  /* Sky gradient */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#050403');
  sky.addColorStop(1, '#1C1917');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  /* Ground */
  ctx.fillStyle = '#141210';
  ctx.fillRect(0, H * 0.65, W, H * 0.35);

  /* Vanishing point: starts at center-ish, zooms in */
  const vpX = W * 0.5;
  const vpY = H * (0.42 - ease * 0.08);

  /* Road perspective */
  ctx.save();
  const roadGrad = ctx.createLinearGradient(0, vpY, 0, H);
  roadGrad.addColorStop(0, '#1a1612');
  roadGrad.addColorStop(1, '#0a0806');
  ctx.fillStyle = roadGrad;
  ctx.beginPath();
  ctx.moveTo(vpX - 40, vpY);
  ctx.lineTo(vpX + 40, vpY);
  ctx.lineTo(W * 0.75, H);
  ctx.lineTo(W * 0.25, H);
  ctx.closePath();
  ctx.fill();

  /* Road center line */
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 30]);
  ctx.beginPath();
  ctx.moveTo(vpX, vpY + 10);
  ctx.lineTo(vpX, H);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  /* Sidewalk left/right */
  drawSidewalkLines(ctx, vpX, vpY, ease);

  /* Building facades (left, right, center-back) */
  drawBuildings(ctx, vpX, vpY, ease, W, H);

  /* Shop facade in center — gets bigger as we zoom */
  const shopScale = 0.35 + ease * 0.25;
  drawShopFacade(ctx, vpX, vpY, shopScale, ease, W, H);

  /* Streetlamps */
  drawStreetlamp(ctx, W * 0.2 - ease * 60,  H * 0.60, 0.8);
  drawStreetlamp(ctx, W * 0.8 + ease * 60,  H * 0.60, 0.8);

  /* Stars (fade as we approach) */
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - ease * 2);
  drawStars(ctx, W, H);
  ctx.restore();

  /* Vignette */
  drawVignette(ctx, W, H, 0.7 + ease * 0.2);
}

/* ── SCENE 2: Ingresso — porta che si apre ── */
function drawEntranceScene(t) {
  const ease = easeInOut(t);

  /* Dark interior bg */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0a0806');
  bg.addColorStop(1, '#1C1917');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Door frame — fills the screen */
  const doorW = W * (0.4 + ease * 0.6);
  const doorH = H * (0.7 + ease * 0.35);
  const doorX = (W - doorW) / 2;
  const doorY = H - doorH;

  /* Warm interior light through door */
  const warmLight = ctx.createRadialGradient(W/2, H*0.5, 0, W/2, H*0.5, doorW * 0.6);
  warmLight.addColorStop(0, 'rgba(202,138,4,0.25)');
  warmLight.addColorStop(0.5, 'rgba(180,100,0,0.08)');
  warmLight.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warmLight;
  ctx.fillRect(0, 0, W, H);

  /* Door surround / arch */
  ctx.save();
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 3 + ease * 2;
  ctx.shadowColor = '#CA8A04';
  ctx.shadowBlur = 20;

  /* Arch top */
  ctx.beginPath();
  ctx.arc(W/2, doorY + 30, doorW * 0.5, Math.PI, 0, false);
  ctx.stroke();

  /* Door sides */
  ctx.beginPath();
  ctx.moveTo(doorX, doorY + 30);
  ctx.lineTo(doorX, H);
  ctx.moveTo(doorX + doorW, doorY + 30);
  ctx.lineTo(doorX + doorW, H);
  ctx.stroke();
  ctx.restore();

  /* Barbershop pole */
  const poleX = W/2 - doorW/2 - 30 + ease * 20;
  drawBarberPole(ctx, poleX, doorY - 20, H - doorY + 20, ease);

  /* Door handle */
  if (ease < 0.7) {
    ctx.save();
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#CA8A04';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(W/2 + doorW * 0.15, H * 0.65, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /* Interior glimpse — marble floor pattern */
  ctx.save();
  ctx.globalAlpha = Math.min(ease * 1.5, 1);
  const interiorGrad = ctx.createLinearGradient(W/2, H*0.5, W/2, H);
  interiorGrad.addColorStop(0, 'rgba(28,25,23,0.9)');
  interiorGrad.addColorStop(1, 'rgba(15,12,10,0.95)');
  ctx.fillStyle = interiorGrad;
  ctx.beginPath();
  ctx.rect(doorX + 4, doorY, doorW - 8, H);
  ctx.fill();

  /* Floor tiles visible through door */
  drawFloorTiles(ctx, W/2, H * 0.8, doorW * 0.8, ease);
  ctx.restore();

  drawVignette(ctx, W, H, 0.85 + ease * 0.1);
}

/* ── SCENE 3: Interno — ci avviciniamo alle sedie ── */
function drawInteriorScene(t) {
  const ease = easeInOut(t);

  /* Interior background */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0D0B09');
  bg.addColorStop(1, '#1C1917');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Marble floor */
  drawMarbleFloor(ctx, W, H, ease);

  /* Walls with wainscoting */
  drawInteriorWalls(ctx, W, H, ease);

  /* Mirror (back wall) */
  drawMirror(ctx, W * 0.5, H * 0.28, W * 0.4, H * 0.45, ease);

  /* Barber chairs — getting closer */
  const chairScale = 0.5 + ease * 0.5;
  const chairY     = H * (0.55 + ease * 0.05);

  drawBarberChair(ctx, W * 0.5, chairY, chairScale, ease);

  /* Ambient lights */
  drawCeilingLights(ctx, W, H, ease);

  /* Shelves with products */
  if (ease > 0.3) {
    ctx.save();
    ctx.globalAlpha = (ease - 0.3) / 0.7;
    drawProductShelf(ctx, W * 0.12, H * 0.45, ease);
    drawProductShelf(ctx, W * 0.82, H * 0.45, ease);
    ctx.restore();
  }

  drawVignette(ctx, W, H, 0.65 + ease * 0.2);
}

/* ── SCENE 4: Sedia — il taglio inizia ── */
function drawBarberChairScene(t) {
  const ease = easeInOut(t);

  /* Very close interior */
  ctx.fillStyle = '#0D0B09';
  ctx.fillRect(0, 0, W, H);

  drawMarbleFloor(ctx, W, H, 1);
  drawInteriorWalls(ctx, W, H, 1);

  /* Mirror takes up more space */
  drawMirror(ctx, W * 0.5, H * 0.25, W * 0.55, H * 0.5, 1);

  /* Big chair in foreground */
  const scale = 0.95 + ease * 0.15;
  drawBarberChair(ctx, W * 0.5, H * 0.62, scale, 1);

  /* Barber hands / scissors */
  if (ease > 0.4) {
    ctx.save();
    ctx.globalAlpha = (ease - 0.4) / 0.6;
    drawScissors(ctx, W * 0.62, H * 0.33, 0.8 + ease * 0.3);
    ctx.restore();
  }

  /* Warm ambiance */
  const warmAura = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.4, W*0.4);
  warmAura.addColorStop(0, 'rgba(202,138,4,0.06)');
  warmAura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warmAura;
  ctx.fillRect(0, 0, W, H);

  drawCeilingLights(ctx, W, H, 1);
  drawProductShelf(ctx, W * 0.06, H * 0.42, 1);
  drawProductShelf(ctx, W * 0.86, H * 0.42, 1);

  drawVignette(ctx, W, H, 0.75);
}

/* ══════════════════════════════════════════════
   DRAWING HELPERS
══════════════════════════════════════════════ */
function drawSidewalkLines(ctx, vpX, vpY, ease) {
  ctx.save();
  ctx.strokeStyle = 'rgba(100,80,40,0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const t2 = i / 8;
    const y = vpY + (H - vpY) * t2;
    const spreadL = (vpX - W*0.25) * t2;
    const spreadR = (W*0.75 - vpX) * t2;
    ctx.beginPath();
    ctx.moveTo(vpX - spreadL * 0.8, y);
    ctx.lineTo(W * 0.22, y + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vpX + spreadR * 0.8, y);
    ctx.lineTo(W * 0.78, y + 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBuildings(ctx, vpX, vpY, ease, W, H) {
  /* Left building */
  ctx.save();
  const lBuildX = W * 0.05;
  const lBuildW = W * 0.3 - ease * 30;
  const lBuildH = H * 0.45;
  const lGrad = ctx.createLinearGradient(lBuildX, 0, lBuildX + lBuildW, 0);
  lGrad.addColorStop(0, '#1a1612');
  lGrad.addColorStop(1, '#110e0c');
  ctx.fillStyle = lGrad;
  ctx.fillRect(lBuildX, H * 0.18, lBuildW, lBuildH);

  /* Windows left */
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const wx = lBuildX + 20 + c * 45;
      const wy = H * 0.22 + r * 50;
      const lit = (r + c) % 3 !== 0;
      ctx.fillStyle = lit ? 'rgba(202,138,4,0.35)' : 'rgba(30,25,20,0.8)';
      ctx.fillRect(wx, wy, 28, 36);
    }
  }

  /* Right building */
  const rBuildX = W * 0.65 + ease * 30;
  const rBuildW = W * 0.3;
  const rGrad = ctx.createLinearGradient(rBuildX, 0, rBuildX + rBuildW, 0);
  rGrad.addColorStop(0, '#110e0c');
  rGrad.addColorStop(1, '#1a1612');
  ctx.fillStyle = rGrad;
  ctx.fillRect(rBuildX, H * 0.15, rBuildW, H * 0.5);

  /* Windows right */
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      const wx = rBuildX + 20 + c * 55;
      const wy = H * 0.19 + r * 45;
      const lit = (r * 2 + c) % 4 !== 0;
      ctx.fillStyle = lit ? 'rgba(202,138,4,0.28)' : 'rgba(30,25,20,0.8)';
      ctx.fillRect(wx, wy, 32, 30);
    }
  }
  ctx.restore();
}

function drawShopFacade(ctx, vpX, vpY, scale, ease, W, H) {
  const sw = W * scale;
  const sh = H * scale * 0.9;
  const sx = vpX - sw / 2;
  const sy = H - sh - 10 + (1 - ease) * H * 0.05;

  ctx.save();

  /* Facade body */
  const facadeGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
  facadeGrad.addColorStop(0, '#2A2420');
  facadeGrad.addColorStop(1, '#1C1814');
  ctx.fillStyle = facadeGrad;
  ctx.fillRect(sx, sy, sw, sh);

  /* Sign band */
  ctx.fillStyle = '#0C0A08';
  ctx.fillRect(sx, sy, sw, sh * 0.22);

  /* Shop name on sign */
  ctx.fillStyle = '#CA8A04';
  ctx.shadowColor = '#CA8A04';
  ctx.shadowBlur = 12 * ease;
  ctx.font = `bold ${Math.max(10, sw * 0.08)}px 'Bodoni Moda', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BARBER FRATELLI', vpX, sy + sh * 0.11);
  ctx.shadowBlur = 0;

  /* Door */
  const dw = sw * 0.28;
  const dh = sh * 0.55;
  const dx = vpX - dw / 2;
  const dy = sy + sh - dh;
  ctx.fillStyle = '#0A0806';
  ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(dx, dy, dw, dh);

  /* Door arch */
  ctx.beginPath();
  ctx.arc(vpX, dy, dw * 0.5, Math.PI, 0);
  ctx.stroke();

  /* Door handle */
  ctx.beginPath();
  ctx.arc(dx + dw * 0.72, dy + dh * 0.55, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#CA8A04';
  ctx.fill();

  /* Windows left of door */
  const winW = sw * 0.22;
  const winH = sh * 0.38;
  const winY  = sy + sh * 0.3;

  [[sx + sw*0.06, winY], [sx + sw*0.71, winY]].forEach(([wx, wy]) => {
    const wGrad = ctx.createLinearGradient(wx, wy, wx+winW, wy+winH);
    wGrad.addColorStop(0, 'rgba(202,138,4,0.12)');
    wGrad.addColorStop(1, 'rgba(150,80,0,0.06)');
    ctx.fillStyle = wGrad;
    ctx.fillRect(wx, wy, winW, winH);
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 1;
    ctx.strokeRect(wx, wy, winW, winH);
    /* Cross bars */
    ctx.beginPath();
    ctx.moveTo(wx + winW/2, wy);
    ctx.lineTo(wx + winW/2, wy + winH);
    ctx.moveTo(wx, wy + winH/2);
    ctx.lineTo(wx + winW, wy + winH/2);
    ctx.stroke();
  });

  ctx.restore();
}

function drawBarberPole(ctx, x, y, h, progress) {
  ctx.save();
  /* Pole body */
  ctx.fillStyle = '#1C1917';
  ctx.fillRect(x - 8, y, 16, h);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 8, y, 16, h);

  /* Stripes */
  const stripeCount = 8;
  for (let i = 0; i < stripeCount; i++) {
    const t2 = i / stripeCount;
    const sy2 = y + h * t2;
    const color = i % 2 === 0 ? '#DC2626' : '#FFFFFF';
    ctx.fillStyle = color;
    ctx.fillRect(x - 7, sy2, 14, h / stripeCount * 0.85);
  }

  /* Cap */
  ctx.fillStyle = '#888';
  ctx.fillRect(x - 10, y - 8, 20, 8);
  ctx.fillRect(x - 6, y - 12, 12, 6);

  /* Glow when close */
  if (progress > 0.5) {
    ctx.shadowColor = '#DC2626';
    ctx.shadowBlur = 8 * (progress - 0.5) * 2;
    ctx.strokeStyle = 'rgba(220,38,38,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 8, y, 16, h);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawFloorTiles(ctx, cx, y, width, progress) {
  ctx.save();
  ctx.globalAlpha = Math.min(progress * 2, 0.6);
  const tileSize = 30;
  const cols = Math.ceil(width / tileSize);
  for (let c = -cols/2; c < cols/2; c++) {
    for (let r = 0; r < 4; r++) {
      const tx = cx + c * tileSize;
      const ty = y + r * (tileSize * 0.4);
      const isBlack = (c + r) % 2 === 0;
      ctx.fillStyle = isBlack ? '#0A0806' : '#1E1A16';
      ctx.fillRect(tx, ty, tileSize - 1, tileSize * 0.4 - 1);
    }
  }
  ctx.restore();
}

function drawMarbleFloor(ctx, W, H, ease) {
  ctx.save();
  const floorGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  floorGrad.addColorStop(0, '#1a1612');
  floorGrad.addColorStop(1, '#0d0b09');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);

  /* Tile pattern */
  ctx.globalAlpha = 0.5;
  const tW = W / 8;
  const tH = H * 0.05;
  for (let c = 0; c < 8; c++) {
    for (let r = 0; r < 5; r++) {
      if ((c + r) % 2 === 0) {
        ctx.fillStyle = '#151210';
        ctx.fillRect(c * tW, H * 0.6 + r * tH, tW - 1, tH - 1);
      }
    }
  }

  /* Reflection strip */
  ctx.globalAlpha = 0.15;
  const ref = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.75);
  ref.addColorStop(0, '#CA8A04');
  ref.addColorStop(1, 'transparent');
  ctx.fillStyle = ref;
  ctx.fillRect(W * 0.3, H * 0.6, W * 0.4, H * 0.15);
  ctx.restore();
}

function drawInteriorWalls(ctx, W, H, ease) {
  ctx.save();

  /* Left wall */
  const lwGrad = ctx.createLinearGradient(0, 0, W * 0.25, 0);
  lwGrad.addColorStop(0, '#1a1512');
  lwGrad.addColorStop(1, '#221e1a');
  ctx.fillStyle = lwGrad;
  ctx.fillRect(0, 0, W * 0.2, H * 0.65);

  /* Right wall */
  const rwGrad = ctx.createLinearGradient(W * 0.75, 0, W, 0);
  rwGrad.addColorStop(0, '#221e1a');
  rwGrad.addColorStop(1, '#1a1512');
  ctx.fillStyle = rwGrad;
  ctx.fillRect(W * 0.8, 0, W * 0.2, H * 0.65);

  /* Back wall */
  ctx.fillStyle = '#18140F';
  ctx.fillRect(W * 0.2, 0, W * 0.6, H * 0.65);

  /* Wainscoting */
  ctx.strokeStyle = '#CA8A04';
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  /* Horizontal rail */
  ctx.beginPath();
  ctx.moveTo(0, H * 0.45);
  ctx.lineTo(W, H * 0.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, H * 0.50);
  ctx.lineTo(W, H * 0.50);
  ctx.stroke();

  ctx.restore();
}

function drawMirror(ctx, cx, cy, mW, mH, ease) {
  ctx.save();
  const mx = cx - mW/2;
  const my = cy;

  /* Mirror frame */
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#CA8A04';
  ctx.shadowBlur = 8;
  ctx.strokeRect(mx, my, mW, mH);
  ctx.shadowBlur = 0;

  /* Mirror surface — reflection of interior */
  const mirrorGrad = ctx.createLinearGradient(mx, my, mx + mW, my + mH);
  mirrorGrad.addColorStop(0,   'rgba(30,25,20,0.9)');
  mirrorGrad.addColorStop(0.4, 'rgba(45,38,30,0.85)');
  mirrorGrad.addColorStop(1,   'rgba(20,16,12,0.95)');
  ctx.fillStyle = mirrorGrad;
  ctx.fillRect(mx, my, mW, mH);

  /* Mirror sheen */
  const sheen = ctx.createLinearGradient(mx, my, mx + mW * 0.3, my + mH);
  sheen.addColorStop(0,   'rgba(255,255,255,0.04)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.01)');
  sheen.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(mx, my, mW, mH);

  /* Inner frame detail */
  ctx.strokeStyle = 'rgba(202,138,4,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(mx + 8, my + 8, mW - 16, mH - 16);

  ctx.restore();
}

function drawBarberChair(ctx, cx, cy, scale, ease) {
  const s = scale;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);

  const W2 = 120, H2 = 160;

  /* Base / pedestal */
  ctx.fillStyle = '#2A2218';
  ctx.fillRect(-15, 60, 30, 40);
  ctx.fillStyle = '#3A3020';
  ctx.fillRect(-40, 95, 80, 8);

  /* Chrome base ring */
  ctx.beginPath();
  ctx.ellipse(0, 103, 45, 6, 0, 0, Math.PI * 2);
  const chromGrad = ctx.createLinearGradient(-45, 97, 45, 103);
  chromGrad.addColorStop(0, '#888');
  chromGrad.addColorStop(0.5, '#CCC');
  chromGrad.addColorStop(1, '#666');
  ctx.fillStyle = chromGrad;
  ctx.fill();

  /* Seat */
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.roundRect(-50, 15, 100, 45, 6);
  ctx.fill();
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  /* Seat cushion button */
  ctx.fillStyle = '#6B0000';
  ctx.beginPath();
  ctx.arc(0, 37, 4, 0, Math.PI * 2);
  ctx.fill();

  /* Back rest */
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.roundRect(-45, -70, 90, 88, 8);
  ctx.fill();
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  /* Headrest */
  ctx.fillStyle = '#7A0000';
  ctx.beginPath();
  ctx.roundRect(-25, -100, 50, 32, 6);
  ctx.fill();
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 1;
  ctx.stroke();

  /* Armrests */
  [-55, 55].forEach(ax => {
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.roundRect(ax > 0 ? ax - 10 : ax, -20, 10, 50, 4);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.roundRect(ax > 0 ? ax - 12 : ax - 2, 25, 14, 8, 3);
    ctx.fill();
  });

  /* Footrest */
  ctx.fillStyle = '#1A1610';
  ctx.beginPath();
  ctx.roundRect(-35, 55, 70, 10, 3);
  ctx.fill();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.stroke();

  /* Chrome pole */
  const poleGrad = ctx.createLinearGradient(-6, 0, 6, 0);
  poleGrad.addColorStop(0, '#555');
  poleGrad.addColorStop(0.5, '#CCC');
  poleGrad.addColorStop(1, '#444');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(-6, 55, 12, 50);

  /* Chair glow */
  ctx.shadowColor = 'rgba(139,0,0,0.3)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = 'transparent';
  ctx.beginPath();
  ctx.roundRect(-50, -100, 100, 200, 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

function drawScissors(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI * 0.15);
  ctx.scale(scale, scale);

  ctx.strokeStyle = '#CCC';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  /* Blade 1 */
  ctx.save();
  ctx.rotate(-0.2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-50, -70);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-55, -75, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  /* Blade 2 */
  ctx.save();
  ctx.rotate(0.2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(50, -70);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(55, -75, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  /* Pivot */
  ctx.fillStyle = '#CA8A04';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCeilingLights(ctx, W, H, ease) {
  [[W * 0.25, 0], [W * 0.5, 0], [W * 0.75, 0]].forEach(([lx, ly]) => {
    ctx.save();
    const light = ctx.createRadialGradient(lx, 60, 0, lx, 60, 180);
    light.addColorStop(0,   'rgba(255, 220, 150, 0.18)');
    light.addColorStop(0.4, 'rgba(200, 150, 50, 0.08)');
    light.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, W, H * 0.5);

    /* Fixture */
    ctx.fillStyle = '#333';
    ctx.fillRect(lx - 15, ly, 30, 20);
    ctx.fillStyle = 'rgba(255,220,150,0.7)';
    ctx.beginPath();
    ctx.ellipse(lx, ly + 20, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawProductShelf(ctx, x, y, ease) {
  ctx.save();
  ctx.translate(x, y);

  /* Shelf board */
  ctx.fillStyle = '#2A2218';
  ctx.fillRect(-30, 0, 60, 8);
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(-30, 0, 60, 8);

  /* Products (bottles/jars) */
  const products = [
    { x: -20, h: 40, color: '#1a1a2e', cap: '#CA8A04' },
    { x: -5,  h: 30, color: '#2d1b00', cap: '#888' },
    { x: 10,  h: 45, color: '#0a1628', cap: '#CA8A04' },
  ];
  products.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 6, -p.h, 12, p.h);
    ctx.fillStyle = p.cap;
    ctx.fillRect(p.x - 5, -p.h - 4, 10, 5);
  });

  ctx.restore();
}

function drawStreetlamp(ctx, x, y, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;

  /* Pole */
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 120);
  ctx.lineTo(x + 25, y - 135);
  ctx.stroke();

  /* Lamp head */
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.ellipse(x + 25, y - 138, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Light glow */
  const glow = ctx.createRadialGradient(x + 25, y - 138, 0, x + 25, y - 138, 60);
  glow.addColorStop(0, 'rgba(255,200,100,0.25)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 25, y - 138, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStars(ctx, W, H) {
  /* Deterministic pseudo-random stars */
  for (let i = 0; i < 80; i++) {
    const x = ((i * 137.5 + 23) % 1) * W;
    const y = ((i * 97.3 + 11) % 0.42) * H;
    const r = 0.5 + (i % 3) * 0.3;
    const a = 0.3 + (i % 5) * 0.14;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(
      ((i * 137.508) % W),
      ((i * 97.312) % (H * 0.4)),
      r, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
}

function drawVignette(ctx, W, H, strength) {
  const vg = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.9);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

/* ─── EASING ─── */
function easeInOut(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/* ─── SCROLL REVEAL ─── */
function updateReveal() {
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      el.classList.add('in-view');
    }
  });
}

/* ══════════════════════════════════════════════
   BOOKING SYSTEM
══════════════════════════════════════════════ */
let currentStep = 1;
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                   'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30',
               '12:00','14:00','14:30','15:00','15:30','16:00',
               '16:30','17:00','17:30','18:00','18:30','19:00'];

/* Randomly unavailable slots for demo */
const UNAVAILABLE = new Set(['09:30','11:00','15:00','17:30']);

function renderCalendar() {
  const first = new Date(calYear, calMonth, 1);
  const days  = new Date(calYear, calMonth + 1, 0).getDate();
  let startDay = first.getDay(); // 0=Sun
  startDay = startDay === 0 ? 6 : startDay - 1; // Mon=0

  $('calMonth').textContent = `${MONTHS_IT[calMonth]} ${calYear}`;

  const grid = $('calGrid');
  grid.innerHTML = '';

  const today = new Date();
  today.setHours(0,0,0,0);

  /* Empty cells */
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    empty.setAttribute('aria-hidden', 'true');
    grid.appendChild(empty);
  }

  for (let d = 1; d <= days; d++) {
    const date = new Date(calYear, calMonth, d);
    const isSun = date.getDay() === 0;
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isSelected = $('selectedDate').value === dateStr;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day';
    btn.textContent = d;
    btn.setAttribute('role', 'gridcell');
    btn.setAttribute('aria-label', `${d} ${MONTHS_IT[calMonth]} ${calYear}`);

    if (isPast || isSun) {
      btn.disabled = true;
      btn.classList.add('past');
      btn.setAttribute('aria-disabled', 'true');
    } else {
      if (isToday) btn.classList.add('today');
      if (isSelected) btn.classList.add('selected');
      btn.addEventListener('click', () => selectDate(dateStr, btn));
    }
    grid.appendChild(btn);
  }
}

function selectDate(dateStr, btn) {
  $('selectedDate').value = dateStr;
  document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
  renderTimeSlots();
}

function renderTimeSlots() {
  const grid = $('timeGrid');
  grid.innerHTML = '';
  TIMES.forEach(t => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot';
    btn.textContent = t;
    btn.setAttribute('aria-label', `Orario ${t}`);
    if (UNAVAILABLE.has(t)) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    } else {
      btn.addEventListener('click', () => selectTime(t, btn));
    }
    grid.appendChild(btn);
  });
}

function selectTime(time, btn) {
  $('selectedTime').value = time;
  document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
}

/* Calendar navigation */
$('calPrev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
$('calNext').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

/* Step navigation */
function bookingNext(fromStep) {
  if (!validateStep(fromStep)) return;
  showStep(fromStep + 1);
  if (fromStep + 1 === 3) renderTimeSlots();
  if (fromStep + 1 === 4) updateSummary();
}

function bookingBack(fromStep) {
  showStep(fromStep - 1);
}

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  $(`step${n}`).classList.add('active');
  currentStep = n;
  updateStepDots(n);
}

function updateStepDots(n) {
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i < n);
  });
}

function validateStep(step) {
  if (step === 1) {
    const svc = document.querySelector('input[name="service"]:checked');
    if (!svc) { alert('Seleziona un servizio per continuare.'); return false; }
  }
  if (step === 2) {
    if (!$('barber').value) { alert('Seleziona un barbiere.'); return false; }
    if (!$('selectedDate').value) { alert('Seleziona una data.'); return false; }
  }
  if (step === 3) {
    if (!$('selectedTime').value) { alert('Seleziona un orario.'); return false; }
  }
  return true;
}

function updateSummary() {
  const svc = document.querySelector('input[name="service"]:checked');
  const label = svc ? svc.getAttribute('data-label') : '';
  const price = svc ? svc.getAttribute('data-price') : '';
  const barber = $('barber').value;
  const date   = $('selectedDate').value;
  const time   = $('selectedTime').value;

  const parts = date.split('-');
  const dateFormatted = parts.length === 3
    ? `${parseInt(parts[2])} ${MONTHS_IT[parseInt(parts[1])-1]} ${parts[0]}`
    : date;

  $('bookingSummary').innerHTML = `
    <strong>Riepilogo prenotazione:</strong><br/>
    Servizio: <strong>${label}</strong> — ${price}<br/>
    Barbiere: <strong>${barber}</strong><br/>
    Data: <strong>${dateFormatted}</strong> alle <strong>${time}</strong>
  `;
}

/* Form submit */
$('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const fname = $('fname').value.trim();
  const lname = $('lname').value.trim();
  const phone = $('phone').value.trim();
  if (!fname || !lname || !phone) {
    alert('Compila i campi obbligatori: nome, cognome e telefono.');
    return;
  }

  const svc    = document.querySelector('input[name="service"]:checked');
  const label  = svc ? svc.getAttribute('data-label') : '';
  const barber = $('barber').value;
  const date   = $('selectedDate').value;
  const time   = $('selectedTime').value;
  const parts  = date.split('-');
  const dateFmt = parts.length === 3
    ? `${parseInt(parts[2])} ${MONTHS_IT[parseInt(parts[1])-1]} ${parts[0]}`
    : date;

  $('confirmText').innerHTML =
    `Ciao <strong>${fname}</strong>! La tua prenotazione per <strong>${label}</strong> ` +
    `con <strong>${barber}</strong> il <strong>${dateFmt}</strong> alle <strong>${time}</strong> ` +
    `è confermata. Ti contatteremo al <strong>${phone}</strong> per conferma.`;

  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  $('stepConfirm').classList.add('active');
  updateStepDots(5);
});

function resetBooking() {
  $('bookingForm').reset();
  $('selectedDate').value = '';
  $('selectedTime').value = '';
  showStep(1);
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
function init() {
  resize();
  renderCalendar();
  renderTimeSlots();
  updateReveal();

  /* Initial draw */
  draw(0);

  /* Reduced motion: skip journey */
  if (prefersReducedMotion) {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }
}

window.addEventListener('load', init);
