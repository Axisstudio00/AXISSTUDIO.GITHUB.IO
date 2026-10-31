// Company data. Only details verified on grtendaggiconcept.it and public business
// directories are filled in; empty fields are rendered only once provided.
export const company = {
  name: "GR Tendaggi Concept",
  shortName: "GR Tendaggi",
  street: "Via Emilia, 134",
  postalCode: "40068",
  city: "San Lazzaro di Savena",
  province: "BO",
  region: "Emilia-Romagna",
  country: "IT",
  phones: [
    { label: "+39 379 194 4480", href: "tel:+393791944480" },
    { label: "+39 327 792 2710", href: "tel:+393277922710" },
  ],
  email: "grtendaggiconcept@gmail.com",
  areaServed: "Bologna e le province dell'Emilia-Romagna",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Emilia+134+40068+San+Lazzaro+di+Savena+BO",
  // To be provided by the company before launch (not published online):
  vatNumber: process.env.NEXT_PUBLIC_COMPANY_VAT ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  social: [] as { label: string; href: string }[],
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://grtendaggiconcept.it").replace(/\/$/, "");

export type NavItem = { href: string; label: string; short?: string };

export const solutions: NavItem[] = [
  { href: "/tende-da-interno", label: "Tende da interno" },
  { href: "/tende-da-sole", label: "Tende da sole" },
  { href: "/outdoor", label: "Outdoor e chiusure invernali", short: "Outdoor" },
  { href: "/zanzariere", label: "Zanzariere" },
  { href: "/schermature", label: "Schermature e oscuranti", short: "Schermature" },
];

export const studio: NavItem[] = [
  { href: "/materiali", label: "Materiali e soluzioni", short: "Materiali" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti e preventivi", short: "Contatti" },
];

export const legal: NavItem[] = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/cookie-policy", label: "Cookie policy" },
];

export const interestOptions = [
  "Tende da interno",
  "Tende da sole",
  "Outdoor e chiusure invernali",
  "Zanzariere",
  "Schermature e oscuranti",
  "Tappezzeria",
  "Altro",
] as const;

export const fullAddress = `${company.street}, ${company.postalCode} ${company.city} (${company.province})`;
