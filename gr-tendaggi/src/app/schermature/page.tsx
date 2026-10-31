import { PageHero } from "@/components/page/PageHero";
import { Intro, PhotoPair, Process, Related } from "@/components/page/Blocks";
import { OfferIndex } from "@/components/page/OfferIndex";
import { Consult } from "@/components/home/Consult";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/schermature";

export const metadata = pageMeta({
  title: "Schermature e sistemi oscuranti",
  description:
    "Tende tecniche filtranti e oscuranti, veneziane con lamelle da 50, 25 e 16 mm, tapparelle. Schermature su misura a Bologna e in Emilia-Romagna.",
  path,
  image: "ristoranteTecniche",
});

export default function Page() {
  return (
    <>
      <PageHero
        image="ristoranteTecniche"
        crumb="Schermature e oscuranti"
        title="Schermature e oscuranti"
        lead="Tende tecniche, veneziane e tapparelle per regolare luce, calore e privacy, in casa e negli spazi di lavoro."
        position="55% 50%"
      />
      <Intro
        id="schermature-intro"
        title="Dosare la luce"
        statement="Non sempre serve il buio: spesso basta togliere il riverbero e tenere fuori il calore."
        text={[
          "Le schermature lavorano dove la luce è più intensa: uffici con monitor, sale affacciate a sud, camere da letto, vetrine e locali.",
          "Le tende tecniche sono disponibili in vari gradi di trasparenza o di oscuramento; veneziane e tapparelle completano le soluzioni per ogni apertura.",
        ]}
      />
      <OfferIndex
        id="schermature-offerta"
        title="Tre modi di schermare"
        items={[
          {
            name: "Tende tecniche",
            text: "Tessuti tecnici in vari gradi di trasparenza o di oscuramento, per case, uffici e attività.",
            image: "ristoranteTecniche",
          },
          {
            name: "Veneziane",
            text: "Lamelle orientabili disponibili in 50, 25 e 16 mm, per dosare la luce con precisione.",
          },
          {
            name: "Tapparelle",
            text: "Avvolgibili per oscurare e proteggere le aperture, la sera e quando la casa resta chiusa.",
            image: "tapparella",
          },
        ]}
      />
      <PhotoPair
        first="tapparella"
        second="ristoranteTecniche"
        mirrored
        captions={[
          "Ambientazione illustrativa · Tapparella avvolgibile",
          "Ambientazione illustrativa · Tende tecniche in sala",
        ]}
        tone="bg-warm pt-[var(--section-gap)]"
      />
      <Process />
      <Related current={path} />
      <Consult
        image="doppiaAltezza"
        title={["Luce sì,", "riverbero no."]}
        text="Raccontaci l'ambiente e l'esposizione: ti aiutiamo a scegliere grado di oscuramento e sistema."
        position="55% 50%"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Schermature e oscuranti", path }])} />
    </>
  );
}
