import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/page/LegalPage";
import { company, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Informativa sul trattamento dei dati personali raccolti dal sito di GR Tendaggi Concept.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="30 ottobre 2026"
      sections={[
        {
          heading: "Titolare del trattamento",
          body: (
            <p>
              {company.name}, {fullAddress}
              {company.vatNumber ? `, P. IVA ${company.vatNumber}` : ""}. Email:{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>.
            </p>
          ),
        },
        {
          heading: "Quali dati raccogliamo",
          body: (
            <>
              <p>Il sito raccoglie soltanto:</p>
              <ul>
                <li>
                  i dati che invii con il modulo di richiesta preventivo: nome e cognome, email, telefono (facoltativo),
                  categoria di interesse e messaggio;
                </li>
                <li>
                  i dati tecnici di navigazione registrati automaticamente dal server che ospita il sito (ad esempio
                  indirizzo IP, data e ora, pagina richiesta), usati per garantirne il funzionamento e la sicurezza.
                </li>
              </ul>
              <p>Il sito non utilizza strumenti di profilazione né di statistica.</p>
            </>
          ),
        },
        {
          heading: "Perché li trattiamo",
          body: (
            <ul>
              <li>
                Per rispondere alla tua richiesta e preparare un preventivo: il trattamento è necessario per misure
                precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b del Regolamento UE 2016/679).
              </li>
              <li>
                Per proteggere il sito da abusi e invii automatici: legittimo interesse del titolare (art. 6, par. 1,
                lett. f).
              </li>
            </ul>
          ),
        },
        {
          heading: "Come vengono trattati",
          body: (
            <p>
              I dati sono trattati con strumenti elettronici e non vengono diffusi né usati per invii promozionali. Le
              richieste inviate dal modulo vengono inoltrate all&apos;indirizzo email aziendale tramite un servizio di
              invio email; il fornitore utilizzato e l&apos;eventuale trasferimento di dati fuori dall&apos;Unione
              europea saranno indicati qui una volta attivato il servizio.
            </p>
          ),
        },
        {
          heading: "Per quanto tempo",
          body: (
            <p>
              Per il tempo necessario a gestire la richiesta e l&apos;eventuale rapporto che ne segue, nel rispetto
              degli obblighi di legge. Il periodo massimo di conservazione è da definire a cura del titolare.
            </p>
          ),
        },
        {
          heading: "A chi possono essere comunicati",
          body: (
            <p>
              Ai fornitori tecnici che ospitano il sito e gestiscono l&apos;invio delle email, nominati responsabili del
              trattamento, e alle autorità quando previsto dalla legge.
            </p>
          ),
        },
        {
          heading: "I tuoi diritti",
          body: (
            <p>
              Puoi chiedere in ogni momento l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione
              del trattamento, la portabilità e opporti al trattamento (artt. 15–22 del Regolamento), scrivendo a{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>. Hai inoltre il diritto di proporre reclamo al
              Garante per la protezione dei dati personali. Per i cookie consulta la{" "}
              <Link href="/cookie-policy">cookie policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
