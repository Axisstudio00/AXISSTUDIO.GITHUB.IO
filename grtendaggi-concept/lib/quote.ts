// Invio del modulo preventivo.
// Oggi: Netlify Forms (nessun backend, nessuna chiave nel frontend). Le richieste arrivano nel
// pannello Netlify → Forms e possono essere inoltrate via email o webhook.
// Domani: collegamento al gestionale GR Tendaggi Concept. Il payload è già strutturato
// (`QuotePayload`) e ogni richiesta ha un `lead_id` univoco per evitare duplicati: basterà
// configurare in Netlify un "outgoing webhook" sul form `preventivo` verso l'endpoint del gestionale,
// oppure una Netlify Function che riceve l'evento `submission-created` e lo inoltra con le
// credenziali salvate come variabili d'ambiente lato server (mai nel codice del sito).

export const FORM_NAME = 'preventivo';
export const FORM_VERSION = '2026-10';

export type QuotePayload = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  prodotto: string;
  localita: string;
  messaggio: string;
  privacy: 'si';
  lead_id: string;
  origine: string;
  pagina: string;
  versione_modulo: string;
};

export function newLeadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function submitQuote(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  const body = new URLSearchParams();
  data.forEach((v, k) => body.append(k, typeof v === 'string' ? v : v.name));
  // POST verso il file statico rilevato da Netlify in fase di deploy (public/__forms.html).
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Invio non riuscito (${res.status})`);
}
