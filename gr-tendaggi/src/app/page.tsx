import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { ProductChapters } from "@/components/home/ProductChapters";
import { MaterialExperience } from "@/components/home/MaterialExperience";
import { LightSlider } from "@/components/home/LightSlider";
import { Inspiration } from "@/components/home/Inspiration";
import { Consult } from "@/components/home/Consult";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${company.name} — Tende su misura a Bologna` },
  description:
    "Tende da interno, tende da sole, zanzariere, schermature e chiusure invernali su misura. Via Emilia 134, San Lazzaro di Savena (BO).",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: `${company.name} — La luce prende forma` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ProductChapters />
      <MaterialExperience />
      <section aria-label="Simulazione della luce" className="frame section-gap bg-ivory">
        <LightSlider headingLevel={2} />
      </section>
      <Inspiration />
      <Consult />
    </>
  );
}
