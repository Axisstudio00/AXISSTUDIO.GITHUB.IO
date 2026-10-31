import { ContactForm } from "@/components/contact/ContactForm";
import { Picture } from "@/components/ui/Picture";
import { company, fullAddress } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const path = "/contatti";

export const metadata = pageMeta({
  title: "Contatti e preventivi",
  description:
    "Richiedi un preventivo per tende, tende da sole, zanzariere e schermature su misura. GR Tendaggi Concept, Via Emilia 134, San Lazzaro di Savena (BO).",
  path,
  image: "panoramico",
});

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;

  return (
    <>
      <section
        aria-labelledby="page-title"
        className="frame bg-warm pt-[calc(var(--header-h)+clamp(3rem,10vh,7rem))] pb-16"
      >
        <div className="grid-12 items-end gap-y-8">
          <h1 id="page-title" className="col-span-12 text-display leading-[0.96] lg:col-span-8">
            <span data-hero-line className="block overflow-hidden pb-[0.04em]">
              <span className="block">Contatti</span>
            </span>
            <span data-hero-line className="block overflow-hidden pb-[0.04em]">
              <span className="block">e preventivi</span>
            </span>
          </h1>
          <p className="col-span-12 max-w-[40ch] text-[1.25rem] md:col-span-6 lg:col-span-4 lg:col-start-9">
            Raccontaci il tuo spazio: ti rispondiamo con una proposta su misura. Preferisci parlarne a voce? Chiamaci.
          </p>
        </div>
      </section>

      <section aria-label="Recapiti e modulo" className="frame bg-warm pb-[var(--section-gap)]">
        <div className="grid-12 gap-y-16">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="text-lead leading-[1.1]">Recapiti</h2>
            <dl data-reveal className="mt-8 space-y-7 text-[1rem]">
              <div data-reveal-item>
                <dt className="text-[1rem] text-muted">Telefono</dt>
                <dd className="mt-1 flex flex-col text-[1.25rem] leading-snug">
                  {company.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="w-fit underline-offset-4 hover:text-bronze-ink hover:underline"
                    >
                      {p.label}
                    </a>
                  ))}
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="text-[1rem] text-muted">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${company.email}`}
                    className="break-all underline underline-offset-4 hover:text-bronze-ink"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="text-[1rem] text-muted">Indirizzo</dt>
                <dd className="mt-1">
                  <address className="not-italic">{fullAddress}</address>
                  <a
                    href={company.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block underline underline-offset-4 hover:text-bronze-ink"
                  >
                    Apri in Google Maps
                  </a>
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="text-[1rem] text-muted">Zona servita</dt>
                <dd className="mt-1">Bologna e le province dell&apos;Emilia-Romagna</dd>
              </div>
            </dl>
            <figure className="mt-14 hidden lg:block">
              <div data-clip className="overflow-hidden">
                <Picture id="veloControluce" sizes="30vw" imgClassName="aspect-[4/5] w-full object-cover" />
              </div>
            </figure>
          </div>

          <div id="preventivo" className="col-span-12 scroll-mt-28 bg-ivory p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <h2 className="text-lead leading-[1.1]">Richiedi un preventivo</h2>
            <p className="mt-3 mb-10 max-w-[48ch] text-muted">
              Compila il modulo: i campi sono tutti obbligatori, tranne il telefono.
            </p>
            <ContactForm defaultInterest={categoria} />
          </div>
        </div>
      </section>

      <figure className="relative overflow-hidden bg-warm">
        <div data-parallax="10" className="scale-[1.1]">
          <Picture
            id="panoramico"
            sizes="100vw"
            imgClassName="aspect-[21/9] min-h-[40svh] w-full object-cover"
            style={{ objectPosition: "60% 50%" }}
          />
        </div>
      </figure>
      <JsonLd data={breadcrumbSchema([{ name: "Contatti e preventivi", path }])} />
    </>
  );
}
