import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/tende-da-interno", priority: 0.9 },
  { path: "/tende-da-sole", priority: 0.9 },
  { path: "/outdoor", priority: 0.8 },
  { path: "/zanzariere", priority: 0.8 },
  { path: "/schermature", priority: 0.8 },
  { path: "/materiali", priority: 0.7 },
  { path: "/chi-siamo", priority: 0.6 },
  { path: "/contatti", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.2 },
  { path: "/cookie-policy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-30");
  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
