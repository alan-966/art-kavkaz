import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const SECTION_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/o-fonde", label: "О фонде" },
  { href: "/sobytiya", label: "События" },
  { href: "/partnery", label: "Партнёры" },
  { href: "/smi-o-nas", label: "СМИ о нас" },
];

function SocialLink({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-light text-[#d4e4f4] transition-colors hover:text-white"
    >
      {label}
    </a>
  );
}

export function Footer({ siteSettings }: { siteSettings: SiteSettings }) {
  return (
    <footer
      className="border-t border-white/[0.12] text-white"
      style={{ backgroundImage: "linear-gradient(125deg, #1c4f76 0%, #2e6f9e 72%)" }}
    >
      <div className="mx-auto grid w-full max-w-[1320px] gap-[clamp(32px,4vw,56px)] px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,90px)] pb-[clamp(30px,4vw,46px)] [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
        <div className="max-w-[300px]">
          <div className="mb-5 flex items-center gap-3">
            <span className="block h-[9px] w-[9px] rotate-45 bg-accent" />
            <span className="font-sans text-base font-bold tracking-[0.3em]">АРТ&nbsp;·&nbsp;КАВКАЗ</span>
          </div>
          <p className="text-[14.5px] font-light leading-[1.7] text-[#d4e4f4]">
            {siteSettings.footer_description}
          </p>
        </div>

        <div>
          <div className="mb-[18px] text-[11px] uppercase tracking-[0.24em] text-[#a9cdec]">Контакты</div>
          <div className="text-sm font-light leading-[1.9] text-[#d4e4f4]">
            {siteSettings.address}
            <br />
            <span className="text-white">{siteSettings.phone}</span>
            <br />
            <a href={`mailto:${siteSettings.email}`} className="text-white hover:underline">
              {siteSettings.email}
            </a>
          </div>
        </div>

        <div>
          <div className="mb-[18px] text-[11px] uppercase tracking-[0.24em] text-[#a9cdec]">Разделы</div>
          <div className="flex flex-col gap-[11px]">
            {SECTION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-left text-sm font-light text-[#d4e4f4] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-[18px] text-[11px] uppercase tracking-[0.24em] text-[#a9cdec]">Соцсети</div>
          <div className="flex flex-col gap-[11px]">
            <SocialLink href={siteSettings.telegram_url} label="Telegram" />
            <SocialLink href={siteSettings.vk_url} label="ВКонтакте" />
            <SocialLink href={siteSettings.max_messenger_url} label="Макс" />
            <SocialLink href={siteSettings.rutube_url} label="Rutube" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.14]">
        <div className="mx-auto flex w-full max-w-[1320px] flex-wrap justify-between gap-4 px-[clamp(20px,4vw,48px)] py-[22px] text-xs tracking-[0.06em] text-[#a9cdec]">
          <span>© {new Date().getFullYear()} {siteSettings.org_legal_name}. Все права защищены.</span>
          <span>Официальный сайт фонда</span>
        </div>
      </div>
    </footer>
  );
}
