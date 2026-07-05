import Link from "next/link";
import type { Metadata } from "next";
import { getEvents, getHomePage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { HeroSlider } from "@/components/HeroSlider";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { StatBlock } from "@/components/StatBlock";
import { EventCard } from "@/components/EventCard";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return buildMetadata(home, "/", {
    description: home.intro_text.replace(/<[^>]+>/g, "").slice(0, 160),
    absoluteTitle: true,
  });
}

export default async function Home() {
  const [home, events] = await Promise.all([getHomePage(), getEvents()]);
  const latestEvents = events.slice(0, 3);
  const introImageUrl = mediaUrl(home.intro_image?.url);

  return (
    <>
      <HeroSlider slides={home.hero_slides.map((s) => s.value)} />

      <section className="mx-auto grid max-w-[1320px] items-center gap-[clamp(40px,6vw,80px)] px-[clamp(20px,4vw,48px)] py-[clamp(70px,9vw,128px)] [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
        <div>
          <SectionEyebrow>{home.eyebrow}</SectionEyebrow>
          <h2 className="m-0 mb-6 font-display text-[clamp(30px,4vw,52px)] font-medium uppercase leading-[1.08] text-ink">
            {home.intro_heading}
          </h2>
          <div
            className="text-[clamp(15px,1.5vw,18px)] font-light leading-[1.7] text-[#3a4c63] [&_p]:mb-[22px] [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: home.intro_text }}
          />
        </div>
        <div className="relative min-h-[clamp(360px,42vw,560px)] overflow-hidden bg-gradient-to-br from-surface-mist to-surface-tint">
          {introImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={introImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {home.intro_quote && (
            <div
              className="absolute inset-x-0 bottom-0 p-[clamp(28px,4vw,46px)]"
              style={{ backgroundImage: "linear-gradient(0deg,rgba(220,234,250,.95),transparent)" }}
            >
              <p className="m-0 font-display text-[clamp(20px,2.4vw,30px)] font-medium italic leading-[1.35] text-navy">
                «{home.intro_quote}»
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] py-[clamp(70px,9vw,128px)]">
        <SectionEyebrow>{home.mission_eyebrow}</SectionEyebrow>
        <h2 className="m-0 max-w-[880px] font-display text-[clamp(30px,4vw,52px)] font-medium uppercase leading-[1.08] text-ink">
          {home.mission_heading}
        </h2>
        <div
          className="mt-6 max-w-[680px] text-[clamp(15px,1.5vw,18px)] font-light leading-[1.7] text-[#3a4c63]"
          dangerouslySetInnerHTML={{ __html: home.mission_text }}
        />
      </section>

      {home.stats.length > 0 && (
        <section className="border-y border-blue/[0.16] bg-surface-alt">
          <div className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] py-[clamp(70px,9vw,128px)]">
            <SectionEyebrow>{home.stats_eyebrow}</SectionEyebrow>
            <h2 className="m-0 mb-[clamp(40px,5vw,60px)] max-w-[760px] font-display text-[clamp(30px,4vw,52px)] font-medium uppercase leading-[1.08] text-ink">
              {home.stats_heading}
            </h2>
            <div className="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(min(218px,100%),1fr))]">
              {home.stats.map((stat) => (
                <StatBlock key={stat.id} value={stat.value.value} label={stat.value.label} />
              ))}
            </div>
          </div>
        </section>
      )}

      {latestEvents.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] py-[clamp(70px,9vw,128px)]">
          <div className="mb-[46px] flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionEyebrow>Хроника</SectionEyebrow>
              <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] font-medium uppercase leading-[1.05] text-ink">
                События
              </h2>
            </div>
            <Link
              href="/sobytiya"
              className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-navy"
            >
              Все события →
            </Link>
          </div>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {latestEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
