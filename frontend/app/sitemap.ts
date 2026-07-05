import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/o-fonde/istoriya", priority: 0.7, changeFrequency: "monthly" },
  { path: "/o-fonde/dokumenty", priority: 0.6, changeFrequency: "monthly" },
  { path: "/o-fonde/sovet", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sobytiya", priority: 0.9, changeFrequency: "weekly" },
  { path: "/partnery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/smi-o-nas", priority: 0.6, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...events.map((event) => ({
      url: `${SITE_URL}/sobytiya/${event.meta.slug}`,
      lastModified: event.meta.first_published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
