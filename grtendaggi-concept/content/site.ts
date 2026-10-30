// Dati aziendali. Fonte: sito attuale (indicizzato) e schede directory (PagineGialle, PagineBianche, Virgilio).
// Tutto ciò che è `null` va richiesto al cliente prima della pubblicazione.
export const site = {
  name: 'GRtendaggi Concept',
  shortName: 'GRtendaggi',
  url: 'https://grtendaggiconcept.it',
  description:
    'Tende, schermature solari e chiusure su misura a Bologna e in Emilia-Romagna: consulenza, realizzazione, installazione e manutenzione.',
  address: {
    street: 'Via Emilia 134',
    postalCode: '40068',
    city: 'San Lazzaro di Savena',
    province: 'BO',
    region: 'Emilia-Romagna',
    country: 'IT',
  },
  phones: [
    { label: '379 194 4480', href: 'tel:+393791944480', e164: '+393791944480' },
    { label: '327 792 2710', href: 'tel:+393277922710', e164: '+393277922710' },
  ],
  // DA VERIFICARE: quale numero è attivo su WhatsApp.
  whatsapp: {
    number: '393791944480',
    message: 'Buongiorno, vorrei informazioni per un preventivo.',
  },
  email: 'grtendaggiconcept@gmail.com',
  area: 'Bologna e tutte le province dell’Emilia-Romagna',
  // Non presenti tra le fonti verificate: lasciare vuoti finché il cliente non li conferma.
  social: [] as { label: string; href: string }[],
  vatNumber: null as string | null,
  legalName: null as string | null,
  openingHours: null as { days: string; hours: string }[] | null,
  // Coordinate GPS: da ricavare dalla scheda Google Business del cliente (non inventate).
  geo: null as { lat: number; lng: number } | null,
  // true finché le immagini sono illustrazioni segnaposto (mostra una nota onesta nella galleria).
  placeholderImages: true,
} as const;

export const whatsappHref = (text: string = site.whatsapp.message) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.address.street}, ${site.address.postalCode} ${site.address.city} ${site.address.province}`,
)}`;
