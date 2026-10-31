import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import type { ImageId } from "@/lib/images";

const panels: {
  href: string;
  title: string;
  fact: string;
  image: ImageId;
  grow: number;
  position?: string;
  mobile: string;
}[] = [
  {
    href: "/tende-da-interno",
    title: "Tende da interno",
    fact: "Tessuti leggeri o oscuranti, apertura manuale o motorizzata",
    image: "veloColline",
    grow: 5,
    mobile: "basis-[64%]",
  },
  {
    href: "/tende-da-sole",
    title: "Tende da sole",
    fact: "Balconi, terrazze, giardini e vetrine",
    image: "tendaSole",
    grow: 2,
    position: "30% 50%",
    mobile: "basis-[36%]",
  },
  {
    href: "/outdoor",
    title: "Outdoor e chiusure",
    fact: "Chiusure invernali Crystal in PVC o vetro flessibile",
    image: "pergolaLamelle",
    grow: 3,
    position: "40% 50%",
    mobile: "basis-[36%]",
  },
  {
    href: "/zanzariere",
    title: "Zanzariere",
    fact: "Avvolgibili, a battente, plissé, scorrevoli",
    image: "zanzariera",
    grow: 2,
    mobile: "basis-[64%]",
  },
  {
    href: "/schermature",
    title: "Schermature e oscuranti",
    fact: "Tende tecniche, veneziane, tapparelle",
    image: "ristoranteTecniche",
    grow: 3,
    position: "60% 50%",
    mobile: "basis-full",
  },
];

export function Solutions() {
  return (
    <section
      id="soluzioni"
      aria-labelledby="soluzioni-title"
      className="bg-ivory pt-[var(--section-gap)] pb-[calc(var(--section-gap)*0.6)]"
    >
      <div className="frame grid-12 items-end gap-y-6">
        <Lines
          id="soluzioni-title"
          lines={["Le soluzioni,", "su misura."]}
          className="col-span-12 text-title md:col-span-7 lg:col-start-3"
        />
        <p data-reveal className="col-span-12 max-w-[36ch] md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10">
          <span data-reveal-item className="block">
            Dentro e fuori casa, ogni sistema si sceglie per come vivi la stanza: quanta luce, quanta privacy, quanta
            aria.
          </span>
        </p>
      </div>

      <ul className="band mt-14 flex flex-wrap md:mt-16 lg:h-[68svh] lg:min-h-[30rem] lg:flex-nowrap">
        {panels.map((p, i) => (
          <li
            key={p.href}
            className={`band-panel relative h-[30svh] min-h-[13rem] md:h-[36svh] lg:h-auto lg:min-h-0 lg:basis-0 ${p.mobile}`}
            style={{ ["--grow" as string]: p.grow }}
          >
            <div data-clip data-clip-delay={i * 0.09} className="absolute inset-0 overflow-hidden">
              <Picture
                id={p.image}
                sizes="(min-width: 1024px) 40vw, 64vw"
                alt=""
                className="absolute inset-0"
                imgClassName="band-img h-full w-full object-cover"
                style={{ objectPosition: p.position ?? "50% 50%" }}
              />
            </div>
            <Link
              href={p.href}
              className="on-dark group absolute inset-0 flex flex-col justify-end p-4 text-ivory sm:p-6"
            >
              <span aria-hidden="true" className="scrim-bottom absolute inset-0 opacity-90" />
              <span className="relative font-serif text-lead leading-[1.08] font-light tracking-[-0.015em]">
                {p.title}
              </span>
              <span className="relative mt-2 hidden max-w-[30ch] text-[1rem] leading-snug text-sand sm:block">
                {p.fact}
              </span>
              <span className="relative mt-3 inline-flex items-center gap-2 text-[0.875rem] text-ivory">
                Scopri
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 12"
                  width="18"
                  height="11"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="frame mt-5 text-[0.875rem] text-muted">
        Ambientazioni illustrative. Passa sulle immagini per aprirle.
      </p>
    </section>
  );
}
