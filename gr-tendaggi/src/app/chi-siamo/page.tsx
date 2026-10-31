import Link from "next/link";
import { PageHero } from "@/components/page/PageHero";
import { OfferColumns, PhotoPair, Process } from "@/components/page/Blocks";
import { Consult } from "@/components/home/Consult";
import { Lines } from "@/components/ui/Lines";
import { company, fullAddress } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/chi-siamo";

export const metadata = pageMeta({
  title: "Chi siamo",
  description:
    "GR Tendaggi Concept realizza, vende e installa tende su misura a Bologna e in Emilia-Romagna, da Via Emilia 134 a San Lazzaro di Savena.",
  path,
  image: "doppiaAltezza",
});

export default function Page() {
  return (
    <>
      <PageHero
        image="doppiaAltezza"
        crumb="Chi siamo"
        title="Chi siamo"
        lead="Realizziamo, vendiamo e installiamo tende su misura a Bologna e nelle province dell'Emilia-Romagna."
        position="50% 45%"
      />

      <section aria-labelledby="studio-title" className="frame section-gap bg-warm">
        <div className="grid-12 gap-y-10">
          <Lines
            id="studio-title"
            lines={["Sulla Via Emilia,", "a San Lazzaro."]}
            className="col-span-12 text-title md:col-span-7"
          />
          <div data-reveal className="col-span-12 space-y-5 md:col-span-5 md:col-start-8 md:pt-4">
            <p data-reveal-item className="max-w-[46ch]">
              {company.name} ha sede in {fullAddress}. Da qui seguiamo progetti per la casa e per le attività, a Bologna
              e in tutta l&apos;Emilia-Romagna.
            </p>
            <p data-reveal-item className="max-w-[46ch]">
              Lavoriamo su un&apos;idea semplice: ogni ambiente ha una sua luce, e una tenda ben scelta la accompagna
              invece di nasconderla. Per questo partiamo sempre dalla stanza, da come è esposta e da come la vivi.
            </p>
            <p data-reveal-item className="max-w-[46ch]">
              Ci occupiamo dell&apos;intero percorso: la scelta di tessuti e sistemi, la realizzazione su misura, la
              posa e, quando serve, la manutenzione.
            </p>
          </div>
        </div>
      </section>

      <PhotoPair
        first="veloControluce"
        second="tendeFiltranti"
        captions={[
          "Ambientazione illustrativa · Velo in lino",
          "Ambientazione illustrativa · Tende filtranti in soggiorno",
        ]}
      />

      <OfferColumns
        id="cosa-facciamo"
        title={["Cosa", "facciamo."]}
        tone="bg-ivory"
        items={[
          {
            name: "Tende da interno",
            text: "Tende d'arredo con tessuti leggeri o oscuranti, apertura manuale o motorizzata.",
          },
          {
            name: "Tende da sole",
            text: "Per balconi, terrazze, giardini e vetrine, con motorizzazione, manutenzione e cambio telo.",
          },
          { name: "Chiusure Crystal", text: "Chiusure invernali in PVC o vetro flessibile per terrazze e dehors." },
          { name: "Zanzariere", text: "Avvolgibili, a battente, plissé, scorrevoli e motorizzate." },
          { name: "Schermature", text: "Tende tecniche, veneziane e tapparelle." },
          { name: "Tappezzeria", text: "Rifacimento e riparazione di divani, poltrone, sedie e letti." },
        ]}
      />

      <Process />

      <section aria-labelledby="dove-title" className="frame section-gap bg-warm">
        <div className="grid-12 items-end gap-y-8">
          <h2 id="dove-title" className="col-span-12 text-title md:col-span-6">
            Dove siamo
          </h2>
          <div className="col-span-12 text-[1.25rem] md:col-span-5 md:col-start-8">
            <address className="not-italic">
              {company.name}
              <br />
              {fullAddress}
            </address>
            <p className="mt-4 flex flex-col">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="w-fit underline-offset-4 hover:underline">
                  {p.label}
                </a>
              ))}
              <a href={`mailto:${company.email}`} className="w-fit underline-offset-4 hover:underline">
                {company.email}
              </a>
            </p>
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[1rem] font-medium">
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-[6px] hover:text-bronze-ink"
              >
                Apri in Google Maps
              </a>
              <Link href="/contatti#preventivo" className="underline underline-offset-[6px] hover:text-bronze-ink">
                Richiedi un preventivo
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Consult image="tramontoVetrate" position="40% 50%" />
      <JsonLd data={breadcrumbSchema([{ name: "Chi siamo", path }])} />
    </>
  );
}
