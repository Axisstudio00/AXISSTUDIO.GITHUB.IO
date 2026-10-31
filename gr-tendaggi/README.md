# GR Tendaggi Concept — The Art of Light

Sito multipagina per GR Tendaggi Concept (Via Emilia 134, San Lazzaro di Savena, BO).
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger.

## Avvio

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Rigenerare le immagini ottimizzate dopo aver cambiato gli originali in `assets/originals/`:

```bash
npm run images       # asset derivati, AVIF + WebP responsive in public/images, crop Open Graph in public/og
```

Le varianti già presenti in `public/images` non vengono ricodificate; per rigenerarle dopo una modifica:
`FORCE=1 npm run images`.

## Configurazione (`.env.local`, vedi `.env.example`)

| Variabile | A cosa serve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico per canonical, sitemap e Open Graph |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Invio del modulo preventivi tramite [Resend](https://resend.com). Il mittente deve appartenere a un dominio verificato su Resend. |
| `NEXT_PUBLIC_COMPANY_VAT` | Partita IVA, mostrata in footer, privacy e dati strutturati solo se impostata |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero WhatsApp aziendale verificato (formato `393791944480`); il link compare solo se impostato |

**Modulo contatti.** La validazione è condivisa tra client e server (`src/lib/contact-schema.ts`). L'API
`/api/contact` controlla origine, content-type, dimensione, campo anti-spam nascosto, tempo minimo di
compilazione e limita 5 invii ogni 10 minuti per IP. Finché le variabili Resend non sono impostate risponde
`503 not_configured` e il modulo lo dice chiaramente, proponendo email precompilata e telefono: nessun invio
viene simulato. Il limite per IP è in memoria: su hosting serverless con più istanze conviene spostarlo su
uno store condiviso (es. Upstash Redis).

## Deploy

Il sito usa una route API server-side, quindi **non può girare su GitHub Pages** (solo file statici).
È configurato per **Netlify** tramite `netlify.toml` e il runtime ufficiale `@netlify/plugin-nextjs`, che
trasforma le pagine dinamiche e `/api/contact` in Netlify Functions.

1. Su Netlify: *Add new project → Import an existing project* e scegliere questo repository.
2. *Base directory*: `gr-tendaggi`. Build command e publish directory vengono letti da `netlify.toml`
   (`npm run build`, `.next`): se nel pannello sono impostati valori diversi, svuotarli o allinearli.
3. *Site configuration → Environment variables*: aggiungere le variabili della tabella sopra
   (`NEXT_PUBLIC_SITE_URL` con il dominio definitivo, le tre variabili Resend per attivare il modulo).
4. Avviare il deploy. Nel log deve comparire il plugin `@netlify/plugin-nextjs` e, in *Functions bundling*,
   la funzione `___netlify-server-handler`: se le funzioni deployate sono 0, il runtime non è stato applicato
   e le pagine rispondono 404.

Le variabili `NEXT_PUBLIC_*` vengono incorporate durante la build: dopo averle cambiate serve un nuovo deploy.

Verifica in locale, senza pubblicare nulla:

```bash
npx netlify-cli build --offline
```

## Struttura

```
src/app/                 pagine (una cartella per route), sitemap.ts, robots.ts, api/contact
src/components/site/     header con menu a tutto schermo, footer, motion globale, barra di avanzamento
src/components/home/     sezioni della homepage
src/components/page/     blocchi delle pagine interne (hero, indice offerta, colonne, coppie foto, processo)
src/lib/                 dati aziendali, catalogo immagini, schema modulo, dati strutturati, GSAP
assets/originals/        le 18 immagini originali, conservate intatte
```

## Mappa immagini → sezioni

Tutte le immagini sono ambientazioni illustrative generate digitalmente: sul sito sono presentate come tali,
mai come lavori eseguiti.

| # | File | Contenuto | Dove |
| --- | --- | --- | --- |
| 01 | living-velo-controluce (4:5) | Velo in lino controluce | Manifesto, Ispirazioni, Tende da interno, Chi siamo, Contatti, Consulenza Materiali |
| 02 | living-vista-lago (4:5) | Teli ai lati della vetrata, lago | Manifesto, Tende da interno |
| 03 | terrazza-pergola-tramonto (16:9) | Terrazza coperta con teli | Scena outdoor, Tende da sole, Outdoor |
| 04 | living-tramonto-vetrate (16:9) | Soggiorno sul lago al tramonto | Ispirazioni, Consulenza Zanzariere e Chi siamo |
| 05 | living-tende-filtranti (3:2) | Tende filtranti avorio | Hero (dissolvenza), Tende da interno, Chi siamo |
| 06 | ristorante-tende-tecniche (3:2) | Tende tecniche a rullo | Soluzioni, Schermature |
| 07 | living-doppia-altezza (3:2) | Doppia altezza, due tessuti | Hero (dissolvenza), Ispirazioni, Chi siamo |
| 08 | living-panoramico-tramonto (16:9) | Soggiorno panoramico | **Hero**, Contatti, OG predefinita |
| 09 | living-pergola-piscina (16:9) | Soggiorno verso la terrazza | Consulenza Home, Ispirazioni, Outdoor |
| 10 | camera-velo-oscurante (4:5) | Camera, velo + tenda coprente | Cursore "Quanta luce?", 404 |
| 11 | living-velo-colline (4:5) | Veli fino a terra, colline | Soluzioni, hero Tende da interno |
| 12 | campionario-tessuti (1:1) | Campionario tessuti | Materiali (home), hero Materiali |
| 13 | trama-lino-macro (1:1) | Macro trama in lino | Materiali, texture del cursore |
| 14 | binario-tenda-dettaglio (1:1) | Binario e teli a onda | Materiali |
| 15 | tenda-da-sole-terrazza (16:9) | Tenda da sole a bracci | Soluzioni, scena outdoor, hero Tende da sole |
| 16 | pergola-bioclimatica (16:9) | Copertura a lamelle | Soluzioni, scena outdoor, hero Outdoor |
| 17 | zanzariera-scorrevole (4:5) | Zanzariera scorrevole | Soluzioni, Ispirazioni, hero Zanzariere |
| 18 | tapparella-avvolgibile (4:5) | Tapparella avvolgibile | Ispirazioni, Schermature |

**Asset derivati** (`assets/derived`, generati da `scripts/derived-assets.mjs` a partire dagli originali, che
restano intatti):

| File | Origine | Uso |
| --- | --- | --- |
| tenda-intro-velo | ritaglio dei veli dell'immagine 11 | Tende dell'intro, desktop |
| tenda-intro-velo-stretto | ritaglio del velo dell'immagine 01 | Tende dell'intro, mobile |
| camera-filtrante | immagine 10 + un secondo velo più fitto sulla vetrata | Simulatore, stato Filtrante |
| camera-oscurante | immagine 10 + il tendaggio opaco della stessa stanza sulla vetrata, luce dalla finestra ridotta, lampada accesa | Simulatore, stato Oscurante |

## Intro della homepage

Alla prima apertura della homepage in una sessione, due pannelli di velo (texture fotografica, pieghe, ombra
sul bordo e sull'orlo) coprono la foto; una GSAP Timeline li apre verso i lati mentre la stanza si schiarisce,
poi entrano titolo, sottotitolo, CTA e navigazione (circa 3 s su desktop, 2,3 s su mobile, con pannelli singoli
e texture più leggera).

- Lo script inline in `layout.tsx` arma l'intro prima del primo frame, quindi non c'è flash della pagina sotto.
- Non si ripete nella stessa sessione (`sessionStorage`), né nella navigazione interna.
- Si salta con il pulsante "Salta l'introduzione", con un tasto qualsiasi, con la rotella o con lo scroll touch.
- Con `prefers-reduced-motion` non parte.
- Se il JavaScript non parte, dopo 4 s le tende si aprono comunque via CSS.

## Simulatore "Quanta luce?"

Tre stati della stessa fotografia (Velo = originale, Filtrante, Oscurante) sovrapposti e sfumati con l'opacità
in base al cursore: geometria, arredi e inquadratura non cambiano, varia solo la vetrata con il suo tessuto e
la luce che entra. È una simulazione indicativa costruita su un'unica fotografia generata, ed è dichiarata come
tale sul sito. Per una resa fotorealistica servono tre scatti reali della stessa stanza, da treppiede e con la
stessa esposizione, con velo, filtrante e oscurante montati (oppure tre render della stessa scena). Basta
sostituire i tre file in `assets/originals` e `assets/derived` mantenendo i nomi.

## Da verificare con l'azienda prima della pubblicazione

- **Fonti dei dati.** Indirizzo, telefoni, email e servizi sono stati ricavati dalle pagine indicizzate di
  grtendaggiconcept.it e da elenchi aziendali, perché il sito non era raggiungibile dall'ambiente di sviluppo.
  Vanno confermati, in particolare i due numeri di telefono.
- **Pergole.** Non risultano tra i servizi pubblicati, quindi la pagina richiesta "Pergole e outdoor" è stata
  adattata in "Outdoor e chiusure invernali" (Crystal in PVC o vetro flessibile, tende da sole). Se l'azienda
  installa pergole, si aggiunge la voce.
- **Dati mancanti.** Partita IVA, numero WhatsApp, profili social e orari non sono stati trovati e non sono
  pubblicati.
- **Testi legali.** Privacy e cookie policy sono bozze basate sui servizi realmente attivi (nessun cookie,
  nessuna analytics, font ospitati in locale): vanno verificate da un consulente, che deve anche definire i
  tempi di conservazione. Se si aggiungono strumenti di statistica, serve un banner di consenso preventivo.
- **Realizzazioni.** La pagina non esiste di proposito: va aggiunta solo con fotografie reali dei lavori.
