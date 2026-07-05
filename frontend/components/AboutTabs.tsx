"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/o-fonde/istoriya", label: "История фонда" },
  { href: "/o-fonde/dokumenty", label: "Документы" },
  { href: "/o-fonde/sovet", label: "Совет фонда" },
];

export function AboutTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2.5 pb-[18px]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border px-6 py-3 font-sans text-[12.5px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
              active
                ? "border-blue bg-blue/[0.08] text-navy"
                : "border-blue/[0.22] text-muted hover:border-blue/50 hover:text-navy"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
