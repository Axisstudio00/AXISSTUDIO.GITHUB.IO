import { LegalPage } from '@/components/LegalPage';
import { CookiePrefsButton } from '@/components/CookieConsent';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Cookie policy',
  description: 'Informativa sui cookie e sugli strumenti di tracciamento del sito GRtendaggi Concept.',
  path: '/cookie/',
});

export default function Cookie() {
  return (
    <LegalPage title="Cookie policy" path="/cookie/" updated="ottobre 2026">
      <h2>In breve</h2>
      <p>
        Questo sito non usa cookie di profilazione né strumenti di statistica. I caratteri tipografici sono
        ospitati sul nostro server, senza richieste a servizi esterni.
      </p>

      <h2>Strumenti tecnici (sempre attivi)</h2>
      <ul>
        <li>
          <strong>grc-consent</strong> — archiviazione locale del browser (localStorage). Ricorda le tue scelte sui
          cookie. Non scade finché non la cancelli o modifichi le preferenze.
        </li>
      </ul>

      <h2>Contenuti esterni (solo con consenso)</h2>
      <ul>
        <li>
          <strong>Google Maps</strong> — la mappa nella pagina contatti viene caricata solo se acconsenti. Google può
          impostare propri cookie: consulta l’informativa di Google su policies.google.com.
        </li>
      </ul>
      <p>
        I collegamenti a WhatsApp, Google Maps e ai social aprono servizi esterni solo quando li scegli tu.
      </p>

      <h2>Modificare le preferenze</h2>
      <p>Puoi cambiare idea in qualsiasi momento.</p>
      <p>
        <CookiePrefsButton className="btn btn-ink" />
      </p>
      <p>
        Se in futuro verranno aggiunti strumenti di statistica o marketing, saranno bloccati fino al tuo consenso e
        questa pagina sarà aggiornata.
      </p>
    </LegalPage>
  );
}
