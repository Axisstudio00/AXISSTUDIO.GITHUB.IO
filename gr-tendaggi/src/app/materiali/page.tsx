import { PageHero } from "@/components/page/PageHero";
import { Intro, OfferColumns, Related } from "@/components/page/Blocks";
import { LightSlider } from "@/components/home/LightSlider";
import { Consult } from "@/components/home/Consult";
import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/materiali";

export const metadata = pageMeta({
  title: "Materiali e soluzioni",
  description:
    "Tessuti leggeri, filtranti e oscuranti, sistemi di apertura manuali o motorizzati e servizi di tappezzeria su misura. GR Tendaggi Concept, Bologna.",
  path,
  image: "campionario",
});

export default function Page() {
  return (
    <>
      <PageHero
        variant="framed"
        image="campionario"
        crumb="Materiali e soluzioni"
        title="Materiali e soluzioni"
        lead="Tessuti, trame e meccanismi: i dettagli che distinguono una tenda qualunque da quella giusta per il tuo spazio."
        position="55% 50%"
      />
      <Intro
        id="materiali-intro"
        title="Scegliere da vicino"
        statement="Un tessuto si sceglie con le mani e con la luce: guardandolo controluce, nella stanza dove vivrà."
        text={[
          "Peso, trama e colore cambiano il modo in cui una tenda cade, filtra e invecchia. Per questo li valutiamo insieme, campioni alla mano.",
          "Accanto al tessuto c'è il sistema che lo muove: manuale per la semplicità di tutti i giorni, motorizzato per grandi vetrate e aperture difficili da raggiungere.",
        ]}
      />

      <section aria-labelledby="dettagli-title" className="frame section-gap bg-ivory">
        <Lines id="dettagli-title" lines={["Tre dettagli", "che fanno la tenda."]} className="text-title" />
        <div className="mt-16 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-14 lg:mt-24">
          {[
            {
              id: "tramaLino" as const,
              title: "La trama",
              text: "Più è aperta, più luce lascia passare; più è fitta, più protegge la privacy.",
              cls: "col-span-12 md:col-span-5",
            },
            {
              id: "campionario" as const,
              title: "Il colore",
              text: "Dal lino naturale al grigio antracite: il colore del tessuto tinge la luce della stanza.",
              cls: "col-span-9 md:col-span-4 md:col-start-7 md:mt-[22vh]",
            },
            {
              id: "binario" as const,
              title: "Il movimento",
              text: "Binari e comandi, manuali o motorizzati, fanno scorrere il telo senza sforzo.",
              cls: "col-span-8 col-start-5 md:col-span-3 md:col-start-10 md:-mt-[8vh]",
            },
          ].map((d, i) => (
            <figure key={d.title} className={d.cls}>
              <div data-clip data-clip-delay={i * 0.1} className="overflow-hidden">
                <div data-parallax={8 + i * 4} className="scale-[1.1]">
                  <Picture
                    id={d.id}
                    sizes="(min-width: 768px) 40vw, 90vw"
                    imgClassName="aspect-square w-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-4">
                <span className="block font-serif text-lead leading-[1.08] font-light">{d.title}</span>
                <span className="mt-2 block max-w-[34ch]">{d.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <OfferColumns
        id="tessuti"
        title={["Tessuti", "e sistemi."]}
        tone="bg-warm"
        items={[
          { name: "Tessuti leggeri", text: "Veli e lini trasparenti, per un effetto elegante e una luce morbida." },
          {
            name: "Tessuti oscuranti",
            text: "Per una protezione maggiore dalla luce, in camera e negli ambienti da schermare.",
          },
          { name: "Tessuti tecnici", text: "Per tende tecniche in vari gradi di trasparenza o di oscuramento." },
          { name: "Apertura manuale", text: "Semplice e immediata, per l'uso di tutti i giorni." },
          { name: "Apertura motorizzata", text: "Per grandi vetrate, aperture alte o più tende da muovere insieme." },
          {
            name: "Veneziane 50 · 25 · 16 mm",
            text: "Tre larghezze di lamella per proporzionare la veneziana alla finestra.",
          },
        ]}
      />

      <section aria-label="Simulazione della luce" className="frame section-gap bg-sand">
        <LightSlider headingLevel={2} />
      </section>

      <OfferColumns
        id="tappezzeria"
        title={["Tappezzeria", "su misura."]}
        tone="bg-ivory"
        items={[
          { name: "Rifacimento", text: "Nuova imbottitura e nuovo rivestimento per divani, poltrone, sedie e letti." },
          { name: "Riparazione", text: "Interventi sulle parti danneggiate, per riportare l'arredo in uso." },
          { name: "Cuscini", text: "Sostituzione dei cuscini usurati, con tessuti scelti insieme." },
        ]}
      />

      <Related current={path} />
      <Consult
        image="veloControluce"
        title={["Vieni a scegliere", "da vicino."]}
        text="Raccontaci il tuo progetto: prepariamo una proposta di tessuti e sistemi adatta al tuo ambiente."
        position="30% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Materiali e soluzioni", path }])} />
    </>
  );
}
