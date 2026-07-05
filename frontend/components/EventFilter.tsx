"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import type { EventSummary } from "@/lib/types";

export function EventFilter({ events }: { events: EventSummary[] }) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const event of events) {
      if (event.category_slug && event.category_name) {
        seen.set(event.category_slug, event.category_name);
      }
    }
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [events]);

  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? events.filter((e) => e.category_slug === active) : events;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActive(null)}
          className={`border px-5 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors ${
            active === null ? "border-blue bg-blue/10 text-navy" : "border-blue/20 text-muted"
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.slug)}
            className={`border px-5 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors ${
              active === cat.slug ? "border-blue bg-blue/10 text-navy" : "border-blue/20 text-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-9 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
