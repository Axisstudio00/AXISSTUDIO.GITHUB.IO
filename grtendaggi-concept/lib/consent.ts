'use client';
import { useSyncExternalStore } from 'react';

// Preferenze cookie salvate nel browser del visitatore.
// Categorie reali del sito: "necessari" (sempre attivi) ed "esterni" (mappa Google incorporata).
// Se in futuro si aggiungono statistiche o marketing, aggiungere qui la categoria e bloccarne
// il caricamento finché `consent.<categoria>` non è true.
export type Consent = { necessary: true; external: boolean; date: string; version: 1 };

const KEY = 'grc-consent';
const listeners = new Set<() => void>();
let cache: Consent | null | undefined;

function read(): Consent | null {
  if (cache !== undefined) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function saveConsent(external: boolean) {
  const value: Consent = { necessary: true, external, date: new Date().toISOString(), version: 1 };
  cache = value;
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* archiviazione non disponibile: la scelta vale per questa visita */
  }
  listeners.forEach((l) => l());
}

export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent('grc:consent-open'));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** undefined durante il prerender, null se il visitatore non ha ancora scelto. */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
