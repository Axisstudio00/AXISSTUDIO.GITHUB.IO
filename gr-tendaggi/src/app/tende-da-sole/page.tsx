import { PageHero } from "@/components/page/PageHero";
import { Intro, OfferColumns, PhotoPair, Process, Related } from "@/components/page/Blocks";
import { OfferIndex } from "@/components/page/OfferIndex";
import { Consult } from "@/components/home/Consult";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/tende-da-sole";

export const metadata = pageMeta({
  title: "Tende da sole su misura",
  description:
    "Tende da sole per balconi, terrazze, giardini e vetrine a Bologna e in Emilia-Romagna. Motorizzazione, manutenzione e sostituzione dei teli.",
  path,
  image: "tendaSole",
});

export default function Page() {
  return (
    <>
      <PageHero
        image="tendaSole"
        crumb="Tende da sole"
        title="Tende da sole"
        lead="Per balconi, terrazze, giardini e vetrine: protezione da sole, calore e intemperie, con tende realizzate sulle misure del tuo spazio."
        position="40% 50%"
      />
      <Intro
        id="sole-intro"
        title="L'ombra giusta"
        statement="Una tenda da sole allunga la stagione all'aperto e tiene fresca la casa dietro le vetrate."
        text={[
          "Ogni esterno ha le sue ore di sole, il suo vento, la sua vista da non coprire. Per questo una tenda da sole si progetta sul posto e sull'uso: quanto deve sporgere, come si apre, quale telo usare.",
          "Ci occupiamo anche delle tende che hai già: motorizzazione, manutenzione e sostituzione del telo.",
        ]}
      />
      <OfferIndex
        id="sole-dove"
        title="Dove servono"
        tone="bg-ivory"
        items={[
          {
            name: "Balconi e terrazze",
            text: "Ombra dove si vive all'aperto, e meno calore che arriva alle stanze affacciate.",
            image: "tendaSole",
          },
          {
            name: "Giardini e spazi esterni",
            text: "Zone d'ombra per pranzi, letture e pomeriggi lunghi, in armonia con l'architettura.",
            image: "terrazzaPergola",
          },
          {
            name: "Vetrine",
            text: "Protezione per merce ed esposizioni, e un ingresso più accogliente per chi entra.",
          },
        ]}
      />
      <OfferColumns
        id="sole-servizi"
        title={["Per le tende", "che hai già."]}
        tone="bg-sand"
        items={[
          {
            name: "Motorizzazione",
            text: "Una tenda da sole esistente può essere motorizzata, per aprirla e chiuderla con un comando.",
          },
          { name: "Manutenzione", text: "Controlli e interventi per mantenere la tenda efficiente nel tempo." },
          { name: "Sostituzione del telo", text: "Un nuovo tessuto rinnova la tenda senza cambiare la struttura." },
        ]}
      />
      <PhotoPair
        first="zanzariera"
        second="terrazzaPergola"
        mirrored
        captions={[
          "Ambientazione illustrativa · Dal soggiorno al giardino",
          "Ambientazione illustrativa · Teli leggeri sulla terrazza",
        ]}
        tone="bg-warm pt-[var(--section-gap)]"
      />
      <Process tone="bg-ivory" />
      <Related current={path} />
      <Consult
        image="terrazzaPergola"
        title={["La tua terrazza,", "all'ombra giusta."]}
        text="Raccontaci esposizione e misure: ti proponiamo la tenda, il telo e il comando più adatti."
        position="30% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Tende da sole", path }])} />
    </>
  );
}
