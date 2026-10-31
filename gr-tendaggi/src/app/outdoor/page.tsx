import Link from "next/link";
import { PageHero } from "@/components/page/PageHero";
import { Intro, OfferColumns, PhotoPair, Process, Related } from "@/components/page/Blocks";
import { Consult } from "@/components/home/Consult";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/outdoor";

export const metadata = pageMeta({
  title: "Outdoor e chiusure invernali Crystal",
  description:
    "Chiusure invernali Crystal in PVC o vetro flessibile per terrazze e dehors, e tende da sole su misura. GR Tendaggi Concept, Bologna.",
  path,
  image: "pergolaLamelle",
});

export default function Page() {
  return (
    <>
      <PageHero
        image="pergolaLamelle"
        crumb="Outdoor e chiusure invernali"
        title="Outdoor e chiusure"
        lead="Spazi esterni da vivere più a lungo: chiusure invernali Crystal per terrazze e dehors, e tende da sole su misura."
        position="45% 50%"
      />
      <Intro
        id="outdoor-intro"
        title="Fuori, tutto l'anno"
        statement="Una terrazza chiusa bene in inverno resta una stanza in più, con la vista di sempre."
        text={[
          "Le chiusure Crystal trasformano terrazze e dehors in spazi riparati dal freddo e dal vento, lasciando passare la luce e lo sguardo.",
          "Sono pensate per la casa e per le attività: ristoranti, bar e locali che vogliono usare il dehors anche nei mesi freddi.",
        ]}
      />
      <OfferColumns
        id="outdoor-offerta"
        title={["Chiusure", "invernali Crystal."]}
        tone="bg-ivory"
        items={[
          {
            name: "In PVC trasparente",
            text: "Teli trasparenti che chiudono terrazze e dehors, mantenendo luce e vista.",
          },
          {
            name: "In vetro flessibile",
            text: "Un'alternativa al PVC per chiudere gli spazi esterni nei mesi freddi.",
          },
          {
            name: "Per ristoranti e dehors",
            text: "Soluzioni per attività che vogliono accogliere all'aperto anche in inverno.",
          },
        ]}
      />
      <PhotoPair
        first="pergolaPiscina"
        second="terrazzaPergola"
        captions={[
          "Ambientazione illustrativa · Dal soggiorno alla terrazza",
          "Ambientazione illustrativa · Teli leggeri sulla terrazza",
        ]}
        tone="bg-warm pt-[var(--section-gap)]"
      />
      <section aria-labelledby="outdoor-sole" className="frame section-gap bg-sand">
        <div className="grid-12 items-end gap-y-8">
          <h2 id="outdoor-sole" className="col-span-12 text-title md:col-span-6">
            E d&apos;estate, l&apos;ombra
          </h2>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <p className="max-w-[42ch]">
              Per balconi, terrazze, giardini e vetrine realizziamo tende da sole su misura, e ci occupiamo di
              motorizzazione, manutenzione e sostituzione dei teli.
            </p>
            <p className="mt-6">
              <Link
                href="/tende-da-sole"
                className="font-medium underline underline-offset-[6px] hover:text-bronze-ink"
              >
                Scopri le tende da sole
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Process tone="bg-ivory" />
      <Related current={path} />
      <Consult
        image="tendaSole"
        title={["Il tuo esterno,", "in ogni stagione."]}
        text="Raccontaci il tuo spazio esterno: valutiamo insieme la chiusura o la tenda più adatta."
        position="25% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Outdoor e chiusure invernali", path }])} />
    </>
  );
}
