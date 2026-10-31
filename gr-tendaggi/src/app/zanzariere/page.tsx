import { PageHero } from "@/components/page/PageHero";
import { Intro, OfferColumns, PhotoPair, Process, Related } from "@/components/page/Blocks";
import { Consult } from "@/components/home/Consult";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/zanzariere";

export const metadata = pageMeta({
  title: "Zanzariere su misura",
  description:
    "Zanzariere su misura a Bologna: avvolgibili verticali e laterali, a battente, plissé, scorrevoli e motorizzate. GR Tendaggi Concept.",
  path,
  image: "zanzariera",
});

export default function Page() {
  return (
    <>
      <PageHero
        variant="framed"
        image="zanzariera"
        crumb="Zanzariere"
        title="Zanzariere"
        lead="Finestre e portefinestre aperte, insetti fuori: zanzariere su misura avvolgibili, a battente, plissé, scorrevoli e motorizzate."
        position="50% 60%"
      />
      <Intro
        id="zanzariere-intro"
        title="Aria, senza ospiti"
        statement="Una buona zanzariera si nota solo quando manca: discreta di giorno, indispensabile la sera."
        text={[
          "Il modello giusto dipende dall'apertura: una finestra stretta, una portafinestra usata di continuo, una grande vetrata scorrevole.",
          "Valutiamo con te ingombri, passaggio e comando, e realizziamo la zanzariera sulle misure del serramento.",
        ]}
      />
      <OfferColumns
        id="zanzariere-tipi"
        title={["Un modello", "per ogni apertura."]}
        tone="bg-ivory"
        items={[
          {
            name: "Avvolgibili verticali",
            text: "Il telo scende dall'alto e si riavvolge nel cassonetto: la scelta classica per le finestre.",
          },
          { name: "Avvolgibili laterali", text: "Il telo scorre di lato, adatto alle portefinestre e ai passaggi." },
          { name: "A battente", text: "Si apre come una porta, comoda per gli accessi usati spesso." },
          { name: "Plissé", text: "Il telo pieghettato si raccoglie in poco spazio, anche su aperture ampie." },
          { name: "Scorrevoli", text: "Pannelli che scorrono su guida, per vetrate e grandi aperture." },
          {
            name: "Motorizzate",
            text: "Apertura e chiusura con un comando, per finestre alte o difficili da raggiungere.",
          },
        ]}
      />
      <PhotoPair
        first="veloColline"
        second="pergolaPiscina"
        captions={[
          "Ambientazione illustrativa · Portefinestre sulle colline",
          "Ambientazione illustrativa · Grandi aperture sull'esterno",
        ]}
        tone="bg-warm pt-[var(--section-gap)]"
      />
      <Process />
      <Related current={path} />
      <Consult
        image="tramontoVetrate"
        title={["Finestre aperte,", "sere tranquille."]}
        text="Dicci quante e quali aperture vuoi proteggere: ti proponiamo il modello più adatto a ciascuna."
        position="40% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Zanzariere", path }])} />
    </>
  );
}
