import { LegalPage } from '@/components/LegalPage';
import { site } from '@/content/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Privacy policy',
  description: 'Informativa sul trattamento dei dati personali del sito GRtendaggi Concept.',
  path: '/privacy/',
});

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" path="/privacy/" updated="ottobre 2026">
      <h2>Titolare del trattamento</h2>
      <p>
        {site.legalName ?? site.name}, {site.address.street}, {site.address.postalCode} {site.address.city} (
        {site.address.province}){site.vatNumber ? `, P.IVA ${site.vatNumber}` : ''}. Email:{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Quali dati trattiamo</h2>
      <ul>
        <li>
          Dati inviati con il modulo di richiesta preventivo: nome, cognome, email, telefono, soluzione di interesse,
          località dell’intervento, messaggio, oltre a un codice identificativo della richiesta e alla pagina di
          provenienza.
        </li>
        <li>Dati che ci comunichi spontaneamente via email, telefono o WhatsApp.</li>
        <li>Dati tecnici di navigazione registrati dal servizio di hosting (ad esempio indirizzo IP e data della richiesta).</li>
      </ul>

      <h2>Perché li trattiamo e su quale base</h2>
      <ul>
        <li>Rispondere alle richieste e preparare preventivi: misure precontrattuali richieste dall’interessato (art. 6.1.b GDPR).</li>
        <li>Garantire la sicurezza e il funzionamento del sito: legittimo interesse del titolare (art. 6.1.f GDPR).</li>
        <li>Mostrare la mappa di Google nella pagina contatti: consenso (art. 6.1.a GDPR), revocabile in ogni momento.</li>
      </ul>

      <h2>Chi tratta i dati per nostro conto</h2>
      <ul>
        <li>Netlify, Inc. — hosting del sito e raccolta dei moduli. Il trasferimento verso gli Stati Uniti avviene sulla base delle garanzie previste dal GDPR (da verificare nel contratto di servizio).</li>
        <li>Google (Gmail) — gestione della posta elettronica.</li>
        <li>In futuro: il gestionale aziendale, se collegato al modulo. L’informativa andrà aggiornata di conseguenza.</li>
      </ul>
      <p>I dati non vengono venduti né usati per finalità di marketing senza un consenso specifico.</p>

      <h2>Per quanto tempo</h2>
      <p>
        I dati delle richieste sono conservati per il tempo necessario a gestirle e, se ne nasce un rapporto
        commerciale, per i termini previsti dalla legge. Il periodo di conservazione delle richieste non seguite
        da un incarico è da definire con il titolare.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità dei dati e opporti al
        trattamento scrivendo a <a href={`mailto:${site.email}`}>{site.email}</a>. Puoi inoltre proporre reclamo al
        Garante per la protezione dei dati personali (www.garanteprivacy.it).
      </p>

      <h2>Conferimento</h2>
      <p>
        I campi del modulo sono necessari per poterti ricontattare: senza di essi non possiamo rispondere alla
        richiesta.
      </p>
    </LegalPage>
  );
}
