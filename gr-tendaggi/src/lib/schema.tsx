import { company, siteUrl } from "./site";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: company.name,
    url: siteUrl,
    email: company.email,
    telephone: company.phones.map((p) => p.href.replace("tel:", "")),
    image: `${siteUrl}/og/living-panoramico-tramonto.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressRegion: company.province,
      addressCountry: company.country,
    },
    areaServed: { "@type": "AdministrativeArea", name: company.region },
    ...(company.vatNumber ? { vatID: company.vatNumber } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
