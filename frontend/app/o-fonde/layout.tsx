import { getAboutIndexPage } from "@/lib/api";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AboutTabs } from "@/components/AboutTabs";

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const about = await getAboutIndexPage();

  return (
    <>
      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(34px,5vw,60px)] pt-[clamp(54px,7vw,92px)]">
        <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
        <h1 className="m-0 font-display text-[clamp(38px,6.4vw,86px)] font-medium uppercase leading-[0.98] text-ink-strong">
          {about.title}
        </h1>
        <div
          className="mt-7 max-w-[620px] text-[clamp(16px,1.7vw,20px)] font-light leading-[1.65] text-[#3a4c63]"
          dangerouslySetInnerHTML={{ __html: about.intro_text }}
        />
      </section>

      <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)]">
        <AboutTabs />
      </section>

      {children}
    </>
  );
}
