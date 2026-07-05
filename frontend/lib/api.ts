import type {
  AboutIndexPage,
  CouncilPage,
  DocumentsPage,
  EventDetail,
  EventSummary,
  EventsIndexPage,
  HistoryPage,
  HomePage,
  PartnersPage,
  PressIndexPage,
  SiteSettings,
} from "./types";

const WAGTAIL_API_URL = process.env.WAGTAIL_API_URL ?? "http://localhost:8000/api/v2";
const WAGTAIL_BASE_URL = process.env.WAGTAIL_BASE_URL ?? "http://localhost:8000";

/**
 * Every Wagtail fetch is cached indefinitely (`force-cache`) and invalidated
 * on-demand by the /api/revalidate webhook (triggered from the page_published
 * signal in the Wagtail backend) rather than on a timer.
 */
async function wagtailFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WAGTAIL_API_URL}${path}`, {
    cache: "force-cache",
    next: { tags: ["wagtail"] },
  });
  if (!res.ok) {
    throw new Error(`Wagtail API ${path} responded with ${res.status}`);
  }
  return res.json();
}

async function wagtailFirst<T>(path: string): Promise<T> {
  const data = await wagtailFetch<{ items: T[] }>(path);
  const item = data.items[0];
  if (!item) {
    throw new Error(`Wagtail API ${path} returned no items`);
  }
  return item;
}

/** Wagtail image/document URLs come back site-root-relative; make them absolute. */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${WAGTAIL_BASE_URL}${url}`;
}

export const getSiteSettings = () =>
  wagtailFetch<SiteSettings>("/site-settings/");

export const getHomePage = () =>
  wagtailFirst<HomePage>("/pages/?type=home.HomePage&fields=*");

export const getAboutIndexPage = () =>
  wagtailFirst<AboutIndexPage>("/pages/?type=about.AboutIndexPage&fields=*");

export const getHistoryPage = () =>
  wagtailFirst<HistoryPage>("/pages/?type=about.HistoryPage&fields=*");

export const getDocumentsPage = () =>
  wagtailFirst<DocumentsPage>("/pages/?type=about.DocumentsPage&fields=*");

export const getCouncilPage = () =>
  wagtailFirst<CouncilPage>("/pages/?type=about.CouncilPage&fields=*");

export const getEventsIndexPage = () =>
  wagtailFirst<EventsIndexPage>("/pages/?type=events.EventsIndexPage&fields=*");

export const getEvents = async (): Promise<EventSummary[]> => {
  const data = await wagtailFetch<{ items: EventSummary[] }>(
    "/pages/?type=events.EventPage&fields=*&order=-date_start"
  );
  return data.items;
};

export const getEventBySlug = async (slug: string): Promise<EventDetail | null> => {
  const data = await wagtailFetch<{ items: EventDetail[] }>(
    `/pages/?type=events.EventPage&fields=*&slug=${encodeURIComponent(slug)}`
  );
  return data.items[0] ?? null;
};

export const getPartnersPage = () =>
  wagtailFirst<PartnersPage>("/pages/?type=partners.PartnersPage&fields=*");

export const getPressIndexPage = () =>
  wagtailFirst<PressIndexPage>("/pages/?type=press.PressIndexPage&fields=*");
