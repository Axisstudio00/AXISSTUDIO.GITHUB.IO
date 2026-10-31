import type { Metadata } from "next";
import { ogImage, type ImageId } from "./images";

export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image: ImageId;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: [{ url: ogImage(image), width: 1200, height: 630 }],
    },
  };
}
