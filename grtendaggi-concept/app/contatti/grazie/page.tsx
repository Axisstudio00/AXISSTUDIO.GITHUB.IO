import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Richiesta inviata', robots: { index: false, follow: false } };

// Pagina di conferma per l'invio senza JavaScript (azione del form Netlify).
export default function Grazie() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <h1 className="t-head">Richiesta inviata.</h1>
      <p className="t-lead mt-6 max-w-[36ch]">Grazie: ti ricontatteremo al più presto per parlare del tuo progetto.</p>
      <Link href="/" className="btn btn-primary mt-10 self-start">Torna alla home</Link>
    </section>
  );
}
