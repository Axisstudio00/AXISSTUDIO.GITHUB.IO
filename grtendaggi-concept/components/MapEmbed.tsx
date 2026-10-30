'use client';
import { openConsentPreferences, saveConsent, useConsent } from '@/lib/consent';
import { mapsHref, site } from '@/content/site';

// Google Maps viene caricata solo dopo il consenso ai "contenuti esterni".
export function MapEmbed() {
  const consent = useConsent();
  const q = encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
  if (consent?.external) {
    return (
      <iframe
        title={`Mappa: ${site.address.street}, ${site.address.city}`}
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        className="h-full min-h-[22rem] w-full grayscale-[35%]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="flex h-full min-h-[22rem] flex-col items-start justify-end gap-4 bg-surface p-6 md:p-8">
      <p className="max-w-[40ch]">
        La mappa è fornita da Google Maps, che può impostare cookie. Caricala solo se sei d’accordo.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ink" onClick={() => saveConsent(true)}>
          Mostra la mappa
        </button>
        <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
          Apri in Google Maps
        </a>
      </div>
      <button type="button" className="t-small underline underline-offset-4" onClick={openConsentPreferences}>
        Gestisci preferenze cookie
      </button>
    </div>
  );
}
