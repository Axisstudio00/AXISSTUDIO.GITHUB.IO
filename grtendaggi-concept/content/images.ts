// Registro immagini. Ogni chiave corrisponde a /public/images/<dir>/<chiave>-<larghezza>.webp
// Le illustrazioni attuali sono segnaposto disegnati (scripts/scenes.js): sostituire con foto originali
// mantenendo gli stessi nomi file, oppure aggiungere nuove chiavi con `dir: 'foto'`.
export type ImageKey =
  | 'hero' | 'interni' | 'veneziane' | 'esterni' | 'chiusure' | 'pergola' | 'tessuti'
  | 'campionario' | 'zanzariere' | 'tapparelle' | 'rullo' | 'tecniche' | 'vetrate'
  | 'crystal' | 'inferriate' | 'manutenzione';

export const imageWidths = [640, 1024, 1600, 2400] as const;
export const imageRatio = { w: 2400, h: 1600 };

export const imageDir: Record<ImageKey, string> = Object.fromEntries(
  ([
    'hero', 'interni', 'veneziane', 'esterni', 'chiusure', 'pergola', 'tessuti', 'campionario',
    'zanzariere', 'tapparelle', 'rullo', 'tecniche', 'vetrate', 'crystal', 'inferriate', 'manutenzione',
  ] as ImageKey[]).map((k) => [k, 'placeholder']),
) as Record<ImageKey, string>;

export const imageSrc = (key: ImageKey, w: number) => `/images/${imageDir[key]}/${key}-${w}.webp`;
