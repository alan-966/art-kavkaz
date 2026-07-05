import type { Metadata } from "next";
import Image from "next/image";
import { getHistoryPage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHistoryPage();
  return buildMetadata(page, "/o-fonde/istoriya", {
    description: "Ключевые вехи фонда «АРТ-Кавказ» с момента основания.",
  });
}

export default async function HistoryPage() {
  const page = await getHistoryPage();

  return (
    <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(40px,5vw,70px)] pt-[clamp(40px,6vw,80px)]">
      <div className="relative border-l border-blue/[0.28] pl-[clamp(24px,5vw,72px)]">
        {page.timeline.map((entry, i) => {
          const imageUrl = mediaUrl(entry.value.image?.url);
          return (
            <div
              key={entry.id}
              className={`relative grid gap-7 ${i < page.timeline.length - 1 ? "pb-14" : ""} [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]`}
            >
              <span
                className="absolute top-1.5 h-4 w-4 rotate-45 bg-accent"
                style={{ left: "calc(-1 * clamp(24px,5vw,72px) - 8px)" }}
              />
              <div>
                <div className="font-display text-[clamp(34px,5vw,58px)] font-semibold leading-none text-navy">
                  {entry.value.year}
                </div>
                <h3 className="mb-2 mt-3 font-display text-xl font-medium uppercase text-ink">
                  {entry.value.title}
                </h3>
                {entry.value.description && (
                  <p className="m-0 text-[17px] font-light leading-[1.65] text-muted">
                    {entry.value.description}
                  </p>
                )}
              </div>
              <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-surface-mist to-[#b4cae3]">
                {imageUrl && (
                  <Image src={imageUrl} alt={entry.value.title} fill className="object-cover" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
