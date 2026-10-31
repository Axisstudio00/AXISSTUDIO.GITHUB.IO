import { PageHero } from "@/components/page/PageHero";
import { Intro, PhotoPair, Process, Related } from "@/components/page/Blocks";
import { OfferIndex } from "@/components/page/OfferIndex";
import { LightSlider } from "@/components/home/LightSlider";
import { Consult } from "@/components/home/Consult";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/tende-da-interno";

export const metadata = pageMeta({
  title: "Tende da interno su misura",
  description:
    "Tende d'arredo su misura a Bologna: tessuti leggeri o oscuranti, apertura manuale o motorizzata. GR Tendaggi Concept, San Lazzaro di Savena.",
  path,
  image: "veloColline",
});

export default function Page() {
  return (
    <>
      <PageHero
        variant="framed"
        image="veloColline"
        crumb="Tende da interno"
        title="Tende da interno"
        lead="Tessuti leggeri per un effetto elegante, tessuti oscuranti per proteggersi dalla luce: tende d'arredo su misura, con apertura manuale o motorizzata."
      />
      <Intro
        id="interni-intro"
        title="La luce della stanza"
        statement="Il tessuto giusto non si guarda soltanto: si riconosce dalla luce che lascia nella stanza."
        text={[
          "Una tenda d'arredo lavora tutto il giorno. Al mattino filtra il sole basso, a mezzogiorno protegge pavimenti e arredi, la sera garantisce privacy senza chiudere lo spazio.",
          "Per questo partiamo dalla stanza: l'esposizione, le dimensioni delle vetrate, il modo in cui la vivi. Poi scegliamo con te tessuto, confezione e sistema di apertura.",
        ]}
      />
      <OfferIndex
        id="interni-offerta"
        title="Dal velo all'oscurante"
        items={[
          {
            name: "Tende a velo",
            text: "Tessuti leggeri e trasparenti che addolciscono la luce e lasciano respirare la vista.",
            image: "veloControluce",
          },
          {
            name: "Tende filtranti",
            text: "Trame più fitte per ridurre il riverbero e proteggere la privacy, senza spegnere il giorno.",
            image: "tendeFiltranti",
          },
          {
            name: "Tende oscuranti",
            text: "Tessuti che fermano la luce: per camere da letto, sale TV e ambienti da proteggere dal sole.",
            image: "cameraVelo",
          },
          {
            name: "Apertura manuale o motorizzata",
            text: "Il sistema si sceglie in base alle dimensioni delle vetrate e all'uso quotidiano della stanza.",
            image: "binario",
          },
        ]}
      />
      <section aria-label="Simulazione della luce" className="frame section-gap bg-sand">
        <LightSlider headingLevel={2} />
      </section>
      <PhotoPair
        first="vistaLago"
        second="doppiaAltezza"
        captions={[
          "Ambientazione illustrativa · Teli leggeri ai lati della vetrata",
          "Ambientazione illustrativa · Doppia altezza, velo e tessuto coprente",
        ]}
        tone="bg-warm pt-[var(--section-gap)]"
      />
      <Process />
      <Related current={path} />
      <Consult
        image="panoramico"
        title={["Raccontaci", "la tua stanza."]}
        text="Esposizione, dimensioni, uso: da qui partiamo per proporti il tessuto e il sistema giusti."
        position="60% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Tende da interno", path }])} />
    </>
  );
}
