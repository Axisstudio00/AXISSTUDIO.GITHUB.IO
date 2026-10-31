import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import type { ImageId } from "@/lib/images";

type Props = {
  image: ImageId;
  title: string;
  lead: string;
  variant?: "full" | "framed";
  position?: string;
  crumb?: string;
};

function Crumb({ label }: { label: string }) {
  return (
    <nav aria-label="Percorso" className="text-[0.875rem] text-sand">
      <ol className="flex gap-2">
        <li>
          <Link href="/" className="underline-offset-4 hover:text-ivory hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-ivory">
          {label}
        </li>
      </ol>
    </nav>
  );
}

export function PageHero({ image, title, lead, variant = "full", position = "50% 50%", crumb }: Props) {
  if (variant === "framed") {
    return (
      <section data-hero aria-labelledby="page-title" className="on-dark relative bg-charcoal text-ivory">
        <div className="grid min-h-[100svh] md:grid-cols-12">
          <div className="relative order-1 h-[62svh] overflow-hidden md:order-2 md:col-span-7 md:h-auto">
            <div data-parallax="10" className="absolute inset-0 scale-[1.1]">
              <Picture
                id={image}
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover"
                style={{ objectPosition: position }}
              />
            </div>
            <div aria-hidden="true" className="scrim-top absolute inset-x-0 top-0 h-36" />
          </div>
          <div className="frame order-2 flex flex-col justify-end gap-8 pt-12 pb-12 md:order-1 md:col-span-5 md:pt-[calc(var(--header-h)+4rem)] md:pb-[clamp(2.5rem,8svh,5rem)] md:pr-[var(--gutter)]">
            {crumb && <Crumb label={crumb} />}
            <h1 id="page-title" className="text-title leading-[0.98]">
              <span data-hero-line className="block overflow-hidden pb-[0.04em]">
                <span className="block">{title}</span>
              </span>
            </h1>
            <p className="max-w-[38ch] text-[1rem] sm:text-[1.25rem]">{lead}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-hero
      aria-labelledby="page-title"
      className="on-dark relative h-[88svh] min-h-[32rem] overflow-hidden bg-charcoal text-ivory"
    >
      <div data-parallax="12" className="absolute inset-0 scale-[1.12]">
        <Picture
          id={image}
          priority
          sizes="100vw"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </div>
      <div aria-hidden="true" className="scrim-top absolute inset-x-0 top-0 h-40" />
      <div aria-hidden="true" className="scrim-bottom absolute inset-0" />
      <div className="frame absolute inset-x-0 bottom-0 pb-[clamp(2rem,7svh,4.5rem)]">
        {crumb && (
          <div className="mb-6">
            <Crumb label={crumb} />
          </div>
        )}
        <div className="grid-12 items-end gap-y-6">
          <h1 id="page-title" className="col-span-12 text-display leading-[0.96] lg:col-span-8">
            <span data-hero-line className="block overflow-hidden pb-[0.04em]">
              <span className="block">{title}</span>
            </span>
          </h1>
          <p className="col-span-12 max-w-[40ch] text-[1rem] sm:text-[1.25rem] md:col-span-7 lg:col-span-4 lg:col-start-9">
            {lead}
          </p>
        </div>
      </div>
    </section>
  );
}
