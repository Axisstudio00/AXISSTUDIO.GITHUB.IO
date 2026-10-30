'use client';
import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

type Kind = 'veneziana' | 'rullo' | 'arredo';
type Slat = 16 | 25 | 50;
type Fabric = 'filtrante' | 'oscurante';

const KINDS: { id: Kind; label: string; href: string }[] = [
  { id: 'veneziana', label: 'Veneziana', href: '/soluzioni/veneziane/' },
  { id: 'rullo', label: 'Tenda a rullo', href: '/soluzioni/tende-a-rullo/' },
  { id: 'arredo', label: 'Tenda d’arredo', href: '/soluzioni/tende-interne-arredo/' },
];

// Finestra del disegno (coordinate SVG)
const WX = 300, WY = 70, WW = 200, WH = 330, FLOOR = 430;

function describe(t: number) {
  if (t > 0.8) return 'Luce piena';
  if (t > 0.5) return 'Luce morbida';
  if (t > 0.22) return 'Luce filtrata';
  if (t > 0.06) return 'Penombra';
  return 'Buio';
}

// "Prova la luce": il visitatore sceglie il sistema e lo regola; la stanza disegnata risponde.
export function LightStudio() {
  const uid = useId();
  const [kind, setKind] = useState<Kind>('veneziana');
  const [slat, setSlat] = useState<Slat>(25);
  const [tilt, setTilt] = useState(45); // 0 = lamelle orizzontali (aperte), 90 = chiuse
  const [drop, setDrop] = useState(55); // % di discesa del rullo
  const [openPct, setOpenPct] = useState(40); // % di apertura delle tende d'arredo
  const [fabric, setFabric] = useState<Fabric>('filtrante');

  const fabricT = fabric === 'filtrante' ? 0.42 : 0.02;
  const transmit = useMemo(() => {
    if (kind === 'veneziana') return Math.max(0.02, Math.cos((tilt * Math.PI) / 180) * 0.92);
    if (kind === 'rullo') return 1 - drop / 100 + (drop / 100) * fabricT;
    const covered = 1 - openPct / 100;
    return 1 - covered + covered * (fabric === 'filtrante' ? 0.55 : 0.02);
  }, [kind, tilt, drop, openPct, fabric, fabricT]);

  const product = KINDS.find((k) => k.id === kind)!;

  // Lamelle veneziana
  const pitch = slat === 50 ? 22 : slat === 25 ? 12 : 8;
  const slats = useMemo(() => {
    const rows: number[] = [];
    for (let y = WY; y < WY + WH; y += pitch) rows.push(y);
    return rows;
  }, [pitch]);
  const slatH = Math.max(1.2, pitch * Math.sin((tilt * Math.PI) / 180) + 1);

  const poolOpacity = 0.12 + transmit * 0.7;

  return (
    <section aria-labelledby="luce-title" className="section bg-surface">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <h2 id="luce-title" className="t-head" data-reveal>
            Prova
            <br />
            la luce
          </h2>
          <p className="mt-6 max-w-[34ch]" data-reveal style={{ ['--d' as string]: '80ms' }}>
            Scegli un sistema e regolalo: la stanza cambia con lui. È un modo semplice per capire che effetto
            cerchi prima di parlarne insieme.
          </p>

          <fieldset className="mt-10">
            <legend className="font-medium">Sistema</legend>
            <div className="mt-3 grid grid-cols-3 gap-1 bg-bg p-1" role="radiogroup">
              {KINDS.map((k) => (
                <label key={k.id} className={`flex min-h-12 cursor-pointer items-center justify-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent px-2 text-center text-[1rem] leading-tight transition-colors ${kind === k.id ? 'bg-ink text-paper' : 'hover:bg-paper'}`}>
                  <input type="radio" name={`${uid}-kind`} value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="sr-only" />
                  {k.label}
                </label>
              ))}
            </div>
          </fieldset>

          {kind === 'veneziana' && (
            <>
              <fieldset className="mt-8">
                <legend className="font-medium">Lamella</legend>
                <div className="mt-3 grid grid-cols-3 gap-1 bg-bg p-1">
                  {([16, 25, 50] as Slat[]).map((s) => (
                    <label key={s} className={`flex min-h-12 cursor-pointer items-center justify-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent text-[1rem] transition-colors ${slat === s ? 'bg-ink text-paper' : 'hover:bg-paper'}`}>
                      <input type="radio" name={`${uid}-slat`} checked={slat === s} onChange={() => setSlat(s)} className="sr-only" />
                      {s} mm
                    </label>
                  ))}
                </div>
              </fieldset>
              <Range id={`${uid}-tilt`} label="Inclinazione" value={tilt} min={0} max={90} onChange={setTilt} unit="°" />
            </>
          )}
          {kind === 'rullo' && (
            <>
              <FabricPicker uid={uid} fabric={fabric} setFabric={setFabric} />
              <Range id={`${uid}-drop`} label="Altezza del telo" value={drop} min={0} max={100} onChange={setDrop} unit="%" />
            </>
          )}
          {kind === 'arredo' && (
            <>
              <FabricPicker uid={uid} fabric={fabric} setFabric={setFabric} labels={['Velo', 'Coprente']} />
              <Range id={`${uid}-open`} label="Apertura" value={openPct} min={0} max={100} onChange={setOpenPct} unit="%" />
            </>
          )}

          <p className="mt-8 text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] font-display" aria-live="polite">
            {describe(transmit)}
          </p>
          <Link href={product.href} className="btn btn-primary mt-6">
            Scopri: {product.label} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>

        <figure className="md:col-span-7 md:col-start-6" data-reveal style={{ ['--d' as string]: '120ms' }}>
          <svg viewBox="0 0 800 600" role="img" aria-label={`Stanza con ${product.label.toLowerCase()}: ${describe(transmit).toLowerCase()}`} className="block h-auto w-full bg-paper">
            <defs>
              <pattern id={`${uid}-stripes`} width="10" height={pitch * 1.6} patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
                <rect width="10" height={pitch * 1.6 * Math.max(0.08, 1 - tilt / 90)} fill="#fff6e4" />
              </pattern>
              <clipPath id={`${uid}-win`}>
                <rect x={WX} y={WY} width={WW} height={WH} />
              </clipPath>
            </defs>
            {/* parete e pavimento: l'ambiente si scurisce con la luce che entra */}
            <rect width="800" height={FLOOR} fill="#e5e1d8" />
            <rect y={FLOOR} width="800" height={600 - FLOOR} fill="#b08a62" />
            <rect y={FLOOR} width="800" height="6" fill="#d6cfc2" />
            <rect width="800" height="600" fill="#2a1d17" opacity={0.42 * (1 - transmit)} style={{ transition: 'opacity 500ms' }} />

            {/* vista: cielo, colli, portico */}
            <g clipPath={`url(#${uid}-win)`}>
              <rect x={WX} y={WY} width={WW} height={WH} fill="#dbe4e7" />
              <path d={`M${WX} ${WY + 200} q50 -30 100 -10 t100 -16 V${WY + WH} H${WX} Z`} fill="#9aa58c" />
              <rect x={WX} y={WY + 240} width={WW} height={WH - 240} fill="#c98f52" />
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M${WX + 10 + i * 50} ${WY + WH} v-48 a18 18 0 0 1 36 0 v48 Z`} fill="#6e4a32" />
              ))}
            </g>
            <rect x={WX - 12} y={WY - 12} width={WW + 24} height="12" fill="#d6cfc2" />
            <rect x={WX - 12} y={WY} width="12" height={WH} fill="#d6cfc2" />
            <rect x={WX + WW} y={WY} width="12" height={WH} fill="#d6cfc2" />
            <rect x={WX + WW / 2 - 3} y={WY} width="6" height={WH} fill="#ece6da" />
            <rect x={WX - 20} y={WY + WH} width={WW + 40} height="10" fill="#efebe3" />

            {/* luce sul pavimento */}
            <path
              d={`M${WX} ${FLOOR} H${WX + WW} L${WX + WW * 1.9} 600 H${WX - WW * 0.9} Z`}
              fill={kind === 'veneziana' ? `url(#${uid}-stripes)` : '#fff6e4'}
              opacity={poolOpacity}
              style={{ transition: 'opacity 500ms' }}
            />

            {/* sistema */}
            {kind === 'veneziana' && (
              <g>
                {slats.map((y) => (
                  <rect key={y} x={WX - 6} y={y} width={WW + 12} height={slatH} fill={tilt > 60 ? '#d8d0c2' : '#efe9de'} style={{ transition: 'height 300ms' }} />
                ))}
                <rect x={WX + 40} y={WY} width="1.5" height={WH} fill="#6b5b51" opacity="0.5" />
                <rect x={WX + WW - 40} y={WY} width="1.5" height={WH} fill="#6b5b51" opacity="0.5" />
                <rect x={WX - 10} y={WY - 18} width={WW + 20} height="14" fill="#3a3836" />
              </g>
            )}
            {kind === 'rullo' && (
              <g>
                <rect x={WX - 6} y={WY} width={WW + 12} height={(WH * drop) / 100} fill={fabric === 'filtrante' ? '#efe8da' : '#5b4334'} opacity={fabric === 'filtrante' ? 0.82 : 1} style={{ transition: 'height 300ms' }} />
                <rect x={WX - 6} y={WY + (WH * drop) / 100 - 6} width={WW + 12} height="6" fill="#3a3836" style={{ transition: 'y 300ms' }} />
                <rect x={WX - 12} y={WY - 22} width={WW + 24} height="18" fill="#3a3836" />
              </g>
            )}
            {kind === 'arredo' && (
              <g>
                <rect x="130" y="40" width="540" height="6" fill="#3a3836" />
                {[-1, 1].map((side) => {
                  const cover = 70 + ((100 - openPct) / 100) * 200;
                  const x = side < 0 ? 130 : 670 - cover;
                  const folds = Math.max(3, Math.round(cover / 26));
                  return (
                    <g key={side}>
                      <rect x={x} y="46" width={cover} height={FLOOR - 46} fill={fabric === 'filtrante' ? '#f2ece0' : '#a39383'} opacity={fabric === 'filtrante' ? 0.82 : 1} />
                      {Array.from({ length: folds }).map((_, i) => (
                        <rect key={i} x={x + (i + 0.5) * (cover / folds)} y="46" width="5" height={FLOOR - 46} fill="#2a1d17" opacity={fabric === 'filtrante' ? 0.08 : 0.18} />
                      ))}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
          <figcaption className="t-small mt-3 text-muted">
            Simulazione indicativa: l’effetto reale dipende da esposizione, tessuto e colore.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function FabricPicker({ uid, fabric, setFabric, labels = ['Filtrante', 'Oscurante'] }: { uid: string; fabric: Fabric; setFabric: (f: Fabric) => void; labels?: [string, string] | string[] }) {
  return (
    <fieldset className="mt-8">
      <legend className="font-medium">Tessuto</legend>
      <div className="mt-3 grid grid-cols-2 gap-1 bg-bg p-1">
        {(['filtrante', 'oscurante'] as Fabric[]).map((f, i) => (
          <label key={f} className={`flex min-h-12 cursor-pointer items-center justify-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent text-[1rem] transition-colors ${fabric === f ? 'bg-ink text-paper' : 'hover:bg-paper'}`}>
            <input type="radio" name={`${uid}-fabric`} checked={fabric === f} onChange={() => setFabric(f)} className="sr-only" />
            {labels[i]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Range({ id, label, value, min, max, unit, onChange }: { id: string; label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-medium">{label}</label>
        <output htmlFor={id} className="tabular-nums text-muted">{value}{unit}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full"
      />
    </div>
  );
}
