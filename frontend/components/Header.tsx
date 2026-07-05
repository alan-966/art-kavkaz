"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/o-fonde", label: "О фонде" },
  { href: "/sobytiya", label: "События" },
  { href: "/partnery", label: "Партнёры" },
  { href: "/smi-o-nas", label: "СМИ о нас" },
];

export function Header({ siteSettings }: { siteSettings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const topBarRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const topBar = topBarRef.current;
    const nav = navRef.current;
    if (!topBar || !nav) return;
    const updateHeight = () => {
      const height = topBar.offsetHeight + nav.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(topBar);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  const logoUrl = mediaUrl(siteSettings.logo?.url);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div ref={topBarRef} className="bg-surface border-b border-blue/[0.16]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-3 px-[clamp(18px,4vw,48px)] py-3.5 text-center md:flex-row md:flex-wrap md:justify-between md:gap-6 md:text-left">
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Арт-Кавказ"
                width={siteSettings.logo?.width ?? 180}
                height={siteSettings.logo?.height ?? 84}
                className="h-[clamp(44px,9vw,84px)] w-auto max-w-full"
                quality={90}
                priority
              />
            ) : (
              <span className="flex items-center gap-3 font-display text-lg font-bold tracking-[0.3em] text-navy">
                <span className="block h-2.5 w-2.5 rotate-45 bg-accent" />
                АРТ&nbsp;·&nbsp;КАВКАЗ
              </span>
            )}
          </Link>
          <div className="flex flex-none flex-col items-center gap-1 text-center md:items-end md:text-right">
            <span className="whitespace-nowrap text-base font-bold leading-tight tracking-[0.03em] text-navy">
              {siteSettings.phone}
            </span>
            <span className="whitespace-nowrap text-[11px] uppercase leading-tight tracking-[0.15em] text-muted-4">
              {siteSettings.city} · {siteSettings.region}
            </span>
          </div>
        </div>
      </div>

      <header
        ref={navRef}
        className={`sticky top-0 z-[60] flex justify-center border-b px-[clamp(18px,4vw,48px)] backdrop-blur-lg transition-colors duration-500 ${
          scrolled ? "border-white/20" : "border-white/[0.12]"
        }`}
        style={{
          backgroundImage: `linear-gradient(125deg, ${scrolled ? "#194568 0%, #2a648f 72%" : "#1c4f76 0%, #2e6f9e 72%"})`,
        }}
      >
        <div className="relative flex w-full max-w-[1240px] items-center justify-center py-[15px]">
          <nav className="hidden flex-wrap items-center justify-center gap-[clamp(18px,3.4vw,46px)] md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1.5 font-sans text-base font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className="absolute bottom-[-3px] left-0 h-px bg-accent transition-all duration-300"
                    style={{ width: active ? "100%" : "0%" }}
                  />
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="flex flex-col items-center justify-center gap-[5px] p-2 md:hidden"
          >
            <span
              className={`block h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-white transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>

          <nav
            className={`absolute inset-x-0 top-full flex flex-col items-center gap-1 border-b border-white/[0.12] bg-blue-deep py-4 backdrop-blur-lg transition-all duration-300 md:hidden ${
              menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2.5 font-sans text-base font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
