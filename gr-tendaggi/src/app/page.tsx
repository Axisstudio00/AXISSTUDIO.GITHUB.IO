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
