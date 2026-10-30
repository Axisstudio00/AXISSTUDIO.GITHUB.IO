import Link from 'next/link';
import { Photo } from '../Photo';
import { site } from '@/content/site';

// Coordinate pubbliche approssimative dei capoluoghi lungo la Via Emilia (solo per il disegno).
const CITIES: { name: string; lng: number; lat: number; label?: 'above' | 'below'; on: boolean }[] = [
  { name: 'Piacenza', lng: 9.69, lat: 45.05, label: 'below', on: true },
  { name: 'Parma', lng: 10.33, lat: 44.8, label: 'below', on: true },
  { name: 'Reggio Emilia', lng: 10.63, lat: 44.7, on: true },
  { name: 'Modena', lng: 10.93, lat: 44.65, label: 'below', on: true },
  { name: 'Bologna', lng: 11.34, lat: 44.49, on: true },
  { name: 'Imola', lng: 11.71, lat: 44.35, on: true },
  { name: 'Faenza', lng: 11.88, lat: 44.29, on: true },
  { name: 'Forlì', lng: 12.04, lat: 44.22, on: true },
  { name: 'Cesena', lng: 12.24, lat: 44.14, on: true },
  { name: 'Rimini', lng: 12.57, lat: 44.06, label: 'above', on: true },
  { name: 'Ferrara', lng: 11.62, lat: 44.84, label: 'above', on: false },
  { name: 'Ravenna', lng: 12.2, lat: 44.42, label: 'above', on: false },
];
const px = (lng: number) => 20 + (lng - 9.6) * 118;
const py = (lat: number) => 30 + (45.12 - lat) * 165;
const HOME = { lng: 11.41, lat: 44.47 };

export function ViaEmilia() {
  const road = CITIES.filter((c) => c.on).map((c) => `${px(c.lng)},${py(c.lat)}`).join(' ');
  return (
    <section aria-labelledby="via-title" className="section">
      <div className="wrap">
        <h2 id="via-title" className="t-head" data-reveal>
          Via Emilia 134
        </h2>
        <p className="t-lead mt-6 max-w-[40ch]" data-reveal style={{ ['--d' as string]: '80ms' }}>
          Da San Lazzaro di Savena, alle porte di Bologna, seguiamo case, negozi e uffici in tutte le province
          dell’Emilia-Romagna.
        </p>

        <div className="mt-16 grid gap-4 md:mt-20 md:grid-cols-12">
          <div className="relative md:col-span-8">
            <Photo name="esterni" alt="Facciata bolognese con persiane verdi e tenda da sole sopra il portico" sizes="(min-width: 768px) 66vw, 100vw" className="aspect-[4/3] md:aspect-[16/10]" />
            <p className="bg-paper p-5 text-[1rem] md:absolute md:right-0 md:top-0 md:w-[22rem]">
              Lavoriamo tra portici, terrazzi e cortili: per ogni facciata e ogni stanza scegliamo soluzioni che
              rispettano l’edificio e chi lo abita.
            </p>
          </div>
          <div className="md:col-span-4">
            <figure className="bg-field p-5 text-white" data-reveal style={{ ['--d' as string]: '120ms' }}>
              <svg viewBox="0 0 420 240" role="img" aria-label="La Via Emilia da Piacenza a Rimini, con la sede di San Lazzaro di Savena" className="block h-auto w-full">
                <polyline points={road} fill="none" stroke="#efebe3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {CITIES.map((c) => (
                  <g key={c.name}>
                    <circle cx={px(c.lng)} cy={py(c.lat)} r={c.on ? 4 : 3.5} fill={c.on ? '#efebe3' : 'none'} stroke="#efebe3" strokeWidth="1.5" />
                    {c.label && (
                      <text x={px(c.lng)} y={py(c.lat) + (c.label === 'above' ? -12 : 24)} fill="#efebe3" fontSize="14" textAnchor="middle" fontFamily="Jost, sans-serif">
                        {c.name}
                      </text>
                    )}
                  </g>
                ))}
                <circle cx={px(HOME.lng)} cy={py(HOME.lat)} r="10" fill="#2a1d17" stroke="#efebe3" strokeWidth="3" />
                <text x={px(HOME.lng) - 16} y={py(HOME.lat) + 32} fill="#ffffff" fontSize="16" textAnchor="end" fontFamily="Jost, sans-serif" fontWeight="500">
                  Bologna · San Lazzaro
                </text>
              </svg>
              <figcaption className="t-small mt-3 text-white/90">La Via Emilia, da Piacenza a Rimini.</figcaption>
            </figure>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-[1rem]">
              <div>
                <dt className="text-muted">Sede</dt>
                <dd className="mt-1">{site.address.city} ({site.address.province})</dd>
              </div>
              <div>
                <dt className="text-muted">Zona</dt>
                <dd className="mt-1">Bologna e province dell’Emilia-Romagna</dd>
              </div>
              <div>
                <dt className="text-muted">Per</dt>
                <dd className="mt-1">Abitazioni e attività commerciali</dd>
              </div>
              <div>
                <dt className="text-muted">Servizio</dt>
                <dd className="mt-1">Dalla consulenza alla manutenzione</dd>
              </div>
            </dl>
            <Link href="/contatti/" className="link-strong mt-8 inline-block">Come raggiungerci</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
