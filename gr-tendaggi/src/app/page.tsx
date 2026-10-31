import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Solutions } from "@/components/home/Solutions";
import { Outdoor } from "@/components/home/Outdoor";
import { Materials } from "@/components/home/Materials";
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
      {/* Curtain textures for the intro: fetched early so the panels never show their flat base colour. */}
      <link rel="preload" as="image" href="/images/tenda-intro-velo-470.webp" media="(min-width: 768px)" />
      <link rel="preload" as="image" href="/images/tenda-intro-velo-stretto-330.webp" media="(max-width: 767px)" />
      <Hero />
      <Manifesto />
      <Solutions />
      <Outdoor />
      <Materials />
      <Inspiration />
      <Consult />
    </>
  );
}
