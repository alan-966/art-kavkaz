import type { Metadata } from "next";
import Image from "next/image";
import { getPartnersPage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { SectionEyebrow } from "@/components/SectionEyebrow";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPartnersPage();
  return buildMetadata(page, "/partnery", {
    description: "Государственные институции, культурные организации и медиа-партнёры фонда «АРТ-Кавказ».",
  });
}

function LogoTile({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  return (
    <div className="flex aspect-[5/3] items-center justify-center bg-surface-alt font-mono text-[11px] uppercase tracking-[0.18em] text-muted-4 transition-colors hover:bg-surface-tint">
      {logoUrl ? (
        <div className="relative h-full w-full">
          <Image src={logoUrl} alt={name} fill className="object-contain p-4" />
        </div>
      ) : (
        name
      )}
    </div>
  );
}

export default async function PartnersPage() {
  const page = await getPartnersPage();

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

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] py-[clamp(40px,5vw,70px)]">
        <SectionEyebrow>{page.fund_partners_heading}</SectionEyebrow>
        <div className="grid gap-px border border-blue/[0.16] bg-blue/[0.16] [grid-template-columns:repeat(auto-fit,minmax(min(170px,100%),1fr))]">
          {page.fund_partners.map((partner) => (
            <LogoTile key={partner.id} name={partner.name} logoUrl={mediaUrl(partner.logo?.url)} />
          ))}
        </div>

        {page.fund_partner_details.length > 0 && (
          <div className="mt-[30px] grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {page.fund_partner_details.map((detail) => {
              const logoUrl = mediaUrl(detail.logo?.url);
              return (
                <div key={detail.id} className="border border-blue/[0.16] bg-surface-soft p-[30px]">
                  <div className="mb-[18px] flex items-center gap-[18px]">
                    <div className="relative flex h-16 w-16 flex-none items-center justify-center border border-blue/20 bg-surface-tint">
                      {logoUrl && <Image src={logoUrl} alt={detail.name} fill className="object-contain p-2" />}
                    </div>
                    <h3 className="m-0 font-display text-xl font-medium uppercase leading-[1.2] text-ink">
                      {detail.name}
                    </h3>
                  </div>
                  {detail.description && (
                    <p className="m-0 text-sm font-light leading-[1.65] text-muted">{detail.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(70px,9vw,120px)] pt-[clamp(40px,5vw,70px)]">
        <SectionEyebrow>{page.media_partners_heading}</SectionEyebrow>
        <div className="grid gap-px border border-blue/[0.16] bg-blue/[0.16] [grid-template-columns:repeat(auto-fit,minmax(min(170px,100%),1fr))]">
          {page.media_partners.map((partner) => (
            <LogoTile key={partner.id} name={partner.name} logoUrl={mediaUrl(partner.logo?.url)} />
          ))}
        </div>

        {page.cta_text && (
          <div
            className="mx-auto mt-[60px] max-w-[900px] p-[clamp(36px,5vw,64px)] text-center"
            style={{
              border: "1px solid rgba(46,111,158,.22)",
              backgroundImage: "linear-gradient(135deg,#dceafa,#dceafa)",
            }}
          >
            <p className="mx-auto mb-6 max-w-[760px] font-display text-[clamp(22px,2.8vw,34px)] font-medium italic leading-[1.35] text-navy">
              {page.cta_text}
            </p>
            {page.cta_button_text && (
              <a
                href={page.cta_button_link || undefined}
                className="inline-flex items-center gap-3 border border-blue bg-blue px-[34px] py-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-surface-tint transition-all hover:bg-transparent hover:text-navy"
              >
                {page.cta_button_text} →
              </a>
            )}
          </div>
        )}
      </section>
    </>
  );
}
