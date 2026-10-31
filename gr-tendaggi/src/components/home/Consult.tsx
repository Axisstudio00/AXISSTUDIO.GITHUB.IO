import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ImageId } from "@/lib/images";

type Props = {
  image?: ImageId;
  title?: [string, string];
  text?: string;
  position?: string;
};

/** Closing photograph with the text kept in its calm right half; on phones the text drops onto the footer colour. */
export function Consult({
  image = "pergolaPiscina",
  title = ["Il tuo spazio.", "Una nuova prospettiva."],
  text = "Raccontaci il tuo ambiente: ti aiutiamo a scegliere tessuti, sistemi e soluzioni su misura, dalla luce che filtra all'ombra che protegge.",
  position = "35% 50%",
}: Props) {
  return (
    <section aria-labelledby="consulenza-title" className="on-dark relative bg-charcoal text-ivory">
      <div className="relative h-[70svh] overflow-hidden lg:h-[92svh]">
        <div data-parallax="10" className="absolute inset-0 scale-[1.12]">
          <Picture
            id={image}
            sizes="100vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover brightness-[0.82]"
            style={{ objectPosition: position }}
          />
        </div>
        <div aria-hidden="true" className="scrim-bottom absolute inset-0 hidden lg:block" />
      </div>
      <div className="frame relative py-14 lg:absolute lg:inset-0 lg:flex lg:items-end lg:py-[clamp(3rem,9svh,6rem)]">
        <div data-reveal className="md:max-w-[36rem] lg:ml-[50%] lg:max-w-[min(40rem,46vw)] lg:pl-[var(--gutter)]">
          <h2 id="consulenza-title" data-reveal-item className="text-title leading-[1.02]">
            <span className="block">{title[0]}</span>
            <span className="block">{title[1]}</span>
          </h2>
          <p data-reveal-item className="mt-5 max-w-[42ch] text-[1rem] text-ivory">
            {text}
          </p>
          <div data-reveal-item className="mt-8">
            <ButtonLink href="/contatti#preventivo" tone="light">
              Richiedi una consulenza
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
