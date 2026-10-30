/*
 * Illustrazioni segnaposto disegnate in canvas.
 * NON sono fotografie di lavori GRtendaggi Concept: servono solo a dare al
 * layout la giusta densità finché il cliente non fornisce le foto originali.
 * Ogni scena è deterministica (seed fisso) per rendering ripetibili.
 */
(function () {
  const C = {
    bone: '#e5e1d8', paper: '#efebe3', sand: '#cdbfa8', linen: '#e9e2d4',
    taupe: '#a39383', choc: '#2a1d17', cocoa: '#5b4334', green: '#456f3a',
    greenDark: '#2f4d28', ochre: '#c98f52', ochreLight: '#dcae76',
    brick: '#a65a3a', sky: '#dfe5e6', skyWarm: '#efe9df', oak: '#b08a62',
    steel: '#6c6a66', anthracite: '#3a3836',
  };

  let seed = 1;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function setSeed(s) { seed = s; }

  function lin(ctx, x0, y0, x1, y1, stops) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }
  function rad(ctx, x, y, r0, r1, stops) {
    const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }
  function blur(ctx, px, fn) { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); }
  function rect(ctx, x, y, w, h, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
  function poly(ctx, pts, fill) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function shade(hex, k) {
    const [r, g, b] = hexToRgb(hex);
    const f = (v) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  // Grana fotografica + leggera vignettatura: unifica tutte le scene.
  function finish(ctx, w, h, { grain = 9, vig = 0.22 } = {}) {
    ctx.fillStyle = rad(ctx, w / 2, h / 2, Math.min(w, h) * 0.35, Math.max(w, h) * 0.75,
      [[0, 'rgba(42,29,23,0)'], [1, `rgba(42,29,23,${vig})`]]);
    ctx.fillRect(0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h); const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rand() - 0.5) * grain;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(id, 0, 0);
  }

  // Intonaco: macchie morbide a bassa opacità.
  function plaster(ctx, x, y, w, h, base, amt = 0.05, blobs = 60) {
    rect(ctx, x, y, w, h, base);
    blur(ctx, Math.max(w, h) * 0.02, () => {
      for (let i = 0; i < blobs; i++) {
        const bx = x + rand() * w, by = y + rand() * h, r = (0.05 + rand() * 0.15) * Math.max(w, h);
        ctx.fillStyle = rand() > 0.5 ? `rgba(255,255,255,${amt})` : `rgba(60,40,30,${amt * 0.7})`;
        ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  // Tessuto a pieghe verticali. Ombreggiatura per colonna da somma di sinusoidi.
  function drape(ctx, x, y, w, h, opt) {
    const { color, folds = 8, alpha = 1, light = 0.35, dark = 0.3, hem = 10, phase = rand() * 6, lightDir = 1 } = opt;
    const step = 2;
    const f1 = (folds * Math.PI * 2) / w, f2 = f1 * 2.3;
    ctx.save(); ctx.globalAlpha = alpha;
    for (let i = 0; i < w; i += step) {
      const s = Math.sin(i * f1 + phase) * 0.7 + Math.sin(i * f2 + phase * 1.7) * 0.3;
      const ds = Math.cos(i * f1 + phase) * lightDir;
      const k = s * 0.5 * light + ds * 0.15 - (s < -0.4 ? dark * (-s - 0.4) : 0);
      const hemY = Math.sin(i * f1 + phase) * hem;
      ctx.fillStyle = shade(color, k);
      ctx.fillRect(x + i, y, step + 0.5, h + hemY);
    }
    ctx.restore();
  }

  function floorPlanks(ctx, x, y, w, h, base) {
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, shade(base, -0.15)], [1, shade(base, 0.05)]]);
    ctx.fillRect(x, y, w, h);
    let py = y;
    let gap = 6;
    while (py < y + h) {
      ctx.fillStyle = 'rgba(42,29,23,0.10)'; ctx.fillRect(x, py, w, 1.5);
      py += gap; gap *= 1.28;
    }
    ctx.save(); ctx.globalAlpha = 0.06;
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = rand() > 0.5 ? '#fff' : '#3a2516';
      ctx.fillRect(x + rand() * w, y + rand() * h, 40 + rand() * 200, 1);
    }
    ctx.restore();
  }

  // Bologna sullo sfondo: portici, tetti in coppi, colli. Sfocato.
  function bolognaView(ctx, x, y, w, h, { hills = true, porticoes = true } = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    rect(ctx, x, y, w, h, lin(ctx, 0, y, 0, y + h, [[0, '#d7e0e3'], [0.6, '#efe8dc'], [1, '#f3ede2']]));
    if (hills) {
      blur(ctx, 6, () => {
        ctx.fillStyle = '#9aa58c';
        ctx.beginPath(); ctx.moveTo(x, y + h * 0.55);
        for (let i = 0; i <= 20; i++) ctx.lineTo(x + (w * i) / 20, y + h * (0.5 - Math.sin(i * 0.5) * 0.05 - rand() * 0.03));
        ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.fill();
      });
    }
    if (porticoes) {
      blur(ctx, 4, () => {
        const by = y + h * 0.6;
        rect(ctx, x, by, w, h * 0.4, C.ochre);
        rect(ctx, x, by - h * 0.06, w, h * 0.06, C.brick);
        const n = 6, aw = w / n;
        for (let i = 0; i < n; i++) {
          const ax = x + i * aw + aw * 0.15, ay = by + h * 0.14, ww = aw * 0.7;
          ctx.fillStyle = '#7d5638';
          ctx.beginPath(); ctx.moveTo(ax, y + h);
          ctx.lineTo(ax, ay + ww / 2); ctx.arc(ax + ww / 2, ay + ww / 2, ww / 2, Math.PI, 0);
          ctx.lineTo(ax + ww, y + h); ctx.fill();
        }
      });
    }
    ctx.restore();
  }

  function sunPool(ctx, pts, alpha, blurPx) {
    blur(ctx, blurPx, () => { poly(ctx, pts, `rgba(255,246,228,${alpha})`); });
  }

  const scenes = {};

  // Hero: stanza con finestra centrale e tende in lino.
  scenes.hero = (ctx, w, h) => {
    setSeed(11);
    const floorY = h * 0.78;
    plaster(ctx, 0, 0, w, floorY, C.bone, 0.04);
    ctx.fillStyle = rad(ctx, w * 0.5, h * 0.42, 0, w * 0.6, [[0, 'rgba(255,250,240,0.55)'], [1, 'rgba(255,250,240,0)']]);
    ctx.fillRect(0, 0, w, floorY);
    floorPlanks(ctx, 0, floorY, w, h - floorY, C.oak);
    rect(ctx, 0, floorY - 10, w, 10, shade(C.bone, -0.08));
    const wx = w * 0.36, wy = h * 0.12, ww = w * 0.28, wh = floorY - wy - h * 0.02;
    rect(ctx, wx - 18, wy - 18, ww + 36, wh + 18, shade(C.bone, -0.1));
    bolognaView(ctx, wx, wy, ww, wh);
    rect(ctx, wx + ww / 2 - 6, wy, 12, wh, '#d9d2c4');
    rect(ctx, wx, wy + wh * 0.62, ww, 10, '#d9d2c4');
    sunPool(ctx, [[wx, floorY], [wx + ww, floorY], [wx + ww * 1.55, h], [wx - ww * 0.55, h]], 0.55, 30);
    drape(ctx, wx - w * 0.07, wy - 40, w * 0.15, floorY - wy + 40, { color: C.linen, folds: 5, alpha: 0.82, light: 0.3, hem: 6 });
    drape(ctx, wx + ww - w * 0.06, wy - 40, w * 0.12, floorY - wy + 40, { color: C.linen, folds: 4, alpha: 0.78, light: 0.3, hem: 6 });
    drape(ctx, w * 0.02, wy - 40, w * 0.2, floorY - wy + 40, { color: C.sand, folds: 6, light: 0.45, dark: 0.35, hem: 4 });
    drape(ctx, w * 0.8, wy - 40, w * 0.18, floorY - wy + 40, { color: C.sand, folds: 5, light: 0.45, dark: 0.35, hem: 4, lightDir: -1 });
    rect(ctx, w * 0.01, wy - 52, w * 0.98, 8, C.anthracite);
    // poltrona e tavolino
    blur(ctx, 18, () => poly(ctx, [[w * 0.62, floorY + h * 0.17], [w * 0.86, floorY + h * 0.17], [w * 0.9, floorY + h * 0.2], [w * 0.6, floorY + h * 0.2]], 'rgba(42,29,23,0.35)'));
    ctx.fillStyle = C.taupe; roundRect(ctx, w * 0.64, floorY - h * 0.06, w * 0.2, h * 0.16, 40); ctx.fill();
    ctx.fillStyle = shade(C.taupe, -0.12); roundRect(ctx, w * 0.645, floorY - h * 0.16, w * 0.19, h * 0.14, 50); ctx.fill();
    ctx.fillStyle = shade(C.taupe, 0.12); roundRect(ctx, w * 0.655, floorY + h * 0.0, w * 0.17, h * 0.05, 24); ctx.fill();
    rect(ctx, w * 0.66, floorY + h * 0.1, 10, h * 0.08, C.choc); rect(ctx, w * 0.82, floorY + h * 0.1, 10, h * 0.08, C.choc);
    ctx.fillStyle = C.cocoa; ctx.beginPath(); ctx.ellipse(w * 0.2, floorY + h * 0.03, w * 0.06, h * 0.015, 0, 0, Math.PI * 2); ctx.fill();
    rect(ctx, w * 0.198, floorY + h * 0.03, 8, h * 0.12, C.choc);
    finish(ctx, w, h);
  };

  // Tende interne d'arredo: primo piano di tende in lino controluce.
  scenes.interni = (ctx, w, h) => {
    setSeed(21);
    rect(ctx, 0, 0, w, h, lin(ctx, 0, 0, w, 0, [[0, '#f6f1e6'], [0.5, '#fffaf0'], [1, '#efe7d8']]));
    blur(ctx, 40, () => { bolognaView(ctx, w * 0.1, h * 0.1, w * 0.8, h * 0.9, { hills: true }); });
    rect(ctx, 0, 0, w, h, 'rgba(255,250,240,0.35)');
    drape(ctx, -20, 0, w * 0.55, h, { color: C.linen, folds: 9, alpha: 0.86, light: 0.3, dark: 0.2, hem: 0 });
    drape(ctx, w * 0.42, 0, w * 0.6, h, { color: '#efe8da', folds: 10, alpha: 0.72, light: 0.25, dark: 0.15, hem: 0, lightDir: -1 });
    drape(ctx, w * 0.78, 0, w * 0.24, h, { color: C.sand, folds: 4, light: 0.45, dark: 0.4, hem: 0 });
    finish(ctx, w, h, { vig: 0.18 });
  };

  // Veneziane: ombre delle lamelle su parete.
  scenes.veneziane = (ctx, w, h) => {
    setSeed(31);
    plaster(ctx, 0, 0, w, h, shade(C.sand, -0.05), 0.05);
    ctx.save(); ctx.translate(w * 0.5, h * 0.5); ctx.rotate(-0.32); ctx.translate(-w, -h);
    blur(ctx, 6, () => {
      const band = 54;
      for (let y = 0; y < h * 2; y += band) {
        ctx.fillStyle = 'rgba(255,240,214,0.75)';
        ctx.fillRect(w * 0.45, y, w * 1.0, band * 0.52);
      }
    });
    ctx.restore();
    blur(ctx, 60, () => poly(ctx, [[0, 0], [w * 0.35, 0], [w * 0.15, h], [0, h]], 'rgba(42,29,23,0.25)'));
    // veneziana reale sul bordo destro
    const bx = w * 0.82;
    rect(ctx, bx - 10, 0, w - bx + 10, h, shade(C.sand, -0.25));
    for (let y = 0; y < h; y += 36) {
      rect(ctx, bx, y, w - bx, 22, lin(ctx, 0, y, 0, y + 22, [[0, '#f4efe6'], [1, '#bdb1a0']]));
    }
    rect(ctx, bx + 40, 0, 3, h, 'rgba(60,45,35,0.4)'); rect(ctx, w - 70, 0, 3, h, 'rgba(60,45,35,0.4)');
    finish(ctx, w, h);
  };

  // Tende da sole su facciata bolognese.
  scenes.esterni = (ctx, w, h) => {
    setSeed(41);
    rect(ctx, 0, 0, w, h * 0.16, lin(ctx, 0, 0, 0, h * 0.16, [[0, '#c9d6dc'], [1, '#e4e6e0']]));
    plaster(ctx, 0, h * 0.12, w, h * 0.88, C.ochre, 0.06);
    rect(ctx, 0, h * 0.12, w, h * 0.04, C.brick);
    const winY = h * 0.3;
    [0.12, 0.42, 0.72].forEach((fx, i) => {
      const x = w * fx, ww = w * 0.16, wh = h * 0.26;
      rect(ctx, x - 14, winY - 14, ww + 28, wh + 28, shade(C.ochre, 0.25));
      rect(ctx, x, winY, ww, wh, '#3b2e27');
      persiana(ctx, x - ww * 0.48, winY, ww * 0.46, wh, C.green);
      persiana(ctx, x + ww + ww * 0.02, winY, ww * 0.46, wh, C.green);
      if (i === 1) {
        blur(ctx, 22, () => poly(ctx, [[x - 60, winY - 30], [x + ww + 60, winY - 30], [x + ww + 140, winY + wh * 0.72], [x - 140, winY + wh * 0.72]], 'rgba(42,25,15,0.38)'));
      }
    });
    // tenda da sole a bracci
    const ax = w * 0.42 - 70, aw = w * 0.16 + 140, ay = winY - 40;
    poly(ctx, [[ax, ay], [ax + aw, ay], [ax + aw + 60, ay + h * 0.12], [ax - 60, ay + h * 0.12]], C.paper);
    for (let i = 0; i < 9; i++) {
      if (i % 2) continue;
      const t0 = i / 9, t1 = (i + 1) / 9;
      poly(ctx, [[ax + aw * t0, ay], [ax + aw * t1, ay], [ax - 60 + (aw + 120) * t1, ay + h * 0.12], [ax - 60 + (aw + 120) * t0, ay + h * 0.12]], C.green);
    }
    rect(ctx, ax - 60, ay + h * 0.12, aw + 120, h * 0.035, C.greenDark);
    rect(ctx, ax - 10, ay - 12, aw + 20, 14, C.anthracite);
    // portico
    const py = h * 0.68;
    rect(ctx, 0, py, w, h - py, shade(C.ochre, -0.08));
    const n = 5, aw2 = w / n;
    for (let i = 0; i < n; i++) {
      const x = i * aw2 + aw2 * 0.12, ww = aw2 * 0.76, top = py + h * 0.06;
      ctx.fillStyle = '#5e3f2b';
      ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x, top + ww / 2); ctx.arc(x + ww / 2, top + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(x + ww, h); ctx.fill();
    }
    finish(ctx, w, h);
  };

  function persiana(ctx, x, y, w, h, color) {
    rect(ctx, x, y, w, h, shade(color, -0.25));
    for (let yy = y + 10; yy < y + h - 10; yy += 16) {
      rect(ctx, x + 10, yy, w - 20, 11, lin(ctx, 0, yy, 0, yy + 11, [[0, shade(color, 0.18)], [1, shade(color, -0.2)]]));
    }
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  // Infissi e scuri: persiane verdi su parete ocra.
  scenes.chiusure = (ctx, w, h) => {
    setSeed(51);
    plaster(ctx, 0, 0, w, h, C.ochreLight, 0.07);
    const x = w * 0.36, y = h * 0.16, ww = w * 0.28, wh = h * 0.62;
    rect(ctx, x - 26, y - 26, ww + 52, wh + 26, shade(C.ochreLight, 0.3));
    rect(ctx, x - 40, y + wh, ww + 80, 26, shade(C.ochreLight, 0.4));
    rect(ctx, x, y, ww, wh, '#efe9dd');
    rect(ctx, x + ww * 0.06, y + wh * 0.05, ww * 0.88, wh * 0.9, '#cbd3d2');
    blur(ctx, 10, () => drape(ctx, x + ww * 0.06, y + wh * 0.05, ww * 0.4, wh * 0.9, { color: '#f4efe5', folds: 4, alpha: 0.85 }));
    rect(ctx, x + ww / 2 - 5, y, 10, wh, '#efe9dd');
    persiana(ctx, x + ww + 4, y, ww * 0.5, wh, C.green);
    ctx.save(); ctx.translate(x - 4, y); ctx.transform(-0.55, 0.06, 0, 1, 0, 0);
    persiana(ctx, 0, 0, ww * 0.5, wh, C.green); ctx.restore();
    blur(ctx, 26, () => poly(ctx, [[x + ww + 4, y + 20], [x + ww * 1.5 + 4, y + 20], [x + ww * 1.62, y + wh + 30], [x + ww + 30, y + wh + 30]], 'rgba(60,30,10,0.22)'));
    finish(ctx, w, h);
  };

  // Pergotende e bioclimatiche: lamelle viste dal basso.
  scenes.pergola = (ctx, w, h) => {
    setSeed(61);
    rect(ctx, 0, 0, w, h, lin(ctx, 0, 0, w, h, [[0, '#cfdde2'], [1, '#f2ede4']]));
    ctx.fillStyle = rad(ctx, w * 0.78, h * 0.2, 0, w * 0.35, [[0, 'rgba(255,248,230,0.95)'], [1, 'rgba(255,248,230,0)']]);
    ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(-0.42);
    for (let i = -16; i <= 16; i++) {
      const y = i * 120;
      rect(ctx, -w, y, w * 2, 64, lin(ctx, 0, y, 0, y + 64, [[0, '#eeeae3'], [0.45, '#b9b3aa'], [1, '#77726c']]));
      rect(ctx, -w, y + 64, w * 2, 6, 'rgba(40,35,30,0.4)');
    }
    rect(ctx, -w, -60, w * 2, 90, C.anthracite);
    ctx.restore();
    rect(ctx, 0, h * 0.86, w, h * 0.14, C.anthracite);
    finish(ctx, w, h);
  };

  // Tessuti / tappezzeria: drappo in primo piano.
  scenes.tessuti = (ctx, w, h) => {
    setSeed(71);
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(0.18); ctx.translate(-w * 0.7, -h * 0.8);
    drape(ctx, 0, 0, w * 1.4, h * 1.6, { color: C.sand, folds: 6, light: 0.5, dark: 0.45, hem: 0 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.07;
    for (let y = 0; y < h; y += 3) rect(ctx, 0, y, w, 1, '#2a1d17');
    for (let x = 0; x < w; x += 3) rect(ctx, x, 0, 1, h, '#ffffff');
    ctx.restore();
    finish(ctx, w, h, { vig: 0.32 });
  };

  // Campionario: mazzette di tessuto.
  scenes.campionario = (ctx, w, h) => {
    setSeed(81);
    plaster(ctx, 0, 0, w, h, shade(C.bone, -0.04), 0.04);
    const tones = [C.linen, C.sand, C.taupe, '#8c7a66', C.green, '#7d8b6c', C.cocoa, '#d8cbb3', C.ochreLight, C.anthracite, '#e7dfcf', '#b9a58a'];
    const n = tones.length;
    for (let i = 0; i < n; i++) {
      const x = w * 0.12 + i * (w * 0.065), y = h * 0.18 + Math.sin(i) * 12;
      blur(ctx, 14, () => rect(ctx, x + 18, y + 26, w * 0.12, h * 0.66, 'rgba(42,29,23,0.25)'));
      drape(ctx, x, y, w * 0.12, h * 0.64, { color: tones[i], folds: 1.4, light: 0.3, dark: 0.2, hem: 0, phase: i });
      rect(ctx, x, y, w * 0.12, h * 0.05, shade(tones[i], -0.15));
    }
    finish(ctx, w, h);
  };

  // Zanzariera: rete fine davanti a un giardino sfocato.
  scenes.zanzariere = (ctx, w, h) => {
    setSeed(91);
    rect(ctx, 0, 0, w, h, '#b9c3a6');
    blur(ctx, 40, () => {
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = ['#6f8a55', '#8fa36d', '#4f6b3e', '#c8d0ad', '#e8e6d2'][Math.floor(rand() * 5)];
        ctx.beginPath(); ctx.arc(rand() * w, rand() * h, 60 + rand() * 220, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.save(); ctx.globalAlpha = 0.22;
    for (let x = 0; x < w; x += 7) rect(ctx, x, 0, 1.4, h, '#2a2a28');
    for (let y = 0; y < h; y += 7) rect(ctx, 0, y, w, 1.4, '#2a2a28');
    ctx.restore();
    rect(ctx, 0, 0, w * 0.07, h, C.anthracite); rect(ctx, w * 0.93, 0, w * 0.07, h, C.anthracite);
    rect(ctx, 0, h * 0.9, w, h * 0.1, C.anthracite);
    finish(ctx, w, h);
  };

  // Tapparelle: avvolgibile a metà corsa.
  scenes.tapparelle = (ctx, w, h) => {
    setSeed(101);
    plaster(ctx, 0, 0, w, h, shade(C.bone, -0.02), 0.06);
    const x = w * 0.28, y = h * 0.1, ww = w * 0.44, wh = h * 0.78;
    rect(ctx, x - 22, y - 22, ww + 44, wh + 22, shade(C.bone, 0.3));
    bolognaView(ctx, x, y, ww, wh);
    const drop = wh * 0.55;
    for (let yy = y; yy < y + drop; yy += 30) rect(ctx, x, yy, ww, 28, lin(ctx, 0, yy, 0, yy + 28, [[0, '#e8e2d6'], [0.5, '#cfc6b6'], [1, '#a99f90']]));
    rect(ctx, x, y + drop, ww, 12, C.anthracite);
    blur(ctx, 26, () => poly(ctx, [[x, y + drop + 12], [x + ww, y + drop + 12], [x + ww, y + drop + 60], [x, y + drop + 60]], 'rgba(42,29,23,0.2)'));
    rect(ctx, x - 40, y + wh, ww + 80, 24, shade(C.bone, 0.4));
    finish(ctx, w, h);
  };

  // Tende a rullo in un interno.
  scenes.rullo = (ctx, w, h) => {
    setSeed(111);
    const floorY = h * 0.84;
    plaster(ctx, 0, 0, w, floorY, '#e9e4da', 0.04);
    floorPlanks(ctx, 0, floorY, w, h - floorY, '#c4a27c');
    const panes = [[0.1, 0.62], [0.38, 0.34], [0.66, 0.48]];
    panes.forEach(([fx, dr]) => {
      const x = w * fx, y = h * 0.1, ww = w * 0.24, wh = floorY - y - h * 0.04;
      rect(ctx, x - 12, y - 12, ww + 24, wh + 12, '#4a4643');
      bolognaView(ctx, x, y, ww, wh);
      ctx.save(); ctx.globalAlpha = 0.9;
      rect(ctx, x, y, ww, wh * dr, lin(ctx, x, 0, x + ww, 0, [[0, '#ece5d7'], [1, '#ddd3c1']]));
      ctx.restore();
      rect(ctx, x, y + wh * dr - 8, ww, 8, C.anthracite);
      rect(ctx, x - 12, y - 30, ww + 24, 20, '#3d3a37');
      sunPool(ctx, [[x, floorY], [x + ww, floorY], [x + ww * 1.4, h], [x - ww * 0.2, h]], 0.35 * (1 - dr), 24);
    });
    finish(ctx, w, h);
  };

  // Tende tecniche: ufficio con screen.
  scenes.tecniche = (ctx, w, h) => {
    setSeed(121);
    rect(ctx, 0, 0, w, h, '#d9dcdc');
    const cols = 5, cw = w / cols;
    for (let i = 0; i < cols; i++) {
      const x = i * cw;
      blur(ctx, 5, () => {
        rect(ctx, x, 0, cw, h, lin(ctx, 0, 0, 0, h, [[0, '#c3d1d8'], [1, '#e9e7e0']]));
        for (let b = 0; b < 4; b++) rect(ctx, x + rand() * cw, h * (0.35 + rand() * 0.2), 40 + rand() * 80, h, `rgba(120,130,135,${0.25 + rand() * 0.2})`);
      });
      const dr = [0.7, 0.45, 0.82, 0.3, 0.6][i];
      ctx.save(); ctx.globalAlpha = 0.8;
      rect(ctx, x, 0, cw, h * dr, '#56544f');
      ctx.globalAlpha = 0.12;
      for (let y = 0; y < h * dr; y += 4) rect(ctx, x, y, cw, 1, '#fff');
      ctx.restore();
      rect(ctx, x, h * dr - 10, cw, 10, '#2a2928');
      rect(ctx, x - 6, 0, 12, h, '#2f2f2e');
    }
    rect(ctx, 0, h * 0.9, w, h * 0.1, '#45433f');
    finish(ctx, w, h, { vig: 0.18 });
  };

  // Vetrate panoramiche sui colli.
  scenes.vetrate = (ctx, w, h) => {
    setSeed(131);
    bolognaView(ctx, 0, 0, w, h, { hills: true, porticoes: false });
    blur(ctx, 3, () => {
      ctx.fillStyle = '#7f8c6c';
      ctx.beginPath(); ctx.moveTo(0, h * 0.62);
      for (let i = 0; i <= 30; i++) ctx.lineTo((w * i) / 30, h * (0.6 - Math.sin(i * 0.4) * 0.04));
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
    });
    rect(ctx, 0, h * 0.78, w, h * 0.22, lin(ctx, 0, h * 0.78, 0, h, [[0, '#cdbfa8'], [1, '#a89780']]));
    const n = 6, pw = w / n;
    for (let i = 0; i < n; i++) {
      const x = i * pw;
      ctx.save(); ctx.globalAlpha = 0.16;
      poly(ctx, [[x + pw * 0.1, 0], [x + pw * 0.35, 0], [x + pw * 0.05, h], [x - pw * 0.2, h]], '#ffffff');
      ctx.restore();
      rect(ctx, x - 5, 0, 10, h, '#3a3836');
    }
    rect(ctx, 0, 0, w, 26, '#3a3836'); rect(ctx, 0, h * 0.78 - 8, w, 12, '#3a3836');
    finish(ctx, w, h);
  };

  // Crystal invernali: dehors chiuso in PVC trasparente.
  scenes.crystal = (ctx, w, h) => {
    setSeed(141);
    rect(ctx, 0, 0, w, h, lin(ctx, 0, 0, 0, h, [[0, '#cfd6d8'], [1, '#e8e2d6']]));
    blur(ctx, 10, () => {
      plaster(ctx, 0, h * 0.2, w, h * 0.6, C.ochre, 0.05, 20);
      for (let i = 0; i < 6; i++) rect(ctx, w * (0.05 + i * 0.16), h * 0.32, w * 0.08, h * 0.3, '#5e3f2b');
    });
    rect(ctx, 0, 0, w, h * 0.14, C.green);
    for (let i = 0; i < 12; i += 2) rect(ctx, (w / 12) * i, 0, w / 12, h * 0.14, shade(C.green, 0.15));
    rect(ctx, 0, h * 0.14, w, h * 0.03, C.greenDark);
    ctx.save(); ctx.globalAlpha = 0.28;
    rect(ctx, 0, h * 0.17, w, h * 0.7, '#f4f7f6');
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.35;
    for (let i = 0; i < 9; i++) poly(ctx, [[w * (0.1 * i), h * 0.17], [w * (0.1 * i + 0.03), h * 0.17], [w * (0.1 * i - 0.04), h * 0.87], [w * (0.1 * i - 0.07), h * 0.87]], '#ffffff');
    ctx.restore();
    for (let i = 0; i <= 4; i++) rect(ctx, (w / 4) * i - 8, h * 0.14, 16, h * 0.76, C.anthracite);
    rect(ctx, 0, h * 0.87, w, h * 0.13, '#8a8178');
    finish(ctx, w, h);
  };

  // Inferriate: grata in ferro su finestra.
  scenes.inferriate = (ctx, w, h) => {
    setSeed(151);
    plaster(ctx, 0, 0, w, h, shade(C.ochre, 0.18), 0.07);
    const x = w * 0.3, y = h * 0.12, ww = w * 0.4, wh = h * 0.72;
    rect(ctx, x - 24, y - 24, ww + 48, wh + 24, shade(C.ochre, 0.4));
    rect(ctx, x, y, ww, wh, '#463a33');
    blur(ctx, 8, () => drape(ctx, x, y, ww, wh, { color: '#ece5d8', folds: 6, alpha: 0.6 }));
    const bars = 9;
    for (let i = 1; i < bars; i++) {
      const bx = x + (ww * i) / bars;
      blur(ctx, 10, () => rect(ctx, bx + 18, y, 10, wh, 'rgba(40,20,10,0.25)'));
      rect(ctx, bx - 6, y - 10, 12, wh + 10, C.anthracite);
    }
    [0.25, 0.75].forEach((f) => rect(ctx, x - 6, y + wh * f, ww + 12, 14, C.anthracite));
    rect(ctx, x - 40, y + wh, ww + 80, 26, shade(C.ochre, 0.45));
    finish(ctx, w, h);
  };

  // Su misura: tessuto steso con metro da sarto (manutenzione, sostituzione tessuti, consulenza).
  scenes.manutenzione = (ctx, w, h) => {
    setSeed(161);
    rect(ctx, 0, 0, w, h, shade(C.oak, -0.1));
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(-0.08); ctx.translate(-w * 0.62, -h * 0.5);
    blur(ctx, 30, () => rect(ctx, 30, 40, w * 1.2, h * 0.9, 'rgba(42,29,23,0.35)'));
    drape(ctx, 0, 0, w * 1.2, h * 0.9, { color: C.linen, folds: 3, light: 0.18, dark: 0.1, hem: 0 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.06;
    for (let y = 0; y < h; y += 3) rect(ctx, 0, y, w, 1, '#2a1d17');
    ctx.restore();
    ctx.save(); ctx.translate(w * 0.5, h * 0.56); ctx.rotate(-0.22);
    const tw = w * 1.3, th = 96;
    blur(ctx, 10, () => rect(ctx, -tw / 2 + 8, 14, tw, th, 'rgba(42,29,23,0.3)'));
    rect(ctx, -tw / 2, 0, tw, th, '#e6c35a');
    ctx.fillStyle = C.choc; ctx.font = '500 30px sans-serif'; ctx.textAlign = 'center';
    for (let i = 0; i * 9 < tw; i++) {
      const x = -tw / 2 + i * 9; const big = i % 10 === 0, mid = i % 5 === 0;
      rect(ctx, x, 0, 2, big ? 40 : mid ? 28 : 16, C.choc);
      if (big) ctx.fillText(String(110 + i / 10), x, 74);
    }
    ctx.restore();
    // ago e filo
    ctx.save(); ctx.translate(w * 0.78, h * 0.22); ctx.rotate(0.6);
    rect(ctx, 0, 0, 260, 6, '#9a9893'); ctx.restore();
    ctx.strokeStyle = C.green; ctx.lineWidth = 4; ctx.beginPath();
    ctx.moveTo(w * 0.78, h * 0.22); ctx.bezierCurveTo(w * 0.7, h * 0.1, w * 0.62, h * 0.3, w * 0.55, h * 0.18); ctx.stroke();
    finish(ctx, w, h);
  };

  window.SCENES = scenes;
})();
