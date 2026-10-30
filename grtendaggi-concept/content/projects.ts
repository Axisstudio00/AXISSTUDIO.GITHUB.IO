import type { ImageKey } from './images';
import type { CategoryId } from './products';

// Realizzazioni. ATTENZIONE: le voci attuali usano illustrazioni segnaposto.
// Sostituire con le foto dei lavori reali (titolo, località e categoria forniti dal cliente).
export type Project = {
  id: string;
  title: string;
  category: CategoryId;
  image: ImageKey;
  /** Località solo se confermata dal cliente. */
  place?: string;
  ratio: 'portrait' | 'landscape' | 'square';
};

export const projects: Project[] = [
  { id: 'p1', title: 'Tende in lino per zona giorno', category: 'interni', image: 'hero', ratio: 'landscape' },
  { id: 'p2', title: 'Tenda da sole su facciata con portico', category: 'esterni', image: 'esterni', ratio: 'portrait' },
  { id: 'p3', title: 'Veneziane con lamella 50 mm', category: 'interni', image: 'veneziane', ratio: 'square' },
  { id: 'p4', title: 'Copertura a lamelle orientabili', category: 'esterni', image: 'pergola', ratio: 'landscape' },
  { id: 'p5', title: 'Persiane e infisso', category: 'chiusure', image: 'chiusure', ratio: 'portrait' },
  { id: 'p6', title: 'Tende a rullo per vetrata', category: 'interni', image: 'rullo', ratio: 'landscape' },
  { id: 'p7', title: 'Chiusura Crystal per dehors', category: 'chiusure', image: 'crystal', ratio: 'landscape' },
  { id: 'p8', title: 'Zanzariera per porta finestra', category: 'protezioni', image: 'zanzariere', ratio: 'portrait' },
  { id: 'p9', title: 'Rivestimento in tessuto', category: 'servizi', image: 'tessuti', ratio: 'square' },
  { id: 'p10', title: 'Tapparella sostituita', category: 'protezioni', image: 'tapparelle', ratio: 'portrait' },
  { id: 'p11', title: 'Vetrate panoramiche su terrazzo', category: 'chiusure', image: 'vetrate', ratio: 'landscape' },
  { id: 'p12', title: 'Tende tecniche per ufficio', category: 'interni', image: 'tecniche', ratio: 'landscape' },
];
