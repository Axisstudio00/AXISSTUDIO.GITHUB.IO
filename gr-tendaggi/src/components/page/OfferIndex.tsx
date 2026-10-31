"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import type { ImageId } from "@/lib/images";

type Item = { name: string; text: string; image?: ImageId };

/** A held picture on the left that changes as each offer on the right reaches the middle of the screen. */
export function OfferIndex({
  id,
  title,
  items,
  tone = "bg-ivory",
}: {
  id: string;
  title: string;
  items: Item[];
  tone?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const unique = Array.from(new Set(items.flatMap((i) => (i.image ? [i.image] : []))));
  // Items without a picture of their own keep the last one shown.
  const shown =
    items.slice(0, active + 1).reduceRight<ImageId | undefined>((found, i) => found ?? i.image, undefined) ?? unique[0];

  return (
    <section aria-labelledby={id} className={`frame section-gap ${tone}`}>
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <h2 id={id} className="text-title">
              {title}
            </h2>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden md:block">
              {unique.map((img) => (
                <Picture
                  key={img}
                  id={img}
                  sizes="40vw"
                  alt=""
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-out)] ${
                    shown === img ? "scale-100 opacity-100" : "opacity-0 motion-safe:scale-[1.04]"
                  }`}
                  imgClassName="h-full w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        <ul className="col-span-12 md:col-span-6 md:col-start-7 md:pt-[30vh] md:pb-[24vh]">
          {items.map((item, i) => (
            <li
              key={item.name}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="py-8 md:min-h-[46vh] md:py-0"
            >
              {item.image && (
                <div className="mb-6 overflow-hidden md:hidden">
                  <Picture id={item.image} sizes="100vw" alt="" imgClassName="aspect-[3/2] w-full object-cover" />
                </div>
              )}
              <h3
                className={`text-lead leading-[1.04] transition-colors duration-500 ${
                  i === active ? "md:text-charcoal" : "md:text-muted"
                }`}
              >
                {item.name}
              </h3>
              <p className="mt-4 max-w-[40ch]">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
