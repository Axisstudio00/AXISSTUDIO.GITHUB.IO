import Link from "next/link";
import { company, solutions, studio, legal, fullAddress } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const wa = company.whatsappNumber.replace(/\D/g, "");

  return (
    <footer className="on-dark bg-charcoal text-ivory">
      <div className="frame pt-16 pb-6 sm:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-[1rem] leading-relaxed lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <div className="col-span-2 lg:col-span-4">
            <h2 className="font-serif text-lead leading-[1.1] font-light">
              Tende su misura,
              <br />
              dalla luce all&apos;ombra.
            </h2>
            <address className="mt-6 text-taupe not-italic">
              <span className="block text-ivory">{company.name}</span>
              {fullAddress}
              <br />
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sand underline underline-offset-4 hover:text-ivory"
              >
                Apri in Google Maps
              </a>
            </address>
          </div>

          <nav aria-label="Soluzioni" className="lg:col-span-3 lg:col-start-5">
            <h3 className="font-sans text-[1rem] font-medium tracking-normal">Soluzioni</h3>
            <ul className="mt-3 space-y-1.5 text-taupe">
              {solutions.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="transition-colors hover:text-ivory">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio" className="lg:col-span-2">
            <h3 className="font-sans text-[1rem] font-medium tracking-normal">Studio</h3>
            <ul className="mt-3 space-y-1.5 text-taupe">
              {studio.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="transition-colors hover:text-ivory">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 sm:col-span-1 lg:col-span-3 lg:col-start-10">
            <h3 className="font-sans text-[1rem] font-medium tracking-normal">Contatti</h3>
            <ul className="mt-3 space-y-1.5 text-taupe">
              {company.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="transition-colors hover:text-ivory">
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="break-all transition-colors hover:text-ivory">
                  {company.email}
                </a>
              </li>
              {wa && (
                <li>
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ivory"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {company.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ivory"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(5rem,12vw,11rem)] min-w-0">
          <p
            aria-hidden="true"
            className="font-serif leading-[0.8] font-light tracking-[-0.035em] whitespace-nowrap text-sand select-none"
          >
            <span className="hidden text-[9.4vw] md:block">GR Tendaggi Concept</span>
            <span className="block text-[15.6vw] md:hidden">GR Tendaggi</span>
            <span className="block text-[15.6vw] md:hidden">Concept</span>
          </p>
          <div className="mt-6 flex flex-col gap-2 text-[0.875rem] text-taupe sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <span>
              © {year} {company.name}
              {company.vatNumber ? ` · P. IVA ${company.vatNumber}` : ""}
            </span>
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-ivory">
                {l.label}
              </Link>
            ))}
            <span>Solo cookie tecnici, nessuna profilazione.</span>
            <span className="sm:ml-auto">Immagini: ambientazioni illustrative generate digitalmente.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
