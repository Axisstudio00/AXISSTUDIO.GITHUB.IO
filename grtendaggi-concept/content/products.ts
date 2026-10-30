import type { ImageKey } from './images';

// Catalogo soluzioni.
// `verified` raccoglie le affermazioni ritrovate sul sito attuale; il resto dei testi descrive
// la tipologia di prodotto in modo generale ed è DA VALIDARE con il cliente (materiali,
// marchi, garanzie e prestazioni non sono stati inventati e non vanno aggiunti senza conferma).

export type CategoryId = 'interni' | 'esterni' | 'protezioni' | 'chiusure' | 'servizi';

export type Category = {
  id: CategoryId;
  title: string;
  short: string;
  intro: string;
  image: ImageKey;
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  /** Riga sotto il titolo, nelle liste. */
  short: string;
  /** Titolo editoriale della pagina (max ~30 caratteri). */
  headline: string;
  lead: string;
  body: string[];
  features: { title: string; text: string }[];
  uses: string[];
  variants?: string[];
  verified?: string[];
  image: ImageKey;
  gallery: ImageKey[];
  seo: { title: string; description: string };
  /** URL del sito attuale da reindirizzare qui (vedi public/_redirects). */
  legacy?: string[];
};

export const categories: Category[] = [
  {
    id: 'interni',
    title: 'Soluzioni per interni',
    short: 'Tende d’arredo, a rullo, veneziane, tende tecniche',
    intro: 'Tessuti e sistemi che dosano la luce nelle stanze, dalla zona giorno all’ufficio.',
    image: 'interni',
  },
  {
    id: 'esterni',
    title: 'Soluzioni per esterni',
    short: 'Tende da sole, pergotende, bioclimatiche',
    intro: 'Ombra, riparo e spazio in più per balconi, terrazzi, giardini e vetrine.',
    image: 'esterni',
  },
  {
    id: 'protezioni',
    title: 'Schermature e protezioni',
    short: 'Tapparelle, zanzariere, inferriate',
    intro: 'Buio quando serve, aria senza insetti, sicurezza alle finestre.',
    image: 'tapparelle',
  },
  {
    id: 'chiusure',
    title: 'Chiusure e infissi',
    short: 'Infissi e scuri, vetrate panoramiche, Crystal invernali',
    intro: 'Serramenti, scuri e chiusure trasparenti per vivere gli spazi tutto l’anno.',
    image: 'chiusure',
  },
  {
    id: 'servizi',
    title: 'Tappezzeria e servizi',
    short: 'Tappezzeria, manutenzione, motorizzazione, sostituzione tessuti',
    intro: 'Rivestimenti, riparazioni e cura nel tempo di ciò che è già installato.',
    image: 'manutenzione',
  },
];

export const products: Product[] = [
  // ——— Interni
  {
    slug: 'tende-interne-arredo',
    name: 'Tende interne d’arredo',
    category: 'interni',
    short: 'Tessuti, pieghe e binari scelti per ogni stanza',
    headline: 'Il tessuto fa la stanza',
    lead: 'Tende confezionate su misura per filtrare la luce, garantire riservatezza e completare l’arredo.',
    body: [
      'Una tenda d’arredo cambia il modo in cui la luce entra in casa: un lino leggero la diffonde, un tessuto pesante la trattiene. Per questo la scelta parte dalla stanza, dall’esposizione e dall’uso, prima ancora che dal colore.',
      'Insieme definiamo tessuto, tipo di confezione e sistema di montaggio, poi prendiamo le misure sul posto e seguiamo la posa.',
    ],
    features: [
      { title: 'Su misura', text: 'Altezze, larghezze e drappeggio calcolati sulla finestra reale, non su formati standard.' },
      { title: 'Filtranti o oscuranti', text: 'Tessuti velati per diffondere la luce o tessuti coprenti per le camere.' },
      { title: 'Binari e bastoni', text: 'Sistemi di montaggio a soffitto o a parete, scelti in base allo spazio.' },
    ],
    uses: ['Soggiorni e zone giorno', 'Camere da letto', 'Uffici e studi professionali', 'Hotel e attività ricettive'],
    variants: ['Tende a pannello', 'Tende arricciate', 'Tende a onda', 'Doppia tenda: velo e coprente'],
    image: 'interni',
    gallery: ['interni', 'hero', 'campionario'],
    seo: {
      title: 'Tende interne d’arredo su misura a Bologna',
      description:
        'Tende da interno su misura a Bologna e in Emilia-Romagna: scelta dei tessuti, confezione e posa. Richiedi una consulenza a GRtendaggi Concept.',
    },
    legacy: ['/tende-interne-darredo/'],
  },
  {
    slug: 'tende-a-rullo',
    name: 'Tende a rullo',
    category: 'interni',
    short: 'Un telo che sale e scende, pulito e preciso',
    headline: 'Luce, alla giusta altezza',
    lead: 'Tende a rullo per interni con teli filtranti o oscuranti, a comando manuale o motorizzato.',
    body: [
      'La tenda a rullo è la soluzione più essenziale: un telo avvolto su un tubo che si ferma all’altezza desiderata. Occupa poco spazio e si adatta a finestre, portefinestre e vetrate.',
      'Il tipo di telo decide il risultato: trasparente per schermare il sole mantenendo la vista, oscurante per le camere e le sale riunioni.',
    ],
    features: [
      { title: 'Ingombro minimo', text: 'Montaggio a soffitto, a parete o sul vetro, a seconda del serramento.' },
      { title: 'Teli diversi', text: 'Filtranti, screen e oscuranti, da valutare in base all’esposizione.' },
      { title: 'Manuale o motorizzata', text: 'Comando a catenella o motore, anche per più tende insieme.' },
    ],
    uses: ['Camere e zone notte', 'Cucine e bagni', 'Uffici', 'Negozi e vetrine'],
    variants: ['Rullo filtrante', 'Rullo oscurante', 'Rullo screen', 'Comando motorizzato'],
    image: 'rullo',
    gallery: ['rullo', 'tecniche', 'interni'],
    seo: {
      title: 'Tende a rullo su misura a Bologna',
      description:
        'Tende a rullo filtranti e oscuranti, manuali o motorizzate, su misura a Bologna e provincia. Sopralluogo, misure e installazione.',
    },
  },
  {
    slug: 'veneziane',
    name: 'Veneziane',
    category: 'interni',
    short: 'Lamelle da 50, 25 e 16 mm, manuali o motorizzate',
    headline: 'Lamelle da 50, 25 e 16 mm',
    lead: 'Veneziane disponibili con lamelle da 50 mm, 25 mm e 16 mm, nei modelli manuali e motorizzati.',
    body: [
      'Orientando le lamelle si decide quanta luce entra e da dove: verso il soffitto per una luce indiretta, chiuse per oscurare, aperte per guardare fuori.',
      'La larghezza della lamella cambia il carattere della finestra: la 50 mm ha un segno architettonico deciso, la 25 mm è la misura più versatile, la 16 mm è la più discreta e si adatta anche ai vetri.',
    ],
    features: [
      { title: 'Tre larghezze di lamella', text: '50 mm, 25 mm e 16 mm, da scegliere in base alla finestra e all’effetto desiderato.' },
      { title: 'Manuali o motorizzate', text: 'Comando tradizionale oppure motorizzazione per finestre alte o difficili da raggiungere.' },
      { title: 'Luce orientabile', text: 'L’inclinazione delle lamelle regola la luce senza alzare la tenda.' },
    ],
    uses: ['Studi e uffici', 'Cucine', 'Bagni', 'Zone giorno con forte esposizione'],
    variants: ['Lamella 50 mm', 'Lamella 25 mm', 'Lamella 16 mm', 'Versione motorizzata'],
    verified: ['Lamelle da 50 mm, 25 mm e 16 mm', 'Modelli manuali e motorizzati'],
    image: 'veneziane',
    gallery: ['veneziane', 'tecniche', 'rullo'],
    seo: {
      title: 'Veneziane a Bologna: lamelle 50, 25 e 16 mm',
      description:
        'Veneziane su misura a Bologna con lamelle da 50, 25 e 16 mm, manuali o motorizzate. Consulenza e installazione GRtendaggi Concept.',
    },
    legacy: ['/veneziane-disponibili-in-50mm-25mm-e-16mm/'],
  },
  {
    slug: 'tende-tecniche',
    name: 'Tende tecniche',
    category: 'interni',
    short: 'Tessuti ignifughi e comandi domotici',
    headline: 'Per gli spazi che lavorano',
    lead: 'Tende tecniche per uffici, attività e spazi pubblici, con tessuti ignifughi e possibilità di controllo domotico.',
    body: [
      'Negli ambienti di lavoro una tenda deve rispondere a requisiti precisi: controllo dell’abbagliamento sugli schermi, comfort termico, sicurezza antincendio.',
      'Le tende tecniche uniscono tessuti certificati e meccanismi affidabili, con la possibilità di gestire le tende dal sistema domotico dell’edificio.',
    ],
    features: [
      { title: 'Tessuti ignifughi', text: 'Teli adatti agli ambienti in cui sono richiesti requisiti di reazione al fuoco.' },
      { title: 'Controllo domotico', text: 'Comando centralizzato, scenari e integrazione con i sistemi smart home.' },
      { title: 'Comfort visivo', text: 'Teli screen che riducono il riverbero mantenendo la vista verso l’esterno.' },
    ],
    uses: ['Uffici e open space', 'Sale riunioni', 'Negozi e showroom', 'Strutture ricettive e scuole'],
    variants: ['Rullo screen', 'Tende a pannello', 'Sistemi motorizzati e domotici'],
    verified: ['Tessuti ignifughi', 'Controllo domotico / smart home'],
    image: 'tecniche',
    gallery: ['tecniche', 'rullo', 'veneziane'],
    seo: {
      title: 'Tende tecniche a Bologna: ignifughe e domotiche',
      description:
        'Tende tecniche per uffici e attività a Bologna: tessuti ignifughi, teli screen e controllo domotico. Sopralluogo e posa in opera.',
    },
    legacy: ['/tende-tecniche/'],
  },

  // ——— Esterni
  {
    slug: 'tende-da-sole',
    name: 'Tende da sole',
    category: 'esterni',
    short: 'Per balconi, terrazzi, giardini e vetrine',
    headline: 'Ombra dove serve',
    lead: 'Tende da sole per balconi, terrazzi, giardini e vetrine commerciali: riparo da sole, calore e intemperie.',
    body: [
      'Una tenda da sole ben scelta rende vivibile il balcone nelle ore più calde e protegge la casa dal surriscaldamento estivo.',
      'Valutiamo esposizione, spazio disponibile e facciata per scegliere il sistema più adatto, il tessuto e il tipo di comando.',
    ],
    features: [
      { title: 'Per ogni spazio', text: 'Balconi, terrazzi, giardini e vetrine di negozi e locali.' },
      { title: 'Protezione', text: 'Riparo dal sole diretto, dal calore e dalle intemperie leggere.' },
      { title: 'Comando a scelta', text: 'Manovra manuale o motorizzata, da valutare in sopralluogo.' },
    ],
    uses: ['Balconi', 'Terrazzi', 'Giardini', 'Vetrine commerciali e dehors'],
    variants: ['A bracci', 'A caduta', 'Cappottine', 'Tende per vetrine'],
    verified: ['Per balconi, terrazzi, giardini e vetrine commerciali', 'Protezione da sole, calore e intemperie'],
    image: 'esterni',
    gallery: ['esterni', 'pergola', 'crystal'],
    seo: {
      title: 'Tende da sole a Bologna su misura',
      description:
        'Tende da sole su misura a Bologna e in Emilia-Romagna per balconi, terrazzi, giardini e vetrine. Consulenza, installazione e manutenzione.',
    },
  },
  {
    slug: 'pergotende',
    name: 'Pergotende',
    category: 'esterni',
    short: 'Una struttura con copertura in tessuto scorrevole',
    headline: 'Il terrazzo diventa stanza',
    lead: 'Pergotende con struttura portante e copertura in tessuto che si apre e si chiude, per vivere l’esterno con continuità.',
    body: [
      'La pergotenda unisce la solidità di una pergola alla flessibilità di una tenda: la copertura scorre sulle guide e si raccoglie quando si vuole il cielo aperto.',
      'È adatta a terrazzi, giardini e spazi esterni di locali; può essere completata con chiusure laterali.',
    ],
    features: [
      { title: 'Copertura mobile', text: 'Telo che si estende e si raccoglie lungo le guide della struttura.' },
      { title: 'Spazio esterno abitabile', text: 'Un’area ombreggiata e riparata da arredare.' },
      { title: 'Completabile', text: 'Possibili chiusure laterali, ad esempio con teli Crystal o vetrate.' },
    ],
    uses: ['Terrazzi', 'Giardini', 'Dehors di bar e ristoranti'],
    image: 'pergola',
    gallery: ['pergola', 'esterni', 'crystal'],
    seo: {
      title: 'Pergotende a Bologna',
      description:
        'Pergotende su misura a Bologna per terrazzi, giardini e dehors. Progettazione, installazione e assistenza di GRtendaggi Concept.',
    },
  },
  {
    slug: 'tende-bioclimatiche',
    name: 'Tende bioclimatiche',
    category: 'esterni',
    short: 'Lamelle orientabili per luce e aria',
    headline: 'Lamelle che seguono il sole',
    lead: 'La soluzione più innovativa per vivere l’esterno con comfort e risparmio energetico: una copertura a lamelle orientabili.',
    body: [
      'Le lamelle ruotano per lasciar passare la luce, creare ombra o favorire la ventilazione naturale; chiuse, formano una copertura continua.',
      'Gestire luce e calore sullo spazio esterno aiuta anche a contenere il surriscaldamento degli ambienti interni adiacenti.',
    ],
    features: [
      { title: 'Lamelle orientabili', text: 'Regolazione di luce, ombra e ventilazione.' },
      { title: 'Comfort tutto l’anno', text: 'Uno spazio esterno utilizzabile per più mesi.' },
      { title: 'Risparmio energetico', text: 'Controllo dell’irraggiamento sulle superfici vetrate adiacenti.' },
    ],
    uses: ['Terrazzi e attici', 'Giardini', 'Spazi esterni di attività ricettive'],
    verified: ['Presentata come la soluzione più innovativa per comfort e risparmio energetico'],
    image: 'pergola',
    gallery: ['pergola', 'vetrate', 'esterni'],
    seo: {
      title: 'Tende e pergole bioclimatiche a Bologna',
      description:
        'Pergole bioclimatiche a lamelle orientabili a Bologna e in Emilia-Romagna: comfort all’aperto e risparmio energetico. Richiedi un sopralluogo.',
    },
  },

  // ——— Protezioni
  {
    slug: 'tapparelle',
    name: 'Tapparelle',
    category: 'protezioni',
    short: 'Avvolgibili per oscurare e proteggere',
    headline: 'Buio quando serve',
    lead: 'Tapparelle per oscurare, isolare e proteggere le finestre, con fornitura, sostituzione e motorizzazione.',
    body: [
      'La tapparella resta uno dei sistemi più efficaci per oscurare completamente una stanza e proteggere il serramento dall’esterno.',
      'Seguiamo sia le nuove installazioni sia la sostituzione di tapparelle esistenti e la loro motorizzazione.',
    ],
    features: [
      { title: 'Oscuramento', text: 'Buio completo nelle camere e protezione dal calore estivo.' },
      { title: 'Sostituzione', text: 'Rinnovo di teli e componenti su cassonetti esistenti.' },
      { title: 'Motorizzazione', text: 'Trasformazione delle tapparelle manuali in motorizzate.' },
    ],
    uses: ['Abitazioni', 'Uffici', 'Locali commerciali'],
    image: 'tapparelle',
    gallery: ['tapparelle', 'chiusure', 'inferriate'],
    seo: {
      title: 'Tapparelle a Bologna: installazione e sostituzione',
      description:
        'Tapparelle a Bologna: nuove installazioni, sostituzione e motorizzazione di avvolgibili. Sopralluogo e preventivo GRtendaggi Concept.',
    },
  },
  {
    slug: 'zanzariere',
    name: 'Zanzariere',
    category: 'protezioni',
    short: 'Aria aperta, insetti fuori',
    headline: 'Finestre aperte, d’estate',
    lead: 'Zanzariere su misura per finestre e porte, per tenere aperto senza far entrare gli insetti.',
    body: [
      'Una zanzariera ben fatta non si nota: scorre senza intoppi, chiude bene sui bordi e non toglie luce alla stanza.',
      'Scegliamo il sistema in base al serramento e all’uso: per una finestra della camera o per una porta finestra che si attraversa spesso.',
    ],
    features: [
      { title: 'Su misura', text: 'Realizzate sulle misure del serramento per una chiusura precisa.' },
      { title: 'Finestre e porte', text: 'Sistemi verticali per finestre e laterali per porte finestre.' },
      { title: 'Discrete', text: 'Rete sottile che lascia passare aria e luce.' },
    ],
    uses: ['Finestre', 'Porte finestre', 'Lucernari'],
    variants: ['Avvolgibile verticale', 'Laterale per porte finestre', 'A pannello fisso'],
    image: 'zanzariere',
    gallery: ['zanzariere', 'chiusure', 'tapparelle'],
    seo: {
      title: 'Zanzariere su misura a Bologna',
      description:
        'Zanzariere su misura per finestre e porte a Bologna e provincia: sopralluogo, misure e installazione GRtendaggi Concept.',
    },
    legacy: ['/zanzariere/'],
  },
  {
    slug: 'inferriate',
    name: 'Inferriate',
    category: 'protezioni',
    short: 'Sicurezza alle finestre',
    headline: 'Sicurezza, con misura',
    lead: 'Inferriate per proteggere finestre e accessi, fisse o apribili, in armonia con la facciata.',
    body: [
      'Un’inferriata deve proteggere senza appesantire la casa. Disegno, colore e sistema di apertura vanno scelti guardando la facciata e i serramenti esistenti.',
      'Valutiamo in sopralluogo le esigenze di sicurezza e le possibilità di montaggio.',
    ],
    features: [
      { title: 'Fisse o apribili', text: 'Apribili quando la finestra è anche una via d’uscita.' },
      { title: 'Su misura', text: 'Dimensioni e disegno adattati al vano.' },
      { title: 'Coordinate', text: 'Finiture scelte con serramenti e scuri.' },
    ],
    uses: ['Piani terra e rialzati', 'Locali commerciali', 'Cantine e accessi secondari'],
    image: 'inferriate',
    gallery: ['inferriate', 'chiusure', 'tapparelle'],
    seo: {
      title: 'Inferriate per finestre a Bologna',
      description:
        'Inferriate fisse e apribili su misura a Bologna e in Emilia-Romagna. Sopralluogo, preventivo e installazione con GRtendaggi Concept.',
    },
  },

  // ——— Chiusure
  {
    slug: 'infissi-e-scuri',
    name: 'Infissi e scuri',
    category: 'chiusure',
    short: 'Serramenti, persiane e scuri',
    headline: 'Le finestre, dall’inizio',
    lead: 'Infissi e scuri per rinnovare le finestre di casa, coordinati con tende e schermature.',
    body: [
      'Serramento, scuro e tenda lavorano insieme: occuparsene con un unico interlocutore rende più semplice scegliere finiture, misure e tempi.',
      'Persiane e scuri fanno parte del paesaggio delle nostre città: li proponiamo con attenzione al carattere dell’edificio.',
    ],
    features: [
      { title: 'Un solo interlocutore', text: 'Infissi, scuri e tende progettati insieme.' },
      { title: 'Rispetto della facciata', text: 'Colori e modelli coerenti con l’edificio.' },
      { title: 'Posa in opera', text: 'Rilievo delle misure e installazione.' },
    ],
    uses: ['Ristrutturazioni', 'Sostituzione di serramenti', 'Nuove costruzioni'],
    image: 'chiusure',
    gallery: ['chiusure', 'esterni', 'inferriate'],
    seo: {
      title: 'Infissi e scuri a Bologna',
      description:
        'Infissi, persiane e scuri a Bologna e provincia, coordinati con tende e schermature. Sopralluogo e preventivo GRtendaggi Concept.',
    },
  },
  {
    slug: 'vetrate-panoramiche',
    name: 'Vetrate panoramiche',
    category: 'chiusure',
    short: 'Sistemi di chiusura trasparenti',
    headline: 'Chiudere senza perdere la vista',
    lead: 'Vetrate panoramiche e sistemi di chiusura per verande, terrazzi e dehors, per proteggere senza rinunciare alla vista.',
    body: [
      'Le vetrate panoramiche chiudono uno spazio esterno con superfici trasparenti, proteggendolo da vento e pioggia e mantenendo la luce.',
      'Possono completare pergotende e bioclimatiche, trasformando il terrazzo in uno spazio utilizzabile anche nelle mezze stagioni.',
    ],
    features: [
      { title: 'Vista libera', text: 'Superfici ampie e profili ridotti.' },
      { title: 'Protezione', text: 'Riparo da vento e pioggia.' },
      { title: 'Abbinabili', text: 'Integrabili con pergotende e coperture bioclimatiche.' },
    ],
    uses: ['Verande', 'Terrazzi', 'Dehors di locali'],
    image: 'vetrate',
    gallery: ['vetrate', 'pergola', 'crystal'],
    seo: {
      title: 'Vetrate panoramiche a Bologna',
      description:
        'Vetrate panoramiche e sistemi di chiusura per terrazzi, verande e dehors a Bologna. Consulenza e installazione GRtendaggi Concept.',
    },
  },
  {
    slug: 'crystal-invernali',
    name: 'Crystal invernali',
    category: 'chiusure',
    short: 'Chiusure trasparenti in PVC per l’inverno',
    headline: 'Il dehors anche a gennaio',
    lead: 'Chiusure invernali Crystal in PVC trasparente per proteggere dehors, verande e pergole dal freddo.',
    body: [
      'I teli Crystal chiudono lo spazio esterno nei mesi freddi lasciando passare la luce, e si avvolgono quando torna la bella stagione.',
      'Sono una soluzione molto usata per bar e ristoranti, ma anche per verande e pergole private.',
    ],
    features: [
      { title: 'Trasparenti', text: 'Teli in PVC trasparente che mantengono luce e visibilità.' },
      { title: 'Stagionali', text: 'Si chiudono d’inverno e si raccolgono d’estate.' },
      { title: 'Su strutture esistenti', text: 'Applicabili a pergole, pergotende e tende.' },
    ],
    uses: ['Dehors di bar e ristoranti', 'Verande', 'Pergole private'],
    verified: ['Chiusure invernali Crystal in PVC'],
    image: 'crystal',
    gallery: ['crystal', 'vetrate', 'esterni'],
    seo: {
      title: 'Chiusure Crystal invernali a Bologna',
      description:
        'Chiusure invernali Crystal in PVC trasparente per dehors, verande e pergole a Bologna e in Emilia-Romagna. Richiedi un preventivo.',
    },
  },

  // ——— Servizi
  {
    slug: 'tappezzeria',
    name: 'Tappezzeria',
    category: 'servizi',
    short: 'Imbottiture e rivestimenti di divani, poltrone, letti',
    headline: 'Rifoderare, non sostituire',
    lead: 'Tappezzeria in generale: imbottitura e rivestimento di divani, poltrone e letti, riparazioni comprese.',
    body: [
      'Un divano comodo o una poltrona a cui si è affezionati meritano spesso una seconda vita: nuova imbottitura, nuovo rivestimento, riparazione della struttura.',
      'Scegliamo insieme il tessuto, anche coordinato con le tende della stanza.',
    ],
    features: [
      { title: 'Rivestimenti', text: 'Nuovi tessuti per divani, poltrone, testate e letti.' },
      { title: 'Imbottiture', text: 'Rifacimento delle imbottiture consumate.' },
      { title: 'Riparazioni', text: 'Interventi su sedute e strutture danneggiate.' },
    ],
    uses: ['Divani', 'Poltrone', 'Letti e testate', 'Sedute di locali'],
    verified: ['Imbottitura e rivestimento', 'Divani, poltrone e letti', 'Riparazioni'],
    image: 'tessuti',
    gallery: ['tessuti', 'campionario', 'manutenzione'],
    seo: {
      title: 'Tappezzeria a Bologna: divani, poltrone, letti',
      description:
        'Tappezzeria a Bologna: rivestimento, imbottitura e riparazione di divani, poltrone e letti. Scelta dei tessuti con GRtendaggi Concept.',
    },
    legacy: ['/tappezzeria-in-generale-imbottitura-e-rivestimento/'],
  },
  {
    slug: 'manutenzione',
    name: 'Manutenzione e motorizzazione',
    category: 'servizi',
    short: 'Riparazioni, motori e sostituzione tessuti',
    headline: 'Quello che c’è già, rinnovato',
    lead: 'Manutenzione, motorizzazione e sostituzione dei tessuti di tende e schermature già installate.',
    body: [
      'Spesso non serve cambiare tutto: un telo nuovo su una struttura sana, un motore al posto della manovella, una revisione dei meccanismi bastano a far tornare una tenda come nuova.',
      'Interveniamo su tende da sole, tende interne, tapparelle e altri sistemi, valutando caso per caso la soluzione più conveniente.',
    ],
    features: [
      { title: 'Sostituzione tessuti', text: 'Nuovi teli su strutture esistenti.' },
      { title: 'Motorizzazione', text: 'Motori per tende e tapparelle che oggi si azionano a mano.' },
      { title: 'Manutenzione', text: 'Controllo e riparazione di meccanismi e componenti.' },
    ],
    uses: ['Tende da sole', 'Tende interne', 'Tapparelle', 'Pergotende'],
    verified: ['Manutenzione', 'Sostituzione tessuti'],
    image: 'manutenzione',
    gallery: ['manutenzione', 'campionario', 'esterni'],
    seo: {
      title: 'Manutenzione e motorizzazione tende a Bologna',
      description:
        'Manutenzione, motorizzazione e sostituzione tessuti per tende da sole, tende interne e tapparelle a Bologna. Contatta GRtendaggi Concept.',
    },
  },
];

export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
