import type { Metadata } from "next";
import { getPressIndexPage } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { SectionEyebrow } from "@/components/SectionEyebrow";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPressIndexPage();
  return buildMetadata(page, "/smi-o-nas", {
    description: "Публикации федеральных и региональных медиа о фонде «АРТ-Кавказ».",
  });
}

export default async function PressPage() {
  const page = await getPressIndexPage();

  return (
    <>
      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(30px,4vw,50px)] pt-[clamp(54px,7vw,92px)]">
        <SectionEyebrow>{page.eyebrow}</SectionEyebrow>
        <h1 className="m-0 font-display text-[clamp(38px,6.4vw,86px)] font-medium uppercase leading-[0.98] text-ink-strong">
          {page.title}
        </h1>
        <div
          className="mt-7 max-w-[620px] text-[clamp(16px,1.7vw,20px)] font-light leading-[1.65] text-[#3a4c63]"
          dangerouslySetInnerHTML={{ __html: page.intro_text }}
        />
      </section>

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(70px,9vw,120px)] pt-[clamp(30px,4vw,50px)]">
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))]">
          {page.press_items.map((item) => {
            const card = (
              <div className="flex h-full flex-col gap-4 border border-blue/[0.16] bg-surface-soft p-[clamp(28px,3vw,40px)] transition-colors hover:border-blue/45">
                <span className="flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.12em] text-blue">
                  <span className="block h-1.5 w-1.5 flex-none rotate-45 bg-accent" />
                  {item.source_name} · {item.year}
                </span>
                <span className="font-display text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.22] text-ink-strong">
                  {item.title}
                </span>
                <span className="text-[14.5px] font-light leading-[1.6] text-muted">{item.excerpt}</span>
                {item.external_url && (
                  <span className="mt-auto inline-flex items-center gap-2 pt-1 text-xs uppercase tracking-[0.12em] text-navy">
                    Читать материал <span className="text-[13px]">↗</span>
                  </span>
                )}
              </div>
            );

            return item.external_url ? (
              <a key={item.id} href={item.external_url} target="_blank" rel="noopener noreferrer" className="block h-full">
                {card}
              </a>
            ) : (
              <div key={item.id}>{card}</div>
            );
          })}
        </div>
      </section>
    </>
  );
}
