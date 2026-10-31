import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MotionRoot } from "@/components/site/MotionRoot";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { company, siteUrl } from "@/lib/site";
import { JsonLd, localBusinessSchema } from "@/lib/schema";
import "./globals.css";

const serif = localFont({
  src: "../fonts/newsreader-latin-opsz-normal.woff2",
  variable: "--font-newsreader",
  weight: "200 800",
  display: "swap",
  // Not preloaded: it would compete with the LCP image on slow connections; the metric-matched fallback avoids layout shift.
  preload: false,
  fallback: ["Georgia", "serif"],
});

const sans = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  variable: "--font-hanken",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Tende su misura a Bologna`,
    template: `%s | ${company.name}`,
  },
  description:
    "Tende da interno, tende da sole, zanzariere e schermature su misura. GR Tendaggi Concept, Via Emilia 134, San Lazzaro di Savena (Bologna).",
  applicationName: company.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: company.name,
    images: [{ url: "/og/living-panoramico-tramonto.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fdfcf9",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: arms the scroll reveals, and falls back to the plain page if the app script never starts.
const armMotion = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: no-preference)').matches)return;d.classList.add('motion-armed');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion-armed')},3500)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: armMotion }} />
      </head>
      <body>
        <a
          href="#contenuto"
          className="fixed top-3 left-3 z-[80] -translate-y-24 bg-charcoal px-4 py-3 text-ivory focus:translate-y-0"
        >
          Vai al contenuto
        </a>
        <ScrollProgress />
        <Header />
        <main id="contenuto" className="relative z-10 bg-warm">
          {children}
        </main>
        <Footer />
        <MotionRoot />
        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  );
}
