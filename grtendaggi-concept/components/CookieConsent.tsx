'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { openConsentPreferences, saveConsent, useConsent } from '@/lib/consent';

export function CookiePrefsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentPreferences}>
      Preferenze cookie
    </button>
  );
}

export function CookieConsent() {
  const consent = useConsent();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [external, setExternal] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => {
      setExternal(Boolean(consent?.external));
      setPrefsOpen(true);
    };
    window.addEventListener('grc:consent-open', open);
    return () => window.removeEventListener('grc:consent-open', open);
  }, [consent]);

  useEffect(() => {
    if (prefsOpen) dialogRef.current?.querySelector<HTMLElement>('input,button')?.focus();
  }, [prefsOpen]);

  if (consent === undefined) return null;
  const showBanner = consent === null && !prefsOpen;

  const choose = (ext: boolean) => {
    saveConsent(ext);
    setPrefsOpen(false);
  };

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Informativa cookie"
          className="fixed inset-x-2 bottom-[4rem] z-[65] bg-ink p-4 text-paper md:inset-x-auto md:bottom-6 md:right-6 md:max-w-[26rem] md:p-5"
        >
          <p className="t-small md:text-[1rem] md:leading-relaxed">
            Usiamo solo cookie tecnici. Con il tuo consenso carichiamo la mappa di Google nei contatti.{' '}
            <Link href="/cookie/" className="underline underline-offset-4">Dettagli</Link>
            {' · '}
            <button type="button" className="underline underline-offset-4" onClick={() => setPrefsOpen(true)}>
              Personalizza
            </button>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-primary min-h-11 px-3" onClick={() => choose(true)}>
              Accetta tutti
            </button>
            <button type="button" className="btn btn-paper min-h-11 px-3" onClick={() => choose(false)}>
              Solo necessari
            </button>
          </div>
        </div>
      )}

      {prefsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-3 md:items-center" onClick={() => setPrefsOpen(false)}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-lg bg-paper p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Escape' && setPrefsOpen(false)}
          >
            <h2 id={titleId} className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]">Preferenze cookie</h2>
            <div className="mt-6 space-y-5">
              <div className="flex items-start justify-between gap-6 bg-bg p-4">
                <div>
                  <p className="font-medium">Necessari</p>
                  <p className="t-small mt-1 text-muted">Servono al funzionamento del sito e a ricordare questa scelta. Sempre attivi.</p>
                </div>
                <input type="checkbox" checked disabled aria-label="Cookie necessari, sempre attivi" className="mt-1 h-5 w-5 accent-[var(--accent)]" />
              </div>
              <label className="flex cursor-pointer items-start justify-between gap-6 bg-bg p-4">
                <span>
                  <span className="block font-medium">Contenuti esterni</span>
                  <span className="t-small mt-1 block text-muted">
                    Mappa Google Maps nella pagina contatti. Google può impostare propri cookie.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={external}
                  onChange={(e) => setExternal(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[var(--accent)]"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary flex-1" onClick={() => choose(external)}>
                Salva preferenze
              </button>
              <button type="button" className="btn btn-ink flex-1" onClick={() => choose(true)}>
                Accetta tutti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
