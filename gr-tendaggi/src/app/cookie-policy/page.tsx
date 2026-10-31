import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/page/LegalPage";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Informazioni sui cookie e sulle tecnologie di archiviazione usate dal sito di GR Tendaggi Concept.",
  alternates: { canonical: "/cookie-policy" },
};

export default function Page() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="30 ottobre 2026"
      sections={[
        {
          heading: "In breve",
          body: (
            <p>
              Questo sito non installa cookie di profilazione né cookie statistici, e non incorpora servizi di terze
              parti che li installino: i caratteri tipografici sono ospitati sul nostro server, non ci sono mappe, video
              o pulsanti social incorporati. Per questo non è richiesto alcun consenso.
            </p>
          ),
        },
        {
          heading: "Cosa memorizziamo nel tuo browser",
          body: (
            <p>
              Nulla. Il sito non salva cookie né dati nell&apos;archiviazione locale del browser. Per questo non viene
              mostrato alcun banner: secondo le linee guida del Garante, il consenso serve solo per cookie e strumenti
              diversi da quelli tecnici.
            </p>
          ),
        },
        {
          heading: "Collegamenti esterni",
          body: (
            <p>
              Alcuni link aprono servizi esterni, come Google Maps per le indicazioni stradali. Questi servizi vengono
              caricati solo se scegli di aprirli e applicano le proprie informative su privacy e cookie.
            </p>
          ),
        },
        {
          heading: "Come gestire i cookie",
          body: (
            <p>
              Puoi controllare ed eliminare cookie e dati salvati dalle impostazioni del tuo browser. Se in futuro il
              sito introdurrà strumenti di statistica o di marketing, questi verranno attivati solo dopo il tuo consenso
              esplicito e la presente informativa sarà aggiornata.
            </p>
          ),
        },
        {
          heading: "Titolare",
          body: (
            <p>
              Per i dati del titolare e per esercitare i tuoi diritti consulta la{" "}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
