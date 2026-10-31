import manifest from "@/data/images.generated.json";

// All visuals are AI-generated illustrative settings, not photographs of completed jobs.
export const images = {
  veloControluce: {
    slug: "living-velo-controluce",
    alt: "Soggiorno con tende a velo in lino che filtrano il sole del tardo pomeriggio, divano chiaro e tavolino in pietra",
  },
  vistaLago: {
    slug: "living-vista-lago",
    alt: "Tende leggere ai lati di una grande vetrata con vista su lago e montagne, divano bianco e tavolino in travertino",
  },
  terrazzaPergola: {
    slug: "terrazza-pergola-tramonto",
    alt: "Terrazza coperta con teli leggeri mossi dal vento, salotto esterno e piscina al tramonto",
  },
  tramontoVetrate: {
    slug: "living-tramonto-vetrate",
    alt: "Soggiorno con tende filtranti lungo le vetrate e vista sul lago al tramonto",
  },
  tendeFiltranti: {
    slug: "living-tende-filtranti",
    alt: "Ampio soggiorno con tende filtranti color avorio nella luce calda del tramonto, cucina e pranzo sullo sfondo",
  },
  ristoranteTecniche: {
    slug: "ristorante-tende-tecniche",
    alt: "Sala di ristorante con tende tecniche a rullo in tessuto filtrante abbassate sulle vetrate",
  },
  doppiaAltezza: {
    slug: "living-doppia-altezza",
    alt: "Soggiorno a doppia altezza con tende lunghe filtranti, tende più coprenti ai lati e lampade ad anello",
  },
  panoramico: {
    slug: "living-panoramico-tramonto",
    alt: "Soggiorno aperto sul panorama al tramonto, con tende in lino trasparente ai lati delle vetrate",
  },
  pergolaPiscina: {
    slug: "living-pergola-piscina",
    alt: "Soggiorno con tenda a velo che si apre su una terrazza coperta, piscina e montagne",
  },
  cameraVelo: {
    slug: "camera-velo-oscurante",
    alt: "Camera da letto con tenda a velo davanti alla vetrata e tenda più pesante raccolta di lato",
  },
  veloColline: {
    slug: "living-velo-colline",
    alt: "Tende a velo lunghe fino a terra davanti alle vetrate, con vista sulle colline",
  },
  campionario: {
    slug: "campionario-tessuti",
    alt: "Campionario di tessuti per tende in diverse trame e colori, dal lino naturale al grigio antracite",
  },
  tramaLino: {
    slug: "trama-lino-macro",
    alt: "Dettaglio ravvicinato di una trama in lino attraversata dalla luce",
  },
  binario: {
    slug: "binario-tenda-dettaglio",
    alt: "Binario per tende in metallo spazzolato con teli in tessuto a onda",
  },
  tendaSole: {
    slug: "tenda-da-sole-terrazza",
    alt: "Tenda da sole a bracci estensibili su una terrazza con piscina e vista sul lago al tramonto",
  },
  pergolaLamelle: {
    slug: "pergola-bioclimatica",
    alt: "Copertura a lamelle orientabili con luce integrata sopra un salotto esterno",
  },
  zanzariera: {
    slug: "zanzariera-scorrevole",
    alt: "Zanzariera scorrevole su una portafinestra con vista sul giardino al tramonto",
  },
  tapparella: {
    slug: "tapparella-avvolgibile",
    alt: "Tapparella avvolgibile scura parzialmente abbassata su una vetrata del soggiorno",
  },
} as const;

export type ImageId = keyof typeof images;

type ManifestEntry = { width: number; height: number; widths: number[]; blur: string; color: string };

export function imageData(id: ImageId) {
  const { slug, alt } = images[id];
  const m = (manifest as Record<string, ManifestEntry>)[slug];
  return { slug, alt, ...m };
}

export function srcSet(id: ImageId, ext: "avif" | "webp") {
  const { slug, widths } = imageData(id);
  return widths.map((w) => `/images/${slug}-${w}.${ext} ${w}w`).join(", ");
}

export function fallbackSrc(id: ImageId) {
  const { slug, widths } = imageData(id);
  const w = widths.find((x) => x >= 1080) ?? widths[widths.length - 1];
  return `/images/${slug}-${w}.webp`;
}

export function ogImage(id: ImageId) {
  return `/og/${images[id].slug}.jpg`;
}
