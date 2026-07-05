import type { Metadata } from "next";
import Image from "next/image";
import { getCouncilPage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCouncilPage();
  return buildMetadata(page, "/o-fonde/sovet", {
    description: "Состав совета фонда «АРТ-Кавказ».",
  });
}

export default async function CouncilPage() {
  const page = await getCouncilPage();

  return (
    <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(70px,9vw,120px)] pt-[clamp(50px,6vw,80px)]">
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
        {page.members.map((member) => {
          const photoUrl = mediaUrl(member.photo?.url);
          return (
            <div key={member.id}>
              <div className="relative mb-[18px] aspect-[3/4] overflow-hidden bg-gradient-to-br from-surface-mist to-[#b4cae3]">
                {photoUrl && (
                  <Image src={photoUrl} alt={member.full_name} fill className="object-cover" />
                )}
              </div>
              <h3 className="m-0 mb-1.5 font-display text-xl font-medium uppercase text-ink">
                {member.full_name}
              </h3>
              <div className="mb-2.5 text-xs uppercase tracking-[0.14em] text-blue">
                {member.role_title}
                {member.role_subtitle && ` · ${member.role_subtitle}`}
              </div>
              {member.bio && (
                <p className="m-0 text-[13.5px] font-light leading-[1.6] text-muted">{member.bio}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
