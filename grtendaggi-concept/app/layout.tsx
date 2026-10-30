import type { Metadata, Viewport } from 'next';
import '@fontsource/bodoni-moda/latin-500.css';
import '@fontsource/bodoni-moda/latin-500-italic.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileActions } from '@/components/MobileActions';
import { CookieConsent } from '@/components/CookieConsent';
import { RevealObserver } from '@/components/Reveal';
import { JsonLd } from '@/components/JsonLd';
import { site } from '@/content/site';
import { localBusinessJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Tende e schermature su misura a Bologna`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#e5e1d8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Abilita le animazioni di ingresso solo quando JavaScript è attivo */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={localBusinessJsonLd()} />
      </head>
      <body>
        <Header />
        <main id="contenuto" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActions />
        <CookieConsent />
        <RevealObserver />
      </body>
    </html>
  );
}
