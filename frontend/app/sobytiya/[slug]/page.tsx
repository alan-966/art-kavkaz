import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents, getSiteSettings, mediaUrl } from "@/lib/api";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { formatEventDate } from "@/lib/format";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { breadcrumbJsonLd, eventJsonLd, JsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return buildMetadata(event, `/sobytiya/${slug}`, { description: event.excerpt });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, siteSettings] = await Promise.all([getEventBySlug(slug), getSiteSettings()]);
  if (!event) notFound();

  const imageUrl = mediaUrl(event.cover_image?.url);

  return (
    <>
      <JsonLd
        data={eventJsonLd({
          name: event.title,
          description: event.excerpt,
          url: `${SITE_URL}/sobytiya/${slug}`,
          startDate: event.date_start,
          endDate: event.date_end,
          imageUrl: imageUrl,
          locationName: `${siteSettings.city}, ${siteSettings.region}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", url: SITE_URL },
          { name: "События", url: `${SITE_URL}/sobytiya` },
          { name: event.title, url: `${SITE_URL}/sobytiya/${slug}` },
        ])}
      />

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(30px,4vw,50px)] pt-[clamp(54px,7vw,92px)]">
        {event.category_name && <SectionEyebrow>{event.category_name}</SectionEyebrow>}
        <h1 className="m-0 font-display text-[clamp(32px,5.4vw,72px)] font-medium uppercase leading-[1.02] text-ink-strong">
          {event.title}
        </h1>
        <div className="mt-6 font-mono text-sm uppercase tracking-[0.14em] text-muted-3">
          {formatEventDate(event.date_start, event.date_end)}
        </div>
      </section>

      {imageUrl && (
        <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(30px,4vw,50px)]">
          <div className="relative h-[clamp(280px,42vw,520px)] overflow-hidden bg-surface-mist">
            <Image src={imageUrl} alt={event.title} fill className="object-cover" />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(70px,9vw,120px)]">
        {event.excerpt && (
          <p className="m-0 mb-6 max-w-[720px] text-[clamp(16px,1.7vw,20px)] font-light leading-[1.65] text-[#3a4c63]">
            {event.excerpt}
          </p>
        )}
        {event.body && (
          <div
            className="max-w-[720px] text-[15.5px] font-light leading-[1.75] text-muted [&_p]:mb-5"
            dangerouslySetInnerHTML={{ __html: event.body }}
          />
        )}
      </section>
    </>
  );
}
