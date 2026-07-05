import type { Metadata } from "next";
import { mediaUrl } from "./api";
import type { WagtailImage, WagtailPageMeta } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "АРТ-Кавказ";

interface SeoSource {
  title: string;
  meta: WagtailPageMeta;
  og_image: WagtailImage | null;
}

export function buildMetadata(
  page: SeoSource,
  path: string,
  options: { description?: string; fallbackImage?: WagtailImage | null; absoluteTitle?: boolean } = {}
): Metadata {
  const title = page.meta.seo_title || page.title;
  const description = page.meta.search_description || options.description || "";
  const url = `${SITE_URL}${path}`;
  const image = page.og_image ?? options.fallbackImage ?? null;
  const imageUrl = mediaUrl(image?.url);

  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl, width: image!.width, height: image!.height }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
