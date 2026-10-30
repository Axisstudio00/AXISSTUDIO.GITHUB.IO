import Link from 'next/link';
import { PageHead } from '@/components/PageHead';
import { Photo } from '@/components/Photo';
import { JsonLd } from '@/components/JsonLd';
import { process } from '@/content/process';
import { site } from '@/content/site';
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Chi siamo: tendaggi su misura a San Lazzaro di Savena',
  description:
    'GRtendaggi Concept realizza, vende, installa e cura tende e schermature su misura da San Lazzaro di Savena per Bologna e tutta l’Emilia-Romagna.',
  path: '/chi-siamo/',
});

// Testi basati sulle informazioni verificate. Storia, anno di fondazione e persone
// vanno aggiunti solo quando forniti dal cliente.
export default function ChiSiamo() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Chi siamo', path: '/chi-siamo/' }])} />
      <PageHead
        title={<>Chi siamo</>}
        lead="Realizziamo, vendiamo, installiamo e curiamo tende e schermature su misura per case e attività."
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Chi siamo', href: '/chi-siamo/' }]}
        image="campionario"
        imageAlt="Campionario di tessuti nei toni naturali"
      />

      <section aria-labelledby="approccio-title" className="section">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
          <h2 id="approccio-title" className="t-head md:col-span-5" data-reveal>Un solo interlocutore</h2>
          <div className="space-y-6 md:col-span-6 md:col-start-7" data-reveal style={{ ['--d' as string]: '80ms' }}>
            <p className="t-lead">
              {site.name} opera principalmente a Bologna e in tutte le province dell’Emilia-Romagna, dalla sede di Via
              Emilia a San Lazzaro di Savena.
            </p>
            <p>
              Ci occupiamo dell’intero percorso: la consulenza per capire che cosa serve davvero, la scelta e la
              personalizzazione della soluzione, la posa in opera e la manutenzione negli anni, compresa la
              motorizzazione e la sostituzione dei tessuti.
            </p>
            <p>
              Lavoriamo per abitazioni private e per attività commerciali: tende d’arredo e tecniche, schermature
              solari, chiusure per esterni, infissi e lavori di tappezzeria.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="valori-title" className="bg-field section text-white">
        <div className="wrap">
          <h2 id="valori-title" className="t-head max-w-[14ch]" data-reveal>Ciò che conta per noi</h2>
          <dl className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
            {[
              ['Ascolto', 'Ogni ambiente ha la sua luce e chi lo abita le sue abitudini. Partiamo da lì, non dal catalogo.'],
              ['Misura', 'Rileviamo le misure sul posto e realizziamo ogni soluzione per quello spazio.'],
              ['Cura', 'Posa attenta e assistenza anche dopo l’installazione, per far durare ciò che scegli.'],
            ].map(([t, d], i) => (
              <div key={t} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <dt className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none">{t}</dt>
                <dd className="mt-4 max-w-[34ch] text-white/90">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="fasi-title" className="section">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <h2 id="fasi-title" className="t-head" data-reveal>Il metodo</h2>
              <Photo name="manutenzione" alt="Tessuto con metro da sarto" sizes="(min-width: 768px) 40vw, 100vw" className="mt-10 aspect-[4/3]" wipe />
            </div>
          </div>
          <ol className="space-y-14 md:col-span-6 md:col-start-7 md:pt-24">
            {process.map((s, i) => (
              <li key={s.title} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                <h3 className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05]">{s.title}</h3>
                <p className="mt-3 max-w-[48ch]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cta-chi-title" className="bg-paper">
        <div className="wrap grid gap-8 py-20 md:grid-cols-12 md:py-28">
          <h2 id="cta-chi-title" className="t-head md:col-span-7">Vieni a trovarci</h2>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <p>
              {site.address.street}, {site.address.postalCode} {site.address.city} ({site.address.province}).
            </p>
            <Link href="/contatti/" className="btn btn-primary mt-6">Contatti e preventivo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
