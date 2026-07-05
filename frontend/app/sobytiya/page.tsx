import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getEvents, getEventsIndexPage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { formatEventDate } from "@/lib/format";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { EventFilter } from "@/components/EventFilter";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEventsIndexPage();
  return buildMetadata(page, "/sobytiya", {
    description: "Выставки, лекции и другие события фонда «АРТ-Кавказ».",
  });
}

export default async function EventsPage() {
  const [page, events] = await Promise.all([getEventsIndexPage(), getEvents()]);
  const featured = events.find((e) => e.is_featured);
  const rest = events.filter((e) => e.id !== featured?.id);
  const featuredImageUrl = mediaUrl(featured?.cover_image?.url);

  return (
    <>
      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(30px,4vw,50px)] pt-[clamp(54px,7vw,92px)]">
        <SectionEyebrow>{page.eyebrow}</SectionEyebrow>
        <h1 className="m-0 font-display text-[clamp(38px,6.4vw,86px)] font-medium uppercase leading-[0.98] text-ink-strong">
          {page.title}
        </h1>
      </section>

      {featured && (
        <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(30px,4vw,50px)] pt-[clamp(20px,3vw,40px)]">
          <Link
            href={`/sobytiya/${featured.meta.slug}`}
            className="grid border border-blue/20 bg-surface-soft transition-colors hover:border-blue/45 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]"
          >
            <div className="relative min-h-[380px] overflow-hidden bg-gradient-to-br from-surface-mist to-surface-tint">
              {featuredImageUrl && (
                <Image src={featuredImageUrl} alt={featured.title} fill className="object-cover" />
              )}
              <span className="absolute left-[18px] top-[18px] bg-blue px-[13px] py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-surface-tint">
                Главное событие
              </span>
            </div>
            <div className="flex flex-col justify-center p-[clamp(30px,4vw,56px)]">
              <div className="mb-[18px] flex items-center gap-3.5 text-[11.5px] uppercase tracking-[0.14em]">
                {featured.category_name && <span className="text-blue">{featured.category_name}</span>}
                <span className="h-1 w-1 rotate-45 bg-[#c2d4e8]" />
                <span className="font-mono text-muted-3">
                  {formatEventDate(featured.date_start, featured.date_end)}
                </span>
              </div>
              <h2 className="m-0 mb-[18px] font-display text-[clamp(28px,3.4vw,44px)] font-medium uppercase leading-[1.1] text-ink">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="m-0 mb-[26px] max-w-[520px] text-[15.5px] font-light leading-[1.7] text-[#45576d]">
                  {featured.excerpt}
                </p>
              )}
              <span className="text-[12.5px] uppercase tracking-[0.16em] text-navy">Подробнее о событии →</span>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(70px,9vw,120px)] pt-[clamp(20px,3vw,40px)]">
        <EventFilter events={rest} />
      </section>
    </>
  );
}
